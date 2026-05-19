"use client";

import React from "react";
import { BookOpen, Users, Clock, Bell, ChevronRight } from "lucide-react";

export default function LecturerDashboard() {
  return (
    <div className="space-y-6">
      {/* KHỐI TIÊU ĐỀ CHÀO MỪNG */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">
          Xin chào, ThS. Nguyễn Văn A 👋
        </h1>
        <p className="text-xs text-gray-400 mt-1">Chúc bạn một ngày làm việc hiệu quả!</p>
      </div>

      {/* 4 KHỐI CARD THỐNG KÊ GIAO DIỆN Lecturer */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Lớp đang dạy */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Lớp đang giảng dạy</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-slate-100">4</h4>
            <p className="mt-1 text-[10px] text-gray-400">Học kỳ 2, 2023-2024</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Tiết dạy */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Tiết dạy hôm nay</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-slate-100">3</h4>
            <p className="mt-1 text-[10px] text-gray-400">Hôm nay</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Tổng sinh viên */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Sinh viên quản lý</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-slate-100">142</h4>
            <p className="mt-1 text-[10px] text-gray-400">Tổng số sinh viên</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Thông báo chưa đọc */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400">Thông báo mới</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-slate-100">2</h4>
            <p className="mt-1 text-[10px] text-rose-500 font-medium">Chưa đọc</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50">
            <Bell className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* CHI TIẾT LỊCH DẠY BÊN DƯỚI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lịch dạy chi tiết */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Lịch giảng dạy chi tiết hôm nay</h3>
            <span className="text-xs text-emerald-600 cursor-pointer flex items-center font-medium">Xem thời khóa biểu <ChevronRight className="h-3 w-3 ml-0.5"/></span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { time: "07:30 - 09:00", name: "Lập trình ứng dụng Web", code: "D22CNTT03 - Nhóm 01", room: "Phòng A305" },
              { time: "09:15 - 10:45", name: "Cơ sở dữ liệu nâng cao", code: "D22CNTT02 - Nhóm 02", room: "Phòng A204" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 dark:bg-slate-950 dark:border-slate-800">
                <div className="flex gap-6 items-center">
                  <span className="text-xs font-bold text-gray-500 w-[85px]">{item.time}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.code}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">{item.room}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Thông báo từ phòng ban */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Tin tức nhận được</h3>
            <span className="text-xs text-emerald-600 cursor-pointer font-medium">Xem tất cả</span>
          </div>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-rose-500 pl-3">
              <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold">Khẩn cấp</span>
              <p className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-1">Hạn cuối khóa điểm thi học kỳ</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Thời hạn: 30/05/2026</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <span className="text-[10px] text-gray-400 font-medium">Phòng Đào tạo</span>
              <p className="text-xs font-medium text-gray-800 dark:text-slate-200 mt-0.5">Triển khai quy chế coi thi mới</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Ngày nhận: 19/05/2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
