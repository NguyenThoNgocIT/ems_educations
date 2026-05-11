"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
} from "lucide-react";
import promotionsData from "./data_promotions";
import CreatePromotionModal from "./CreatePromotionModal";

const PromotionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-Inter dark:bg-black">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Header Action */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold font-Inter text-white shadow-md shadow-green-500/20 transition-all hover:bg-green-600"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>

        {/* Bảng danh sách khuyến mãi */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50/50 text-sm font-semibold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/30 dark:text-white">
                <th className="w-12 p-4 text-center">#</th>
                <th className="p-4">Mã khuyến mãi</th>
                <th className="p-4 text-center">Khuyến mãi</th>
                <th className="p-4">Gói khuyến mãi</th>
                <th className="p-4 text-right">Khuyến mãi tối đa</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Số lượng</th>
                <th className="p-4 text-center">Đã dùng</th>
                <th className="p-4">Ngày hết hạn</th>
                <th className="p-4 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {promotionsData.map((promo) => (
                <tr
                  key={promo.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-4 text-center">
                    <button className="rounded border p-0.5 text-slate-400 transition-all hover:bg-slate-50">
                      <Plus size={12} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex w-fit items-center gap-2 rounded border bg-slate-50 px-2 py-1 dark:border-slate-600 dark:bg-slate-800">
                      <Copy size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold font-Inter tracking-normal text-slate-900 dark:text-slate-200">
                        {promo.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-bold text-indigo-600">
                    {promo.discountValue}
                  </td>
                  <td className="p-4 text-xs font-semibold font-Inter xt-slate-900 dark:text-slate-300">
                    {promo.packageType}
                  </td>
                  <td className="dark:text-slate-4 leading-relaxed00 p-4 text-right text-sm text-slate-600">
                    {promo.maxDiscount}
                  </td>
                  <td className="flex items-center justify-center p-4 text-center">
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-semibold whitespace-nowrap ${
                        promo.status === "Đã kết thúc"
                          ? "bg-yellow-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {promo.status}
                    </span>
                  </td>

                  <td className="dark:text-slate-4 leading-relaxed00 p-4 text-center text-sm text-slate-600">
                    {promo.quantity}
                  </td>
                  <td className="dark:text-slate-4 leading-relaxed00 p-4 text-center text-sm font-semibold text-slate-600">
                    {promo.used}
                  </td>
                  <td className="dark:text-slate-4 leading-relaxed00 p-4 text-sm text-slate-600">
                    {promo.expiryDate}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 transition-all hover:text-indigo-600">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 transition-all hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 border-t bg-slate-50/20 p-4 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-600">
              Tổng cộng: {promotionsData.length}
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronLeft size={20} />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-indigo-700 shadow-sm">
                1
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreatePromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PromotionManagement;
