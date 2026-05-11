"use client";
import React, { useState, useMemo } from "react";
import {
  Wallet,
  CreditCard,
  Tag,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Printer,
  Info,
  CircleDollarSign,
  Trash2,
} from "lucide-react";
import { paymentData } from "./paymentData";
import AddPaymentModal from "./AddPaymentModal";

const PaymentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- LOGIC LỌC DỮ LIỆU KẾT HỢP (SEARCH + TABS) ---
  const filteredPayments = useMemo(() => {
    // 1. Lấy thời điểm hiện tại (Giả định hôm nay là 03/02/2026 theo yêu cầu dự án)
    const today = new Date("2026-02-03");

    return paymentData.filter((item) => {
      // Lọc theo Tìm kiếm
      const matchSearch =
        item.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Lọc theo Thời gian (Tabs)
      const itemDate = new Date(item.createdAt.split(" ")[0]); // Lấy phần YYYY-MM-DD
      let matchTab = true;

      if (activeTab === "Hôm nay") {
        matchTab = itemDate.toDateString() === today.toDateString();
      } else if (activeTab === "7 ngày qua") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchTab = itemDate >= sevenDaysAgo && itemDate <= today;
      }

      return matchSearch && matchTab;
    });
  }, [searchQuery, activeTab]);

  // Tính toán Stat Cards dựa trên dữ liệu đã lọc để con số nhảy theo Tab
  const stats = useMemo(() => {
    const total = filteredPayments.reduce((acc, curr) => acc + curr.total, 0);
    const paid = filteredPayments.reduce((acc, curr) => acc + curr.paid, 0);
    const debt = filteredPayments.reduce((acc, curr) => acc + curr.balance, 0);
    return { total, paid, debt };
  }, [filteredPayments]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + "đ";

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- STATS CARDS: Con số sẽ tự nhảy khi bấm Tab --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Doanh thu kỳ này"
          value={formatVND(stats.total)}
          icon={<Wallet className="text-emerald-500" />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Đã thu thực tế"
          value={formatVND(stats.paid)}
          icon={<CreditCard className="text-indigo-600" />}
          color="text-indigo-700"
          bgColor="bg-blue-50"
        />
        <StatCard
          label="Khuyến mãi"
          value="8,850,000đ"
          icon={<Tag className="text-amber-500" />}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          label="Nợ đọng"
          value={formatVND(stats.debt)}
          icon={<AlertCircle className="text-rose-500" />}
          color="text-rose-600"
          bgColor="bg-rose-50"
        />
      </div>

      {/* --- TOOLBAR: TAB HOẠT ĐỘNG THẬT --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          {["Tất cả", "Hôm nay", "7 ngày qua"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)} // Cập nhật trạng thái khi nhấn
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                activeTab === tab
                  ? "scale-105 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="relative ml-4">
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab("Tất cả");
              }} // Reset tab khi tìm kiếm để dễ nhìn
              className="w-64 rounded-xl border border-slate-100 bg-slate-50 py-2 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-600 active:scale-95"
        >
          <Plus size={18} /> Thêm phiếu thu
        </button>
      </div>

      {/* --- TABLE: CẬP NHẬT THEO LOGIC --- */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="w-10 px-4 py-4 text-center">+</th>
                <th className="px-6 py-4">Mã hóa đơn</th>
                <th className="px-6 py-4">Học viên</th>
                <th className="px-6 py-4">Dòng tiền chi tiết</th>
                <th className="px-6 py-4">Thời gian khởi tạo</th>
                <th className="px-6 py-4">Người tạo</th>
                <th className="px-6 py-4 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((item, index) => (
                  <tr
                    key={index}
                    className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                  >
                    <td className="px-4 py-6 text-center font-bold text-slate-300">
                      +
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-indigo-700">
                          #{item.id}
                        </span>
                        <span
                          className={`w-fit rounded-lg px-2 py-0.5 text-[9px] font-bold text-white ${item.type === "Đăng ký học" ? "bg-blue-500" : "bg-purple-500"}`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {item.payer}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.payerId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-0.5 font-bold">
                        <div className="text-slate-400">
                          Tổng:{" "}
                          <span className="text-slate-900 dark:text-slate-200">
                            {formatVND(item.total)}
                          </span>
                        </div>
                        <div className="text-emerald-600">
                          Đã thu: {formatVND(item.paid)}
                        </div>
                        <div className="text-rose-600 italic">
                          Nợ: {formatVND(item.balance)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-600">
                      {item.createdAt}
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-bold text-indigo-600">
                        {item.creator}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          title="In hóa đơn"
                          className="hover:text-slate-900"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          title="Thu tiền thêm"
                          className="hover:text-emerald-500"
                        >
                          <CircleDollarSign size={18} />
                        </button>
                        <button title="Xóa" className="hover:text-rose-500">
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
                    Không tìm thấy dữ liệu thanh toán trong khoảng thời gian
                    này...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

// Component thẻ thống kê
const StatCard = ({ label, value, icon, color, bgColor }: any) => (
  <div className="flex items-center gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900">
    <div
      className={`h-12 w-12 ${bgColor} flex items-center justify-center rounded-2xl`}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold tracking-widest text-slate-400">
        {label}
      </span>
      <span className={`text-xl font-bold ${color} mt-0.5 tracking-normal`}>
        {value}
      </span>
    </div>
  </div>
);

export default PaymentManagement;
