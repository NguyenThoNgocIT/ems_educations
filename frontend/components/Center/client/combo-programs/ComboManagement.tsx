"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import combosData from "./data_combos";
import CreateComboModal from "./CreateComboModal";

const ComboManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-Inter dark:bg-black">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <button className="rounded-lg border p-2 text-slate-400 hover:bg-slate-50 dark:border-slate-600">
            <Filter size={20} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 font-semibold font-Inter text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600"
          >
            <Plus size={20} /> Tạo mới
          </button>
        </div>

        {/* Bảng danh sách Combo */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50/50 text-sm font-semibold font-Inter tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/30 dark:text-white">
                <th className="w-12 p-6 text-center">#</th>
                <th className="p-6">Tên combo</th>
                <th className="p-6">Tổng tiền gốc</th>
                <th className="p-6">Thời gian</th>
                <th className="p-6">Mô tả</th>
                <th className="p-6 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {combosData.map((combo) => (
                <tr
                  key={combo.id}
                  className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-6 text-center align-top">
                    <button className="rounded border p-0.5 text-slate-400 hover:bg-slate-50">
                      <Plus size={12} />
                    </button>
                  </td>

                  {/* Cột Tên & Trạng thái */}
                  <td className="p-6 align-top">
                    <div className="space-y-3">
                      <h4 className="text-slate-9 leading-relaxed00 text-sm leading-snug leading-tight font-semibold font-Inter dark:text-white">
                        {combo.name}
                      </h4>
                      <span className="inline-block rounded-lg border border-blue-400 bg-blue-50/50 px-3 py-1 text-[11px] font-semibold font-Inter text-indigo-600">
                        {combo.status}
                      </span>
                    </div>
                  </td>

                  {/* Cột Chi tiết giá */}
                  <td className="p-6 align-top">
                    <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
                      <span className="text-slate-400">Tiền gốc:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.originalPrice}
                      </span>
                      <span className="text-slate-400">Tiền giảm:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.discountPrice}
                      </span>
                      <span className="text-slate-400">% giảm:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.discountPercent}
                      </span>
                      <span className="font-semibold font-Inter text-green-500">
                        Tổng tiền:
                      </span>
                      <span className="font-semibold font-Inter text-green-500">
                        {combo.totalPrice}
                      </span>
                    </div>
                  </td>

                  {/* Cột Thời gian */}
                  <td className="p-6 align-top">
                    <div className="grid grid-cols-[110px_1fr] gap-y-1 text-sm">
                      <span className="text-slate-400">Ngày bắt đầu:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.startDate}
                      </span>
                      <span className="text-slate-400">Ngày kết thúc:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.endDate}
                      </span>
                      <span className="text-slate-400">Diễn ra trong:</span>
                      <span className="font-semibold font-Inter text-slate-900 dark:text-slate-200">
                        {combo.duration}
                      </span>
                    </div>
                  </td>

                  <td className="text-slate-4 leading-relaxed00 p-6 align-top text-sm italic">
                    {combo.description}
                  </td>

                  {/* Cột Chức năng */}
                  <td className="p-6 align-top">
                    <div className="flex justify-center gap-3">
                      <button className="p-1.5 text-slate-400 transition-all hover:text-indigo-600">
                        <Edit3 size={20} />
                      </button>
                      <button className="p-1.5 text-slate-400 transition-all hover:text-red-500">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 border-t p-4 dark:border-slate-700">
            <button className="p-1 text-slate-400 transition-all hover:text-slate-900">
              <ChevronLeft size={20} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-indigo-700 shadow-sm">
              1
            </button>
            <button className="p-1 text-slate-400 transition-all hover:text-slate-900">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <CreateComboModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ComboManagement;
