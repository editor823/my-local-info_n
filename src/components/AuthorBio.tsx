import React from "react";

interface AuthorBioProps {
  district?: string;
  publishedDate?: string;
}

export default function AuthorBio({ district = "강북·도봉·노원", publishedDate }: AuthorBioProps) {
  return (
    <section className="my-10 p-6 sm:p-7 bg-white rounded-3xl border border-emerald-100/80 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* 에디터 아바타 및 인증 뱃지 */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center text-2xl shadow-sm border-2 border-white">
            ✍️
          </div>
          <span
            className="absolute -bottom-1.5 -right-1.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-white"
            title="Fact-Checked"
          >
            인증됨 ✓
          </span>
        </div>

        {/* 에디터 정보 & E-E-A-T 신뢰도 안내 */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg">
              로컬 복지 큐레이터 김에디터
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              현장 취재 & 팩트체크 전담
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            서울 {district} 일대에서 10년 이상 거주하며, 주민센터 복지 창구와 행안부·정부24 공공데이터를 직접 발로 뛰며 검증합니다. 인터넷에 복사된 뻔한 정보가 아닌, <strong>실제 신청 과정에서 겪는 서류 누락 방지 팁과 현실적인 절차 노하우</strong>만을 정직하게 기록합니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-bold">●</span> 직접 현장 검증 완료
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-bold">●</span> 관할 구청 공고 기준 확인
            </span>
            {publishedDate && (
              <span className="text-slate-600">
                마지막 팩트체크: {publishedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
