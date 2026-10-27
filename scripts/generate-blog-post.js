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
  const prompt = `당신은 서울시 ${districtName}에서 10년 넘게 살아오며, 매주 주민센터와 구청을 직접 오가며 공공 복지 제도를 발로 뛰며 취재하는 10년 차 베테랑 로컬 에디터 '김에디터'입니다.
인터넷 검색하면 누구나 복사할 수 있는 정부 공고문 요약글이나, 뻔한 AI 말투("안녕하세요!", "~에 대해 알아보겠습니다", "3가지 이유", "마치며" 등)는 절대 쓰지 마세요.
구글 애드센스 심사관이 읽었을 때 "아, 이 사람은 진짜 ${districtName}에 살면서 직접 주민센터 창구에 가보고, 담당 공무원과 통화해 보고, 신청서 서류를 직접 챙겨본 사람이구나!" 하고 감탄할 수 있는 **생생한 현장 경험담과 실전 시행착오 노하우가 담긴 2,000자 이상의 고품질 오리지널 포스팅**을 작성해 주세요.

대상 정보: ${JSON.stringify(latestItem, null, 2)}

[핵심 SEO 제목 작성 공식]
- 형식: [${currentYear} ${districtName}] ${targetName} 핵심 총정리: 대상 자격, 신청 방법 및 실전 꿀팁
- 독자가 실제 스마트폰 검색창에 검색할 단어(지원금, 조건, 서류, 주민센터 등)를 자연스럽게 녹여주세요.

[본문 필수 구성 가이드라인 - 구글 E-E-A-T 직접 경험(Experience) 극대화]
1. 현장 밀착형 인트로 (AI 클리셰 절대 금지)
   - 뻔한 인사말 없이, ${districtName} 동네 주민이 실제로 겪은 구체적인 사례나 내가 직접 동 주민센터 복지 창구에 다녀오며 느낀 이야기로 생생하게 시작하세요.
2. 핵심 지원 혜택 및 실질적 체감 효용
   - 표(Table)를 활용하여 한눈에 들어오도록 요약하고, "실제로 내 통장에 얼마가 들어오는지", "가구당 1년에 얼마를 아낄 수 있는지" 현실적인 숫자로 서술하세요.
3. 대상 자격 심층 검증 (나도 받을 수 있을까?)
   - 나이, 소득 기준(중위소득), 거주 요건 등 헷갈리기 쉬운 조건을 조목조목 짚어주고, "이사 온 지 얼마 안 된 전입자", "맞벌이 가구"의 자격 기준을 명쾌하게 풀어주세요.
4. [직접 해보고 알려주는] 단계별 신청 절차 및 구비 서류
   - 온라인(정부24) 신청 시 모바일 인증 오류 피하는 법과 창구 방문 시 필요한 서류를 1단계, 2단계 순서로 알기 쉽게 정리하세요.
5. [에디터 실전 꿀팁] 가장 많이 겪는 반려 사유 & 현장 노하우 (핵심 경험 섹션!)
   - 실제 주민들이 서류 누락으로 반려당하는 대표 사례 2~3가지 (예: 등본 세대주 관계 미표기, 통장 사본 양식 오류 등).
   - 관할 동 주민센터 방문 시 대기 시간을 30분 이상 줄이는 요일/시간대 팁 (예: 월요일 오전 피하기 등).
   - 무인민원발급기에서 무료로 뗄 수 있는 서류와 유료 서류 구분법.
6. 동네 주민들이 가장 많이 묻는 현실 Q&A 3가지
   - 다른 정부 지원금과 중복 수령 가능한지, 소득이 애매한 경우 등 민감한 질문에 명쾌한 답변 제공.
7. 공식 확인 창구 및 담당 부서 직통 연락처
   - 정확한 관할 구청 및 주민센터 복지팀 안내.

[모바일 가독성 필수 규칙]
- 마크다운 백틱(\`\`\`) 코드블록 절차도를 절대 쓰지 마세요 (스마트폰에서 글자 잘림).
- 번호 목록, 소제목(###), 체크리스트, 인용구(>)를 적절히 배치하여 스마트폰으로 읽기 편하게 작성하세요.

반드시 아래 YAML 프론트매터 형식으로만 출력하고 다른 부가 설명이나 전체 백틱(\`\`\`)은 붙이지 마세요:
---
title: (검색 최적화된 고품질 제목)
date: "${todayStr}"
summary: (구글 검색 스니펫에 노출될 클릭 유도형 1~2문장 요약)
category: "${latestItem.category || "혜택"}"
tags: ["${districtName}", "${targetName}", "생활정보", "지원금", "복지혜택"]
---

(본문 내용: 마크다운 소제목 ###, 체크리스트, 표, 꿀팁 박스 인용구 등을 다채롭게 활용하여 2,000자 이상 정성스럽게 작성)

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
