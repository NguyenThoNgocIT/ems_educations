"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  FileSpreadsheet,
  ArrowUpToLine,
  Plus,
  User,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { staffData, UserRole } from "./staffData";
import AddStaffModal from "./AddStaffModal";
import ImportStaffModal from "./ImportStaffModal";

const StaffList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // --- LOGIC ROLE COLOR (Chỉnh lại Role cho trực quan) ---
  const getRoleStyle = (role: UserRole, isAdmin?: boolean) => {
    if (isAdmin) return "bg-[#22C55E] text-white"; // Admin - Xanh lá
    switch (role) {
      case "Giáo viên":
        return "bg-[#3B82F6] text-white"; // Xanh dương
      case "Tư vấn viên":
        return "bg-[#F59E0B] text-white"; // Vàng
      default:
        return "bg-[#8B5CF6] text-white"; // Nhân viên - Tím
    }
  };

  const filteredData = useMemo(() => {
    return staffData.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER HOẠT ĐỘNG TẤT CẢ CÁC NÚT --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          <button className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 hover:bg-blue-50">
            <Filter size={20} />
          </button>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tìm tên, mã hoặc email nhân sự..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Đã xuất file Excel nhân sự!")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
          >
            <FileSpreadsheet size={16} /> Export
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
          >
            <ArrowUpToLine size={16} /> Import
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="ml-2 flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      {/* --- BẢNG DANH SÁCH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-6 py-4 text-center">+</th>
              <th className="px-6 py-4">Thông tin nhân sự</th>
              <th className="px-6 py-4">Email liên hệ</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Chức vụ (Role)</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.map((staff, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-slate-50/20"
              >
                <td className="px-6 py-6 text-center font-bold text-slate-300">
                  +
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-50 dark:bg-slate-800">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {staff.name}
                      </span>
                      <span className="text-[10px] font-bold tracking-tight text-slate-400">
                        {staff.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-indigo-600 italic">
                  {staff.email}
                </td>
                <td className="px-6 py-6 font-bold text-slate-600 dark:text-slate-400">
                  {staff.phone}
                </td>
                <td className="px-6 py-6">
                  <span
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-bold shadow-sm ${getRoleStyle(staff.role, staff.isAdmin)}`}
                  >
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="text-slate-400 hover:text-indigo-600">
                      <Edit3 size={18} />
                    </button>
                    <button className="text-slate-400 hover:text-rose-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStaffModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ImportStaffModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
};

export default StaffList;
