"use client";
import React from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";

const templateData = [
  { id: 1, name: "Hợp đồng" },
  { id: 2, name: "Điều khoản" },
  { id: 3, name: "Phiếu thu" },
  { id: 4, name: "Phiếu chi" },
];

const ContractTemplates = () => {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- TABLE: DANH SÁCH MẪU --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-8 py-4">Mẫu</th>
              <th className="w-32 px-8 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {templateData.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* Tên mẫu biểu */}
                <td className="px-8 py-6 font-bold text-slate-900 dark:text-slate-300">
                  {item.name}
                </td>

                {/* Icon chức năng Info --- */}
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <button
                      title="Xem chi tiết"
                      className="text-slate-400 transition-colors hover:text-indigo-600"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <div className="flex items-center gap-1">
          <button className="cursor-not-allowed p-1 text-slate-300">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[11px] font-bold text-indigo-700">
            1
          </span>
          <button className="cursor-not-allowed p-1 text-slate-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractTemplates;
