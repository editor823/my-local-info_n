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
  const targetDistricts = ["강북구", "도봉구", "노원구"];
  const targetItems = allItems.filter((item) => {
    const text = `${item.location || ""} ${item.name || ""} ${item.title || ""} ${
      item.target || ""
    } ${item.summary || ""}`;
    return targetDistricts.some((d) => text.includes(d));
  });

  const availableItems = targetItems.length > 0 ? targetItems : allItems;

  if (availableItems.length === 0) {
    console.log("공공서비스 데이터가 비어 있습니다.");
    return;
  }

  // src/content/posts 폴더 확인 및 기존 글 검사
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const existingContents = existingFiles.map((file) => {
    try {
      return fs.readFileSync(path.join(postsDir, file), "utf-8");
    } catch {
      return "";
    }
  });

  // 아직 블로그 글이 작성되지 않은 항목 찾기 (역순: 최신 등록순)
  let latestItem = null;
  for (let i = availableItems.length - 1; i >= 0; i--) {
    const candidate = availableItems[i];
    const candidateName = candidate.name || candidate.title || "";
    if (!candidateName) continue;

    const alreadyWritten = existingContents.some((content) =>
      content.includes(candidateName)
    );

    if (!alreadyWritten) {
      latestItem = candidate;
      break;
    }
  }

  if (!latestItem) {
    console.log("강북·도봉·노원 지역의 새로운 작성 대상 공공서비스가 없습니다 (이미 모두 작성됨).");
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
  const prompt = `당신은 서울시 ${districtName} 생활 복지 및 문화 정보를 친절하고 깊이 있게 해설해 주는 10년 차 수석 SEO 에디터입니다.
아래 강북·도봉·노원 공공서비스 및 생활 혜택 정보를 바탕으로 네이버/구글 검색 상위 노출과 클릭률(CTR)을 극대화할 수 있는 고품질 블로그 글(1,500자 이상)을 정성껏 작성해 주세요.

정보: ${JSON.stringify(latestItem, null, 2)}

[핵심 SEO 제목 작성 공식 - 절대 준수]
제목(title)은 네이버/구글 검색 이용자가 실제로 검색창에 치는 단어들을 조합하여 작성해야 합니다.
- 필수 포함 요소: [연도: ${currentYear}년] + [지역명: ${districtName}] + [핵심 혜택 명칭] + [검색 의도 키워드: 신청방법, 자격조건, 서류, 꿀팁 중 1~2개]
- 좋은 제목 예시:
  * [${currentYear} ${districtName}] ${targetName} 총정리: 신청방법과 지원 대상 자격 확인
  * 모르면 못 받는 ${districtName} ${targetName}, 지원금 혜택 및 신청 서류 완벽 가이드
- 너무 딱딱한 공문서식 제목은 금지하며, 독자의 클릭을 유도하는 매력적인 문구로 지어주세요.

[본문 작성 가이드라인]
1. 도입부: 왜 이 정보가 ${districtName} 주민에게 지금 꼭 필요한지 공감대 형성
2. 이 혜택을 놓치면 안 되는 핵심 이유 3가지 (구체적 금액/장점 언급)
3. 신청 자격 요건 (연령, 거주지, 소득 기준 명확히 정리)
4. 신청 방법 및 필수 구비 서류 체크리스트 (온라인/방문처 링크 포함)
5. 신청 시 실수하기 쉬운 주의사항 및 실전 꿀팁
6. 주민들이 가장 많이 묻는 질문과 답변 (FAQ 3가지)

반드시 아래 YAML 프론트매터 형식으로만 출력하고 다른 설명 텍스트나 마크다운 코드블록 백틱(\`\`\`)은 붙이지 마세요:
---
title: (위의 황금 공식대로 작성된 검색 최적화 제목)
date: "${todayStr}"
summary: (구글 검색 스니펫에 노출될 클릭 유도형 1~2문장 요약)
category: "${latestItem.category || "혜택"}"
tags: ["${districtName}", "${targetName}", "생활정보", "지원금", "신청방법"]
image: (이 글의 주제에 맞는 Unsplash 이미지 URL 1개. 예: https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)
---

(본문 내용: 마크다운 소제목 ###, 글머리 기호, 표 또는 체크리스트를 풍부하게 활용하여 1,500자 이상으로 길고 알차게 작성)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명을 출력해줘. 키워드는 간결한 영문 소문자 케밥케이스로.`;

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
        const parsedName = line.replace("FILENAME:", "").trim().replace(/\.md$/, "");
        if (parsedName) {
          filename = `${parsedName}.md`;
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

    const targetFilePath = path.join(postsDir, filename);

    fs.writeFileSync(targetFilePath, finalPostContent, "utf-8");
    console.log(`블로그 글 생성 완료: ${filename}`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생 (기존 파일 유지):", err);
  }
}

main();
