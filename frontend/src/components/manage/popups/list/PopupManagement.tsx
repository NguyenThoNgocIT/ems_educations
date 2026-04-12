"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";
import { initialPopupData, PopupItem } from "./popupData";
import AddPopupModal from "./AddPopupModal";

const PopupManagement = () => {
  const [popups, setPopups] = useState<PopupItem[]>(initialPopupData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM ---
  const filteredPopups = useMemo(() => {
    return popups.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, popups]);

  // --- LOGIC BẬT/TẮT TRẠNG THÁI ---
  const toggleStatus = (id: number) => {
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER HOẠT ĐỘNG --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm kiếm tên thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
        >
          <Plus size={18} /> Tạo popup mới
        </button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-10 py-8">Chiến dịch Popup</th>
              <th className="px-6 py-5">Ngày bắt đầu</th>
              <th className="px-6 py-5">Ngày kết thúc</th>
              <th className="px-6 py-5 text-center">Độ trễ</th>
              <th className="px-6 py-5">Khởi tạo bởi</th>
              <th className="px-6 py-5 text-center">Trạng thái hiển thị</th>
              <th className="px-8 py-5 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredPopups.length > 0 ? (
              filteredPopups.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-8 py-6 font-bold text-slate-900 dark:text-slate-200">
                    {item.name}
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-indigo-600">
                        {item.start.time}
                      </span>
                      <span className="font-bold text-slate-600">
                        {item.start.date}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-rose-500">
                        {item.end.time}
                      </span>
                      <span className="font-bold text-slate-600">
                        {item.end.date}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-center font-bold text-slate-600 dark:text-slate-300">
                    <span className="rounded-md bg-slate-50 px-2 py-1 dark:bg-slate-800">
                      {item.delay}
                    </span>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col text-[10px] font-bold text-slate-400">
                      <span>{item.creator.date}</span>
                      <span className="text-indigo-600">
                        {item.creator.name}
                      </span>
                    </div>
                  </td>

                  {/* NÚT GẠT HOẠT ĐỘNG */}
                  <td className="px-6 py-6 text-center">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.isActive ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isActive ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Sửa"
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa"
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy Popup nào...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-6 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold text-slate-600">
          Tổng: {filteredPopups.length} Popup
        </span>
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-slate-300 hover:text-indigo-700">
            <ChevronLeft size={18} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
            1
          </span>
          <button className="p-1 text-slate-300 hover:text-indigo-700">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <AddPopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PopupManagement;
