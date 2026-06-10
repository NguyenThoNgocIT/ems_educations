import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { fixMojibakeText } from '@/utils/text';
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  CreateRbacApiDto,
  RbacApi,
  MenuItem,
  CreateMenuDto,
  UpdateMenuDto,
  UserWithRoles,
} from '@/types/rbac';

const unwrapData = <T = any>(response: any): T => unwrapApiResponse<T>(response);

const unwrapList = <T = any>(response: any): T[] => {
  const data: any = unwrapData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const normalizePermission = (permission: any): Permission => ({
  ...permission,
  id: permission.id || permission.permissionId || '',
  permissionId: permission.permissionId || permission.id,
  code: permission.code || '',
  name: fixMojibakeText(permission.name || permission.code || ''),
  description: fixMojibakeText(permission.description),
  module: fixMojibakeText(permission.module),
  apiCount: permission.apiCount ?? permission.apis?.length ?? 0,
  apis: Array.isArray(permission.apis) ? permission.apis.map(normalizeApi) : permission.apis,
});

const normalizeRole = (role: any): Role => ({
  ...role,
  id: role.id || role.roleId || '',
  roleId: role.roleId || role.id,
  code: role.code || '',
  name: fixMojibakeText(role.name || role.code || ''),
  description: fixMojibakeText(role.description),
  userCount: role.userCount ?? 0,
  permissionCount: role.permissionCount ?? role.permissions?.length ?? 0,
  permissions: Array.isArray(role.permissions) ? role.permissions.map(normalizePermission) : role.permissions,
});

const normalizeApi = (api: any, permissionId?: string): RbacApi => ({
  id: `${api.httpMethod || api.method}:${api.apiPath || api.path}`,
  method: api.httpMethod || api.method,
  path: api.apiPath || api.path,
  permissionId: api.permissionId || permissionId || '',
});

const normalizeMenu = (menu: any): MenuItem => ({
  ...menu,
  id: menu.id || menu.menuId || '',
  menuId: menu.menuId || menu.id,
  name: fixMojibakeText(menu.name || menu.menuTitle || ''),
  menuTitle: fixMojibakeText(menu.menuTitle || menu.name || ''),
  path: menu.path ?? menu.menuUrl ?? '',
  menuUrl: menu.menuUrl ?? menu.path ?? '',
  icon: menu.icon ?? menu.menuIcon ?? '',
  menuIcon: menu.menuIcon ?? menu.icon ?? '',
  orderIndex: menu.orderIndex ?? 0,
  parentId: menu.parentId ?? null,
  permissionId: menu.permissionId ?? null,
  permissionCode: menu.permissionCode ?? null,
});

const toBackendMenuPayload = (data: CreateMenuDto | UpdateMenuDto) => ({
  menuTitle: data.name,
  menuUrl: data.path || '',
  menuIcon: data.icon || '',
  orderIndex: data.orderIndex ?? 0,
  parentId: data.parentId ?? null,
  permissionId: data.permissionId ?? null,
});

// ─── Roles ────────────────────────────────────────────────────────────────────
export const roleApi = {
  getAll: async (): Promise<Role[]> => {
    const response: any = await request.get('/api/v1/roles/admin');
    return unwrapList(response).map(normalizeRole);
  },

  getById: async (id: string): Promise<Role> => {
    const response: any = await request.get(`/api/v1/roles/admin/${id}`);
    return normalizeRole(unwrapData(response));
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    const response: any = await request.post('/api/v1/roles/admin', data);
    return normalizeRole(unwrapData(response));
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const response: any = await request.put(`/api/v1/roles/admin/${id}`, data);
    return normalizeRole(unwrapData(response));
  },

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/roles/admin/${id}`),

  // Permission assignment for a role
  getPermissions: async (id: string): Promise<Permission[]> => {
    const response: any = await request.get(`/api/v1/roles/admin/${id}/permissions`);
    const permissions = unwrapList(response).map(normalizePermission);
    return Promise.all(
      permissions.map(async (permission) => {
        const permissionId = permission.id || permission.permissionId;
        if (!permissionId) return permission;
        try {
          const apis = await permissionApi.getApis(permissionId);
          return { ...permission, apis, apiCount: apis.length };
        } catch {
          return permission;
        }
      }),
    );
  },

  updatePermissions: async (id: string, permissionIds: string[]): Promise<Role> => {
    const response: any = await request.put(`/api/v1/roles/admin/${id}/permissions`, {
      permissionIds: permissionIds.filter(Boolean),
    });
    return normalizeRole(unwrapData(response));
  },

  getAllWithPermissions: async (): Promise<Role[]> => {
    const rolesRes: any = await request.get('/api/v1/roles/admin');
    const roles: Role[] = unwrapList(rolesRes).map(normalizeRole);
    return Promise.all(
      roles.map(async (role) => {
        const roleId = role.id || role.roleId;
        if (!roleId) return role;
        const permissionsRes: any = await request.get(`/api/v1/roles/admin/${roleId}/permissions`);
        const permissions = unwrapList(permissionsRes).map(normalizePermission);
        return { ...role, permissions };
      }),
    );
  },
};

// ─── Permissions ──────────────────────────────────────────────────────────────
export const permissionApi = {
  getAll: async (): Promise<Permission[]> => {
    const response: any = await request.get('/api/v1/permissions/admin');
    return unwrapList(response).map(normalizePermission);
  },

  getById: async (id: string): Promise<Permission> => {
    const response: any = await request.get(`/api/v1/permissions/admin/${id}`);
    return normalizePermission(unwrapData(response));
  },

  create: async (data: CreatePermissionDto): Promise<Permission> => {
    const response: any = await request.post('/api/v1/permissions/admin', data);
    return normalizePermission(unwrapData(response));
  },

  update: async (id: string, data: UpdatePermissionDto): Promise<Permission> => {
    const response: any = await request.put(`/api/v1/permissions/admin/${id}`, data);
    return normalizePermission(unwrapData(response));
  },

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/permissions/admin/${id}`),

  getApis: async (permissionId: string): Promise<any[]> => {
    const res: any = await request.get(`/api/v1/permissions/admin/${permissionId}/apis`);
    return unwrapList(res).map((api: any) => normalizeApi(api, permissionId));
  },

  addApi: (permissionId: string, data: CreateRbacApiDto): Promise<void> =>
    request.post('/api/v1/permissions/admin/apis', {
      permissionId,
      apiPath: data.path,
      httpMethod: data.method,
    }),

  removeApi: (permissionId: string, apiPath: string, httpMethod: string): Promise<void> =>
    request.delete(`/api/v1/permissions/admin/${permissionId}/apis`, {
      params: { apiPath, httpMethod },
    }),
};

