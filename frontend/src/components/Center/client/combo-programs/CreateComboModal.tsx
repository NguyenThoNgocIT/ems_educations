"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Calendar, DollarSign, Tag, Info } from "lucide-react";

interface CreateComboModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateComboModal: React.FC<CreateComboModalProps> = ({
  isOpen,
  onClose,
}) => {
  // 1. Quản lý State cho các trường nhập liệu
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: 0,
    discountValue: 0,
    discountType: "amount", // amount (tiền) hoặc percent (%)
    startDate: "",
    endDate: "",
    description: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [discountPercentDisplay, setDiscountPercentDisplay] = useState("0%");

  // 2. Logic tự động tính toán Tổng tiền và % Giảm
  useEffect(() => {
    let total = formData.originalPrice;
    let percent = "0%";

    if (formData.discountType === "amount") {
      total = formData.originalPrice - formData.discountValue;
      percent =
        formData.originalPrice > 0
          ? ((formData.discountValue / formData.originalPrice) * 100).toFixed(
              1,
            ) + "%"
          : "0%";
    } else {
      total = formData.originalPrice * (1 - formData.discountValue / 100);
      percent = formData.discountValue + "%";
    }

    setTotalPrice(total < 0 ? 0 : total);
    setDiscountPercentDisplay(percent);
  }, [formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-normal leading-snug">
            Tạo chương trình Combo
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
          {/* Section: Thông tin cơ bản */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <Tag size={16} /> THÔNG TIN COMBO
            </h3>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Tên combo *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Trọn gói từ A1"
                className="w-full rounded-lg border bg-white p-2.5 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </section>

          {/* Section: Thông tin giá */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <DollarSign size={16} /> CHI TIẾT GIÁ (VNĐ)
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Tiền gốc *
                </label>
                <input
                  type="number"
                  placeholder="1,010,000,000"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-950"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Giảm giá theo
                </label>
                <select
                  className="w-full rounded-lg border bg-white p-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                >
                  <option value="amount">Số tiền cố định</option>
                  <option value="percent">Phần trăm (%)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Giá trị giảm
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm font-bold text-red-500 dark:border-slate-700 dark:bg-slate-950"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 italic">
                  % Giảm dự kiến
                </label>
                <div className="rounded-lg border bg-slate-50 p-2.5 text-sm font-bold text-slate-6 leading-relaxed00 dark:border-slate-600 dark:bg-slate-800">
                  {discountPercentDisplay}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/10">
              <span className="text-sm font-bold text-green-600">
                Tổng tiền combo:
              </span>
              <span className="text-xl font-bold text-green-600 leading-snug">
                {totalPrice.toLocaleString()} VNĐ
              </span>
            </div>
          </section>

          {/* Section: Thời gian diễn ra */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <Calendar size={16} /> THỜI GIAN ÁP DỤNG
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Ngày bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border p-2.5 text-sm dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Ngày kết thúc *
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border p-2.5 text-sm dark:border-slate-700"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 dark:border-slate-700 leading-tight leading-snug">
              <Info size={16} /> MÔ TẢ
            </h3>
            <textarea
              placeholder="Nhập mô tả ngắn về chương trình combo..."
              className="h-24 w-full resize-none rounded-xl border p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="text-[10px] text-slate-400">
            <p>
              Được tạo bởi:{" "}
              <span className="font-bold text-slate-600">Admin</span>
            </p>
            <p>
              Ngày tạo:{" "}
              <span className="font-bold text-slate-600">31/01/2026</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-red-500/90 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-red-600"
            >
              Hủy
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600">
              <Save size={18} /> Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComboModal;



