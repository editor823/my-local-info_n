import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 우리 동네 이야기",
  description: "우리 동네 이야기의 개인정보 수집, 이용, 쿠키 정책 및 제3자(Google AdSense 등) 서비스 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Privacy Policy
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            개인정보처리방침
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            ‘우리 동네 이야기’(이하 ‘사이트’)는 이용자의 개인정보를 소중히 여기며 관련 법령을 준수합니다.
          </p>
        </div>


        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">1. 수집하는 개인정보 항목</h2>
          <p>
            사이트는 별도의 회원가입 없이 누구나 자유롭게 이용할 수 있습니다. 다만, 서비스 이용 과정에서 웹 브라우저 정보, 접속 IP, 쿠키(Cookie), 방문 일시 등의 로그 정보가 자동으로 생성되어 수집될 수 있습니다.
          </p>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">2. 구글 애드센스 및 제3자 광고 쿠키 정책</h2>
          <p>
            본 사이트는 구글(Google)을 포함한 제3자 광고 업체의 광고 게재 서비스를 이용할 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 bg-slate-100 p-4 rounded-xl text-sm">
            <li>
              구글을 비롯한 제3자 공급업체는 사용자의 이전 웹사이트 방문 기록을 기반으로 맞춤형 광고를 게재하기 위해 <strong>쿠키(Cookie)</strong>를 사용합니다.
            </li>
            <li>
              구글의 광고 쿠키 사용으로 인해 구글 및 제휴사는 본 사이트 또는 인터넷의 다른 웹사이트 방문 기록을 기반으로 적절한 광고를 사용자에게 제공할 수 있습니다.
            </li>
            <li>
              사용자는 언제든지 구글 광고 설정( <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">adssettings.google.com</a> )을 방문하여 맞춤형 광고 게재에 사용되는 쿠키를 비활성화할 수 있습니다.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">3. 웹 분석 도구(Google Analytics) 이용 안내</h2>
          <p>
            사이트 품질 개선 및 사용자 편의 증진을 위해 구글 애널리틱스(Google Analytics) 등의 방문자 분석 도구를 활용할 수 있습니다. 이 도구는 익명화된 트래픽 데이터(페이지 방문 횟수, 머문 시간 등)만을 수집하며, 특정 개인을 식별할 수 있는 정보는 수집하지 않습니다.
          </p>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">4. 쿠키의 설치/운영 및 거부</h2>
          <p>
            이용자는 웹 브라우저의 옵션을 조정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 권리가 있습니다.
          </p>
          <p className="text-xs text-slate-500">
            * 설정 방법 예시 (Chrome 브라우저): 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용 기록 삭제 또는 서드 파티 쿠키 차단
          </p>
        </section>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">5. 개인정보 보호책임자 및 문의</h2>
          <p>
            개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 문의처를 통해 신속하게 답변받으실 수 있습니다.
          </p>
          <p className="text-sm font-semibold text-slate-700">
            문의 이메일: <a href="mailto:tkdgus8231@gmail.com" className="text-emerald-600 hover:underline font-semibold">tkdgus8231@gmail.com</a> (운영팀)
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-400">
          본 방침은 2026년 9월 13일부터 시행됩니다.
        </div>
      </main>

      <Footer />
    </div>
  );
}

