"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Users, Clock, Bell, ChevronRight, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { courseClassApi } from "@/api/course";
import { scheduleApi } from "@/api/schedule";

export default function LecturerDashboard() {
  const [stats, setStats] = useState({
    classesCount: 0,
    todaySchedulesCount: 0,
    studentCount: 0,
    notificationsCount: 0
  });
  
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classRes = await courseClassApi.getAll();
        let classes = classRes.data?.data || classRes.data || [];
        
        // Fetch schedules
        const scheduleRes = await scheduleApi.getAll();
        let schedules = scheduleRes.data?.data || scheduleRes.data || [];

        // Mock fallback data if DB is empty
        if (classes.length === 0) {
          classes = [
            { id: "class1", classCode: "CNTT101-01", courseName: "Lập trình Web", credits: 3 },
            { id: "class2", classCode: "CNTT102-01", courseName: "Cơ sở dữ liệu", credits: 3 },
            { id: "class3", classCode: "CNTT103-01", courseName: "Mạng máy tính", credits: 3 },
            { id: "class4", classCode: "CNTT104-01", courseName: "Toán rời rạc", credits: 3 }
          ];
        }

        if (schedules.length === 0) {
          schedules = [
            { id: "sch1", courseName: "Lập trình ứng dụng Web", courseClassCode: "D22CNTT03 - Nhóm 01", roomCode: "Phòng A305", type: "LT", startPeriod: 1, endPeriod: 3 },
            { id: "sch2", courseName: "Cơ sở dữ liệu nâng cao", courseClassCode: "D22CNTT02 - Nhóm 02", roomCode: "Phòng A204", type: "TH", startPeriod: 4, endPeriod: 6 },
            { id: "sch3", courseName: "Mạng máy tính", courseClassCode: "D22CNTT01 - Nhóm 01", roomCode: "Phòng B102", type: "LT", startPeriod: 7, endPeriod: 9 }
          ];
        }

        // Tính toán thống kê
        setStats({
          classesCount: classes.length,
          todaySchedulesCount: schedules.length, 
          studentCount: classes.length * 40, // Ước tính 40 SV/lớp
          notificationsCount: 2 // Mock notifications
        });

        // Ánh xạ danh sách lịch dạy (Lấy tối đa 3 lịch)
        const mappedSchedules = schedules.slice(0, 3).map((s: any) => {
           const startHour = 7 + (s.startPeriod || 1);
           const endHour = startHour + ((s.endPeriod || 2) - (s.startPeriod || 1));
           return {
             time: `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`,
             name: s.courseName || s.courseClassName || "Lớp học phần",
             code: s.courseClassCode || s.courseClassId?.substring(0, 8) || "Mã lớp",
             room: s.roomCode || s.roomName || "Phòng học",
             type: s.type || "LT"
           };
        });
        
        setTodaySchedules(mappedSchedules);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* KHỐI TIÊU ĐỀ CHÀO MỪNG */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Xin chào, Giảng viên 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Chúc bạn một ngày làm việc và giảng dạy hiệu quả!</p>
      </div>

      {/* 4 KHỐI CARD THỐNG KÊ */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Lớp đang dạy */}
        <div className="rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg hover:border-brand-300 dark:border-gray-800/50 dark:bg-gray-900/40 dark:hover:border-brand-500/50 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lớp đang giảng dạy</p>
            <h4 className="mt-2 text-3xl font-black text-gray-800 dark:text-white">
              {loading ? "..." : stats.classesCount}
            </h4>
            <p className="mt-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full inline-block">Học kỳ này</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 text-brand-600 dark:text-brand-400">
            <BookOpen className="h-7 w-7" />
          </div>
        </div>

        {/* Tiết dạy */}
        <div className="rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg hover:border-sky-300 dark:border-gray-800/50 dark:bg-gray-900/40 dark:hover:border-sky-500/50 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lịch phân công</p>
            <h4 className="mt-2 text-3xl font-black text-gray-800 dark:text-white">
              {loading ? "..." : stats.todaySchedulesCount}
            </h4>
            <p className="mt-1 text-[10px] font-semibold text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400 px-2 py-0.5 rounded-full inline-block">Tổng lịch dạy</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 text-sky-600 dark:text-sky-400">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        {/* Tổng sinh viên */}
        <div className="rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:border-gray-800/50 dark:bg-gray-900/40 dark:hover:border-indigo-500/50 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sinh viên quản lý</p>
            <h4 className="mt-2 text-3xl font-black text-gray-800 dark:text-white">
              {loading ? "..." : stats.studentCount}
            </h4>
            <p className="mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-full inline-block">Ước tính</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-400">
            <Users className="h-7 w-7" />
          </div>
        </div>

        {/* Thông báo chưa đọc */}
        <div className="rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg hover:border-rose-300 dark:border-gray-800/50 dark:bg-gray-900/40 dark:hover:border-rose-500/50 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Thông báo mới</p>
            <h4 className="mt-2 text-3xl font-black text-gray-800 dark:text-white">
              {loading ? "..." : stats.notificationsCount}
            </h4>
            <p className="mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-0.5 rounded-full inline-block">Cần xử lý ngay</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 text-rose-600 dark:text-rose-400">
            <Bell className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* CHI TIẾT LỊCH DẠY BÊN DƯỚI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lịch dạy chi tiết */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-6 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/40 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lịch giảng dạy tới đây</h3>
            <Link href="/dashboard/lecturer/my-schedule" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold flex items-center gap-1 group">
              Xem thời khóa biểu <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          <div className="mt-5 space-y-4 flex-1">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Đang tải lịch giảng dạy...</div>
            ) : todaySchedules.length > 0 ? (
              todaySchedules.map((item, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-brand-200 hover:shadow-md dark:bg-gray-800/30 dark:border-gray-800 dark:hover:bg-gray-800/50 dark:hover:border-brand-500/30 transition-all gap-4 sm:gap-0">
                  <div className="flex gap-5 items-center">
                    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-xl py-2 px-3 min-w-[100px]">
                      <span className="text-xs font-black text-brand-600 dark:text-brand-400">{item.time.split(' - ')[0]}</span>
                      <span className="text-[10px] font-bold text-gray-400">đến {item.time.split(' - ')[1]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{item.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${item.type === 'TH' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>{item.type}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.code}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 w-full sm:w-auto justify-center">
                      <Info size={14} className="text-brand-500"/> {item.room}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Chưa có lịch phân công</p>
              </div>
            )}
          </div>
        </div>

        {/* Thông báo từ phòng ban */}
        <div className="rounded-3xl border border-gray-200/50 bg-white/60 backdrop-blur-xl p-6 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/40">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tin tức nhận được</h3>
            <span className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 cursor-pointer font-semibold">Xem tất cả</span>
          </div>
          <div className="mt-5 space-y-5">
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded mb-1.5 inline-block">Khẩn cấp</span>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-200 leading-tight">Hạn cuối khóa điểm thi học kỳ 2</p>
              <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1"><Clock size={12}/> Hạn chót: 30/05/2026</p>
            </div>
            
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded mb-1.5 inline-block">Phòng Đào tạo</span>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-200 leading-tight">Triển khai quy chế coi thi mới</p>
              <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1"><CheckCircle2 size={12}/> Ngày nhận: 19/05/2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
