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
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataApiKey) {
    console.error("PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }
  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  const localInfoPath = path.join(process.cwd(), "public", "data", "local-info.json");
  let localInfo = { lastUpdated: "", events: [], benefits: [] };

  try {
    if (fs.existsSync(localInfoPath)) {
      const fileRaw = fs.readFileSync(localInfoPath, "utf-8");
      localInfo = JSON.parse(fileRaw);
    }
  } catch (err) {
    console.error("기존 local-info.json 읽기 실패:", err);
    return;
  }

  // [1단계] 공공데이터포털 Gov24 API에서 데이터 가져오기 (강북, 도봉, 노원 탐색)
  const endpoint = "https://api.odcloud.kr/api/gov24/v3/serviceList";
  const targetDistricts = ["강북구", "도봉구", "노원구"];

  // 기존 등록된 서비스명 목록
  const existingNames = new Set([
    ...(Array.isArray(localInfo)
      ? localInfo.map((i) => i.name || i.title)
      : [
          ...(localInfo.events || []).map((i) => i.name || i.title),
          ...(localInfo.benefits || []).map((i) => i.name || i.title),
        ]),
  ]);

  let candidateItem = null;

  // 최대 30페이지까지 탐색하여 새로운 구정 서비스 1건 추출
  for (let page = 1; page <= 30; page++) {
    const url = `${endpoint}?page=${page}&perPage=100&returnType=JSON&serviceKey=${encodeURIComponent(
      publicDataApiKey
    )}`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const serviceItems = data.data || [];

      for (const item of serviceItems) {
        const org = item["소관기관명"] || "";
        const name = item["서비스명"] || "";
        const summary = item["서비스목적요약"] || "";
        const target = item["지원대상"] || "";
        const combined = `${org} ${name} ${summary} ${target}`;

        const isTargetDistrict = targetDistricts.some((d) => combined.includes(d));
        if (isTargetDistrict && name && !existingNames.has(name)) {
          candidateItem = item;
          break;
        }
      }

      if (candidateItem) break;
    } catch (err) {
      console.error(`공공데이터 API ${page}페이지 호출 중 오류 발생:`, err);
    }
  }

  if (!candidateItem) {
    console.log("강북구, 도봉구, 노원구의 새로운 공공서비스 데이터가 없습니다.");
    return;
  }

  console.log("새로 발견된 강북·도봉·노원 공공서비스:", candidateItem["서비스명"]);

  // [2단계] Gemini AI로 새 항목 가공 (gemini-3.6-flash 호환)
  const prompt = `아래 서울 강북구/도봉구/노원구 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 소관기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/수당/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 순수 텍스트로 출력해. 마크다운 백틱 없이.

데이터:
${JSON.stringify(candidateItem, null, 2)}`;

  let processedItem = null;
  try {
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiEndpoint, {
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

    if (!geminiRes.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${geminiRes.status})`);
      return;
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    processedItem = JSON.parse(jsonMatch);
  } catch (err) {
    console.error("Gemini AI 가공 중 오류 발생:", err);
    return;
  }

  if (!processedItem) {
    console.error("가공된 데이터가 유효하지 않습니다.");
    return;
  }

  // [3단계] local-info.json 파일에 저장
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    localInfo.lastUpdated = todayStr;
    const targetCategory = processedItem.category === "행사" ? "events" : "benefits";
    if (!localInfo[targetCategory]) {
      localInfo[targetCategory] = [];
    }

    const itemToSave = {
      id: processedItem.id
        ? String(processedItem.id)
        : `${targetCategory === "events" ? "event" : "benefit"}-${Date.now()}`,
      name: processedItem.name || processedItem.title || "",
      title: processedItem.name || processedItem.title || "",
      category: processedItem.category || (targetCategory === "events" ? "행사" : "혜택"),
      startDate: processedItem.startDate || todayStr,
      endDate: processedItem.endDate || "상시",
      location: processedItem.location || candidateItem["소관기관명"] || "서울특별시",
      target: processedItem.target || candidateItem["지원대상"] || "구민",
      summary: processedItem.summary || candidateItem["서비스목적요약"] || "",
      link: processedItem.link || candidateItem["상세조회URL"] || "https://www.gov.kr",
    };

    localInfo[targetCategory].push(itemToSave);

    fs.writeFileSync(localInfoPath, JSON.stringify(localInfo, null, 2), "utf-8");
    console.log("새로운 공공서비스 정보 1건 추가 완료:", itemToSave.title);
  } catch (err) {
    console.error("local-info.json 파일 저장 중 오류 발생:", err);
  }
}

main();