// ─── Menus ────────────────────────────────────────────────────────────────────
export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response: any = await request.get('/api/v1/menus/admin');
    return unwrapList(response).map(normalizeMenu);
  },

  getMe: async (): Promise<MenuItem[]> => {
    const response: any = await request.get('/api/v1/menus/me');
    return unwrapList(response).map(normalizeMenu);
  },

  create: async (data: CreateMenuDto): Promise<MenuItem> => {
    const response: any = await request.post('/api/v1/menus/admin', toBackendMenuPayload(data));
    return normalizeMenu(unwrapData(response));
  },

  update: async (id: string, data: UpdateMenuDto): Promise<MenuItem> => {
    const response: any = await request.put(`/api/v1/menus/admin/${id}`, toBackendMenuPayload(data));
    return normalizeMenu(unwrapData(response));
  },

  delete: (id: string): Promise<void> =>
    request.delete(`/api/v1/menus/admin/${id}`),
};

// ─── User Role Assignment ─────────────────────────────────────────────────────
export const userRoleApi = {
  getUserRoles: async (userId: string): Promise<UserWithRoles> =>
    unwrapData(await request.get(`/api/v1/users/admin/${userId}/roles`)),

  updateUserRoles: async (userId: string, roleIds: string[]): Promise<UserWithRoles> =>
    unwrapData(await request.put(`/api/v1/users/admin/${userId}/roles`, { roleIds })),

  // Search users (reusing general users endpoint)
  searchUsers: async (params?: { keyword?: string; page?: number; size?: number }): Promise<any> =>
    unwrapData(await request.get('/api/v1/users/admin', { params })),
};
