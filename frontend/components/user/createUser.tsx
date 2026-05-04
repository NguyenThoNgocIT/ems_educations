"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

interface User {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Locked" | "Inactive";
  lastLogin: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
  editingUser?: User | null;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
  editingUser = null,
}: CreateUserModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "Student",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setForm({
          fullName: editingUser.fullName,
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          password: "",
        });
      } else {
        setForm({
          fullName: "",
          username: "",
          email: "",
          phone: "",
          role: "Student",
          password: "",
        });
      }
    }
  }, [isOpen, editingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingUser 
        ? `${API_URL}/api/v1/users/${editingUser.userId}`
        : `${API_URL}/api/v1/users`;

      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
          ...( !editingUser && { password: form.password } ),
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi gọi API");

      const result = await res.json();

      onUserCreated(result);
      onClose();
    } catch (error) {
      alert("Kết nối Backend thất bại: " + error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">
            {editingUser ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={loading}>
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label>Họ và tên <span className="text-red-500">*</span></Label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Username <span className="text-red-500">*</span></Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          {!editingUser && (
            <div>
              <Label>Mật khẩu <span className="text-red-500">*</span></Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
          )}

          <div>
            <Label>Vai trò <span className="text-red-500">*</span></Label>
            <Select value={form.role} onValueChange={(v: string) => setForm({ ...form, role: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student (Học sinh)</SelectItem>
                <SelectItem value="Giảng viên">Giảng viên</SelectItem>
                <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-2xl" disabled={loading}>
              {loading ? "Đang xử lý..." : editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}