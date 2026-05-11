"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  FileOutput,
  FileInput,
  Plus,
  Info,
  Mail,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import leadsData from "./data_leads";
import CreateLeadModal from "./CreateLeadModal";

const LeadManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-Inter dark:bg-black">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* --- 1. THANH BỘ LỌC (FILTER BAR) --- */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <button className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-600">
            <Filter size={20} />
          </button>

          <select className="text-slate-4 leading-relaxed00 min-w-[150px] rounded-lg border p-2 text-sm dark:border-slate-600 dark:bg-slate-800">
            <option>Trạng thái</option>
          </select>

          <select className="text-slate-4 leading-relaxed00 min-w-[150px] rounded-lg border p-2 text-sm dark:border-slate-600 dark:bg-slate-800">
            <option>Chia lead</option>
          </select>

          <select className="text-slate-4 leading-relaxed00 min-w-[150px] rounded-lg border p-2 text-sm dark:border-slate-600 dark:bg-slate-800">
            <option>Nhân viên tư vấn</option>
          </select>

          <div className="relative min-w-[200px] flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full rounded-lg border p-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <Search
              className="absolute top-2.5 right-3 text-slate-400"
              size={18}
            />
          </div>
        </div>

        {/* --- 2. THANH TÁC VỤ (ACTION BAR) --- */}
        <div className="flex gap-3">
          <button className="dark:text-slate-3 leading-relaxed00 flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
            <FileOutput size={18} /> Xuất Excel
          </button>
          <button className="dark:text-slate-3 leading-relaxed00 flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
            <FileInput size={18} /> Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600"
          >
            <Plus size={18} /> Thêm lead
          </button>
        </div>

        {/* --- 3. DANH SÁCH LEAD (LEAD LIST) --- */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-slate-50/50 text-left text-sm font-Inter tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/30 dark:text-white">
               <th className="w-12 p-4 text-center">
                  
                </th>
                <th className="p-4">Thông tin lead</th>
                <th className="p-4">Thông tin liên hệ</th>
                <th className="p-4">Trạng thái lead</th>
                <th className="p-4">Tiến độ</th>  
                <th className="p-4 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {leadsData.map((lead) => (
                <tr
                  key={lead.id}
                  className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-4 pt-5 text-center align-top">
                    <input type="checkbox" className="rounded" />
                  </td>

                  {/* Cột Thông tin Lead */}
                  <td className="p-4 pt-5 align-top">
                    <div className="space-y-1">
                      <h4 className="text-slate-9 leading-relaxed00 text-sm font-Inter tracking-tight dark:text-white">
                        {lead.name}
                      </h4>
                      <p className="text-[11px] leading-relaxed font-Inter text-slate-400">
                        #{lead.id}
                      </p>
                      {lead.status === "Cần tư vấn lại" && (
                        <span className="mt-2 inline-block rounded border border-orange-200 px-2 py-0.5 text-[10px] font-semibold font-Inter text-orange-500">
                          Cần tư vấn lại
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Cột Liên hệ */}
                  <td className="p-4 pt-5 align-top">
                    <div className="space-y-1">
                      <p className="dark:text-slate-2 leading-relaxed00 text-sm leading-relaxed font-semibold font-Inter text-slate-900">
                        {lead.phone}
                      </p>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        {lead.email || "-"}
                      </p>
                    </div>
                  </td>

                  {/* Cột Trạng thái & Chất lượng */}
                  <td className="p-4 pt-5 align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="w-16 text-[11px] text-slate-400">
                          Trạng thái:
                        </span>
                        <span
                          className={`rounded border px-3 py-1 text-[10px] font-semibold font-Inter ${
                            lead.status === "Đăng ký học"
                              ? "border-green-200 bg-green-50 text-green-600"
                              : "border-blue-200 bg-blue-50 text-indigo-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-16 text-[11px] text-slate-400">
                          Chất lượng:
                        </span>
                        <span className="rounded border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold font-Inter text-slate-600">
                          {lead.quality}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cột Tiến độ */}
                  <td className="p-4 pt-5 align-top">
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p>Tư vấn: {lead.consultant}</p>
                      <p>Ngày tạo: {lead.createdDate}</p>
                    </div>
                  </td>

                  {/* Cột Chức năng (Icons) */}
                  <td className="p-4 pt-4 align-top">
                    <div className="flex justify-center gap-1">
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-indigo-600">
                        <Info size={18} />
                      </button>
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-indigo-600">
                        <Mail size={18} />
                      </button>
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-indigo-600">
                        <Edit3 size={18} />
                      </button>
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- 4. PHÂN TRANG (PAGINATION) --- */}
          <div className="flex items-center justify-between border-t bg-slate-50/30 p-4 dark:border-slate-700">
            <div className="text-[11px] font-semibold text-slate-600">
              Tổng cộng: {leadsData.length}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronLeft size={20} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-indigo-700 shadow-sm">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-slate-400 transition-all hover:bg-slate-50">
                2
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LeadManagement;
