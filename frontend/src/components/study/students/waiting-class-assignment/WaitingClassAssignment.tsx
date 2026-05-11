"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Info,
  RefreshCw,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Filter,
  Check,
} from "lucide-react";
import { waitingData } from "./waitingData";
import ClassAssignmentModal from "./ClassAssignmentModal";

const WaitingClassAssignment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 🆕 LOGIC CHỌN HỌC VIÊN ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const itemsPerPage = 20;

  const filteredData = useMemo(() => {
    return waitingData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Hàm chọn/hủy chọn từng người
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Hàm chọn/hủy chọn tất cả ở trang hiện tại
  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((item) => item.id);
    const isAllSelected = currentPageIds.every((id) =>
      selectedIds.includes(id),
    );

    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...currentPageIds])),
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: NÚT XẾP LỚP ĐÃ CÓ LOGIC --- */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-50 p-5 dark:border-slate-700">
        <div className="flex flex-1 items-center gap-3">
          <button className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400">
            <Filter size={20} />
          </button>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        {/* Nút chỉ sáng lên khi đã chọn ít nhất 1 người */}
        <button
          onClick={() => selectedIds.length > 0 && setIsModalOpen(true)}
          disabled={selectedIds.length === 0}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-95 ${
            selectedIds.length > 0
              ? "bg-blue-600 shadow-blue-500/20"
              : "cursor-not-allowed bg-slate-300 shadow-none"
          }`}
        >
          <LayoutGrid size={18} />
          Xếp lớp {selectedIds.length > 0 && `(${selectedIds.length})`}
        </button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-12 px-6 py-4 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((item) => selectedIds.includes(item.id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4">Thông tin học viên</th>
              <th className="px-6 py-4">Tư vấn viên</th>
              <th className="px-6 py-4">Chương trình</th>
              <th className="px-6 py-4 text-center">Số tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4">Ngày đăng ký</th>
              <th className="px-6 py-4">Người tạo</th>
              <th className="w-10 px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className={`group transition-colors ${selectedIds.includes(item.id) ? "bg-blue-50/30" : "hover:bg-slate-50/20"}`}
              >
                <td className="px-6 py-6 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                  />
                </td>
                {/* ... (Các cột thông tin học viên giữ nguyên như bản cũ) ... */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-50">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-slate-900">
                  {item.consultant}
                </td>
                <td className="px-6 py-6 font-semibold text-indigo-700">
                  {item.program}
                </td>
                <td className="px-6 py-6 text-center font-semibold">
                  {item.amount}
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="rounded-lg bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-6 font-bold text-slate-600">
                  {item.regDate}
                </td>
                <td className="px-6 py-6 font-semibold text-indigo-600">
                  {item.creator}
                </td>
                <td className="px-4 py-6">
                  <Info size={18} className="text-slate-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClassAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCount={selectedIds.length}
      />
    </div>
  );
};

export default WaitingClassAssignment;
