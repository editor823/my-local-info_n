const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PUBLIC_DATA_API_KEY) {
      console.error("PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.");
      process.exit(1);
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
      process.exit(1);
    }

    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const serviceUrl = new URL("https://api.odcloud.kr/api/gov24/v3/serviceList");
    serviceUrl.searchParams.append("page", "1");
    serviceUrl.searchParams.append("perPage", "20");
    serviceUrl.searchParams.append("returnType", "JSON");
    serviceUrl.searchParams.append("serviceKey", PUBLIC_DATA_API_KEY);

    console.log("공공데이터 API 요청 중...");
    const apiRes = await fetch(serviceUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!apiRes.ok) {
      throw new Error(`공공데이터 API 요청 실패: status ${apiRes.status} ${apiRes.statusText}`);
    }

    const apiData = await apiRes.json();
    const rawItems = apiData.data || [];

    if (rawItems.length === 0) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // 필터링 헬퍼 함수
    const containsText = (item, keyword) => {
      const targetFields = [
        item.서비스명,
        item.서비스목적요약,
        item.지원대상,
        item.소관기관명,
      ];
      return targetFields.some((field) => typeof field === "string" && field.includes(keyword));
    };

    let filteredItems = rawItems.filter((item) => containsText(item, "성남"));
    if (filteredItems.length === 0) {
      filteredItems = rawItems.filter((item) => containsText(item, "경기"));
    }
    if (filteredItems.length === 0) {
      filteredItems = rawItems;
    }

    // [2단계] 기존 데이터와 비교
    const localInfoPath = path.join(process.cwd(), "public/data/local-info.json");
    if (!fs.existsSync(localInfoPath)) {
      throw new Error("기존 local-info.json 파일이 존재하지 않습니다.");
    }

    const localInfoRaw = fs.readFileSync(localInfoPath, "utf-8");
    const localInfo = JSON.parse(localInfoRaw);
    const existingNames = new Set((localInfo.items || []).map((item) => item.name));

    // 이미 있는 항목(name 기준) 제외
    const newItems = filteredItems.filter((item) => {
      const name = item.서비스명 || item.serviceName || item.name;
      return name && !existingNames.has(name);
    });

    if (newItems.length === 0) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    // 새 항목 1개 선정
    const selectedItem = newItems[0];
    console.log(`신규 데이터 가공 대상: ${selectedItem.서비스명 || selectedItem.name}`);

    // [3단계] Gemini AI로 새 항목 1개만 가공
    const today = new Date().toISOString().split("T")[0];
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

[공공데이터 내용]
${JSON.stringify(selectedItem, null, 2)}`;

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
      const errBody = await geminiRes.text();
      throw new Error(`Gemini API 요청 실패: status ${geminiRes.status} ${errBody}`);
    }

    const geminiData = await geminiRes.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Gemini 응답 내용이 비어 있습니다.");
    }

    // 마크다운 코드블록 제거 후 JSON 파싱
    let cleanedJsonText = candidateText.trim();
    if (cleanedJsonText.startsWith("```")) {
      cleanedJsonText = cleanedJsonText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    }

    const parsedItem = JSON.parse(cleanedJsonText);

    // [4단계] 기존 데이터에 추가
    // url/link 호환 처리 및 id 부여
    if (parsedItem.link && !parsedItem.url) {
      parsedItem.url = parsedItem.link;
    }
    if (!parsedItem.url) {
      parsedItem.url = "#";
    }

    // 기존 items와 겹치지 않는 id 보장
    if (!parsedItem.id) {
      parsedItem.id = `item-${Date.now()}`;
    }

    if (!Array.isArray(localInfo.items)) {
      localInfo.items = [];
    }

    localInfo.items.push(parsedItem);
    localInfo.updatedAt = today;

    fs.writeFileSync(localInfoPath, JSON.stringify(localInfo, null, 2), "utf-8");
    console.log("기존 local-info.json에 신규 데이터가 성공적으로 추가되었습니다.");
  } catch (error) {
    console.error("데이터 수집 및 처리 중 오류 발생 (기존 local-info.json 유지됨):", error);
    process.exit(1);
  }
}

main();
