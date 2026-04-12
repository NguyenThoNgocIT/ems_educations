"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Info,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
} from "lucide-react";
import { initialCenterData, Center } from "./centerData";
import AddCenterModal from "./AddCenterModal";

const CenterManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM THEO TÊN HOẶC MÃ ---
  const filteredData = useMemo(() => {
    return initialCenterData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM & THÊM MỚI --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex max-w-md flex-1 items-center gap-3">
          <button className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-blue-50">
            <Filter size={20} />
          </button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm mã hoặc tên cơ sở..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
        >
          <Plus size={18} /> Thêm cơ sở mới
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-8 py-5">Mã cơ sở</th>
              <th className="px-6 py-5">Tên trung tâm đào tạo</th>
              <th className="px-6 py-5">Địa chỉ liên hệ</th>
              <th className="px-6 py-5">Số điện thoại</th>
              <th className="px-6 py-5 text-indigo-700">Email</th>
              <th className="px-8 py-5 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-900 dark:divide-slate-800 dark:text-slate-300">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="px-8 py-6 font-bold text-slate-400 italic">
                    {item.id}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-50 p-2 text-slate-400 dark:bg-slate-800">
                        <Building2 size={16} />
                      </div>
                      <span className="cursor-pointer font-bold text-slate-900 hover:text-indigo-700 hover:underline dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-600">
                    {item.address || "---"}
                  </td>
                  <td className="px-6 py-6 font-bold tracking-tight text-slate-600 dark:text-slate-400">
                    {item.phone || "---"}
                  </td>
                  <td className="px-6 py-6 font-bold text-indigo-600 italic underline decoration-blue-100">
                    {item.email || "---"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-5 opacity-40 transition-opacity group-hover:opacity-100">
                      <button
                        title="Thông tin"
                        className="hover:text-indigo-600"
                      >
                        <Info size={18} />
                      </button>
                      <button title="Sửa" className="hover:text-indigo-700">
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa"
                        className="transition-transform hover:scale-125 hover:text-rose-500"
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
                  colSpan={6}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy cơ sở nào...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-5 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold tracking-widest text-slate-600">
          Hệ thống: {filteredData.length} cơ sở
        </span>
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-200">
            1
          </span>
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddCenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CenterManagement;
