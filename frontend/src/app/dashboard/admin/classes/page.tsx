"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { administrativeClassApi } from "@/api/administrative-class";
import type { AdministrativeClass } from "@/types/lookup";

export default function AdministrativeClassesPage() {
  return (
    <AdminResourcePage<AdministrativeClass>
      title="Lớp hành chính"
      description="Quản lý lớp hành chính theo khoa và khóa đào tạo."
      api={administrativeClassApi as any}
      idKey="classId"
      columns={[
        { key: "classCode", label: "Mã lớp" },
        { key: "className", label: "Tên lớp" },
        { key: "departmentId", label: "Khoa" },
        { key: "academicCohortId", label: "Khóa" },
        { key: "maxSize", label: "Sĩ số tối đa" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "classCode", label: "Mã lớp", required: true },
        { key: "className", label: "Tên lớp", required: true },
        { key: "departmentId", label: "Department ID" },
        { key: "academicCohortId", label: "Academic Cohort ID" },
        { key: "advisorId", label: "Advisor ID" },
        { key: "maxSize", label: "Sĩ số tối đa", type: "number" },
        { key: "status", label: "Trạng thái số", type: "number" },
        { key: "note", label: "Ghi chú", type: "textarea" },
        { key: "isActive", label: "Đang hoạt động", type: "boolean" },
      ]}
      initialForm={{ isActive: true, maxSize: 50, status: 1 }}
    />
  );
}
