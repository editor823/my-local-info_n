import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "면책조항 (Disclaimer) | 우리 동네 이야기",
  description: "우리 동네 이야기에서 제공하는 공공데이터 및 생활 복지·행사 정보에 관한 법적 고지 및 면책조항 안내입니다.",
  alternates: {
    canonical: "/disclaimer/",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Legal Disclaimer
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            면책조항 (Disclaimer)
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            ‘우리 동네 이야기’ 서비스의 정보 제공 범위 및 법적 책임 한계에 관한 공식 안내입니다.
          </p>
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">1. 정보의 목적 및 성격</h2>
          <p>
            ‘우리 동네 이야기’는 서울시 및 강북구·도봉구·노원구 등 각 지방자치단체, 공공데이터포털(data.go.kr)에서 공개하는 공공누리(공공저작물) 데이터를 바탕으로 주민들에게 유용한 생활·복지·문화 정보를 알기 쉽게 재구성하여 제공하는 비영리 목적의 민간 정보 포털입니다.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">2. 정확성 및 최신성에 대한 면책</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-950 text-sm space-y-3">
            <p className="font-bold text-base text-amber-900">⚠️ 법적 고지 사항</p>
            <p>
              본 사이트에 수록된 복지 지원금, 신청 자격, 구비 서류, 행사 일정, 참가 비용 등의 정보는 공공기관의 공고문 발표 시점을 기준으로 정확성을 기하여 작성되었습니다. 그러나 주관 기관의 예산 조기 소진, 조례 변경, 기상 악화 등으로 인해 실제 정책 내용과 차이가 발생할 수 있습니다.
            </p>
            <p>
              따라서 이용자가 본 웹사이트의 정보에만 의존하여 행한 법적·재정적 조치나 불이익(지원금 미수령, 접수 기한 경과 등)에 대하여 본 사이트 및 운영자는 어떠한 민·형사상 법적 책임도 부담하지 않습니다.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">3. 공식 기관 확인 안내</h2>
          <p>
            복지 혜택 신청 및 행사 참가 전에는 반드시 관련 자치구청(강북구청, 도봉구청, 노원구청) 공식 홈페이지, 정부24, 또는 복지로 공식 누리집을 통해 최종 공고 내용을 직접 재확인해 주시기 바랍니다.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">4. 외부 링크에 대한 책임</h2>
          <p>
            본 사이트에는 이용자의 편의를 위해 지자체 공식 웹사이트나 관련 기관의 외부 링크가 포함될 수 있습니다. 본 사이트는 해당 외부 사이트가 독자적으로 제공하는 콘텐츠, 개인정보 보호정책, 서비스 품질에 대해 통제할 수 없으며 이에 대해 책임을 지지 않습니다.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>본 면책조항은 2026년 9월 13일부터 적용됩니다.</span>
          <div className="flex items-center gap-3 font-semibold">
            <Link href="/terms/" className="hover:text-emerald-700 underline">
              이용약관
            </Link>
            <span>·</span>
            <Link href="/privacy/" className="hover:text-emerald-700 underline">
              개인정보처리방침
            </Link>
            <span>·</span>
            <Link href="/contact/" className="hover:text-emerald-700 underline">
              문의 및 제보
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
