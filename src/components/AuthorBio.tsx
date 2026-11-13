import React from "react";
import Link from "next/link";

interface AuthorBioProps {
  district?: string;
  publishedDate?: string;
  lastChecked?: string;
}

// [애드센스 재심사 대응] 가공의 인물·경력·인증 표시를 없애고,
// 실제 운영 주체와 글이 만들어지는 방식을 그대로 안내합니다.
// 운영자 실명이나 상호를 공개하려면 OPERATOR_NAME 을 바꾸세요.
const OPERATOR_NAME = "우리동네이야기";

export default function AuthorBio({ publishedDate, lastChecked }: AuthorBioProps) {
  return (
    <section className="my-10 p-6 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-xs">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-slate-900 text-base">작성·검토: {OPERATOR_NAME}</span>
          {publishedDate && (
            <span className="text-[11px] text-slate-500">작성일 {publishedDate}</span>
          )}
          {lastChecked && (
            <span className="text-[11px] text-emerald-700 font-semibold">· 최종 확인일 {lastChecked}</span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          이 글은 행정안전부 공공데이터포털·정부24에 공개된 공공서비스 정보를 바탕으로 정리했습니다.
          초안 작성에 AI 도구를 사용했으며, 운영자가 내용을 검토합니다. 지원 대상·금액·기간은 예산과
          조례에 따라 바뀔 수 있으니 신청 전 반드시 관할 기관의 공식 공고를 확인해 주세요.
        </p>

        <p className="text-xs text-slate-500">
          잘못된 내용을 발견하셨다면{" "}
          <Link href="/contact/" className="font-bold underline text-emerald-800 hover:text-emerald-950">
            문의 페이지
          </Link>
          로 알려 주세요. 확인 후 수정합니다.
        </p>
      </div>
    </section>
  );
}
