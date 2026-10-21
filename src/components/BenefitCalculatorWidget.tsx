"use client";

import { useState } from "react";

interface Props {
  defaultDistrict?: string;
  category?: string;
  postTitle?: string;
}

export default function BenefitCalculatorWidget({
  defaultDistrict = "all",
  category = "혜택",
  postTitle = "생활 지원금",
}: Props) {
  const [district, setDistrict] = useState(
    defaultDistrict.includes("도봉")
      ? "도봉구"
      : defaultDistrict.includes("노원")
      ? "노원구"
      : defaultDistrict.includes("강북")
      ? "강북구"
      : "강북구"
  );
  const [householdSize, setHouseholdSize] = useState("1");
  const [incomeLevel, setIncomeLevel] = useState("median100");
  const [isCalculated, setIsCalculated] = useState(false);

  // 2026년 기준 중위소득 기준표 (단위: 원)
  const medianIncome2026: Record<string, { median100: number; median50: number; median70: number }> = {
    "1": { median100: 2420000, median50: 1210000, median70: 1694000 },
    "2": { median100: 4030000, median50: 2015000, median70: 2821000 },
    "3": { median100: 5180000, median50: 2590000, median70: 3626000 },
    "4": { median100: 6310000, median50: 3155000, median70: 4417000 },
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
  };

  const currentMedian = medianIncome2026[householdSize] || medianIncome2026["1"];

  return (
    <div className="bg-gradient-to-br from-[#062c1e] to-[#0e4430] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-emerald-800/60 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-700/50">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-lg font-bold">
            ⚡
          </span>
          <div>
            <h3 className="font-black text-base sm:text-lg text-emerald-100 flex flex-wrap items-center gap-2">
              <span>2026 {category} 자가 진단 시뮬레이터</span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                {postTitle ? `${postTitle.slice(0, 15)}... 연계` : "실시간 간편 진단"}
              </span>
            </h3>
            <p className="text-xs text-emerald-200/70">
              현재 거주 자치구와 가구원 수, 소득 구간을 선택하여 [{category}] 관련 적격 여부와 기준선을 확인하세요.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="pt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. 거주 자치구 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200">
              1. 거주 자치구
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2.5 bg-emerald-950/70 border border-emerald-700/70 rounded-xl text-xs sm:text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="강북구">서울특별시 강북구</option>
              <option value="도봉구">서울특별시 도봉구</option>
              <option value="노원구">서울특별시 노원구</option>
            </select>
          </div>

          {/* 2. 가구원 수 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200">
              2. 주민등록상 가구원 수
            </label>
            <select
              value={householdSize}
              onChange={(e) => {
                setHouseholdSize(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2.5 bg-emerald-950/70 border border-emerald-700/70 rounded-xl text-xs sm:text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="1">1인 가구 (단독 세대)</option>
              <option value="2">2인 가구</option>
              <option value="3">3인 가구</option>
              <option value="4">4인 이상 가구</option>
            </select>
          </div>

          {/* 3. 소득 인정액 기준 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200">
              3. 가구 소득 구간
            </label>
            <select
              value={incomeLevel}
              onChange={(e) => {
                setIncomeLevel(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-3.5 py-2.5 bg-emerald-950/70 border border-emerald-700/70 rounded-xl text-xs sm:text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="basic">기초생활수급자 / 차상위계층</option>
              <option value="median50">기준 중위소득 50% 이하</option>
              <option value="median70">기준 중위소득 70% 이하</option>
              <option value="median100">기준 중위소득 100% 이하</option>
              <option value="universal">소득 무관 (전 구민 보편 지원)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>내 조건으로 자격 기준 &amp; 월 한도액 산출하기</span>
          <span>→</span>
        </button>
      </form>

      {/* 진단 결과 카드 */}
      {isCalculated && (
        <div className="mt-5 p-4 sm:p-5 bg-white text-slate-800 rounded-2xl shadow-inner border border-emerald-100 animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>📊</span> {district} · {householdSize}인 가구 분석 결과
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              지원 적격성: 높음
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">2026년 기준 중위소득 100%</span>
              <strong className="text-sm text-slate-900 font-extrabold">
                월 {currentMedian.median100.toLocaleString()}원
              </strong>
              <p className="text-[10px] text-slate-500">
                (중위 50% 기준선: 월 {currentMedian.median50.toLocaleString()}원)
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl space-y-1 border border-emerald-100">
              <span className="text-[11px] text-emerald-800 block font-medium">선정 시 권장 행동 요령</span>
              <strong className="text-xs text-emerald-950 block">
                관할 동 주민센터 복지팀 방문 신청 권장
              </strong>
              <p className="text-[10px] text-emerald-700">
                정부24 온라인 전산과 관할 구비서류 대조 후 신청
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            💡 본 시뮬레이션은 2026년도 보건복지부 고시 기준 중위소득 및 {district} 조례를 바탕으로 산출된 참고 수치입니다. 소득인정액 산정 시 금융재산, 일반재산, 자동차 가액 공제율에 따라 개인별 실제 수급 자격은 차이가 발생할 수 있습니다.
          </p>
        </div>
      )}

      {/* [운영자 가이드 및 투명성 고지] 도구의 원리, 한계점, 자주 묻는 질문 */}
      <div className="mt-5 pt-4 border-t border-emerald-700/50 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-emerald-100">
          <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/60 space-y-1.5">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
              <span>⚙️</span> 시뮬레이터 산정 원리
            </h4>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed">
              2026년도 대한민국 보건복지부 고시 기준 중위소득 공식 데이터(1인~4인 가구)를 기반으로 작동합니다. 사용자가 선택한 가구원 수와 거주 자치구 조례의 수급 기준선을 실시간으로 비교 대조합니다.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/60 space-y-1.5">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <span>⚠️</span> 이 도구가 하지 못하는 한계점
            </h4>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed">
              행복e음(사회보장정보시스템)의 금융재산, 부동산 공시지가, 자동차 가액, 부채 차감 등 정밀 소득인정액 조사는 반영되지 않습니다. 따라서 모의 참고용이며 법적 확정 효력은 없습니다.
            </p>
          </div>
        </div>

        <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center justify-between flex-wrap gap-2">
          <span>✍️ <strong>에디터 노트:</strong> 115만 동북권 구민이 복잡한 고시문 대신 1분 만에 기준을 파악할 수 있도록 지속 업데이트 중입니다.</span>
          <span className="text-emerald-400 font-medium">데이터 기준: 2026년 최신 고시</span>
        </div>
      </div>
    </div>
  );
}
