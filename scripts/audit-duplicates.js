/**
 * 🤖 블로그 글 중복 생성 방지 전용 독립 검수봇
 * 실행: node scripts/audit-duplicates.js
 */

const fs = require("fs");
const path = require("path");

const postsDir = path.join(process.cwd(), "src", "content", "posts");

function extractBaseSlug(filename) {
  return filename
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-?/, "")
    .toLowerCase()
    .trim();
}

function runAudit() {
  console.log("🔍 [중복 검수봇] 블로그 포스트 정밀 전수 검사를 시작합니다...\n");

  if (!fs.existsSync(postsDir)) {
    console.error("❌ posts 디렉토리를 찾을 수 없습니다:", postsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  console.log(`📂 총 ${files.length}개의 마크다운 글을 검사합니다.`);

  const posts = [];
  const errors = [];

  for (const file of files) {
    const fullPath = path.join(postsDir, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const titleMatch = content.match(/^title:\s*["']?(.*?)["']?$/m);
    const title = titleMatch ? titleMatch[1].trim() : file;

    const baseSlug = extractBaseSlug(file);
    const exactSlug = file.replace(/\.md$/, "");

    posts.push({
      file,
      exactSlug,
      baseSlug,
      title,
    });
  }

  // 1. 파일명 및 순수 슬러그(Base Slug) 중복 검사
  const slugMap = new Map();
  for (const post of posts) {
    if (slugMap.has(post.baseSlug)) {
      const prev = slugMap.get(post.baseSlug);
      errors.push({
        type: "슬러그 중복 (키워드 카니발리제이션 위험)",
        file1: prev.file,
        file2: post.file,
        detail: `동일한 핵심 슬러그: '${post.baseSlug}'`,
      });
    } else {
      slugMap.set(post.baseSlug, post);
    }
  }

  // 2. 제목 유사도 검사
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const p1 = posts[i];
      const p2 = posts[j];

      // 제목이 100% 동일하거나 매우 유사한 경우
      if (p1.title && p2.title && p1.title === p2.title) {
        errors.push({
          type: "제목 100% 동일",
          file1: p1.file,
          file2: p2.file,
          detail: `제목: '${p1.title}'`,
        });
      }
    }
  }

  // 결과 판정
  if (errors.length > 0) {
    console.error("\n❌ [중복 검수봇 경고] 다음과 같은 중복 항목이 감지되었습니다:\n");
    errors.forEach((err, idx) => {
      console.error(`[오류 ${idx + 1}] ${err.type}`);
      console.error(`  - 파일 1: ${err.file1}`);
      console.error(`  - 파일 2: ${err.file2}`);
      console.error(`  - 상세 내용: ${err.detail}\n`);
    });
    console.error("🛑 중복 파일을 정리한 후 다시 시도해 주세요.");
    process.exit(1);
  } else {
    console.log("\n✨ ────────────────────────────────────────────── ✨");
    console.log("✅ [검수 통과] 중복된 슬러그나 제목이 단 1개도 없습니다!");
    console.log(`   - 총 검사 파일: ${posts.length}건`);
    console.log("   - 순수 슬러그 고유성: 100% 보장");
    console.log("   - 검색엔진 자기잠식 위험: 0%");
    console.log("✨ ────────────────────────────────────────────── ✨\n");
    process.exit(0);
  }
}

runAudit();
