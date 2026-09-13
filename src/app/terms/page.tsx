import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "이용약관 및 면책조항 | 우리 동네 이야기",
  description: "우리 동네 이야기 서비스 이용 조건 및 공공데이터 정보 제공에 관한 법적 면책 조항 안내입니다.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Terms & Disclaimer
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            이용약관 및 면책조항
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            ‘우리 동네 이야기’ 서비스를 이용해 주시는 모든 분들께 감사드리며, 서비스 이용 조건과 안내 사항을 전달드립니다.
          </p>
        </div>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">1. 서비스의 성격</h2>
          <p>
            본 웹사이트는 행정안전부 공공데이터포털(data.go.kr) 및 각 지자체/정부 부처에서 공개한 오픈 데이터를 기반으로, 시민들의 편의를 돕기 위해 정보를 수집·가공하여 무료로 제공하는 <strong>비공식 민간 생활 정보 포털</strong>입니다.
          </p>
        </section>


        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">2. 정보의 정확성 및 면책 조항 (Disclaimer)</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm space-y-2">
            <p className="font-bold">⚠️ 주의 사항 및 법적 고지</p>
            <p>
              본 사이트에 게재된 모든 정보(행사 일정, 지원금 신청 자격, 구비 서류 등)는 작성 시점의 공공데이터를 기준으로 정성을 다해 검수하고 있으나, 주관 기관의 예산 소진, 정책 변경, 천재지변 등에 따라 실제 내용과 차이가 발생할 수 있습니다.
            </p>
            <p>
              따라서 사용자가 본 사이트의 정보만을 신뢰하여 발생한 직·간접적인 손해에 대해 사이트 운영자는 법적 책임을 지지 않습니다. 최종 신청 전에는 반드시 관련 관공서나 주관 기관의 공식 공고문을 확인하시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">3. 저작권 및 지식재산권</h2>
          <p>
            공공누리(공공저작물 자유이용허락) 라이선스에 따라 제공되는 데이터를 제외한 본 사이트의 고유 콘텐츠 및 디자인에 대한 저작권은 사이트 운영자에게 있습니다. 운영자의 사전 동의 없는 무단 전재, 크롤링 및 상업적 재배포를 금합니다.
          </p>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">4. 서비스 변경 및 중단</h2>
          <p>
            운영자는 시스템 점검, 서버 교체, 기타 운영상 필요에 따라 서비스의 전부 또는 일부를 수정하거나 일시 중단할 수 있습니다.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-400">
          본 약관은 2026년 9월 13일부터 적용됩니다.
        </div>
      </main>

      <Footer />
    </div>
  );
}

