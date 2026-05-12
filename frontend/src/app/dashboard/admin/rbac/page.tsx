"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import {
  ShieldCheck,
  UserPlus,
  Settings,
  Trash2,
  Lock,
  Search,
  Plus,
} from "lucide-react";

// Mock data for roles and permissions
const MOCK_ROLES = [
  {
    id: "1",
    name: "ADMIN",
    description: "Toàn quyền hệ thống",
    userCount: 3,
    permissions: ["READ_ALL", "WRITE_ALL", "DELETE_ALL", "MANAGE_USERS"],
  },
  {
    id: "2",
    name: "BRANCH_MANAGER",
    description: "Quản lý tại chi nhánh",
    userCount: 5,
    permissions: ["READ_BRANCH", "WRITE_BRANCH", "MANAGE_STUDENTS"],
  },
  {
    id: "3",
    name: "TEACHER",
    description: "Giảng viên - xem lịch và nhập điểm",
    userCount: 12,
    permissions: ["READ_SCHEDULE", "WRITE_GRADES"],
  },
  {
    id: "4",
    name: "STUDENT",
    description: "Sinh viên - xem thông tin đào tạo",
    userCount: 150,
    permissions: ["READ_OWN_INFO", "REGISTER_COURSE"],
  },
];

const ALL_PERMISSIONS = [
  "READ_ALL",
  "WRITE_ALL",
  "DELETE_ALL",
  "MANAGE_USERS",
  "READ_BRANCH",
  "WRITE_BRANCH",
  "MANAGE_STUDENTS",
  "READ_SCHEDULE",
  "WRITE_GRADES",
  "READ_OWN_INFO",
  "REGISTER_COURSE",
];

export default function RBACPage() {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const handleOpenModal = (role: any = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        description: "",
        permissions: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (perm: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id ? { ...r, ...formData } : r
        )
      );
    } else {
      setRoles([
        ...roles,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          userCount: 0,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRole = () => {
    setRoles(roles.filter((r) => r.id !== roleToDelete.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1240px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" />
            Phân quyền hệ thống (RBAC)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Quản lý vai trò và các quyền truy cập tương ứng
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          startIcon={<UserPlus size={18} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Tạo vai trò mới
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table className="text-left w-full border-collapse">
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableCell isHeader className="p-4 text-slate-600 dark:text-slate-300 font-semibold">Vai trò</TableCell>
              <TableCell isHeader className="p-4 text-slate-600 dark:text-slate-300 font-semibold">Mô tả</TableCell>
              <TableCell isHeader className="p-4 text-slate-600 dark:text-slate-300 font-semibold text-center">Người dùng</TableCell>
              <TableCell isHeader className="p-4 text-slate-600 dark:text-slate-300 font-semibold">Quyền hạn</TableCell>
              <TableCell isHeader className="p-4 text-slate-600 dark:text-slate-300 font-semibold text-right">Thao tác</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="p-4">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{role.name}</span>
                </TableCell>
                <TableCell className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                  {role.description}
                </TableCell>
                <TableCell className="p-4 text-center">
                  <Badge color="info" variant="light" size="sm">
                    {role.userCount} thành viên
                  </Badge>
                </TableCell>
                <TableCell className="p-4 overflow-hidden">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {role.permissions.map((perm) => (
                      <Badge key={perm} color="primary" variant="light" size="sm">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(role)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setRoleToDelete(role);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-error-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal create/edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-xl"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Lock className="text-indigo-600" />
            {editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tên vai trò
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Ví dụ: ADMIN, TEACHER..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mô tả
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[80px]"
                placeholder="Mô tả quyền hạn của vai trò này"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Danh sách quyền hạn
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      checked={formData.permissions.includes(perm)}
                      onChange={() => handleTogglePermission(perm)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {perm}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="light" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                {editingRole ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-error-50 dark:bg-error-900/20 text-error-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Xác nhận xóa?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Bạn có chắc chắn muốn xóa vai trò <span className="font-bold text-slate-800 dark:text-white">{roleToDelete?.name}</span>? 
            Hành động này không thể hoàn tác và có thể ảnh hưởng đến người dùng thuộc vai trò này.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-error-600 hover:bg-error-700 text-white" onClick={handleDeleteRole}>
              Xác nhận xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
