"use client";

import { Bell, BellOff, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { notificationApi, NotificationItem } from "@/api/notification";

function formatTime(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function NotificationDropdown({ href = "/dashboard/student/notifications" }: { href?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const countRes = await notificationApi.getUnreadCount();
      if (countRes && typeof countRes.count === "number") {
        setUnreadCount(countRes.count);
      }

      const listRes = await notificationApi.getNotifications();
      if (Array.isArray(listRes)) {
        setNotifications(listRes);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    }
  };

  // Poll for unread count and notifications every 15 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch immediately when user opens dropdown
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return;
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.userNotificationId === id ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        title="Thông báo"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-20 mt-4 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-3 shadow-xl sm:right-0 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Thông báo</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {unreadCount} mới
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Đọc tất cả
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Đóng"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="py-2">
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Đang tải thông báo...</div>
          ) : notifications.length === 0 ? (
            <div className="py-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
                <BellOff className="h-5 w-5" />
              </span>
              <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">Chưa có thông báo</p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Bạn sẽ nhận được thông báo khi có các hoạt động mới trên hệ thống.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((item) => (
                <div
                  key={item.userNotificationId}
                  onClick={() => handleMarkAsRead(item.userNotificationId, item.isRead)}
                  className={`flex gap-3 p-3 transition hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer ${
                    !item.isRead ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02]" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs text-slate-950 dark:text-white leading-5 ${
                        !item.isRead ? "font-bold" : "font-semibold"
                      }`}>
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </p>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href={href}
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Mở trang thông báo
        </Link>
      </Dropdown>
    </div>
  );
}
