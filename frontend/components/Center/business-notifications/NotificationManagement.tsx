"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import notificationsData from "./data_notifications";
import CreateNotificationModal from "./CreateNotificationModal";

const NotificationManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen font-Inter">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Nút Tạo mới */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-xl font-semibold font-Inter tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
            Lịch sử thông báo
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold font-Inter text-white shadow-md shadow-green-500/20 transition-all hover:bg-green-600"
          >
            <Plus size={20} /> Tạo mới
          </button>
        </div>

        {/* Bảng danh sách thông báo */}
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                  <th className="w-16 p-4 text-center text-xs font-semibold font-Inter tracking-wider text-slate-600">
                    #
                  </th>
                  <th className="p-4 text-xs font-semibold font-Inter tracking-wider text-slate-600">
                    Ngày gửi thông báo
                  </th>
                  <th className="p-4 text-xs font-semibold font-Inter tracking-wider text-slate-600">
                    Tiêu đề
                  </th>
                  <th className="p-4 text-xs font-semibold font-Inter tracking-wider text-slate-600">
                    Người gửi
                  </th>
                  <th className="p-4 text-center text-xs font-semibold font-Inter tracking-wider text-slate-600">
                    Chức năng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {notificationsData.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="p-4 text-center">
                      <button className="rounded border p-0.5 text-slate-400 transition-all hover:bg-slate-50">
                        <Plus size={14} />
                      </button>
                    </td>
                    <td className="p-4 text-sm font-semibold font-Inter text-slate-900 dark:text-slate-2 leading-relaxed00">
                      {item.sendDate}
                    </td>
                    <td className="p-4 text-sm font-semibold font-Inter leading-snug text-slate-600 dark:text-slate-4 leading-relaxed00">
                      {item.title}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-4 leading-relaxed00">
                      {item.sender}
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 text-slate-600 transition-colors hover:text-indigo-600">
                        <Clock size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex items-center justify-end gap-4 border-t p-4 dark:border-slate-700">
            <span className="text-sm text-slate-6 leading-relaxed00">
              Tổng cộng: {notificationsData.length}
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronLeft size={20} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-sm font-bold text-indigo-700">
                1
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tạo mới thông báo */}
      <CreateNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NotificationManagement;



