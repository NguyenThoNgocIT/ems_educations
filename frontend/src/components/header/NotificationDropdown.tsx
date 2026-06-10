"use client";

import { Bell, BellOff, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { notificationApi, NotificationItem } from "@/api/notification";
import { fixMojibakeText } from "@/utils/text";
import { Dropdown } from "../ui/dropdown/Dropdown";

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

  const fetchUnreadCount = async () => {
    try {
      const countRes = await notificationApi.getUnreadCount();
      setUnreadCount(typeof countRes?.count === "number" ? countRes.count : 0);
    } catch (error: any) {
      if (error?.code !== "ECONNABORTED") {
        console.warn("Không thể tải số thông báo chưa đọc:", error);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      await fetchUnreadCount();
      const listRes = await notificationApi.getNotifications();
      setNotifications(Array.isArray(listRes) ? listRes : []);
    } catch (error: any) {
      if (error?.code !== "ECONNABORTED") {
        console.warn("Không thể tải thông báo:", error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
          item.userNotificationId === id ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.warn("Không thể đánh dấu đã đọc:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.warn("Không thể đánh dấu tất cả đã đọc:", error);
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
          <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
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
                Bạn sẽ nhận được thông báo khi có hoạt động mới trên hệ thống.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
              {notifications.map((item) => (
                <div
                  key={item.userNotificationId}
                  onClick={() => handleMarkAsRead(item.userNotificationId, item.isRead)}
                  className={`flex cursor-pointer gap-3 p-3 transition hover:bg-slate-50 dark:hover:bg-slate-850 ${
                    !item.isRead ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02]" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs leading-5 text-slate-950 dark:text-white ${
                        !item.isRead ? "font-bold" : "font-semibold"
                      }`}>
                        {fixMojibakeText(item.title)}
                      </p>
                      {!item.isRead && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {fixMojibakeText(item.content)}
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
