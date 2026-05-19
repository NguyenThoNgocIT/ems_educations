import { request } from '@/utils/request';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  CreateRbacApiDto,
  MenuItem,
  CreateMenuDto,
  UpdateMenuDto,
  UserWithRoles,
} from '@/types/rbac';

// ─── Roles ────────────────────────────────────────────────────────────────────
export const roleApi = {
  getAll: (): Promise<Role[]> =>
    request.get('/api/v1/roles/admin'),

  getById: (id: string): Promise<Role> =>
    request.get(`/api/v1/roles/admin/${id}`),

  create: (data: CreateRoleDto): Promise<Role> =>
    request.post('/api/v1/roles/admin', data),

  update: (id: string, data: UpdateRoleDto): Promise<Role> =>
    request.put(`/api/v1/roles/admin/${id}`, data),

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/roles/admin/${id}`),

  // Permission assignment for a role
  getPermissions: (id: string): Promise<Permission[]> =>
    request.get(`/api/v1/roles/admin/${id}/permissions`),

  updatePermissions: (id: string, permissionIds: string[]): Promise<Role> =>
    request.put(`/api/v1/roles/admin/${id}/permissions`, { permissionIds }),

  getAllWithPermissions: (): Promise<Role[]> =>
    request.get('/api/v1/roles/admin/with-permissions'),
};

// ─── Permissions ──────────────────────────────────────────────────────────────
export const permissionApi = {
  getAll: (): Promise<Permission[]> =>
    request.get('/api/v1/permissions/admin'),

  getById: (id: string): Promise<Permission> =>
    request.get(`/api/v1/permissions/admin/${id}`),

  create: (data: CreatePermissionDto): Promise<Permission> =>
    request.post('/api/v1/permissions/admin', data),

  update: (id: string, data: UpdatePermissionDto): Promise<Permission> =>
    request.put(`/api/v1/permissions/admin/${id}`, data),

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/permissions/admin/${id}`),

  // API endpoint management for a permission
  addApi: (permissionId: string, data: CreateRbacApiDto): Promise<void> =>
    request.post(`/api/v1/permissions/admin/${permissionId}/apis`, data),

  removeApi: (permissionId: string, apiId: string): Promise<void> =>
    request.delete(`/api/v1/permissions/admin/${permissionId}/apis/${apiId}`),
};

// ─── Menus ────────────────────────────────────────────────────────────────────
export const menuApi = {
  getAll: (): Promise<MenuItem[]> =>
    request.get('/api/v1/menus/admin'),

  getMe: (): Promise<MenuItem[]> =>
    request.get('/api/v1/menus/me'),

  create: (data: CreateMenuDto): Promise<MenuItem> =>
    request.post('/api/v1/menus/admin', data),

  update: (id: string, data: UpdateMenuDto): Promise<MenuItem> =>
    request.put(`/api/v1/menus/admin/${id}`, data),

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/menus/admin/${id}`),
};

// ─── User Role Assignment ─────────────────────────────────────────────────────
export const userRoleApi = {
  getUserRoles: (userId: string): Promise<UserWithRoles> =>
    request.get(`/api/v1/users/admin/${userId}/roles`),

  updateUserRoles: (userId: string, roleIds: string[]): Promise<UserWithRoles> =>
    request.put(`/api/v1/users/admin/${userId}/roles`, { roleIds }),

  // Search users (reusing general users endpoint)
  searchUsers: (params?: { keyword?: string; page?: number; size?: number }): Promise<any> =>
    request.get('/api/v1/users/admin', { params }),
};
