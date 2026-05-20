"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { schoolYearApi, type SchoolYear } from "@/api/admin-resources";

export default function SchoolYearsPage() {
  return (
    <AdminResourcePage<SchoolYear>
      title="Năm học"
      description="Quản lý năm học và khoảng thời gian đào tạo."
      api={schoolYearApi}
      idKey="schoolYearId"
      columns={[
        { key: "code", label: "Mã" },
        { key: "name", label: "Tên năm học" },
        { key: "startDate", label: "Bắt đầu" },
        { key: "endDate", label: "Kết thúc" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "code", label: "Mã năm học", required: true },
        { key: "name", label: "Tên năm học", required: true },
        { key: "schoolYearName", label: "Tên hiển thị" },
        { key: "startDate", label: "Ngày bắt đầu", type: "date" },
        { key: "endDate", label: "Ngày kết thúc", type: "date" },
        { key: "description", label: "Mô tả", type: "textarea" },
        { key: "note", label: "Ghi chú", type: "textarea" },
        { key: "isActive", label: "Trạng thái", type: "boolean" },
      ]}
      initialForm={{ isActive: true }}
    />
  );
}
