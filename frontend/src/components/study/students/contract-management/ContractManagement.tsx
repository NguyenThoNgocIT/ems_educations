"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit3,
  Printer,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
} from "lucide-react";

import AddContractModal from "./AddContractModal";
import { contractData } from "./contractData";

const ContractManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic tìm kiếm thời gian thực
  const filteredContracts = useMemo(() => {
    return contractData.filter(
      (contract) =>
        contract.studentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contract.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM & NÚT TẠO MỚI --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tra cứu tên học viên hoặc mã ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Hợp đồng mới
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH HỢP ĐỒNG ĐÃ LỌC --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-6 py-4">Hợp đồng</th>
              <th className="px-6 py-4">Học viên</th>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Người tạo</th>
              <th className="px-6 py-4 text-center">Ngày cập nhật</th>
              <th className="px-6 py-4 text-center">Người cập nhật</th>
              <th className="w-10 px-4 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredContracts.map((item, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-slate-50/20"
              >
                <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-300">
                  {item.title}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      {item.studentName}
                    </span>
                    <div className="flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 dark:border-slate-600">
                      <Copy size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600">
                        {item.studentId}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  {item.createdAt}
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  {item.creator}
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  {item.updatedAt}
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  {item.updater}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-5">
                    <button
                      title="Sửa"
                      className="text-indigo-600 transition-transform hover:scale-110"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      title="In"
                      className="text-slate-900 transition-transform hover:scale-110 dark:text-slate-300"
                    >
                      <Printer size={18} />
                    </button>
                    <button
                      title="Xóa"
                      className="text-rose-500 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PHÂN TRANG */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <span className="mr-6 text-xs font-bold text-slate-400">
          Tổng cộng: {filteredContracts.length}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-300">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[11px] font-bold text-indigo-700">
            1
          </span>
          <button className="p-1 text-slate-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal được kích hoạt khi nhấn nút "Hợp đồng mới" */}
      <AddContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContractManagement;
