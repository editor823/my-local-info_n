// [애드센스 재심사 대응] 예전 템플릿 페이지(/benefit/, /magazine/) 주소를
// 실제 글(/blog/<slug>/)로 301 이동시키는 Cloudflare Pages _redirects 파일을 만듭니다.
// next build 전에 자동 실행됩니다(package.json의 build 스크립트).
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, "public", "data", "local-info.json"), "utf-8"));
const postsDir = path.join(root, "src", "content", "posts");
const posts = new Set(fs.readdirSync(postsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));

const items = [...(data.benefits || []), ...(data.events || [])];
const lines = [];
const seen = new Set();
for (const item of items) {
  const target = [item.slug, item.id].find((s) => s && posts.has(s));
  if (!target) continue;
  for (const key of [item.id, item.slug]) {
    if (!key) continue;
    for (const base of ["/benefit/", "/magazine/"]) {
      for (const from of [`${base}${key}/`, `${base}${key}`]) {
        if (seen.has(from)) continue;
        seen.add(from);
        lines.push(`${from} /blog/${target}/ 301`);
      }
    }
  }
}
// 글이 없는 예전 템플릿 주소는 글 목록으로 보냅니다.
lines.push("/benefit/* /blog/ 301");
lines.push("/magazine/* /blog/ 301");

fs.writeFileSync(path.join(root, "public", "_redirects"), lines.join("\n") + "\n", "utf-8");
console.log(`_redirects 생성: ${lines.length}줄`);
