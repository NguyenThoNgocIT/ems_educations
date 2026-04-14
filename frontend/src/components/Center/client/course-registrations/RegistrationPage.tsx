"use client";
import React, { useState } from "react";
import {
  User,
  Info,
  BookOpen,
  Users,
  ChevronDown,
  PlusCircle,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  Send,
  X,
} from "lucide-react";

const RegistrationPage = () => {
  const [activeTab, setActiveTab] = useState<"new" | "additional">("new");

  // Thành phần nhãn con để tái sử dụng giao diện
  const FieldLabel = ({
    label,
    required = false,
  }: {
    label: string;
    required?: boolean;
  }) => (
    <label className="mb-1 block text-xs font-bold tracking-tight text-slate-600">
      {required && <span className="mr-1 text-red-500">*</span>}
      {label}
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans dark:bg-black">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        {/* --- HEADER & TABS --- */}
        <div className="border-b dark:border-slate-700">
          <div className="p-3">
            <h1 className="text-xl font-bold tracking-normal text-black dark:text-white leading-snug leading-snug">
              Hệ thống Đăng ký
            </h1>
          </div>
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-bold transition-all ${activeTab === "new" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <PlusCircle size={18} /> Đăng ký mới
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-bold transition-all ${activeTab === "additional" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <UserPlus size={18} /> Đăng ký thêm
            </button>
          </div>
        </div>

        <div className="custom-scrollbar max-h-[75vh] space-y-8 overflow-y-auto p-8">
          {/* ==================== MỤC 1: ĐĂNG KÝ MỚI ==================== */}
          {activeTab === "new" && (
            <div className="animate-in fade-in slide-in-from-left-4 space-y-8 duration-300">
              {/* 1. Thông tin cá nhân */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 italic dark:border-slate-700 leading-snug">
                  <User size={16} /> Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <FieldLabel label="Khách hàng" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border bg-slate-50 p-3 text-sm font-medium text-slate-4 leading-relaxed00 outline-none dark:border-slate-700 dark:bg-slate-950">
                        <option>Chọn khách hàng</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Họ tên" required />
                    <input
                      type="text"
                      placeholder="Nhập họ tên"
                      className="w-full rounded-xl border bg-white p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Email" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border p-3 text-sm dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Số điện thoại" required />
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      className="w-full rounded-xl border p-3 text-sm dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Giới tính" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border p-3 text-sm dark:border-slate-700">
                        <option>Chọn giới tính</option>
                      </select>
                      <ChevronDown
                        className="absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Công việc" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border p-3 text-sm dark:border-slate-700">
                        <option>Chọn công việc</option>
                      </select>
                      <ChevronDown
                        className="absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <FieldLabel label="Tỉnh/Thành phố" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                        <option>Tỉnh/Thành phố</option>
                      </select>
                      <ChevronDown
                        className="absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Quận/Huyện" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                        <option>Quận/Huyện</option>
                      </select>
                      <ChevronDown
                        className="absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Phường/Xã" />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                        <option>Phường/Xã</option>
                      </select>
                      <ChevronDown
                        className="absolute top-3.5 right-3 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <FieldLabel label="Địa chỉ" />
                  <input
                    type="text"
                    placeholder="Địa chỉ chi tiết"
                    className="w-full rounded-xl border p-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel label="Thông tin thêm" />
                  <textarea
                    placeholder="Thông tin thêm..."
                    className="h-24 w-full resize-none rounded-xl border p-3 text-sm dark:border-slate-700"
                  />
                </div>
              </section>

              {/* 2. Thông tin nguồn & Học tập */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 leading-tight leading-snug">
                    <Info size={16} /> THÔNG TIN NGUỒN
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <FieldLabel label="Nguồn" />
                      <div className="relative">
                        <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                          <option>Nguồn lead</option>
                        </select>
                        <ChevronDown
                          className="absolute top-3.5 right-3 text-slate-400"
                          size={18}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Tư vấn viên" />
                      <div className="relative">
                        <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                          <option>Tư vấn viên</option>
                        </select>
                        <ChevronDown
                          className="absolute top-3.5 right-3 text-slate-400"
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 leading-tight leading-snug">
                    <BookOpen size={16} /> THÔNG TIN HỌC TẬP
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <FieldLabel label="Mục đích học" />
                      <div className="relative">
                        <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                          <option>Mục đích học</option>
                        </select>
                        <ChevronDown
                          className="absolute top-3.5 right-3 text-slate-400"
                          size={18}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Nhu cầu học" />
                      <div className="relative">
                        <select className="w-full appearance-none rounded-xl border p-3 text-sm">
                          <option>Nhu cầu học</option>
                        </select>
                        <ChevronDown
                          className="absolute top-3.5 right-3 text-slate-400"
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 3. Thông tin phụ huynh */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 leading-tight leading-snug">
                  <Users size={16} /> THÔNG TIN PHỤ HUYNH
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <FieldLabel label="Tên phụ huynh" />
                    <input
                      type="text"
                      placeholder="Tên phụ huynh"
                      className="w-full rounded-xl border p-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Email phụ huynh" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border p-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <FieldLabel label="Phone phụ huynh" />
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      className="w-full rounded-xl border p-3 text-sm"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==================== MỤC 2: ĐĂNG KÝ THÊM ==================== */}
          {activeTab === "additional" && (
            <div className="animate-in fade-in slide-in-from-right-4 min-h-[400px] space-y-6 duration-300">
              <section className="space-y-6">
                <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 italic dark:border-slate-700 leading-snug">
                  <UserPlus size={16} /> Thông tin cá nhân học viên hiện tại
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel label="Học viên" required />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-2xl border bg-slate-50 p-4 text-sm font-bold outline-none dark:border-slate-700 dark:bg-slate-950">
                        <option>Chọn học viên</option>
                      </select>
                      <ChevronDown
                        className="absolute top-4.5 right-4 text-slate-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel label="Ngày sinh" required />
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full rounded-2xl border bg-slate-50 p-4 text-sm font-bold outline-none dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel label="Email học viên" required />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-2xl border bg-slate-50 p-4 text-sm font-bold outline-none dark:border-slate-700 dark:bg-slate-950">
                        <option>Chọn email</option>
                      </select>
                      <ChevronDown
                        className="absolute top-4.5 right-4 text-slate-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel label="Số điện thoại" required />
                    <div className="relative">
                      <select className="w-full appearance-none rounded-2xl border bg-slate-50 p-4 text-sm font-bold outline-none dark:border-slate-700 dark:bg-slate-950">
                        <option>Chọn số điện thoại</option>
                      </select>
                      <ChevronDown
                        className="absolute top-4.5 right-4 text-slate-400"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 p-10 text-center dark:border-blue-800 dark:bg-blue-900/10">
                <BookOpen size={48} className="mb-2 text-blue-300" />
                <p className="text-sm font-bold text-indigo-600 leading-relaxed">
                  Tiến hành chọn khóa học mới cho học viên
                </p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Thông tin học viên sẽ được tự động đồng bộ sau khi chọn
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="flex justify-end gap-3 border-t bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
          <button className="flex items-center gap-2 rounded-xl bg-red-500/10 px-8 py-3 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">
            Hủy bỏ
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
            <Send size={18} /> Xác nhận đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;



