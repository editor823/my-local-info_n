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

  const prompt = `당신은 서울시 ${districtName} 생활 복지 및 문화 정보를 친절하고 깊이 있게 해설해 주는 전문 에디터입니다.
아래 강북·도봉·노원 공공서비스 및 생활 혜택 정보를 바탕으로 지역 주민에게 실질적인 도움이 되는 고품질 블로그 글(1,500자 이상)을 정성껏 작성해 주세요.

정보: ${JSON.stringify(latestItem, null, 2)}

[작성 가이드라인]
1. 단순 공고문 복사가 아니라 구민이 바로 이해할 수 있는 친근하고 유익한 어조
2. 이 혜택을 꼭 챙겨야 하는 핵심 이유 3가지
3. 신청 자격 및 필수 구비 서류 체크리스트
4. 신청 시 실수하기 쉬운 주의사항 및 실전 꿀팁
5. 자주 묻는 질문(FAQ) 2~3가지와 상세한 답변

반드시 아래 YAML 프론트매터 형식으로만 출력하고 다른 설명 텍스트나 마크다운 코드블록 백틱(\`\`\`)은 붙이지 마세요:
---
title: (클릭하고 싶게 만드는 매력적이고 유익한 제목)
date: "${todayStr}"
summary: (이 글의 핵심 혜택을 명확히 요약한 1~2문장)
category: "${latestItem.category || "혜택"}"
tags: ["${districtName}", "생활정보", "서울시지원"]
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
