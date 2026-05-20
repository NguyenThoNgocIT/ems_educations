"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { semesterApi, type Semester } from "@/api/admin-resources";

export default function SemestersPage() {
  return (
    <AdminResourcePage<Semester>
      title="Học kỳ"
      description="Quản lý học kỳ theo năm học."
      api={semesterApi}
      idKey="semesterId"
      columns={[
        { key: "code", label: "Mã" },
        { key: "name", label: "Tên học kỳ" },
        { key: "schoolYearId", label: "Năm học" },
        { key: "startDate", label: "Bắt đầu" },
        { key: "endDate", label: "Kết thúc" },
        { key: "status", label: "Đang diễn ra" },
      ]}
      fields={[
        { key: "code", label: "Mã học kỳ", required: true },
        { key: "name", label: "Tên học kỳ", required: true },
        { key: "schoolYearId", label: "School Year ID" },
        { key: "startDate", label: "Ngày bắt đầu", type: "date" },
        { key: "endDate", label: "Ngày kết thúc", type: "date" },
        { key: "status", label: "Đang diễn ra", type: "boolean" },
        { key: "description", label: "Mô tả", type: "textarea" },
        { key: "isActive", label: "Trạng thái", type: "boolean" },
      ]}
      initialForm={{ isActive: true, status: false }}
    />
  );
}
