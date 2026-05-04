"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateUserModal from "./createUser";
import { Trash2, Edit } from "lucide-react";

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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/v1/users`;
      console.log("Fetching users from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Users fetched:", data);
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(`Lỗi: ${error instanceof Error ? error.message : String(error)}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      
      setUsers(users.filter(u => u.userId !== userId));
      alert("Xóa tài khoản thành công");
    } catch (error) {
      alert("Lỗi khi xóa tài khoản: " + error);
    }
  };

  const handleUserCreated = (newUser: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.userId === newUser.userId ? newUser : u));
    } else {
      setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center py-10">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
        <Button 
          onClick={handleCreateUser}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"
        >
          + Tạo tài khoản
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, username hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-4 text-left text-sm font-semibold">Họ tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Vai trò</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Không có dữ liệu người dùng
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 text-sm">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm">{user.username}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.userId)}
                        className="text-red-600 hover:text-red-700 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onUserCreated={handleUserCreated}
        editingUser={editingUser}
      />
    </div>
  );
}
