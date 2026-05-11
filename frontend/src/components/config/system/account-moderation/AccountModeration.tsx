"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  CheckSquare,
  Trash2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { initialModerationData, DeviceModeration } from "./moderationData";

const AccountModeration = () => {
  const [data, setData] = useState<DeviceModeration[]>(initialModerationData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceLimit, setDeviceLimit] = useState(5);

  // --- LOGIC TÌM KIẾM ĐA NĂNG ---
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, data]);

  // --- LOGIC BẬT/TẮT QUYỀN TRUY CẬP ---
  const toggleAccess = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasAccess: !item.hasAccess } : item,
      ),
    );
  };

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- TOOLBAR CẤU HÌNH --- */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tìm email, mã hoặc tên học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>

          <button className="text-slate-6 leading-relaxed00 hidden items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold transition-all hover:bg-slate-50 md:flex">
            [HV240916-1] Việt Việt <ChevronDown size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-100/50 bg-blue-50/50 p-2 dark:border-blue-800 dark:bg-blue-900/10">
          <div className="flex items-center gap-2 px-2">
            <CheckSquare size={18} className="text-indigo-700" />
            <span className="text-xs font-bold tracking-normal text-blue-800 dark:text-blue-300">
              Thiết bị tối đa / tài khoản
            </span>
          </div>
          <input
            type="number"
            value={deviceLimit}
            onChange={(e) => setDeviceLimit(Number(e.target.value))}
            className="w-14 rounded-xl border border-blue-200 bg-white py-1.5 text-center text-sm font-bold text-indigo-700 shadow-sm outline-none"
          />
          <button
            onClick={() =>
              alert(`Đã cập nhật giới hạn: ${deviceLimit} thiết bị`)
            }
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Cập nhật
          </button>
        </div>
      </div>

      {/* --- TABLE: DANH SÁCH KIỂM DUYỆT --- */}
      <div className="flex min-h-[500px] flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="px-6 py-5">Tài khoản truy cập</th>
                <th className="px-6 py-5">Học viên</th>
                <th className="px-6 py-4">Thông tin thiết bị</th>
                <th className="px-6 py-4">Hệ điều hành</th>
                <th className="px-6 py-4">Trình duyệt</th>
                <th className="px-6 py-4 text-center">Quyền truy cập</th>
                <th className="px-8 py-4 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                  >
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="cursor-pointer font-bold text-indigo-700 hover:underline">
                          {item.email}
                        </span>
                        <span className="text-[10px] font-bold tracking-normal text-slate-400">
                          ID: {item.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {item.studentName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.studentId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-300">
                        {item.deviceName.includes("iPhone") ? (
                          <Smartphone size={16} className="text-indigo-600" />
                        ) : (
                          <Laptop size={16} className="text-purple-500" />
                        )}
                        {item.deviceName}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-600">
                      {item.os}
                    </td>
                    <td className="px-6 py-6">
                      <span className="rounded-lg bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800">
                        {item.browser}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => toggleAccess(item.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.hasAccess ? "bg-emerald-500" : "bg-slate-300"}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.hasAccess ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                        <span
                          className={`text-[9px] font-bold ${item.hasAccess ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {item.hasAccess ? "Cho phép" : "Đã chặn"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button className="text-rose-500 opacity-40 transition-all group-hover:opacity-100 hover:scale-125">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-32">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800">
                        <Inbox size={40} className="text-slate-300" />
                      </div>
                      <span className="text-xs font-bold tracking-[0.2em] text-slate-400 italic">
                        Không tìm thấy thiết bị nào
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER PHÂN TRANG --- */}
        <div className="mt-auto flex items-center justify-end border-t bg-slate-50/10 p-6 text-[11px] font-bold text-slate-600 dark:border-slate-700">
          <span className="mr-6">Tổng số: {filteredData.length} kết quả</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
              <ChevronLeft size={18} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
              1
            </span>
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModeration;
