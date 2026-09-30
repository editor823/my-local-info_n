import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기 & 소통 창구 | 우리 동네 이야기 (강북·도봉·노원)",
  description: "우리 동네 이야기 운영팀과 직접 소통하실 수 있는 공식 문의 및 오류 제보 창구입니다. 영업일 기준 24~48시간 이내에 신속하게 답변해 드립니다.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-10">
        {/* 상단 타이틀 섹션 */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            Contact & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            문의 및 제보하기
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            게재된 정보의 정정 요청, 동네 행사/축제 제보, 비즈니스 협업 등 소중한 의견을 기다립니다.
          </p>
        </div>

        {/* 1. 상단 빠른 안내 카드 3종 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              📧
            </div>
            <h3 className="font-bold text-slate-900 text-sm">공식 관리자 이메일</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              직접 메일 발송이 필요하신 경우 아래 주소로 문의를 남겨주세요.
            </p>
            <a
              href="mailto:tkdgus8231@gmail.com"
              className="text-xs sm:text-sm font-extrabold text-emerald-600 hover:underline block pt-1 break-all"
            >
              tkdgus8231@gmail.com
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              ⏱️
            </div>
            <h3 className="font-bold text-slate-900 text-sm">답변 처리 소요 시간</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              접수된 모든 문의는 담당 에디터가 확인 후 24~48시간 이내에 회신합니다.
            </p>
            <p className="text-xs font-semibold text-slate-700 pt-1">
              평일: 10:00 ~ 18:00 (주말/공휴일 제외)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              🛡️
            </div>
            <h3 className="font-bold text-slate-900 text-sm">데이터 검증 및 피드백</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              지자체 조례 변경, 신청 마감 등 오류 제보 시 최우선 순위로 문서를 수정합니다.
            </p>
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              신속 정정 프로세스 운영
            </span>
          </div>
        </div>

        {/* 2. 인터랙티브 문의 폼 UI 컴포넌트 */}
        <ContactForm />

        {/* 3. 자주 묻는 질문(FAQ) 및 이용 안내 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>💡</span> 자주 접수되는 문의 안내
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <strong className="text-slate-900 block mb-1 text-sm">
                Q. 특정 지원금이나 복지 혜택의 최종 선발 여부를 확인할 수 있나요?
              </strong>
              <p className="text-slate-600 leading-relaxed">
                ‘우리 동네 이야기’는 공공데이터를 기반으로 알기 쉬운 가이드를 제공하는 <strong>민간 정보 안내 포털</strong>입니다. 구민 여러분의 개별 신청 결과, 대상자 심사 및 지급 내역 조회는 각 관할 구청(강북·도봉·노원구청) 또는 정부24(보조금24) 공식 처를 통해 확인하셔야 합니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <strong className="text-slate-900 block mb-1 text-sm">
                Q. 우리 동네 문화행사나 플리마켓, 전시회를 무료로 제보할 수 있나요?
              </strong>
              <p className="text-slate-600 leading-relaxed">
                네, 가능합니다! 강북구, 도봉구, 노원구 구민들이 참여할 수 있는 공익적 문화행사, 축제, 주민 체험 프로그램은 위 문의 양식에서 [2. 지역 행사/축제 제보]를 선택하시고 행사명, 일시, 장소, 공식 링크를 남겨주시면 검토 후 축제 캘린더에 무료로 등재해 드립니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
