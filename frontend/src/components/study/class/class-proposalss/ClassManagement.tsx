"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Info,
  Home,
  Users,
  ChevronDown,
} from "lucide-react";
import classesData from "./data_classes";

const ClassManagement = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Tính toán số lượng lớp cho từng Tab (Dynamic & Optimized)
  const tabCounts = useMemo(() => {
    return {
      "Tất cả": classesData.length,
      "Sắp diễn ra": classesData.filter((c) => c.status === "Sắp diễn ra")
        .length,
      "Đang diễn ra": classesData.filter((c) => c.status === "Đang diễn ra")
        .length,
      "Kết thúc": classesData.filter((c) => c.status === "Kết thúc").length,
    };
  }, [classesData]); // Phụ thuộc vào dữ liệu nguồn

  // 2. Logic lọc danh sách lớp (Single Source of Truth)
  const filteredItems = useMemo(() => {
    return classesData.filter((cls) => {
      const matchesTab = activeTab === "Tất cả" || cls.status === activeTab;
      const matchesSearch = cls.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, classesData]);

  // 3. Helper định màu Badge trạng thái
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      "Đang diễn ra": "bg-blue-600",
      "Sắp diễn ra": "bg-green-600",
      "Kết thúc": "bg-red-600",
    };
    return styles[status] || "bg-slate-500";
  };

  const router = useRouter();
  return (
    <div className="min-h-screen p-6 font-sans selection:bg-blue-100">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* --- HEADER: TOOLBAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex w-full items-center gap-3 md:w-auto">
            <button className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600">
              <Filter size={18} />
            </button>

            <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
              {Object.entries(tabCounts).map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === name
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:text-slate-900 dark:hover:text-slate-300"
                  }`}
                >
                  {name} ({count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 md:flex-none">
            <div className="group relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pr-12 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-950"
              />
              <span className="absolute top-0 right-0 flex h-full items-center border-l border-slate-100 px-3 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:border-slate-600">
                <Search size={18} />
              </span>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/10 transition-all hover:bg-green-700 active:scale-95">
              <Plus size={20} /> Tạo lớp
            </button>
          </div>
        </div>

        {/* --- GRID: CLASS CARDS --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((cls) => (
              <div
                key={cls.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                {/* Banner */}
                <div
                  className={`h-32 ${cls.bannerColor || "bg-blue-400"} relative flex flex-col justify-between p-4`}
                >
                  <div className="z-10 flex items-start justify-between">
                    <div
                      className={`${getStatusStyle(cls.status)} flex cursor-default items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-white shadow-sm`}
                    >
                      {cls.status} <ChevronDown size={12} />
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/40">
                        <MoreVertical size={16} />
                      </button>
                      <button className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/40">
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 select-none">
                    <h2 className="text-4xl leading-snug font-bold tracking-normal text-white italic dark:text-white/90">
                      MONA LMS
                    </h2>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="truncate text-lg leading-normal leading-snug leading-tight font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white/90">
                      {cls.name}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed font-bold tracking-wider text-slate-400">
                      {cls.startDate} - {cls.endDate}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Thanh toán:</span>{" "}
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {cls.paymentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Giảng viên:</span>{" "}
                      <span className="ml-4 truncate font-bold text-slate-900 dark:text-slate-200">
                        {cls.teachers?.join(", ") || "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tiến độ:</span>{" "}
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {cls.lessonsLearned} / {cls.totalLessons} buổi
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 font-semibold text-green-600">
                      <Users size={18} />
                      <span className="text-sm">
                        {cls.studentsCount} / {cls.maxStudents}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-indigo-700">
                      {cls.price}
                    </span>

                    <button
                      className="absolute -top-3 right-0 rounded-xl bg-pink-500 p-1 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                      onClick={() => router.push("/home-office")}
                    >
                      <Home size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block rounded-2xl border border-dashed border-slate-300 bg-white p-6 dark:border-slate-600 dark:bg-slate-900">
                <p className="leading-relaxed font-bold text-slate-400 italic">
                  Không có dữ liệu lớp học phù hợp.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("Tất cả");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm font-bold text-indigo-600 hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;
