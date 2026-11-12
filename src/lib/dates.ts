// 빌드 시점의 한국 날짜(YYYY-MM-DD). 정적 사이트라 배포할 때마다 갱신됩니다.
export function buildDateKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
