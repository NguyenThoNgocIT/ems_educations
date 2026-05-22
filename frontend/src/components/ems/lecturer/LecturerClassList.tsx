"use client";
import React, { useState, useEffect } from 'react';
import { courseClassApi } from '@/api/course';
import { Users, Clock, MapPin, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function LecturerClassList() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await courseClassApi.getAll();
        const fetchedClasses = res || [];
        setClasses(fetchedClasses);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách lớp học");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>;
  }

  // Filter out some classes to simulate "my classes"
  const myClasses = classes.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {myClasses.map((c, idx) => {
        const progress = Math.floor(Math.random() * 100); // Simulate progress

        return (
          <div key={c.id || idx} className="group flex flex-col bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                c.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
              }`}>
                {c.status || 'ĐANG DẠY'}
              </span>
            </div>
            
            <div className="p-6 pb-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <BookOpen size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {c.courseName || "Tên môn học"}
                  </h3>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    {c.classCode || "Mã lớp"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={12} /> Sĩ số
                  </div>
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {c.currentStudents || 0} / {c.maxStudents || 40}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={12} /> Số tín chỉ
                  </div>
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {c.credits || 3} TC
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
                <button className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 group/btn">
                  Chi tiết lớp học <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
