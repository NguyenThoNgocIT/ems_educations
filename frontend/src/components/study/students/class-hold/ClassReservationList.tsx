"use client";
import React, { useState, useMemo } from "react";
import { Search, Info, User, ChevronLeft, ChevronRight } from "lucide-react";

// Import dữ liệu từ file riêng
import { reservationData } from "./reservationData";

const ClassReservationList = () => {
  // --- TRẠNG THÁI TÌM KIẾM ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC TÌM KIẾM THEO TÊN HOẶC MÃ ---
  const filteredData = useMemo(() => {
    return reservationData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- THANH TÌM KIẾM HOẠT ĐỘNG --- */}
      <div className="border-b border-slate-50 p-5 dark:border-slate-700">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
          />
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU BẢO LƯU ĐẦY ĐỦ --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-4 py-4 text-center">+</th>
              <th className="px-4 py-4">Thông tin</th>
              <th className="px-4 py-4">Trung tâm</th>
              <th className="px-4 py-4">Số tiền bảo lưu</th>
              <th className="px-4 py-4">Thông tin khác</th>
              <th className="px-4 py-4 text-center">Trạng thái</th>
              <th className="px-4 py-4">Ngày bảo lưu</th>
              <th className="px-4 py-4">Hạn bảo lưu</th>
              <th className="px-4 py-4">Người tạo</th>
              <th className="w-10 px-4 py-4"></th>
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

                  {/* Thông tin học viên (Bold ID & Name) */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-50 dark:bg-slate-800">
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

                  <td className="px-4 py-5 font-bold text-slate-600 dark:text-slate-400">
                    {item.center}
                  </td>

                  {/* Số tiền bảo lưu (Màu xanh đậm đặc trưng) */}
                  <td className="px-4 py-5 font-bold text-indigo-700 italic">
                    {item.reservedAmount}
                  </td>

                  {/* Thông tin dòng tiền (Đã sử dụng/Còn lại) */}
                  <td className="px-4 py-5">
                    <div className="flex flex-col text-[11px] font-bold tracking-tight">
                      <div className="text-red-500">
                        Đã sử dụng: {item.usedAmount}
                      </div>
                      <div className="text-green-600">
                        Còn lại: {item.remainingAmount}
                      </div>
                      {item.refundedAmount && (
                        <div className="text-purple-600">
                          Đã hoàn: {item.refundedAmount}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Trạng thái (Badge Italic) */}
                  <td className="px-4 py-5 text-center">
                    <span
                      className={`rounded-lg px-3 py-1.5 text-[10px] font-bold whitespace-nowrap text-white italic ${
                        item.status === "Hết hạn bảo lưu"
                          ? "bg-[#EF4444]"
                          : "bg-[#22C55E]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-5 font-bold text-slate-600">
                    {item.startDate}
                  </td>
                  <td className="px-4 py-5 font-bold text-slate-600">
                    {item.endDate}
                  </td>

                  <td className="px-4 py-5">
                    <span className="cursor-pointer font-bold text-indigo-600 hover:underline">
                      {item.creator}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <Info
                      size={18}
                      className="cursor-pointer text-slate-400 transition-colors hover:text-indigo-600"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-slate-4 leading-relaxed00 px-4 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy thông tin bảo lưu phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: TỰ ĐỘNG CẬP NHẬT TỔNG SỐ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-5 dark:border-slate-700">
        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {filteredData.length}</span>
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
      </div>
    </div>
  );
};

export default ClassReservationList;
