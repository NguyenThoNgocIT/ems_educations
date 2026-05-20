"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { departmentApi } from "@/api/department";
import type { Department } from "@/types/lookup";

export default function DepartmentsPage() {
  return (
    <AdminResourcePage<Department>
      title="Khoa / đơn vị"
      description="Quản lý danh mục khoa và đơn vị đào tạo."
      api={departmentApi as any}
      idKey="departmentId"
      columns={[
        { key: "code", label: "Mã" },
        { key: "name", label: "Tên khoa / đơn vị" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "code", label: "Mã khoa", required: true },
        { key: "name", label: "Tên khoa / đơn vị", required: true },
        { key: "isActive", label: "Đang hoạt động", type: "boolean" },
      ]}
      initialForm={{ isActive: true }}
    />
  );
}
