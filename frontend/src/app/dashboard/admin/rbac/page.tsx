'use client';

import React, { useState } from 'react';
import { Key, Menu, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { RolesTab } from '@/components/rbac/roles-tab';
import { PermissionsTab } from '@/components/rbac/permissions-tab';
import { MenusTab } from '@/components/rbac/menus-tab';
import { UsersTab } from '@/components/rbac/users-tab';

type TabId = 'roles' | 'permissions' | 'menus' | 'users';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: TabConfig[] = [
  { id: 'permissions', label: 'Quyền hạn', icon: <Key size={16} />, description: 'Tạo quyền nghiệp vụ và gắn endpoint API được bảo vệ.' },
  { id: 'menus', label: 'Menu', icon: <Menu size={16} />, description: 'Gắn quyền cho menu để sidebar tự lọc theo người dùng.' },
  { id: 'roles', label: 'Vai trò', icon: <ShieldCheck size={16} />, description: 'Gom nhiều quyền thành vai trò như Admin, Staff, Giảng viên, Sinh viên.' },
  { id: 'users', label: 'Người dùng', icon: <Users size={16} />, description: 'Gán một hoặc nhiều vai trò cho từng tài khoản người dùng.' },
];

const WORKFLOW = [
  { title: '1. Quyền', text: 'Quyền đại diện cho hành động nghiệp vụ: xem, tạo, sửa, xóa.', icon: <Key size={16} /> },
  { title: '2. API', text: 'Mỗi quyền có thể bảo vệ nhiều endpoint tương ứng.', icon: <ShieldCheck size={16} /> },
  { title: '3. Menu', text: 'Menu gắn với quyền để tự ẩn/hiện trên sidebar.', icon: <Menu size={16} /> },
  { title: '4. Vai trò & người dùng', text: 'Vai trò giữ nhiều quyền, người dùng nhận quyền qua vai trò.', icon: <Users size={16} /> },
];

export default function RBACPage() {
  const [activeTab, setActiveTab] = useState<TabId>('roles');
  const [refreshKey, setRefreshKey] = useState(0);
  const [usersSearchPayload, setUsersSearchPayload] = useState('');
  const activeConfig = TABS.find(tab => tab.id === activeTab)!;

  const handleNavigateToUsers = (roleCode: string) => {
    setUsersSearchPayload(`role:${roleCode}`);
    setActiveTab('users');
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <ShieldCheck size={20} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản trị phân quyền RBAC</h1>
          </div>
          <p className="ml-11 text-sm text-gray-500 dark:text-gray-400">{activeConfig.description}</p>
        </div>
        <button
          onClick={() => setRefreshKey(key => key + 1)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {WORKFLOW.map(item => (
          <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span className="text-emerald-600">{item.icon}</span>
              {item.title}
            </div>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="flex w-fit flex-wrap gap-1.5 rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800/60">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'border border-emerald-100 bg-white text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-gray-900 dark:text-emerald-400'
                : 'text-gray-500 hover:bg-white/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-emerald-600' : ''}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div key={`${activeTab}-${refreshKey}`}>
        {activeTab === 'roles' && <RolesTab onNavigateToUsers={handleNavigateToUsers} />}
        {activeTab === 'permissions' && <PermissionsTab />}
        {activeTab === 'menus' && <MenusTab />}
        {activeTab === 'users' && <UsersTab initialSearch={usersSearchPayload} />}
      </div>
    </div>
  );
}
