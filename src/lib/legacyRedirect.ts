import { getPostBySlug } from "@/lib/posts";
import localInfoData from "../../public/data/local-info.json";

// 예전 템플릿 주소(/benefit/, /magazine/)를 실제 글 slug로 찾아 주는 도우미

type Item = { id?: string; slug?: string };

function allItems(): Item[] {
  return [...((localInfoData.benefits || []) as Item[]), ...((localInfoData.events || []) as Item[])];
}

export function findPostSlug(idOrSlug: string): string | null {
  const key = decodeURIComponent(idOrSlug);
  const item = allItems().find((i) => i.id === key || i.slug === key);
  if (!item) return null;
  return [item.slug, item.id].find((s) => s && getPostBySlug(s)) || null;
}

export function legacyStaticParams(): { id: string }[] {
  const params: { id: string }[] = [];
  const seen = new Set<string>();
  for (const item of allItems()) {
    if (!findPostSlug(item.id || item.slug || "")) continue;
    for (const key of [item.id, item.slug]) {
      if (key && !seen.has(key)) {
        seen.add(key);
        params.push({ id: key });
      }
    }
  }
  return params;
}
