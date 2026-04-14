"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { parentData } from "./parentData";
import AddParentModal from "./AddParentModal";

const ParentList = () => {
  // --- TRẠNG THÁI HỆ THỐNG ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM & SẮP XẾP ---
  const processedData = useMemo(() => {
    let result = parentData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortType === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "id-desc") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [searchQuery, sortType]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM & THAO TÁC --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-[240px]">
            <input
              type="text"
              placeholder="Tra cứu tên hoặc mã PH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="relative">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="text-slate-6 leading-relaxed00 cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none"
            >
              <option value="default">Sắp xếp</option>
              <option value="name-asc">Tên (A - Z)</option>
              <option value="id-desc">Mã mới nhất</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH PHỤ HUYNH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-4 py-4 text-center">+</th>
              <th className="px-6 py-4">Thông tin phụ huynh</th>
              <th className="px-6 py-4">Tên đăng nhập</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Ngày sinh</th>
              <th className="px-6 py-4 text-center">Giới tính</th>
              <th className="w-28 px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {processedData.length > 0 ? (
              processedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-4 py-5 text-center font-bold text-slate-300">
                    +
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-50 dark:bg-slate-800">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="cursor-pointer px-6 py-5 font-bold text-indigo-600 hover:underline">
                    {item.username || "---"}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-400">
                    {item.phone || "Chưa cập nhật"}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-400">
                    {item.dob}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {item.gender && (
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${item.gender === "Nữ" ? "bg-[#22C55E]" : "bg-[#3B82F6]"}`}
                      >
                        {item.gender}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
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
                  Không tìm thấy thông tin phụ huynh nào...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER: HIỂN THỊ TỔNG SỐ THỰC TẾ */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-5 dark:border-slate-700">
        <span className="mr-4 text-xs font-bold text-slate-900 dark:text-slate-300">
          Tổng cộng: {processedData.length}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-6 w-6 items-center justify-center rounded border border-blue-100 bg-blue-50 text-[10px] font-bold text-indigo-700">
            1
          </span>
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddParentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ParentList;
