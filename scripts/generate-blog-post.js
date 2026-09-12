const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
      process.exit(1);
    }

    // [1단계] 최신 데이터 확인
    const localInfoPath = path.join(process.cwd(), "public/data/local-info.json");
    if (!fs.existsSync(localInfoPath)) {
      throw new Error("local-info.json 파일이 존재하지 않습니다.");
    }

    const localInfoRaw = fs.readFileSync(localInfoPath, "utf-8");
    const localInfo = JSON.parse(localInfoRaw);
    const items = localInfo.items || [];

    if (items.length === 0) {
      console.log("local-info.json에 항목이 없습니다.");
      return;
    }

    const latestItem = items[items.length - 1];
    const postsDir = path.join(process.cwd(), "src/content/posts");
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
    let isAlreadyWritten = false;

    for (const file of existingFiles) {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      if (latestItem.name && content.includes(latestItem.name)) {
        isAlreadyWritten = true;
        break;
      }
    }

    if (isAlreadyWritten) {
      console.log("이미 작성된 글입니다");
      return;
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const today = new Date().toISOString().split("T")[0];
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: "친근하고 흥미로운 제목"
date: "${today}"
summary: "한 줄 요약"
category: "정보"
tags: ["태그1", "태그2", "태그3"]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log("Gemini API 호출 중...");

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API 요청 실패: status ${geminiRes.status} ${errText}`);
    }

    const geminiData = await geminiRes.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Gemini 응답 내용이 비어 있습니다.");
    }

    // [3단계] 파일 저장 및 텍스트 정제
    let fullText = candidateText.trim();
    // 널 문자(\x00)나 비정상 제어 문자 제거
    fullText = fullText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    if (fullText.startsWith("```markdown")) {
      fullText = fullText.replace(/^```markdown\s*/i, "").replace(/```\s*$/, "").trim();
    } else if (fullText.startsWith("```")) {
      fullText = fullText.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
    }

    // FILENAME 라인 분리 처리
    let filename = `${today}-post`;
    const filenameMatch = fullText.match(/FILENAME:\s*([a-zA-Z0-9_\-]+(?:\.md)?)/i);

    if (filenameMatch) {
      filename = filenameMatch[1].trim();
      if (!filename.endsWith(".md")) {
        filename = `${filename}.md`;
      }
      fullText = fullText.replace(/FILENAME:\s*[^\n\r]+/i, "").trim();
    } else {
      filename = `${today}-post.md`;
    }

    // 중복 파일명 방지
    let targetFilePath = path.join(postsDir, filename);
    if (fs.existsSync(targetFilePath)) {
      const baseName = filename.replace(/\.md$/, "");
      filename = `${baseName}-${Date.now()}.md`;
      targetFilePath = path.join(postsDir, filename);
    }

    fs.writeFileSync(targetFilePath, fullText, "utf-8");
    console.log(`블로그 글 생성 완료: ${filename}`);
  } catch (error) {
    console.error("블로그 글 생성 중 에러 발생 (기존 파일 유지됨):", error);
    process.exit(1);
  }
}

main();
