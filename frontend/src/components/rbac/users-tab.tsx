import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, Key, RefreshCw, Search, ShieldCheck, UserPlus, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { AddUserModal } from './add-user-modal';
import { useAuth } from '@/context/AuthContext';
import { roleApi, userRoleApi } from '@/api/rbac';
import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { fixMojibakeText } from '@/utils/text';
import type { Permission, Role, UserWithRoles } from '@/types/rbac';
import { EmptyState, MethodBadge, UserTableSkeleton, parseUserList, useDebounce } from './shared';

interface UsersTabProps {
  initialSearch?: string;
}

type UserRow = UserWithRoles & {
  userId?: string;
  displayCode?: string;
  accountType?: string;
  fullNameNoAccent?: string;
  requirePasswordChange?: boolean;
  emailConfirmed?: boolean;
  isActive?: boolean;
};

const userIdOf = (user: UserRow) => user.id || user.userId || '';
const roleIdOf = (role: Role) => role.id || role.roleId || '';

function normalizeUser(raw: any, roles: Role[]): UserRow {
  const roleObjects = Array.isArray(raw.roles)
    ? raw.roles.map((role: any) => {
        if (typeof role === 'string') {
          return roles.find(item => item.code === role || item.name === role) || { code: role, name: role };
        }
        return role;
      })
    : [];

  return {
    ...raw,
    id: raw.id || raw.userId || '',
    userId: raw.userId || raw.id || '',
    fullName: fixMojibakeText(raw.fullName),
    fullNameNoAccent: fixMojibakeText(raw.fullNameNoAccent),
    email: fixMojibakeText(raw.email),
    username: fixMojibakeText(raw.username),
    displayCode: fixMojibakeText(raw.displayCode),
    accountType: fixMojibakeText(raw.accountType),
    roles: roleObjects.map((role: Role) => ({
      ...role,
      name: fixMojibakeText(role.name),
      description: fixMojibakeText(role.description),
    })),
  };
}

function roleLabel(code?: string) {
  if (code === 'ADMIN') return 'Quản trị viên';
  if (code === 'SUPER_ADMIN') return 'Quản trị cấp cao';
  if (code === 'LECTURER') return 'Giảng viên';
  if (code === 'STAFF') return 'Nhân viên';
  if (code === 'STUDENT') return 'Sinh viên';
  return code || 'Vai trò';
}

