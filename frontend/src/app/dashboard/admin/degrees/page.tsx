"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { degreeApi } from "@/api/degree";
import type { Degree } from "@/types/lookup";

export default function DegreesPage() {
  return (
    <AdminResourcePage<Degree>
      title="Bằng cấp / học vị"
      description="Quản lý học vị, chuyên ngành và thông tin đào tạo của nhân sự."
      api={degreeApi as any}
      idKey="degreeId"
      columns={[
        { key: "code", label: "Mã" },
        { key: "name", label: "Tên học vị" },
        { key: "majorId", label: "Ngành" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "code", label: "Mã học vị", required: true },
        { key: "name", label: "Tên học vị", required: true },
        { key: "majorId", label: "Major ID" },
        { key: "isActive", label: "Đang hoạt động", type: "boolean" },
      ]}
      initialForm={{ isActive: true }}
    />
  );
}
