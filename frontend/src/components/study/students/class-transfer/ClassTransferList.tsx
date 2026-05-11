"use client";
import React, { useState, useMemo } from "react";
import { Search, User } from "lucide-react";

// Import dữ liệu từ file đã tách
import { transferData } from "./classTransferData";

const ClassTransferList = () => {
  // --- TRẠNG THÁI TÌM KIẾM ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return transferData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- THANH TÌM KIẾM HOẠT ĐỘNG --- */}
      <div className="flex items-center gap-3 border-b border-slate-50 p-5 dark:border-slate-700">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
          />
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU CHUYỂN LỚP --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-4 py-4 text-center">+</th>
              <th className="px-4 py-4">Thông tin</th>
              <th className="px-4 py-4">Lớp cũ</th>
              <th className="px-4 py-4">Lớp mới</th>
              <th className="px-4 py-4">Tiền đã thu</th>
              <th className="px-4 py-4">Ghi chú</th>
              <th className="px-4 py-4">Trung tâm</th>
              <th className="px-4 py-4">Ngày chuyển</th>
              <th className="px-4 py-4">Người tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-4 py-5 text-center font-bold text-slate-300">
                    +
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <User size={18} className="text-slate-400" />
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

                  <td className="px-4 py-5">
                    <div className="flex flex-col">
                      <span className="cursor-pointer font-bold text-indigo-600 hover:underline">
                        {item.oldClass}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.oldPrice}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex flex-col">
                      <span className="cursor-pointer font-bold text-indigo-600 hover:underline">
                        {item.newClass}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.newPrice}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5 font-bold text-green-600">
                    {item.paidAmount}
                  </td>

                  <td className="max-w-[150px] truncate px-4 py-5 font-bold text-slate-600 dark:text-slate-400">
                    {item.note || "-"}
                  </td>

                  <td className="px-4 py-5 font-bold text-slate-900 dark:text-slate-300">
                    {item.center}
                  </td>

                  <td className="px-4 py-5 font-bold text-slate-600">
                    {item.transferDate}
                  </td>

                  <td className="px-4 py-5">
                    <span className="cursor-pointer font-bold text-indigo-600">
                      {item.creator}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-slate-4 leading-relaxed00 px-4 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy dữ liệu chuyển lớp phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTransferList;
