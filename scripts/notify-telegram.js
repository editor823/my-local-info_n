const fs = require("fs");
const path = require("path");

// .env.local 자동 로드 (로컬 실행 대비)
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

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않아 알림을 건너뜁니다.");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      console.log("텔레그램 메시지 발송 성공!");
      return true;
    } else {
      console.error("텔레그램 발송 실패:", data.description);
      return false;
    }
  } catch (err) {
    console.error("텔레그램 API 요청 오류:", err);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isFailure = args.includes("--status=failure");

  // 한국 시간(KST = UTC+9) 기준 오늘 날짜 계산
  const now = new Date();
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayKst = kstTime.toISOString().split("T")[0];

  if (isFailure) {
    const msg = [
      "🚨 [GoodKey Info] 블로그 자동 배포 실패 알림",
      "",
      `📅 일자: ${todayKst}`,
      "⚠️ 자동 배포 과정에서 오류가 발생했습니다.",
      "GitHub 저장소 Actions 탭을 확인해 주세요.",
      "",
      "🔗 확인 링크: https://github.com/editor823/my-local-info_n/actions",
    ].join("\n");

    await sendTelegramMessage(msg);
    return;
  }

  // 오늘 생성된 글이 있는지 확인
  const postsDir = path.join(process.cwd(), "src", "content", "posts");
  let todayPost = null;

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

    // 최신 글 탐색 (오늘 날짜로 시작하거나 내용의 date가 오늘인 글)
    for (const file of files) {
      if (file.startsWith(todayKst)) {
        const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
        const titleMatch = content.match(/title:\s*["']?(.*?)["']?\r?\n/);
        const summaryMatch = content.match(/summary:\s*["']?(.*?)["']?\r?\n/);
        const categoryMatch = content.match(/category:\s*["']?(.*?)["']?\r?\n/);

        todayPost = {
          file,
          slug: file.replace(/\.md$/, ""),
          title: titleMatch ? titleMatch[1] : file,
          summary: summaryMatch ? summaryMatch[1] : "",
          category: categoryMatch ? categoryMatch[1] : "혜택",
        };
        break;
      }
    }
  }

  if (todayPost) {
    // 글 업로드 성공 알림
    const msg = [
      "✅ [GoodKey Info] 오늘자 글 업로드 완료!",
      "",
      `📌 제목: ${todayPost.title}`,
      `📂 분류: ${todayPost.category}`,
      `📝 요약: ${todayPost.summary}`,
      "",
      `🔗 글 보러가기: https://goodkey-info.com/blog/${todayPost.slug}`,
      "🌐 사이트 홈: https://goodkey-info.com",
    ].join("\n");

    await sendTelegramMessage(msg);
  } else {
    // 글 미업로드(누락) 알림
    const msg = [
      "⚠️ [GoodKey Info] 블로그 글 자동 업로드 누락 알림!",
      "",
      `📅 일자: ${todayKst}`,
      "오늘 새로운 글이 발행되지 않았습니다.",
      "• 사유: 신규 공공데이터 없음 또는 AI 생성 오류",
      "• 조치: 사이트 상태 및 API 키 점검이 필요합니다.",
      "",
      "🔗 저장소 점검: https://github.com/editor823/my-local-info_n/actions",
    ].join("\n");

    await sendTelegramMessage(msg);
  }
}

main();
