import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { findPostSlug, legacyStaticParams } from "@/lib/legacyRedirect";

// [애드센스 재심사 대응] 예전 템플릿 자동 생성 페이지를 없앴습니다.
// 실제 글이 있는 항목만 해당 글(/blog/<slug>/)로 이동시키고, 나머지 주소는 404입니다.
// 실제 301 이동은 public/_redirects(Cloudflare Pages)가 처리하며, 이 페이지는 예비용입니다.

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return legacyStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const slug = findPostSlug(id);
  return {
    robots: { index: false, follow: true },
    alternates: slug ? { canonical: `/blog/${slug}/` } : undefined,
  };
}

export default async function LegacyRedirectPage({ params }: PageProps) {
  const { id } = await params;
  const slug = findPostSlug(id);
  permanentRedirect(slug ? `/blog/${slug}/` : "/blog/");
}
