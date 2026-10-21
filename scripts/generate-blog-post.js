const fs = require("fs");
const path = require("path");

// .env.local 파일 자동 로드
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...rest] = trimmed.split("=");
      process.env[k.trim()] = rest.join("=").trim();
    }
  });
}

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  // [1단계] 최신 데이터 확인
  const localInfoPath = path.join(process.cwd(), "public", "data", "local-info.json");
  const postsDir = path.join(process.cwd(), "src", "content", "posts");

  if (!fs.existsSync(localInfoPath)) {
    console.error("public/data/local-info.json 파일이 존재하지 않습니다.");
    return;
  }

  let localInfoData;
  try {
    const rawData = fs.readFileSync(localInfoPath, "utf-8");
    localInfoData = JSON.parse(rawData);
  } catch (err) {
    console.error("local-info.json 파일 읽기 실패:", err);
    return;
  }

  let allItems = [];
  if (Array.isArray(localInfoData)) {
    allItems = localInfoData;
  } else {
    allItems = [
      ...(localInfoData.events || []),
      ...(localInfoData.benefits || []),
    ];
  }

  // 강북구, 도봉구, 노원구 대상 필터링
  const targetDistricts = ["강북구", "도봉구", "노원구", "성북구", "중랑구"];
  const targetItems = allItems.filter((item) => {
    const text = `${item.location || ""} ${item.name || ""} ${item.title || ""} ${
      item.target || ""
    } ${item.summary || ""}`;
    return targetDistricts.some((d) => text.includes(d));
  });

  // 오직 강북구, 도봉구, 노원구 또는 서울 관련 정보만 엄격히 대상으로 제한 (타 지역 및 무관한 수산업 등 원천 차단)
  const availableItems = targetItems;

  if (availableItems.length === 0) {
    console.log("강북·도봉·노원·성북·중랑 지역 대상 공공서비스 데이터가 없습니다.");
    return;
  }

  // [검수봇 1단계] 기존 글 메타데이터(파일명, 순수 슬러그, 제목, 태그) 정밀 분석
  const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  
  // 파일명에서 날짜(YYYY-MM-DD-)를 제거한 순수 슬러그 추출 헬퍼
  function extractBaseSlug(filename) {
    return filename
      .replace(/\.md$/, "")
      .replace(/^\d{4}-\d{2}-\d{2}-?/, "")
      .toLowerCase()
      .trim();
  }

  // 핵심 키워드(불용어 제외 2글자 이상 의미 단어) 추출 헬퍼
  const STOPWORDS = new Set([
    "발행", "판매", "지원", "사업", "안내", "신청", "핵심", "총정리", "가이드", "혜택",
    "서울", "서울시", "서울특별시", "강북", "강북구", "도봉", "도봉구", "노원", "노원구",
    "성북", "성북구", "중랑", "중랑구",
    "2026", "2025", "2024", "알림", "모집", "선발", "운영", "실시", "및", "등"
  ]);

  function extractCoreKeywords(text) {
    if (!text) return [];
    return text
      .replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  }

  const existingPosts = existingFiles.map((file) => {
    try {
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      // 제목 추출 (frontmatter title)
      const titleMatch = content.match(/^title:\s*["']?(.*?)["']?$/m);
      const title = titleMatch ? titleMatch[1].trim() : "";
      return {
        file,
        baseSlug: extractBaseSlug(file),
        title,
        coreKeywords: extractCoreKeywords(title),
        content,
      };
    } catch {
      return { file, baseSlug: extractBaseSlug(file), title: "", coreKeywords: [], content: "" };
    }
  });

  // 중복 여부 판별 검수 함수 (Slug 일치, 핵심 키워드 중복, 본문 포함 여부 3중 검사)
  function isDuplicate(candidate) {
    const candidateName = candidate.name || candidate.title || "";
    if (!candidateName) return true;

    const candidateSlug = (candidate.slug || candidate.id || "").toString().toLowerCase().trim();
    const candidateKeywords = extractCoreKeywords(candidateName);

    for (const post of existingPosts) {
      // 1. Slug가 동일한 경우
      if (candidateSlug && (post.baseSlug === candidateSlug || post.file.includes(candidateSlug))) {
        return { duplicate: true, reason: `동일 슬러그 매칭 (${post.file})` };
      }

      // 2. 본문에 후보 전체 이름이 이미 포함된 경우
      if (post.content.includes(candidateName)) {
        return { duplicate: true, reason: `본문 내 키워드 완전 포함 (${post.file})` };
      }

      // 3. 핵심 고유명사 키워드가 기존 제목과 겹치는 경우 (예: '노원사랑상품권', '강북사랑상품권')
      if (candidateKeywords.length > 0) {
        const matchingKeywords = candidateKeywords.filter((k) =>
          post.title.includes(k) || post.content.includes(k)
        );
        // 핵심 고유명사가 2개 이상 겹치거나, 핵심 단어가 1개뿐인데 그게 정확히 일치할 때
        if (
          (candidateKeywords.length >= 2 && matchingKeywords.length >= 2) ||
          (candidateKeywords.length === 1 && matchingKeywords.length === 1 && matchingKeywords[0].length >= 4)
        ) {
          return { duplicate: true, reason: `핵심 주제 키워드 중복: [${matchingKeywords.join(", ")}] (${post.file})` };
        }
      }
    }

    return { duplicate: false };
  }

  // 아직 작성되지 않은 신규 항목만 선별 (역순: 최신 등록순)
  let latestItem = null;
  for (let i = availableItems.length - 1; i >= 0; i--) {
    const candidate = availableItems[i];
    const candidateName = candidate.name || candidate.title || "";
    if (!candidateName) continue;

    const check = isDuplicate(candidate);
    if (check.duplicate) {
      // 중복으로 제외된 항목 로깅
      // console.log(`[검수봇 통과 제외] ${candidateName} -> ${check.reason}`);
      continue;
    }

    latestItem = candidate;
    break;
  }

  if (!latestItem) {
    console.log("✅ [검수봇 완료] 강북·도봉·노원·성북·중랑 지역의 새로운 작성 대상이 없습니다 (모든 주제가 이미 고품질 글로 작성됨). 중복 생성을 안전하게 방지합니다.");
    return;
  }

  const targetName = latestItem.name || latestItem.title || "";
  const locationText = latestItem.location || "";
  const districtName = locationText.includes("강북")
    ? "강북구"
    : locationText.includes("도봉")
    ? "도봉구"
    : locationText.includes("노원")
    ? "노원구"
    : "서울 강북·도봉·노원";

  console.log(`새로운 블로그 글 작성 시작: [${districtName}] ${targetName}`);

  // [2단계] Gemini AI로 블로그 글 생성
  const todayStr = new Date().toISOString().split("T")[0];
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

  const currentYear = new Date().getFullYear();
  const prompt = `당신은 서울시 ${districtName}에 거주하며 지역 소식과 생활 복지 혜택을 10년 넘게 주민 눈높이에서 생생하게 전해온 전문 생활정보 큐레이터입니다.
단순히 정부 공고문을 요약하거나 기계적인 AI 말투("안녕하세요!", "3가지 이유" 등)를 쓰지 마시고, 실제 지역 주민이 직접 주민센터에 방문하거나 온라인으로 신청해보며 느낀 생생한 팁과 유의사항이 가득 담긴 독창적이고 전문적인 블로그 글(1,800자 이상)을 작성해 주세요.

대상 정보: ${JSON.stringify(latestItem, null, 2)}

[핵심 SEO 제목 작성 공식]
- 형식: [${currentYear} ${districtName}] ${targetName} 핵심 총정리: 대상 자격, 신청 방법 및 실전 꿀팁
- 독자가 검색창에 직접 입력할 만한 핵심 키워드(지원금, 대상, 조건, 신청방법 등)를 자연스럽게 녹여주세요.

[본문 필수 구성 가이드라인 - 구글 애드센스 고품질 오리지널 콘텐츠 기준]
1. 인트로: ${districtName} 주민들이 왜 이 혜택/행사를 알아야 하는지 실생활 밀착형 공감 스토리
2. 핵심 지원 내용 및 실질적 혜택: 지원 금액, 제공 혜택의 실효성을 구체적으로 서술
3. 신청 자격 요건 심층 분석: 연령, 소득, 거주 기간 등 조건 분석 및 자격 확인법
4. 단계별 신청 방법 & 구비 서류 가이드: 온라인(정부24/구청) 및 관할 동 주민센터 방문 절차 상세 안내
5. [에디터 실전 꿀팁 & 주의사항]: 신청 시 자주 겪는 반려 사유, 서류 발급 주의점, 동사무소 방문 시 대기시간 줄이는 팁 등 현실적인 노하우
6. 주민들이 자주 묻는 질문 3가지 (Q&A 형식으로 상세하게 해설)
7. 요약 및 공식 문의처(관할 구청 부서 및 대표 전화번호) 안내

반드시 아래 YAML 프론트매터 형식으로만 출력하고 다른 부가 설명 텍스트나 마크다운 코드블록 백틱(\`\`\`)은 일절 붙이지 마세요:
---
title: (검색 최적화된 고품질 제목)
date: "${todayStr}"
summary: (구글 검색 스니펫에 노출될 클릭 유도형 1~2문장 요약)
category: "${latestItem.category || "혜택"}"
tags: ["${districtName}", "${targetName}", "생활정보", "지원금", "복지혜택"]
---

(본문 내용: 마크다운 소제목 ###, 체크리스트, 표, 꿀팁 박스 인용구 등을 다채롭게 활용하여 1,800자 이상 정성스럽게 작성)

마지막 줄에 FILENAME: keyword 형식으로 파일명 키워드를 출력해줘. 키워드는 간결한 영문 소문자 케밥케이스로 (예: FILENAME: nowon-mini-solar).`;

  let responseText = "";
  try {
    const res = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${res.status})`);
      return;
    }

    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Gemini API 호출 중 에러 발생 (기존 파일 유지):", err);
    return;
  }

  if (!responseText) {
    console.error("Gemini AI로부터 응답을 받지 못했습니다.");
    return;
  }

  // [3단계] 파일 저장
  try {
    const lines = responseText.trim().split("\n");
    let filename = `${todayStr}-info.md`;
    const postLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("FILENAME:")) {
        let slug = line.replace("FILENAME:", "").trim().replace(/\.md$/, "");
        slug = slug.replace(/^\d{4}-\d{2}-\d{2}-?/, "").trim();
        if (slug) {
          filename = `${todayStr}-${slug}.md`;
        }
      } else {
        postLines.push(line);
      }
    }

    let finalPostContent = postLines.join("\n").trim() + "\n";
    // 백틱 마크다운 블록이 감싸진 경우 제거
    finalPostContent = finalPostContent
      .replace(/^```markdown\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/, "")
      .trim() + "\n";

    // [검수봇 2단계] 저장 직전 파일명 및 핵심 슬러그 2차 중복 가드
    const newBaseSlug = extractBaseSlug(filename);
    const slugConflict = existingPosts.find((p) => p.baseSlug === newBaseSlug);
    if (slugConflict) {
      console.warn(`🛑 [검수봇 차단] 생성된 파일(${filename})의 핵심 슬러그(${newBaseSlug})가 기존 파일(${slugConflict.file})과 이미 존재합니다. 중복 생성을 강력 차단하고 작업을 안전하게 중단합니다.`);
      return;
    }

    // 제목 중복 2차 가드
    const newTitleMatch = finalPostContent.match(/^title:\s*["']?(.*?)["']?$/m);
    const newTitle = newTitleMatch ? newTitleMatch[1].trim() : "";
    if (newTitle) {
      const titleConflict = existingPosts.find((p) => p.title && (p.title === newTitle || p.title.includes(newTitle) || newTitle.includes(p.title)));
      if (titleConflict) {
        console.warn(`🛑 [검수봇 차단] 생성된 제목(${newTitle})이 기존 파일(${titleConflict.file}: "${titleConflict.title}")과 중복됩니다. 저장을 차단합니다.`);
        return;
      }
    }

    const targetFilePath = path.join(postsDir, filename);

    fs.writeFileSync(targetFilePath, finalPostContent, "utf-8");
    console.log(`블로그 글 생성 완료: ${filename}`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생 (기존 파일 유지):", err);
  }
}

main();
