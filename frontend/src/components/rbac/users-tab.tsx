import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Users,
  Settings2,
  UserCircle,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { roleApi, userRoleApi } from '@/api/rbac';
import type { Role, UserWithRoles } from '@/types/rbac';
import { SkeletonRow, EmptyState, ActionMenu, ActionMenuItem } from './shared';

export function UsersTab() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [modal, setModal] = useState<{ mode: 'assign' | 'remove'; user?: UserWithRoles; removeRoleId?: string } | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchDebounced(search), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const fetchRoles = useCallback(async () => {
    try {
      const res: any = await roleApi.getAll();
      setAllRoles(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { /* silent */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await userRoleApi.searchUsers({
        keyword: searchDebounced || undefined,
        size: 20,
      });
      const list = Array.isArray(res?.data?.content) ? res.data.content
        : Array.isArray(res?.content) ? res.content
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res) ? res : [];
      setUsers(list);
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [searchDebounced]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAssign = async (user: UserWithRoles) => {
    setSelectedRoleIds(user.roles?.map(r => r.id || r.roleId!).filter(Boolean) || []);
    setModal({ mode: 'assign', user });
  };

  const closeModal = () => setModal(null);

  const handleSaveRoles = async () => {
    if (!modal?.user) return;
    setSaving(true);
    try {
      await userRoleApi.updateUserRoles(modal.user.id, selectedRoleIds);
      toast.success('Cập nhật vai trò thành công');
      closeModal();
      await fetchUsers();
    } catch {
      toast.error('Cập nhật vai trò thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickRemoveRole = async (user: UserWithRoles, roleId: string) => {
    setSaving(true);
    try {
      const remaining = user.roles.filter(r => (r.id || r.roleId) !== roleId).map(r => r.id || r.roleId!);
      await userRoleApi.updateUserRoles(user.id, remaining);
      toast.success('Đã xóa vai trò');
      await fetchUsers();
    } catch {
      toast.error('Xóa vai trò thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo email, username, tên..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Người dùng</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vai trò hiện tại</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                : users.length === 0
                ? (
                  <tr><td colSpan={4}>
                    <EmptyState
                      icon={<Users size={32} />}
                      title={searchDebounced ? 'Không tìm thấy người dùng' : 'Nhập tên/email để tìm kiếm'}
                      description={searchDebounced ? `Không có kết quả cho "${searchDebounced}"` : 'Tìm kiếm user để xem và quản lý vai trò của họ'}
                    />
                  </td></tr>
                )d
                : users.map((user, userIndex) => (
                  <tr key={user.id ?? user.email ?? user.username ?? userIndex} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {(user.fullName || user.username || user.email || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullName || user.username || '—'}</p>
                          {user.username && user.fullName && <p className="text-xs text-gray-400">@{user.username}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{user.email || '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles?.length > 0
                          ? user.roles.map((role, roleIndex) => {
                            const rId = role.id || role.roleId || role.code || role.name || `role-${roleIndex}`;
                            return (
                            <span
                              key={rId}
                              className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 group"
                            >
                              {role.name}
                              <button
                                onClick={() => rId && handleQuickRemoveRole(user, rId)}
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-emerald-400 hover:text-red-500 transition"
                                title={`Xóa vai trò ${role.name}`}
                              >
                                <X size={9} />
                              </button>
                            </span>
                          )})
                          : <span className="text-xs text-gray-400 italic">Chưa có vai trò</span>
                        }
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ActionMenu>
                        <ActionMenuItem icon={<Settings2 size={14} />} label="Quản lý vai trò" onClick={() => openAssign(user)} />
                      </ActionMenu>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Assign Roles */}
      <Modal isOpen={modal?.mode === 'assign'} onClose={closeModal} className="max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
              <UserCircle size={20} className="text-teal-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Quản lý vai trò</h2>
              <p className="text-xs text-gray-400">
                Người dùng: <span className="font-semibold text-teal-600">{modal?.user?.fullName || modal?.user?.username || modal?.user?.email}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {allRoles.map((role, roleIndex) => {
              const rId = role.id || role.roleId || role.code || `role-${roleIndex}`;
              return (
              <label
                key={rId}
                className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-teal-200 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 cursor-pointer transition"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                  selectedRoleIds.includes(rId)
                    ? 'bg-teal-500 border-teal-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedRoleIds.includes(rId) && <Check size={11} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedRoleIds.includes(rId)}
                  onChange={() => setSelectedRoleIds(prev =>
                    prev.includes(rId) ? prev.filter(x => x !== rId) : [...prev, rId]
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{role.name}</p>
                  {role.description && <p className="text-xs text-gray-400 truncate">{role.description}</p>}
                </div>
                {role.userCount !== undefined && (
                  <span className="text-xs text-gray-400">{role.userCount} user</span>
                )}
              </label>
            )})}
          </div>

          <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition">Hủy</button>
            <button
              onClick={handleSaveRoles}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition"
            >
              {saving && <RefreshCw size={13} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
