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

  // 오직 강북구, 도봉구, 노원구 또는 서울 관련 정보만 엄격히 대상으로 제한 (타 지역 및 무관한 수산업 등 원천 차단)
  const availableItems = targetItems;

  if (availableItems.length === 0) {
    console.log("강북·도봉·노원 지역 대상 공공서비스 데이터가 없습니다.");
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
image: (이 글의 주제에 어울리는 고화질 Unsplash 이미지 URL 1개. 예: https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80)
---

(본문 내용: 마크다운 소제목 ###, 체크리스트, 표, 꿀팁 박스 인용구 등을 다채롭게 활용하여 1,800자 이상 정성스럽게 작성)

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
