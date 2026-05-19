"use client";

import React from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  FileText, 
  Bell, 
  ChevronRight, 
  Award,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const notifications = [
    { id: 1, title: "Thông báo kế hoạch đăng ký học phần HK2", sender: "Phòng Đào tạo", date: "21/05/2024", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
    { id: 2, title: "Thông báo thực tập doanh nghiệp", sender: "Khoa CNTT", date: "20/05/2024", color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
    { id: 3, title: "Chương trình học bổng kỳ 2/2024", sender: "Trung tâm CTSV", date: "19/05/2024", color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
    { id: 4, title: "Khảo sát ý kiến sinh viên", sender: "Phòng Công tác sinh viên", date: "18/05/2024", color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
  ];

  return (
    // SỬA: Thêm w-full và overflow-x-hidden để triệt tiêu hoàn toàn scroll ngang bậy bạ
    <div className="w-full overflow-x-hidden space-y-6 antialiased pb-10">
      
      {/* KHỐI CHÀO MỪNG */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Xin chào, Nguyễn Văn B <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Chúc bạn một ngày học tập hiệu quả!
        </p>
      </div>

      {/* 1. HÀNG THỂ THỐNG KÊ (4 CARDS TOP) - Tự động co giãn theo hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* GPA Tích lũy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-0">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">GPA tích lũy</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">3.45</span>
              <span className="text-xs text-slate-400 font-medium">/4.0</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Xếp loại: Khá</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-2">
            <Award size={20} />
          </div>
        </div>

        {/* Tín chỉ tích lũy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-0">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Số tín chỉ tích lũy</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">72</span>
              <span className="text-xs text-slate-400 font-medium">/120</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Học kỳ 4</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0 ml-2">
            <GraduationCap size={20} />
          </div>
        </div>

        {/* Tín chỉ học kỳ này */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-0">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Số tín chỉ học kỳ này</p>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 block">18</span>
            <p className="text-[10px] text-slate-400 font-medium">Học kỳ 2, 2023-2024</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Công nợ học phí */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between shadow-sm min-w-0">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Công nợ học phí</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">0</span>
              <span className="text-xs font-bold text-slate-500">VND</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Đã thanh toán</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0 ml-2">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC TRUNG TÂM: CHIA TỶ LỆ GRID LINH HOẠT CHỐNG CỨNG */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full">
        
        {/* CỘT TRÁI (CHIẾM 8 PHẦN TRÊN MÀN HÌNH LỚN) */}
        <div className="xl:col-span-8 flex flex-col gap-5 min-w-0 w-full">
          
          {/* KHỐI LỊCH HỌC HÔM NAY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calendar size={16} className="text-emerald-500" /> Lịch học hôm nay
              </h2>
              <Link href="#" className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                Xem thời khóa biểu →
              </Link>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {/* Môn 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-24 flex items-center gap-1 flex-shrink-0">
                    <Clock size={12} /> 07:30 - 09:00
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Lập trình Web</h4>
                    <p className="text-[11px] text-slate-400 truncate">D22CNTT03 - P. A305</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md self-start sm:self-center flex-shrink-0">ThS. Nguyễn Văn A</span>
              </div>

              {/* Môn 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-24 flex items-center gap-1 flex-shrink-0">
                    <Clock size={12} /> 09:15 - 10:45
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Cơ sở dữ liệu</h4>
                    <p className="text-[11px] text-slate-400 truncate">D22CNTT02 - P. A204</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md self-start sm:self-center flex-shrink-0">ThS. Trần Thị B</span>
              </div>

              {/* Môn 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-24 flex items-center gap-1 flex-shrink-0">
                    <Clock size={12} /> 13:30 - 15:00
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Tiếng Anh chuyên ngành</h4>
                    <p className="text-[11px] text-slate-400 truncate">D22ANH02 - P. B301</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md self-start sm:self-center flex-shrink-0">ThS. Lê Văn C</span>
              </div>
            </div>
          </div>

          {/* KHỐI KẾT QUẢ HỌC TẬP */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between mb-6 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Award size={16} className="text-emerald-500" /> Kết quả học tập
              </h2>
              <Link href="#" className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                Xem chi tiết →
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-6 min-w-0">
              {/* Vòng tròn điểm số */}
              <div className="relative flex items-center justify-center w-36 h-36 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100 dark:text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500" strokeDasharray="65, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-amber-400" strokeDasharray="20, 100" strokeDashoffset="-65" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">3.45</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">GPA Tích lũy</span>
                </div>
              </div>

              {/* Danh sách nhóm điểm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 w-full min-w-0">
                <div className="flex items-center justify-between text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 truncate">Xuất sắc (4.0)</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 flex-shrink-0">15 TC</span>
                </div>
                <div className="flex items-center justify-between text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 truncate">Giỏi (3.2 - 3.59)</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 flex-shrink-0">36 TC</span>
                </div>
                <div className="flex items-center justify-between text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 truncate">Khá (2.5 - 3.19)</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 flex-shrink-0">18 TC</span>
                </div>
                <div className="flex items-center justify-between text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 truncate">Yếu (&lt; 2.0)</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 flex-shrink-0">0 TC</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (CHIẾM 4 PHẦN): THÔNG BÁO */}
        <div className="xl:col-span-4 min-w-0 w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm h-full flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800/50 pb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Bell size={16} className="text-emerald-500" /> Thông báo
              </h2>
              <Link href="#" className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                Xem tất cả
              </Link>
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              {notifications.map((item) => (
                <div key={item.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Bell size={14} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2">
                      <span className="truncate">{item.sender}</span>
                      <span className="flex-shrink-0">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. HÀNG 4 NÚT HÀNH ĐỘNG NHANH Ở ĐÁY TRANG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Đăng ký học phần */}
        <Link href="#" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Đăng ký học phần</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Đăng ký môn học kỳ mới</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
        </Link>

        {/* Học phí */}
        <Link href="#" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
              <CreditCard size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Học phí</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Xem hóa đơn & thanh toán</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
        </Link>

        {/* Tài liệu học tập */}
        <Link href="#" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Tài liệu học tập</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Bài giảng & tài liệu môn học</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
        </Link>

        {/* Đánh giá giảng viên */}
        <Link href="#" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Đánh giá giảng viên</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Khảo sát chất lượng dạy</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
        </Link>
      </div>

    </div>
  );
}
