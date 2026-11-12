"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "correction",
    title: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 유효성 검사
    if (!formData.name.trim()) {
      setErrorMessage("성함 또는 닉네임을 입력해 주세요.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    if (!formData.title.trim()) {
      setErrorMessage("문의 제목을 입력해 주세요.");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage("문의 내용을 최소 10자 이상 입력해 주세요.");
      return;
    }

    setErrorMessage("");
    setStatus("submitting");

    // 2. [애드센스 재심사 대응] 정적 사이트라 서버로 전송하지 않습니다.
    //    입력 내용으로 메일 앱의 새 메일을 열고, 실제 전송은 사용자가 메일 앱에서 합니다.
    window.location.href = mailtoHref;
    setStatus("success");
  };

  const mailtoHref = `mailto:tkdgus8231@gmail.com?subject=${encodeURIComponent(
    `[${formData.category}] ${formData.title}`
  )}&body=${encodeURIComponent(`보낸 사람: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      category: "correction",
      title: "",
      message: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
          ✍️
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">메일로 문의하기</h2>
          <p className="text-xs text-slate-500">
            아래 내용을 채우면 메일 앱에 새 메일이 만들어집니다. 메일 앱에서 보내기를 눌러야 전송됩니다.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="p-8 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-md shadow-emerald-500/20">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950">메일 앱에서 보내기를 눌러 주세요</h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-1.5 leading-relaxed">
              작성하신 내용으로 새 메일을 열었습니다. 아직 전송되지 않았으니 메일 앱에서 보내기를 눌러 주세요.
              <br />
              메일 앱이 열리지 않았다면 아래 버튼을 누르거나 tkdgus8231@gmail.com 으로 직접 보내 주세요.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100/50 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              추가 문의 작성하기
            </button>
            <a
              href={mailtoHref}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              메일 앱 다시 열기 ↗
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. 성함 / 닉네임 */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-bold text-slate-700">
                성함 또는 닉네임 <span className="text-emerald-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* 2. 회신받을 이메일 */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                회신받을 이메일 주소 <span className="text-emerald-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 3. 문의 유형 */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-slate-700">
                문의 유형 <span className="text-emerald-600">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              >
                <option value="정보 정정/오류 제보">1. 정보 정정 / 오류 제보</option>
                <option value="지역 행사/축제 제보">2. 지역 행사 / 축제 제보</option>
                <option value="콘텐츠 제휴 및 협업">3. 콘텐츠 제휴 및 협업</option>
                <option value="기타 일반 문의">4. 기타 일반 문의</option>
              </select>
            </div>

            {/* 4. 문의 제목 */}
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="title" className="block text-xs font-bold text-slate-700">
                문의 제목 <span className="text-emerald-600">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="예: [도봉구 지원금] 접수 마감일자 확인 요청"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 5. 상세 내용 */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-bold text-slate-700">
              상세 내용 <span className="text-emerald-600">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="문의하시거나 제보하실 내용을 상세히 적어주세요. 특정 공고 글에 대한 문의라면 해당 글 제목이나 링크를 함께 기재해주시면 더 빠른 확인이 가능합니다."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-y"
            ></textarea>
            <p className="text-[11px] text-slate-400">
              * 최소 10자 이상 입력해 주시기 바랍니다.
            </p>
          </div>

          {/* 6. 개인정보 수집 및 처리 동의 */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <span>🔒</span>
            <p>
              이 양식은 사이트에 내용을 저장하거나 전송하지 않습니다. 입력하신 내용은 이용자의 메일 앱으로만 전달되며, 보내신 메일은 <strong>문의 답변 목적</strong>으로만 이용합니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>메일 앱 여는 중...</span>
              </>
            ) : (
              <>
                <span>메일 앱으로 작성하기</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
