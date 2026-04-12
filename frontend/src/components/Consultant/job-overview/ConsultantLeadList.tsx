"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Bell,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { MOCK_LEADS as INITIAL_LEADS } from "./consultant_data";

interface Props {
  onBack: () => void;
}

const ConsultantLeadList = ({ onBack }: Props) => {
  // 1. Dùng useState cho data để có thể cập nhật trạng thái
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // 2. Logic cập nhật trạng thái mới
  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedLeads = [...leads];
    updatedLeads[index].status = newStatus;
    setLeads(updatedLeads);
    setOpenDropdownId(null); // Đóng dropdown sau khi chọn
  };

  // 3. LOGIC ĐẾM SỐ LƯỢNG TỰ ĐỘNG CẬP NHẬT THEO STATE 'leads'
  const counts = useMemo(() => {
    return leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [leads]);

  const statusFilters = [
    { label: "Tất cả", count: leads.length, color: "bg-blue-600" },
    {
      label: "Đã tư vấn",
      count: counts["Đã tư vấn"] || 0,
      color: "bg-blue-500",
    },
    {
      label: "Từ chối học",
      count: counts["Từ chối học"] || 0,
      color: "bg-slate-500",
    },
    {
      label: "Sai thông tin",
      count: counts["Sai thông tin"] || 0,
      color: "bg-red-500",
    },
    {
      label: "Đã liên hệ",
      count: counts["Đã liên hệ"] || 0,
      color: "bg-blue-400",
    },
    { label: "Spam", count: counts["Spam"] || 0, color: "bg-red-600" },
    {
      label: "Cần tư vấn",
      count: counts["Cần tư vấn"] || 0,
      color: "bg-orange-500",
    },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      const matchesStatus =
        activeFilter === "Tất cả" || lead.status === activeFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, activeFilter]);

  return (
    <div className="animate-in slide-in-from-right min-h-screen space-y-4 pb-20 duration-300">
      {/* 1. Bộ lọc trạng thái - Tự động cập nhật số lượng khi đổi status bên dưới */}
      <div className="mb-4 flex flex-wrap gap-2">
        {statusFilters.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(f.label)}
            className={`rounded-md border px-3 py-1 text-xs font-bold transition-all ${
              activeFilter === f.label
                ? `${f.color} border-transparent text-white`
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* 2. Thanh công cụ */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm md:flex-row">
        <div className="flex w-full items-center gap-2 md:w-auto">
          <button
            onClick={onBack}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative flex-1 md:flex-none">
            <Search
              className="absolute top-2.5 left-3 text-slate-400"
              size={16}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 md:w-80"
              placeholder="Tìm kiếm..."
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-sm font-bold text-white">
            <Bell size={16} /> Thông báo
          </button>
          <button className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-bold text-white">
            <Download size={16} /> Export excel
          </button>
          <button className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white">
            <Plus size={16} /> Thêm
          </button>
        </div>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="rounded-lg border border-slate-100 bg-white shadow-sm">
        <div className="overflow-visible">
          {" "}
          {/* Để dropdown không bị che */}
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="p-4">Thông tin</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Tư vấn viên</th>
                <th className="p-4">Cập nhật</th>
                <th className="p-4 text-center">Chức năng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead, i) => (
                <tr
                  key={i}
                  className="group transition-colors hover:bg-blue-50/20"
                >
                  <td className="p-4">
                    <p className="font-bold text-indigo-700">
                      {lead.name}
                    </p>
                    <p className="mt-1 text-slate-400 leading-relaxed">SĐT: {lead.phone}</p>
                  </td>

                  {/* CỘT TRẠNG THÁI CÓ DROPDOWN CHỌN */}
                  <td className="relative p-4">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() =>
                          setOpenDropdownId(openDropdownId === i ? null : i)
                        }
                        className={`flex items-center gap-2 rounded px-3 py-1 font-bold text-white shadow-sm transition-all hover:brightness-110 ${
                          lead.status === "Cần tư vấn"
                            ? "bg-orange-500"
                            : lead.status === "Đã liên hệ"
                              ? "bg-blue-500"
                              : "bg-slate-500"
                        }`}
                      >
                        {lead.status.toUpperCase()} <ChevronDown size={14} />
                      </button>

                      {/* DROPDOWN MENU - GIỐNG ẢNH BẠN GỬI */}
                      {openDropdownId === i && (
                        <div className="ring-opacity-5 animate-in zoom-in-95 absolute left-0 z-[100] mt-2 w-48 rounded-md bg-white p-1 shadow-2xl ring-1 ring-black duration-100">
                          {statusFilters
                            .filter((f) => f.label !== "Tất cả")
                            .map((status) => (
                              <button
                                key={status.label}
                                onClick={() =>
                                  handleStatusChange(i, status.label)
                                }
                                className={`mb-1 w-full rounded-sm px-4 py-2 text-left text-[11px] font-bold text-white transition-colors ${status.color} hover:brightness-90`}
                              >
                                {status.label.toUpperCase()}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-medium">
                    <p className="font-bold text-slate-900 underline leading-relaxed">
                      Phan Hải Bình
                    </p>
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    <p className="font-bold text-indigo-700">Admin</p>
                    <p>14:37 28/08/2024</p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Eye
                        size={18}
                        className="cursor-pointer text-yellow-500 hover:scale-110"
                      />
                      <Trash2
                        size={18}
                        className="cursor-pointer text-red-500 hover:scale-110"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultantLeadList;


