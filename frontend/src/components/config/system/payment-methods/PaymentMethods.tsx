"use client";
import React from "react";
import { Edit3, ChevronLeft, ChevronRight } from "lucide-react";

const paymentMethods = [
  {
    id: 1,
    name: "Chuyển khoản",
    status: "Hoạt động",
    description: [
      "Thông tin thanh toán chuyển khoản",
      "Ngân hàng 1 : MBBANK 100xxxxxx Nguyễn Văn A",
      "Ngân hàng 2 : VP BANK 809xxxxxx Nguyễn Văn A",
      "Nội dung chuyển khoản:",
      "- {Số điện thoại} - {Mã học viên} - {Họ tên học viên}",
      "- ví dụ: 09xxxxxx - HV00xxxx - Nguyễn Văn B",
    ],
    thumbnail: "/api/placeholder/80/80", // Thay bằng link ảnh thực tế
  },
  {
    id: 2,
    name: "Tiền mặt",
    status: "Hoạt động",
    description: [],
    thumbnail: null,
  },
];

const PaymentMethods = () => {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- TABLE: DANH SÁCH PHƯƠNG THỨC --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-[300px] px-6 py-4">Phương thức</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="w-28 px-6 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {paymentMethods.map((method) => (
              <tr
                key={method.id}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* Phương thức (Ảnh + Tên link) */}
                <td className="px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-50 bg-slate-50">
                      {method.thumbnail ? (
                        <img
                          src={method.thumbnail}
                          alt={method.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic">
                          Thumbnail
                        </span>
                      )}
                    </div>
                    <span className="cursor-pointer font-bold text-indigo-700 hover:underline">
                      {method.name}
                    </span>
                  </div>
                </td>

                {/* Trạng thái (Badge xanh dương) --- */}
                <td className="px-6 py-8">
                  <div className="flex justify-center">
                    <span className="rounded-lg bg-[#3B82F6] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                      {method.status}
                    </span>
                  </div>
                </td>

                {/* Mô tả chi tiết */}
                <td className="px-6 py-8">
                  <div className="flex flex-col gap-1 leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                    {method.description.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </td>

                {/* Chức năng (Sửa) */}
                <td className="px-6 py-8">
                  <div className="flex justify-center">
                    <button
                      title="Sửa"
                      className="text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-300"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <div className="flex items-center gap-1">
          <button className="cursor-not-allowed p-1 text-slate-300">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[11px] font-bold text-indigo-700">
            1
          </span>
          <button className="cursor-not-allowed p-1 text-slate-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
