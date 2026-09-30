"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs?: FaqItem[];
  postTitle: string;
  category: string;
}

export default function PostFaqSection({ faqs, postTitle, category }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      question: `${postTitle}의 신청 자격 요건은 어떻게 되나요?`,
      answer: `본 지원 사업은 관할 자치구(강북구·도봉구·노원구)에 주민등록을 둔 구민을 우선 대상으로 합니다. 가구 소득(2026년 기준 중위소득 기준) 및 연령, 대상 자격(어르신, 장애인, 한부모, 청년 등)을 충족해야 하며, 상세 기준은 관할 동 주민센터 또는 정부24에서 확인 가능합니다.`,
    },
    {
      question: `신청 시 필요한 필수 구비 서류는 무엇인가요?`,
      answer: `신청인 본인 신분증, 주민등록등본(최근 3개월 이내 발급본), 본인 명의 통장 사본이 기본 필요 서류입니다. 대리 신청의 경우 위임장과 대리인 신분증, 가족관계증명서가 추가로 요구될 수 있습니다.`,
    },
    {
      question: `타 자치구 지원금이나 유사 복지 혜택과 중복 수혜가 가능한가요?`,
      answer: `사업의 성격에 따라 중복 수급이 제한될 수 있습니다. 예를 들어 동일한 목적으로 지급되는 생계비나 바우처는 중복 지급이 제외될 수 있으므로, 접수 전 관할 동 주민센터 복지팀 담당자와 사전 상담하시는 것을 권장합니다.`,
    },
    {
      question: `온라인 접수와 방문 접수 중 어떤 방법이 더 빠른가요?`,
      answer: `정부24(gov.kr) 또는 복지로(bokjiro.go.kr)에 온라인 신청 창구가 열려 있는 경우 24시간 온라인 접수가 가장 간편합니다. 다만 증빙 서류 보완이 필요한 경우에는 관할 동 주민센터(행정복지센터)를 직접 방문하여 접수하시는 편이 서류 누락 방지에 유리합니다.`,
    },
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4 my-8">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
          💬
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-900">
            자주 묻는 질문 (FAQ) &amp; 핵심 질의응답
          </h3>
          <p className="text-xs text-slate-500">
            구민 여러분이 가장 궁금해하시는 질문과 해결 팁을 모았습니다.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-700 bg-slate-50/70 hover:bg-emerald-50/40 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black">Q.</span>
                  <span>{item.question}</span>
                </span>
                <span className="text-slate-400 font-bold text-xs">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-700 font-black shrink-0">A.</span>
                    <p className="whitespace-pre-line">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