export function UsersTab({ initialSearch = '' }: UsersTabProps) {
  const [rawUsers, setRawUsers] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [modalUser, setModalUser] = useState<UserRow | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());
  const [roleSearch, setRoleSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { user: authUser, refreshUser } = useAuth();

  const users = useMemo(
    () => rawUsers.map(user => normalizeUser(user, allRoles)),
    [rawUsers, allRoles],
  );

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const roles = await roleApi.getAllWithPermissions();
      setAllRoles(roles.map(role => ({
        ...role,
        name: fixMojibakeText(role.name),
        description: fixMojibakeText(role.description),
        permissions: role.permissions?.map(permission => ({
          ...permission,
          name: fixMojibakeText(permission.name),
          description: fixMojibakeText(permission.description),
          module: fixMojibakeText(permission.module),
        })),
      })));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách vai trò');
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const keyword = debouncedSearch.startsWith('role:') ? undefined : debouncedSearch || undefined;
      const response = await userRoleApi.searchUsers({ keyword, size: 100 });
      setRawUsers(parseUserList(response));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  const activeRoleFilter = debouncedSearch.startsWith('role:')
    ? debouncedSearch.replace('role:', '').trim().toUpperCase()
    : '';

  const visibleUsers = useMemo(() => {
    if (!activeRoleFilter) return users;
    return users.filter(user => user.roles.some(role => role.code?.toUpperCase() === activeRoleFilter));
  }, [users, activeRoleFilter]);

  const selectedRoles = useMemo(() => {
    return allRoles.filter(role => {
      const id = roleIdOf(role);
      return id && selectedRoleIds.has(id);
    });
  }, [allRoles, selectedRoleIds]);

  const inheritedPermissions = useMemo(() => {
    const map = new Map<string, Permission>();
    selectedRoles.forEach(role => {
      role.permissions?.forEach(permission => {
        const id = permission.id || permission.permissionId || permission.code;
        if (id && !map.has(id)) map.set(id, permission);
      });
    });
    return Array.from(map.values());
  }, [selectedRoles]);

  const endpointCount = inheritedPermissions.reduce((total, permission) => total + (permission.apis?.length || permission.apiCount || 0), 0);

  const filteredRoles = useMemo(() => {
    const keyword = roleSearch.trim().toLowerCase();
    if (!keyword) return allRoles;
    return allRoles.filter(role =>
      role.code.toLowerCase().includes(keyword) ||
      role.name.toLowerCase().includes(keyword) ||
      role.description?.toLowerCase().includes(keyword),
    );
  }, [allRoles, roleSearch]);

  const openAssign = (user: UserRow) => {
    const selected = new Set<string>();
    user.roles.forEach(role => {
      const matched = allRoles.find(item => item.code === role.code || roleIdOf(item) === roleIdOf(role));
      const id = matched ? roleIdOf(matched) : roleIdOf(role);
      if (id) selected.add(id);
    });
    setSelectedRoleIds(selected);
    setRoleSearch('');
    setModalUser(user);
  };

  const closeModal = () => setModalUser(null);

  const toggleRole = (role: Role) => {
    const id = roleIdOf(role);
    if (!id) return;
    setSelectedRoleIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const saveRoles = async () => {
    if (!modalUser) return;
    if (selectedRoleIds.size === 0 && !window.confirm('Tài khoản sẽ không còn vai trò nào. Bạn muốn tiếp tục?')) {
      return;
    }

    setSaving(true);
    try {
      const userId = userIdOf(modalUser);
      const roleIds = Array.from(selectedRoleIds);
      await userRoleApi.updateUserRoles(userId, roleIds);

      const updatedRoleCodes = allRoles
        .filter(role => selectedRoleIds.has(roleIdOf(role)))
        .map(role => role.code);
      setRawUsers(prev => prev.map(user => {
        const id = user.id || user.userId;
        return id === userId ? { ...user, roles: updatedRoleCodes } : user;
      }));

      if (modalUser.email === authUser?.email || modalUser.username === authUser?.username || userId === authUser?.id) {
        await refreshUser();
      }
      toast.success('Đã cập nhật vai trò cho tài khoản');
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Cập nhật vai trò thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsers = async (userData: any) => {
    setLoading(true);
    try {
      const payload = {
        fullName: userData.fullName,
        fullNameNoAccent: userData.fullNameNoAccent,
        dateOfBirth: userData.dob,
        gender: userData.gender || undefined,
        phoneNumber: userData.phoneNumber || undefined,
        contactEmail: userData.contactEmail || undefined,
        avatarUrl: userData.avatar || undefined,
        departmentId: userData.departmentId || undefined,
        majorId: userData.majorId || undefined,
        trainingProgramId: userData.trainingProgramId || undefined,
        academicCohortId: userData.academicCohortId || undefined,
        divisionId: userData.divisionId || undefined,
        positionId: userData.positionId || undefined,
      };

      const endpoint = userData.isStudent
        ? '/api/v1/students/admin'
        : userData.isLecturer
          ? '/api/v1/instructors/admin'
          : '/api/v1/staffs/admin';

      const response = await request.post(endpoint, payload);
      const account: any = unwrapApiResponse(response);
      const userId = account?.userId;
      if (!userId) {
        throw new Error('Backend chưa trả về userId sau khi tạo tài khoản');
      }

      const roleIds = Array.from(new Set<string>((userData.roles || []).map(String))).filter(Boolean);
      if (roleIds.length > 0) {
        await userRoleApi.updateUserRoles(userId, roleIds);
      }

      toast.success(`Đã tạo tài khoản ${account.emailEdu || userData.fullName}`);
      setIsAddUserModalOpen(false);
      await fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Không thể tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <UserPlus size={16} /> Tạo tài khoản theo đối tượng
          </div>
          <p className="text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
            Admin tạo sinh viên, giảng viên hoặc nhân viên. Backend tự sinh mã, email edu, tài khoản và mật khẩu ban đầu.
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
            <ShieldCheck size={16} /> Gán vai trò
          </div>
          <p className="text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">
            Người dùng không nhận quyền trực tiếp. Mỗi tài khoản được gán một hoặc nhiều vai trò.
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900/40 dark:bg-violet-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
            <Key size={16} /> Quyền kế thừa
          </div>
          <p className="text-xs leading-5 text-violet-700/80 dark:text-violet-300/80">
            Quyền và API được tính tự động từ các vai trò đã chọn, dùng để hiển thị menu và bảo vệ endpoint.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Tìm theo họ tên, email, mã số hoặc role:STUDENT..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            <UserPlus size={15} /> Thêm tài khoản
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} /> Làm mới
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-xs dark:border-gray-800 dark:bg-gray-900">
        <span className="font-semibold text-gray-500 dark:text-gray-400">Lọc nhanh:</span>
        <button
          type="button"
          onClick={() => setSearch('')}
          className={`rounded-lg px-2.5 py-1 font-medium transition ${!activeRoleFilter ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
        >
          Tất cả
        </button>
        {allRoles.map(role => (
          <button
            key={roleIdOf(role) || role.code}
            type="button"
            onClick={() => setSearch(`role:${role.code}`)}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${activeRoleFilter === role.code ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            {role.name || roleLabel(role.code)}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Người dùng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Mã số</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Vai trò</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Quyền</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <UserTableSkeleton rows={6} />
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<Users size={32} />}
                      title="Chưa có tài khoản phù hợp"
                      description="Thử đổi từ khóa tìm kiếm hoặc tạo tài khoản mới."
                    />
                  </td>
                </tr>
              ) : visibleUsers.map(user => {
                const permissions = new Map<string, Permission>();
                user.roles.forEach(role => {
                  const fullRole = allRoles.find(item => item.code === role.code || roleIdOf(item) === roleIdOf(role));
                  fullRole?.permissions?.forEach(permission => {
                    const id = permission.id || permission.permissionId || permission.code;
                    if (id) permissions.set(id, permission);
                  });
                });

                return (
                  <tr key={userIdOf(user)} className="border-b border-gray-100 transition hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="flex min-w-[240px] items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          {(user.fullName || user.username || 'U')[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{user.fullName || user.username || 'Chưa có họ tên'}</p>
                          <p className="truncate text-xs text-gray-400">{user.email || user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-200">{user.displayCode || '-'}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{user.accountType || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.length === 0 ? (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">Chưa có vai trò</span>
                        ) : user.roles.map(role => (
                          <span key={role.code || roleIdOf(role)} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {role.name || roleLabel(role.code)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {permissions.size} quyền
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive === false ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                        {user.isActive === false ? 'Ngừng hoạt động' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openAssign(user)}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <ShieldCheck size={14} /> Gán vai trò
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        allRoles={allRoles}
        onSave={handleSaveUsers}
      />

      <Modal isOpen={!!modalUser} onClose={closeModal} className="max-w-6xl w-full mx-4">
        {modalUser && (
          <div className="max-h-[88vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gán vai trò cho tài khoản</h2>
                <p className="mt-1 text-sm text-gray-500">{modalUser.fullName || modalUser.email}</p>
              </div>
              <button onClick={closeModal} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            {modalUser.email === authUser?.email && (
              <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                <AlertTriangle size={16} />
                Bạn đang chỉnh vai trò của chính mình. Hãy giữ ít nhất một vai trò có quyền quản trị.
              </div>
            )}

            <div className="grid max-h-[65vh] gap-5 overflow-y-auto p-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={roleSearch}
                    onChange={event => setRoleSearch(event.target.value)}
                    placeholder="Tìm vai trò..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                      <tr>
                        <th className="w-12 px-4 py-3 text-xs font-semibold uppercase text-gray-500">Chọn</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Vai trò</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Quyền</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rolesLoading ? (
                        <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">Đang tải vai trò...</td></tr>
                      ) : filteredRoles.map(role => {
                        const id = roleIdOf(role);
                        const checked = selectedRoleIds.has(id);
                        return (
                          <tr key={id || role.code} onClick={() => toggleRole(role)} className={`cursor-pointer border-b border-gray-100 transition dark:border-gray-800 ${checked ? 'bg-emerald-50/70 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}>
                            <td className="px-4 py-3">
                              <span className={`flex h-5 w-5 items-center justify-center rounded border-2 ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'}`}>
                                {checked && <Check size={12} />}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{role.name || roleLabel(role.code)}</p>
                              <p className="mt-0.5 text-xs text-gray-400">{role.code} · {role.description || 'Không có mô tả'}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">{role.permissionCount ?? role.permissions?.length ?? 0}</span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-gray-500">{role.userCount ?? 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-900/10">
                    <p className="text-xs font-medium text-emerald-700">Vai trò</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-300">{selectedRoles.length}</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/10">
                    <p className="text-xs font-medium text-blue-700">Quyền</p>
                    <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-300">{inheritedPermissions.length}</p>
                  </div>
                  <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 dark:border-violet-900/40 dark:bg-violet-900/10">
                    <p className="text-xs font-medium text-violet-700">API</p>
                    <p className="mt-1 text-2xl font-bold text-violet-800 dark:text-violet-300">{endpointCount}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Quyền kế thừa từ vai trò</h3>
                    <p className="mt-1 text-xs text-gray-400">Danh sách này chỉ để kiểm tra. Muốn đổi quyền, hãy sửa quyền của vai trò ở tab Vai trò.</p>
                  </div>
                  <div className="max-h-[330px] overflow-y-auto p-3">
                    {inheritedPermissions.length === 0 ? (
                      <p className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400 dark:bg-gray-800/50">Chưa có quyền nào.</p>
                    ) : inheritedPermissions.map(permission => (
                      <div key={permission.id || permission.permissionId || permission.code} className="mb-2 rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{permission.name}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{permission.code} · {permission.module || 'Chưa phân nhóm'}</p>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800">
                            {permission.apis?.length || permission.apiCount || 0} API
                          </span>
                        </div>
                        {permission.apis && permission.apis.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {permission.apis.slice(0, 3).map(api => (
                              <div key={api.id} className="flex items-center gap-2">
                                <MethodBadge method={api.method} />
                                <code className="truncate text-xs text-gray-500">{api.path}</code>
                              </div>
                            ))}
                            {permission.apis.length > 3 && <p className="text-xs text-gray-400">+ {permission.apis.length - 3} API khác</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button onClick={closeModal} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700">Hủy</button>
              <button onClick={saveRoles} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                {saving && <RefreshCw size={15} className="animate-spin" />} Lưu vai trò
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
