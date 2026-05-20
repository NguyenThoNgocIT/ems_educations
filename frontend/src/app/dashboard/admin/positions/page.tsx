"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { positionApi, type Position } from "@/api/admin-resources";

export default function PositionsPage() {
  return (
    <AdminResourcePage<Position>
      title="Chức vụ"
      description="Quản lý chức vụ, cấp bậc và phụ cấp theo bộ phận."
      api={positionApi}
      idKey="positionId"
      columns={[
        { key: "code", label: "Mã" },
        { key: "name", label: "Tên chức vụ" },
        { key: "level", label: "Cấp bậc" },
        { key: "allowance", label: "Phụ cấp" },
        { key: "divisionId", label: "Bộ phận" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "code", label: "Mã chức vụ", required: true },
        { key: "name", label: "Tên chức vụ", required: true },
        { key: "level", label: "Cấp bậc" },
        { key: "allowance", label: "Phụ cấp", type: "number" },
        { key: "divisionId", label: "Division ID" },
        { key: "description", label: "Mô tả", type: "textarea" },
        { key: "isActive", label: "Trạng thái", type: "boolean" },
      ]}
      initialForm={{ isActive: true, allowance: 0 }}
    />
  );
}
