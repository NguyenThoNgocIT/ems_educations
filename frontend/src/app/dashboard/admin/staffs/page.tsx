"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { staffApi, type Staff } from "@/api/admin-resources";

export default function StaffsPage() {
  return (
    <AdminResourcePage<Staff>
      title="Nhân viên hành chính"
      description="Quản lý hồ sơ nhân viên hành chính và tài khoản được tạo tự động."
      api={staffApi}
      idKey="employeeId"
      columns={[
        { key: "staffCode", label: "Mã NVHC" },
        { key: "employeeCode", label: "Mã nhân viên" },
        { key: "fullName", label: "Họ tên" },
        { key: "divisionId", label: "Phòng ban", render: (row) => row.divisionId ? "Đã liên kết" : "—" },
        { key: "positionId", label: "Chức vụ", render: (row) => row.positionId ? "Đã liên kết" : "—" },
        { key: "isActive", label: "Trạng thái" },
      ]}
      fields={[
        { key: "fullName", label: "Họ tên", required: true },
        { key: "fullNameNoAccent", label: "Tên không dấu" },
        { key: "dateOfBirth", label: "Ngày sinh", type: "date", required: true },
        { key: "gender", label: "Giới tính" },
        { key: "employeeCode", label: "Mã nhân viên" },
        { key: "staffCode", label: "Mã NVHC" },
        { key: "startWorkDate", label: "Ngày bắt đầu", type: "date" },
        { key: "endWorkDate", label: "Ngày kết thúc", type: "date" },
        { key: "contractType", label: "Loại hợp đồng" },
        { key: "divisionId", label: "Division ID", required: true },
        { key: "positionId", label: "Position ID" },
        { key: "contactEmail", label: "Email liên hệ" },
        { key: "phoneNumber", label: "Số điện thoại" },
        { key: "note", label: "Ghi chú", type: "textarea" },
        { key: "isActive", label: "Đang hoạt động", type: "boolean" },
      ]}
      initialForm={{ isActive: true }}
    />
  );
}
