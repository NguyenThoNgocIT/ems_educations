"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileSpreadsheet,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Edit3,
  Trash2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import AddStudentModal from "./AddStudentModal";
import { ACCOUNT_STATUS, studentsData, STUDY_STATUS } from "./studentData";

const StudentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC PHÂN TRANG (PAGINATION) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Mặc định 20 người/trang

  // 1. Lọc dữ liệu theo Search trước
  const filteredData = useMemo(() => {
    return studentsData.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // 2. Tính toán các chỉ số phân trang
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 3. Cắt mảng dữ liệu để hiển thị trang hiện tại
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="relative flex min-w-[300px] flex-1 items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`rounded-xl border p-2.5 transition-all ${showFilter ? "border-indigo-500 bg-blue-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
          >
            <Filter size={20} />
          </button>

          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tra cứu thông tin"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
            <FileSpreadsheet size={16} /> Xuất Excel
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-2 flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Thêm học viên
          </button>
        </div>
      </div>

      {/* --- TABLE: HIỂN THỊ DỮ LIỆU ĐÃ PHÂN TRANG --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-12 px-6 py-4 text-center">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-4">Thông tin học viên</th>
              <th className="px-6 py-4">Thông tin liên hệ</th>
              <th className="px-6 py-4 text-center">Số buổi đã học</th>
              <th className="px-6 py-4">Lớp học</th>
              <th className="px-6 py-4">Upsell</th>
              <th className="px-6 py-4">Tình trạng học tập</th>
              <th className="px-6 py-4">Trạng thái tài khoản</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {paginatedData.map((student, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* ... (Các cột dữ liệu giữ nguyên như cũ) ... */}
                <td className="px-6 py-5 text-center">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <User size={22} />
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href="#"
                        className="text-sm font-bold text-indigo-700 hover:underline"
                      >
                        {student.name}
                      </Link>
                      <span className="text-[10px] font-bold text-slate-400">
                        {student.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-semibold">
                  <div className="text-indigo-600">{student.phone}</div>
                  <div className="text-slate-400 italic">{student.email}</div>
                </td>
                <td className="text-slate-6 leading-relaxed00 px-6 py-5 text-center text-sm font-semibold">
                  {student.sessions}
                </td>
                <td className="text-slate-6 leading-relaxed00 px-6 py-5 text-sm font-semibold">
                  {student.class}
                </td>
                <td className="px-6 py-5">
                  {student.upsell && (
                    <span className="rounded-lg border border-red-100 bg-red-50 px-3 py-1 text-[10px] font-semibold whitespace-nowrap text-red-500">
                      {student.upsell}
                    </span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-xl border px-3 py-1.5 text-[10px] font-semibold ${STUDY_STATUS[student.studyStatus as keyof typeof STUDY_STATUS].color}`}
                  >
                    {
                      STUDY_STATUS[
                        student.studyStatus as keyof typeof STUDY_STATUS
                      ].label
                    }
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-[100px] items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${ACCOUNT_STATUS[student.accountStatus as keyof typeof ACCOUNT_STATUS].color}`}
                      />
                      <span className="text-sm font-semibold text-emerald-500">
                        {
                          ACCOUNT_STATUS[
                            student.accountStatus as keyof typeof ACCOUNT_STATUS
                          ].label
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <button
                        title="Thông tin"
                        className="hover:text-indigo-600"
                      >
                        <Info size={18} />
                      </button>
                      <button title="Sửa" className="hover:text-indigo-600">
                        <Edit3 size={18} />
                      </button>
                      <button title="Xóa" className="hover:text-rose-500">
                        <Trash2 size={18} />
                      </button>
                      <button
                        title="Khóa tài khoản"
                        className="hover:text-rose-500"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER PHÂN TRANG (PAGINATION FOOTER) --- */}
      <div className="flex flex-col items-center justify-between gap-6 border-t bg-slate-50/10 p-6 md:flex-row dark:border-slate-700">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Hiển thị{" "}
          <span className="text-slate-900 dark:text-white">
            {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          trên tổng số <span className="text-indigo-700">{totalItems}</span> học
          viên
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 text-slate-400 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Render số trang thông minh */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Chỉ hiện 3 trang đầu, trang cuối và trang quanh trang hiện tại
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2)
                return (
                  <span key={i} className="text-slate-300">
                    ...
                  </span>
                );
              return null;
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 text-slate-400 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none rounded-xl border border-slate-100 bg-slate-50 py-1.5 pr-8 pl-4 text-xs font-semibold text-slate-600 outline-none"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentManagement;
