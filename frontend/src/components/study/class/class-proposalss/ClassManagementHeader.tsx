"use client";
import React, { useMemo } from "react";
import { Search, Filter, Plus } from "lucide-react";

// Định nghĩa Interface để code chuẩn IT
interface HeaderProps {
  allData: any[]; // Toàn bộ dữ liệu để tính count
  activeTab: string; // Tab đang chọn từ Component cha
  onTabChange: (name: string) => void;
  onSearch: (term: string) => void;
  onCreateClass: () => void;
}

const ClassManagementHeader: React.FC<HeaderProps> = ({
  allData,
  activeTab,
  onTabChange,
  onSearch,
  onCreateClass,
}) => {
  // Logic tính toán số lượng dựa trên data thực tế
  const tabCounts = useMemo(() => {
    return {
      "Tất cả": allData.length,
      "Sắp diễn ra": allData.filter((item) => item.status === "Sắp diễn ra")
        .length,
      "Đang diễn ra": allData.filter((item) => item.status === "Đang diễn ra")
        .length,
      "Kết thúc": allData.filter((item) => item.status === "Kết thúc").length,
    };
  }, [allData]);

  const tabs = [
    { name: "Tất cả", count: tabCounts["Tất cả"] },
    { name: "Sắp diễn ra", count: tabCounts["Sắp diễn ra"] },
    { name: "Đang diễn ra", count: tabCounts["Đang diễn ra"] },
    { name: "Kết thúc", count: tabCounts["Kết thúc"] },
  ];

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all md:flex-row dark:border-slate-700 dark:bg-slate-900">
      <div className="flex w-full items-center gap-3 md:w-auto">
        <button className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600">
          <Filter size={18} />
        </button>

        {/* Danh sách Tabs hiển thị số lượng thật từ data */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-slate-50 p-1 dark:bg-slate-800/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => onTabChange(tab.name)}
                className={`rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" // Màu xanh chuẩn mẫu
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto">
        {/* Thanh tìm kiếm có callback onSearch */}
        <div className="group relative flex-1 md:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm lớp học"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-12 pl-4 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-950"
          />
          <button className="absolute top-0 right-0 h-full border-l border-slate-100 px-3 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:border-slate-600">
            <Search size={18} />
          </button>
        </div>

        {/* Nút Tạo lớp gọi hàm onCreateClass */}
        <button
          onClick={onCreateClass}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 active:scale-95"
        >
          <PlusCircle size={20} /> Tạo lớp
        </button>
      </div>
    </div>
  );
};

const PlusCircle = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

export default ClassManagementHeader;
