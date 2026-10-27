"use client";

import React, { useState } from "react";

interface InteractiveChecklistProps {
  district: string;
  benefitTitle: string;
}

export default function InteractiveChecklist({
  district,
  benefitTitle,
}: InteractiveChecklistProps) {
  const defaultItems = [
    { id: "c1", text: `주민등록등본상 현재 거주지가 ${district} 관내인가요?`, checked: false },
    { id: "c2", text: "신청일 기준 지원 대상 연령 또는 대상 자격(가구 요건)을 충족하시나요?", checked: false },
    { id: "c3", text: "본인 명의의 신분증 및 본인 명의 입금 통장을 소지하고 계신가요?", checked: false },
    { id: "c4", text: "동일 목적의 타 유사 중복 수혜 지원금을 수령하고 있지 않으신가요?", checked: false },
    { id: "c5", text: "최근 3개월 이내 발급된 필수 구비 서류를 준비하실 수 있나요?", checked: false },
  ];

  const [items, setItems] = useState(defaultItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const isAllChecked = checkedCount === items.length;

  return (
    <section className="bg-white border-2 border-emerald-100 rounded-3xl p-5 sm:p-7 shadow-sm my-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
            📋
          </span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {benefitTitle ? `[${benefitTitle}] ` : ""}신청 자격 1분 자가진단 체크리스트
            </h3>
            <p className="text-xs text-slate-600">
              클릭하여 본인의 신청 자격 부합 여부를 미리 점검해 보세요
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 border border-emerald-200">
          <span>진단 진행률:</span>
          <span className="text-emerald-700 font-black">
            {checkedCount} / {items.length} ({Math.round((checkedCount / items.length) * 100)}%)
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
              item.checked
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 text-slate-700"
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
            />
            <span className="text-xs sm:text-sm leading-relaxed">{item.text}</span>
          </label>
        ))}
      </div>

      {/* 진단 결과 알림 배너 */}
      <div
        className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${
          isAllChecked
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
            : checkedCount >= 3
            ? "bg-teal-50 border border-teal-200 text-teal-900"
            : "bg-slate-50 border border-slate-200 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {isAllChecked ? "🎉" : checkedCount >= 3 ? "💡" : "ℹ️"}
          </span>
          <span className="font-bold">
            {isAllChecked
              ? `축하합니다! 5개 필수 조건을 모두 충족하셨습니다. 바로 신청 서류를 준비하세요!`
              : checkedCount >= 3
              ? "대부분의 조건을 충족하셨습니다. 나머지 항목을 점검 후 접수하세요."
              : "조건 항목을 체크하시면 실시간 자가진단 결과를 안내해 드립니다."}
          </span>
        </div>

        {isAllChecked && (
          <span className="hidden sm:inline-block bg-white text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
            적격 판정
          </span>
        )}
      </div>
    </section>
  );
}
