"use client";

import React, { useState, useEffect } from 'react';
import { scheduleApi } from '@/api/schedule';
import { useAuth } from '@/context/AuthContext';
import { Users, Clock, BookOpen, ChevronRight, Activity, Grid, List, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function LecturerClassList() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const fetchProgressReport = async () => {
      try {
        const params = user?.role === 'lecturer' ? { instructorId: user.id } : undefined;
        const res = await scheduleApi.getTeachingProgress(params);
        setClasses(res.data?.data || res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách tiến độ giảng dạy");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgressReport();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Đang tải dữ liệu tiến độ giảng dạy...</span>
      </div>
    );
  }

  const getProgressPercentage = (item: any) => {
    if (!item.requiredPeriods) return 0;
    return Math.min(100, Math.round((item.taughtPeriods * 100) / item.requiredPeriods));
  };

  const getAlertBadge = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800/30 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            Đúng tiến độ
          </Badge>
        );
      case 'BEHIND':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800/30 flex items-center gap-1 w-fit">
            <AlertCircle className="w-3.5 h-3.5" />
            Chậm tiến độ
          </Badge>
        );
      case 'CRITICAL':
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800/30 flex items-center gap-1 w-fit animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            Cảnh báo trễ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'grid'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Dạng lưới</span>
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'table'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Báo cáo tiến độ (9 cột)</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center text-slate-500 py-16 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <BookOpen className="w-12 h-12 opacity-25 mx-auto mb-3 text-slate-400" />
          <p className="font-semibold text-lg">Chưa phân công lớp học phần</p>
          <p className="text-sm mt-1 text-slate-400">Bạn chưa được phân công lớp học phần nào trong học kỳ này.</p>
        </div>
      ) : activeTab === 'grid' ? (
        /* GRID VIEW (CARDS) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((c, idx) => {
            const progress = getProgressPercentage(c);

            return (
              <div
                key={c.courseClassId || idx}
                className="group flex flex-col bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4">
                  {getAlertBadge(c.alertStatus)}
                </div>
                
                <div className="p-6 pb-5 flex-1">
                  <div className="flex items-center gap-3 mb-4 pr-24">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                      <BookOpen size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {c.courseName}
                      </h3>
                      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                        {c.courseClassCode}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Users size={12} /> Tiết yêu cầu
                      </div>
                      <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {c.requiredPeriods} tiết
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={12} /> Số tín chỉ
                      </div>
                      <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {c.credits} TC
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100/50 dark:border-gray-800/50 flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Activity size={12}/> Tiến độ giảng dạy
                      </span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {c.startDate} ~ {c.endDate}
                    </div>
                    <button className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 group/btn">
                      Chi tiết <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (9 COLUMNS REPORT) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mã lớp</th>
                  <th className="px-6 py-4">Tên học phần</th>
                  <th className="px-6 py-4 text-center">Tín chỉ</th>
                  <th className="px-6 py-4">Ngày bắt đầu</th>
                  <th className="px-6 py-4">Ngày kết thúc</th>
                  <th className="px-6 py-4 text-center">Tiết yêu cầu</th>
                  <th className="px-6 py-4 text-center">Tiết đã dạy</th>
                  <th className="px-6 py-4 text-center">Tiết còn lại</th>
                  <th className="px-6 py-4">Tiến độ & Cảnh báo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {classes.map((c, idx) => {
                  const progress = getProgressPercentage(c);

                  return (
                    <tr
                      key={c.courseClassId || idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      {/* 1. Mã lớp */}
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {c.courseClassCode}
                      </td>
                      {/* 2. Tên học phần */}
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={c.courseName}>
                        {c.courseName}
                      </td>
                      {/* 3. Tín chỉ */}
                      <td className="px-6 py-4 text-center font-medium">
                        {c.credits}
                      </td>
                      {/* 4. Ngày bắt đầu */}
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {c.startDate}
                      </td>
                      {/* 5. Ngày kết thúc */}
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {c.endDate}
                      </td>
                      {/* 6. Tiết yêu cầu */}
                      <td className="px-6 py-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                        {c.requiredPeriods}
                      </td>
                      {/* 7. Tiết đã dạy */}
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {c.taughtPeriods}
                      </td>
                      {/* 8. Tiết còn lại */}
                      <td className="px-6 py-4 text-center font-semibold text-slate-500">
                        {c.remainingPeriods}
                      </td>
                      {/* 9. Tiến độ & Cảnh báo */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold w-[150px]">
                            <span className="text-slate-400">Đã dạy:</span>
                            <span className="text-brand-600 dark:text-brand-400">{progress}%</span>
                          </div>
                          <div className="w-[150px] bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-500 h-full rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          {getAlertBadge(c.alertStatus)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
