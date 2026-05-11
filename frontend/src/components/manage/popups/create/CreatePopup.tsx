"use client";
import React, { useState, useMemo } from "react";
import {
  Megaphone,
  Plus,
  Minus,
  Calendar,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { centersData } from "./centersData";

const CreatePopup = () => {
  // --- TRẠNG THÁI HỆ THỐNG ---
  const [popupName, setPopupName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("2026-02-03T00:00"); // Định dạng Datetime
  const [endDate, setEndDate] = useState("2026-02-10T23:59");
  const [delay, setDelay] = useState(2);
  const [selectedCenters, setSelectedCenters] = useState<string[]>(["1"]);
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");

  // Hàm chọn/bỏ chọn trung tâm
  const toggleCenter = (id: string) => {
    setSelectedCenters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // Logic Xử lý Lưu
  const handleCreate = () => {
    if (!popupName) return alert("⚠️ Vui lòng đặt tên cho Popup này!");
    if (new Date(endDate) < new Date(startDate))
      return alert("⚠️ Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");

    alert(`🚀 Mona.Software: Đã kích hoạt Popup [${popupName}] thành công!`);
  };

  return (
    <div className="animate-in fade-in space-y-6 px-2 pb-20 font-sans duration-500 md:px-0">
      {/* --- HEADER: QUẢN LÝ CHUNG --- */}
      <div className="flex flex-col items-stretch justify-between gap-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-indigo-700 shadow-sm dark:bg-blue-900/30">
            <Megaphone size={28} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] leading-relaxed font-bold tracking-[0.2em] text-slate-400">
              Tên chiến dịch popup (Nội bộ)
            </p>
            <input
              type="text"
              value={popupName}
              onChange={(e) => setPopupName(e.target.value)}
              placeholder="Nhập tên popup để dễ quản lý..."
              className="w-full bg-transparent text-lg leading-normal font-bold text-slate-900 outline-none placeholder:text-slate-200 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t pt-4 md:justify-end md:border-t-0 md:pt-0">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800">
            <span className="text-xs font-bold tracking-normal text-slate-600">
              Hiển thị ngay
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isActive ? "bg-blue-600" : "bg-slate-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-black active:scale-95"
          >
            <CheckCircle2 size={18} /> Lưu & Kích hoạt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* --- CỘT TRÁI: SOẠN THẢO & ĐỊA ĐIỂM --- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Trình soạn thảo */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-slate-4 leading-relaxed00 mb-6 text-sm leading-snug leading-tight font-bold tracking-widest italic">
              1. Nội dung hiển thị
            </h3>
            <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[24px] border border-slate-100 dark:border-slate-600">
              <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/50 p-3 dark:bg-slate-800/50">
                <ToolbarButton icon={<Bold size={18} />} />
                <ToolbarButton icon={<Italic size={18} />} />
                <ToolbarButton icon={<Underline size={18} />} />
                <div className="mx-2 w-px bg-slate-200" />
                <ToolbarButton icon={<AlignCenter size={18} />} />
                <ToolbarButton icon={<AlignJustify size={18} />} />
                <ToolbarButton icon={<LinkIcon size={18} />} />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="dark:text-slate-3 leading-relaxed00 flex-1 resize-none bg-transparent p-8 text-sm leading-relaxed font-medium outline-none"
                placeholder="Nhập thông điệp popup của bạn tại đây... (Hỗ trợ cả HTML)"
              />
            </div>
          </div>

          {/* Chọn trung tâm */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-slate-4 leading-relaxed00 mb-6 text-sm leading-snug leading-tight font-bold tracking-widest italic">
              2. Khu vực áp dụng
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {centersData.map((center) => (
                <button
                  key={center.id}
                  onClick={() => toggleCenter(center.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    selectedCenters.includes(center.id)
                      ? "border-indigo-500 bg-blue-50/50 text-blue-700 shadow-sm"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-white dark:bg-slate-800"
                  }`}
                >
                  <span className="text-sm font-bold">{center.name}</span>
                  {selectedCenters.includes(center.id) && (
                    <CheckCircle2 size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: THỜI GIAN & LIÊN KẾT --- */}
        <div className="space-y-6">
          {/* PHẦN LỊCH TRÌNH */}
          <div className="space-y-8 rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-2 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              <h3 className="text-slate-4 leading-relaxed00 text-sm leading-snug leading-tight font-bold tracking-widest italic">
                3. Cài đặt thời gian
              </h3>
            </div>

            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="ml-1 text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-indigo-600">
                  Bắt đầu hiển thị
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-indigo-700 transition-all outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <Clock
                    size={18}
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-blue-300"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="ml-1 text-[10px] font-bold tracking-widest text-slate-400 group-focus-within:text-rose-500">
                  Kết thúc hiển thị
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-rose-500 transition-all outline-none focus:border-rose-400 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <Clock
                    size={18}
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-rose-300"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-50 pt-6 dark:border-slate-700">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] leading-relaxed font-bold tracking-widest text-slate-400">
                  Độ trễ: <span className="text-indigo-700">{delay} Giây</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-blue-100 accent-blue-600 dark:bg-slate-700"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setDelay((d) => Math.max(0, d - 1))}
                    className="rounded-xl bg-slate-50 p-2 text-indigo-700 dark:bg-slate-800"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => setDelay((d) => Math.min(30, d + 1))}
                    className="rounded-xl bg-slate-50 p-2 text-indigo-700 dark:bg-slate-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Liên kết */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-indigo-600" />
              <h3 className="text-slate-4 leading-relaxed00 text-sm leading-snug leading-tight font-bold tracking-widest italic">
                4. Redirect URL
              </h3>
            </div>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://mona.software/promo..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          {/* Xem trước */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-2">
              <Eye size={18} className="text-indigo-600" />
              <h3 className="text-slate-4 leading-relaxed00 text-sm leading-snug leading-tight font-bold tracking-widest italic">
                5. Preview
              </h3>
            </div>
            <div className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-slate-100 bg-slate-50 p-6 dark:bg-slate-800/50">
              <div className="mb-2 h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="absolute inset-0 flex items-center justify-center bg-blue-600/5 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-indigo-700 shadow-xl shadow-blue-500/10">
                  Xem Live Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-white hover:text-indigo-700 hover:shadow-sm dark:hover:bg-slate-800">
    {icon}
  </button>
);

export default CreatePopup;
