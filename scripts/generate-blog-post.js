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
  const targetDistricts = ["강북구", "도봉구", "노원구", "성북구", "중랑구", "동대문구", "광진구", "은평구"];
  const targetItems = allItems.filter((item) => {
    const text = `${item.location || ""} ${item.name || ""} ${item.title || ""} ${
      item.target || ""
    } ${item.summary || ""}`;
    return targetDistricts.some((d) => text.includes(d));
  });

  // 오직 강북구, 도봉구, 노원구 또는 서울 관련 정보만 엄격히 대상으로 제한 (타 지역 및 무관한 수산업 등 원천 차단)
  const availableItems = targetItems;

  if (availableItems.length === 0) {
    console.log("서울 관심 자치구(강북·도봉·노원·성북·중랑·동대문·광진·은평) 대상 공공서비스 데이터가 없습니다.");
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
    "동대문", "동대문구", "광진", "광진구", "은평", "은평구",
    "2026", "2025", "2024", "알림", "모집", "선발", "운영", "실시", "및", "등",
    "구비", "시비", "국비", "가정", "대상", "가구", "주민", "구민", "시민",
    "프로그램", "사업명", "제도", "서비스", "비용", "생활", "복지", "정보", "관내"
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

  // 중복 여부 판별 검수 함수 (Slug 일치, 기존 제목 유사도 검사)
  function isDuplicate(candidate) {
    const candidateName = candidate.name || candidate.title || "";
    if (!candidateName) return { duplicate: true, reason: "이름 없음" };

    const candidateSlug = (candidate.slug || candidate.id || "").toString().toLowerCase().trim();
    const candidateKeywords = extractCoreKeywords(candidateName);

    for (const post of existingPosts) {
      // 1. Slug가 동일한 경우
      if (candidateSlug && (post.baseSlug === candidateSlug || post.file.includes(candidateSlug))) {
        return { duplicate: true, reason: `동일 슬러그 매칭 (${post.file})` };
      }

      // 2. 기존 글 제목에 후보 전체 이름이 완전히 들어있는 경우
      if (post.title && post.title.includes(candidateName)) {
        return { duplicate: true, reason: `기존 글 제목 내 전체 명칭 일치 (${post.file})` };
      }

      // 3. 기존 글 제목과 핵심 고유명사 키워드가 2개 이상 겹치면서 관할 구가 같은 경우
      if (candidateKeywords.length > 0 && post.title) {
        const matchingKeywords = candidateKeywords.filter((k) => post.title.includes(k));
        const candidateLoc = candidate.location || "";
        const sameDistrict = ["강북", "도봉", "노원", "성북", "중랑", "동대문", "광진", "은평"].some(
          (d) => candidateLoc.includes(d) && post.title.includes(d)
        );

        if (
          sameDistrict &&
          ((candidateKeywords.length >= 2 && matchingKeywords.length >= 2) ||
            (candidateKeywords.length === 1 && matchingKeywords.length === 1 && matchingKeywords[0].length >= 4))
        ) {
          return {
            duplicate: true,
            reason: `동일 자치구 핵심 주제 키워드 중복: [${matchingKeywords.join(", ")}] (${post.file})`,
          };
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
    console.log("✅ [검수봇 완료] 서울 관심 자치구(강북·도봉·노원·성북·중랑·동대문·광진·은평)의 새로운 작성 대상이 없습니다 (모든 주제가 이미 고품질 글로 작성됨). 중복 생성을 안전하게 방지합니다.");
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
    : locationText.includes("성북")
    ? "성북구"
    : locationText.includes("중랑")
    ? "중랑구"
    : locationText.includes("동대문")
    ? "동대문구"
    : locationText.includes("광진")
    ? "광진구"
    : locationText.includes("은평")
    ? "은평구"
    : "서울 지역";

  console.log(`새로운 블로그 글 작성 시작: [${districtName}] ${targetName}`);

  // [2단계] Gemini AI로 블로그 글 생성
  const todayStr = new Date().toISOString().split("T")[0];
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

  const currentYear = new Date().getFullYear();
  // [애드센스 재심사 대응] 가공의 작성자·경험담을 만들지 않는 정직한 초안 프롬프트.
  // 이 스크립트는 초안만 만들며(content-drafts/), 발행 여부는 운영자가 원문 대조 후 결정합니다.
  const prompt = `서울시 ${districtName}의 공공 지원 정보를 주민이 이해하기 쉽게 정리하는 안내 글의 "초안"을 작성해 주세요.
이 초안은 운영자가 관할 기관의 공식 공고와 대조해 고친 뒤에만 발행됩니다.

대상 정보(공공데이터 원문): ${JSON.stringify(latestItem, null, 2)}

[반드시 지킬 원칙]
- 작성자 페르소나를 만들지 마세요. "10년 차", "직접 다녀와 보니", "주민센터에서 들은 이야기", 특정 동 주민센터의 대기시간·요일 팁처럼 실제로 확인할 수 없는 경험이나 일화를 쓰지 마세요.
- 대상 정보에 없는 금액, 연령, 기간, 전화번호, 서류를 지어내지 마세요. 원문에 없거나 불확실한 내용은 "[확인 필요: 무엇을 확인할지]" 형태로 표시하세요.
- 서로 다른 숫자를 섞지 마세요. 표와 본문의 금액·연령·기간은 반드시 같아야 합니다.
- 일반적인 신청 요령은 일반론임을 밝히고, 이 사업의 공식 조건처럼 단정하지 마세요.

[구성]
1. 한두 문장 요약: 누가, 무엇을, 어떻게 받는지
2. 핵심 정보 표: 지원 대상 / 지원 내용 / 신청 기간 / 신청 방법 / 문의처 (원문에 있는 값만, 없으면 [확인 필요])
3. 자격 조건 풀이: 헷갈리기 쉬운 조건을 원문 문장에 근거해 설명
4. 신청 절차: 원문에 근거한 단계, 근거가 없으면 [확인 필요]
5. 자주 묻는 질문 2~3개: 원문으로 답할 수 있는 것만
6. 공식 확인처: 관할 기관명과 원문 링크(대상 정보의 link)

[형식]
- 1,000~2,000자 정도, 제목은 독자가 실제로 묻는 질문 형태로(예: "${targetName}, 누가 얼마를 받나요?")
- 마크다운 코드블록(\`\`\`)은 쓰지 마세요.
- 아래 YAML 프론트매터로 시작하고 다른 설명은 붙이지 마세요:
---
title: (제목)
date: "${todayStr}"
summary: (사실만 담은 1~2문장 요약)
category: "${latestItem.category || "혜택"}"
tags: ["${districtName}", "${targetName}"]
sourceUrl: "${latestItem.link || ""}"
---

마지막 줄에 FILENAME: keyword 형식으로 파일명 키워드를 출력해 주세요. 키워드는 간결한 영문 소문자 케밥케이스입니다(예: FILENAME: nowon-mini-solar).`;

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

    // 초안은 사이트에 노출되지 않는 content-drafts/ 폴더에만 저장합니다.
    // 운영자가 공식 공고와 대조·수정한 뒤 src/content/posts/ 로 옮겨야 발행됩니다.
    const draftsDir = path.join(process.cwd(), "content-drafts");
    if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });
    const targetFilePath = path.join(draftsDir, filename);

    fs.writeFileSync(targetFilePath, finalPostContent, "utf-8");
    console.log(`블로그 초안 생성 완료(검토 필요): content-drafts/${filename}`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생 (기존 파일 유지):", err);
  }
}

main();
