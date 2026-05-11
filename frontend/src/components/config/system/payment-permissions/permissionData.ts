export interface PermissionItem {
  id: string;
  name: string;
  grantedAt: string;
  grantedBy: string;
}

export const initialPermissionData: PermissionItem[] = [
  {
    id: "NV240913-2",
    name: "Bùi Đức Việt",
    grantedAt: "2025-06-17 17:05",
    grantedBy: "Admin",
  },
  {
    id: "NV2408280002",
    name: "Trần Minh Sơn",
    grantedAt: "2024-10-03 14:03",
    grantedBy: "Admin",
  },
  {
    id: "NV2408280001",
    name: "Linh Đàm",
    grantedAt: "2024-10-03 14:03",
    grantedBy: "Admin",
  },
];
