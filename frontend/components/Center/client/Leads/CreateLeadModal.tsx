"use client";
import React from "react";
import { X, ChevronDown, User, Info, BookOpen, Users } from "lucide-react";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Thành phần nhãn con để tái sử dụng
  const FieldLabel = ({
    label,
    required = false,
  }: {
    label: string;
    required?: boolean;
  }) => (
    <label className="text-xs font-semibold font-Inter text-slate-600">
      {required && <span className="mr-1 text-red-500">*</span>}
      {label}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-normal leading-snug">
            Tạo hồ sơ lead
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
          {/* 1. THÔNG TIN CƠ BẢN */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <User size={16} /> THÔNG TIN CƠ BẢN
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Họ tên" required />
                <input
                  type="text"
                  placeholder="Họ tên"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Giới tính" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 outline-none dark:border-slate-700 dark:bg-slate-950">
                    <option>Giới tính</option>
                    <option>Nam</option>
                    <option>Nữ</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Số điện thoại" required />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Công việc" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 outline-none dark:border-slate-700 dark:bg-slate-950">
                    <option>Chọn công việc</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel label="Địa chỉ Email" />
              <input
                type="text"
                placeholder="Địa chỉ Email"
                className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <FieldLabel label="Tỉnh/Thành phố" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Tỉnh/Thành phố</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Quận/Huyện" required />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Quận/Huyện</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Phường/Xã" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Phường/Xã</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel label="Địa chỉ" />
              <input
                type="text"
                placeholder="Địa chỉ"
                className="w-full rounded-lg border bg-white p-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </section>

          {/* 2. THÔNG TIN NGUỒN */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <Info size={16} /> THÔNG TIN NGUỒN
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <FieldLabel label="Nguồn" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Nguồn lead</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Lead tag" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Lead tag</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Tư vấn viên" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Tư vấn viên</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. THÔNG TIN HỌC TẬP */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <BookOpen size={16} /> THÔNG TIN HỌC TẬP
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Mục đích học" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Mục đích học</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Chương trình học mong muốn" />
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                    <option>Chương trình học mong muốn</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-3 right-3 text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Điểm đầu vào" />
                <input
                  type="text"
                  placeholder="0.0"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Điểm đầu ra mong muốn" />
                <input
                  type="text"
                  placeholder="0.0"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel label="Nhu cầu học" />
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border bg-white p-2.5 text-sm text-slate-4 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950">
                  <option>Nhu cầu học</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-3 right-3 text-slate-400"
                  size={16}
                />
              </div>
            </div>
          </section>

          {/* 4. THÔNG TIN PHỤ HUYNH */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <Users size={16} /> THÔNG TIN PHỤ HUYNH
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Tên phụ huynh" />
                <input
                  type="text"
                  placeholder="Họ tên phụ huynh"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Phone phụ huynh" />
                <input
                  type="text"
                  placeholder="Số điện thoại phụ huynh"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Email phụ huynh" />
                <input
                  type="email"
                  placeholder="Email phụ huynh"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-slate-950"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Nghề nghiệp phụ huynh" />
                <input
                  type="text"
                  placeholder="Nghề nghiệp"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-slate-950"
                />
              </div>
            </div>
          </section>

          {/* 5. THÔNG TIN THÊM */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              THÔNG TIN THÊM
            </h3>
            <div className="space-y-1">
              <textarea
                placeholder="Nhập thêm ghi chú..."
                className="h-24 w-full resize-none rounded-lg border bg-white p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between border-t bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="space-y-0.5 text-[10px] text-slate-400">
            <p>
              Được tạo bởi:{" "}
              <span className="font-semibold text-slate-600">Admin</span>
            </p>
            <p>
              Ngày tạo:{" "}
              <span className="font-semibold text-slate-600">31/01/2026</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-red-500/90 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-95"
            >
              Hủy
            </button>
            <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadModal;



