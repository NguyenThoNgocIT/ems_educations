"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Printer,
  Trash2,
  User,
} from "lucide-react";

const transactionData = [
  {
    id: 1,
    center: "1 - Tân Bình HCM",
    creator: "Admin",
    time: "16:41 04/12/2025",
    student: "Nguyễn Minh Trang",
    studentId: "HV2408280001",
    value: "-1,000,000 VND",
    method: "Chuyển khoản",
    type: "Chi",
    reason: "Hoàn tiền bồi hoàn về khoá học",
    qrData: "https://me.pay/invoice/001", // Dữ liệu để tạo QR
  },
  {
    id: 2,
    center: "1 - Tân Bình HCM",
    creator: "Admin",
    time: "14:49 04/07/2025",
    student: "Nguyễn Minh Trang",
    studentId: "HV2408280001",
    value: "+176,767 VND",
    method: "Tiền mặt",
    type: "Thu",
    reason: "Thanh toán Mua dịch vụ",
    qrData: "https://me.pay/invoice/002",
  },
];

const IncomeExpenseTable = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* --- THẺ THỐNG KÊ --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Tổng thu"
          value="1,981,310,000đ"
          icon={<Wallet className="text-indigo-600" />}
          color="text-indigo-700"
          bgColor="bg-blue-50"
        />
        <StatCard
          label="Lợi nhuận"
          value="1,981,310,000đ"
          icon={<TrendingUp className="text-emerald-500" />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Tổng chi"
          value="0đ"
          icon={<AlertCircle className="text-rose-500" />}
          color="text-rose-600"
          bgColor="bg-rose-50"
        />
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="px-6 py-4">Trung tâm</th>
                <th className="px-6 py-4">Học viên</th>
                <th className="px-6 py-4">Giá trị</th>
                <th className="px-4 py-4 text-center">Loại</th>
                <th className="px-6 py-4">Lý do</th>
                <th className="px-6 py-4 text-center">Mã QR</th>
                <th className="px-6 py-4">Ngày thanh toán</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
              {transactionData.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  {/* Trung tâm & Người tạo */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {item.center}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Người tạo:{" "}
                        <span className="text-indigo-600">{item.creator}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Thời gian: {item.time}
                      </span>
                    </div>
                  </td>

                  {/* Học viên */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        {item.student}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Mã HV: {item.studentId}
                      </span>
                    </div>
                  </td>

                  {/* Giá trị (Xanh cho Thu, Đỏ cho Chi) --- */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span
                        className={`font-bold ${item.type === "Thu" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {item.value}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Phương thức: {item.method}
                      </span>
                    </div>
                  </td>

                  {/* Badge Loại */}
                  <td className="px-4 py-6 text-center">
                    <span
                      className={`rounded-xl px-2 py-1 text-[10px] font-semibold text-white ${item.type === "Thu" ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="max-w-[150px] truncate px-6 py-6 font-semibold text-slate-600">
                    {item.reason}
                  </td>

                  {/* TẠO MÃ QR TỰ ĐỘNG --- */}
                  <td className="px-6 py-6">
                    <div className="flex justify-center transition-transform group-hover:scale-125">
                      <QRCodeSVG
                        value={item.qrData}
                        size={48}
                        level="L"
                        includeMargin={false}
                        className="rounded-md border border-slate-100 bg-white p-1"
                      />
                    </div>
                  </td>

                  <td className="px-6 py-6 font-bold text-indigo-600">
                    Invalid date
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Printer
                        size={18}
                        className="cursor-pointer leading-relaxed hover:text-slate-900"
                      />
                      <Trash2
                        size={18}
                        className="cursor-pointer hover:text-rose-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bgColor }: any) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-white/[0.03]">
    <div
      className={`h-12 w-12 ${bgColor} flex items-center justify-center rounded-xl dark:border dark:border-slate-700 dark:bg-white/[0.03]`}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold tracking-tight text-slate-400">
        {label}
      </span>
      <span className={`text-[19px] font-bold ${color} mt-1 tracking-normal`}>
        {value}
      </span>
    </div>
  </div>
);

export default IncomeExpenseTable;
