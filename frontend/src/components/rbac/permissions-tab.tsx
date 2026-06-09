import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Globe,
  Key,
  Menu as MenuIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { ExcelImportModal } from './excel-import-modal';
import { permissionApi } from '@/api/rbac';
import type { CreatePermissionDto, CreateRbacApiDto, HttpMethod, Permission, RbacApi } from '@/types/rbac';
import { ActionMenu, ActionMenuItem, EmptyState, MethodBadge, METHODS, SkeletonRow } from './shared';

type PermModalMode = 'create' | 'edit' | 'apis' | 'delete';

type EndpointPreset = {
  label: string;
  method: HttpMethod;
  path: string;
};

type EndpointGroup = {
  module: string;
  description: string;
  keywords: string[];
  endpoints: EndpointPreset[];
};

const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    module: 'Sinh viên',
    description: 'Tạo, xem, sửa, xóa sinh viên và chức năng tự xem của sinh viên.',
    keywords: ['STUDENT', 'SINH_VIEN', 'SINH VIÊN'],
    endpoints: [
      { label: 'Xem danh sách sinh viên', method: 'GET', path: '/api/v1/students/admin' },
      { label: 'Xem chi tiết sinh viên', method: 'GET', path: '/api/v1/students/admin/**' },
      { label: 'Tạo sinh viên', method: 'POST', path: '/api/v1/students/admin' },
      { label: 'Nhập Excel sinh viên', method: 'POST', path: '/api/v1/students/admin/import-excel' },
      { label: 'Cập nhật sinh viên', method: 'PUT', path: '/api/v1/students/admin/**' },
      { label: 'Xóa sinh viên', method: 'DELETE', path: '/api/v1/students/admin/**' },
      { label: 'Sinh viên tự xem hồ sơ', method: 'GET', path: '/api/v1/students/me' },
      { label: 'Sinh viên tự cập nhật hồ sơ', method: 'PUT', path: '/api/v1/students/me' },
    ],
  },
  {
    module: 'Giảng viên',
    description: 'Quản lý giảng viên và hồ sơ cá nhân của giảng viên.',
    keywords: ['INSTRUCTOR', 'LECTURER', 'GIANG_VIEN', 'GIẢNG VIÊN'],
    endpoints: [
      { label: 'Xem danh sách giảng viên', method: 'GET', path: '/api/v1/instructors/admin' },
      { label: 'Xem chi tiết giảng viên', method: 'GET', path: '/api/v1/instructors/admin/**' },
      { label: 'Tạo giảng viên', method: 'POST', path: '/api/v1/instructors/admin' },
      { label: 'Cập nhật giảng viên', method: 'PUT', path: '/api/v1/instructors/admin/**' },
      { label: 'Xóa giảng viên', method: 'DELETE', path: '/api/v1/instructors/admin/**' },
      { label: 'Giảng viên tự xem hồ sơ', method: 'GET', path: '/api/v1/instructors/me' },
      { label: 'Giảng viên tự cập nhật hồ sơ', method: 'PUT', path: '/api/v1/instructors/me' },
    ],
  },
  {
    module: 'Nhân viên',
    description: 'Quản lý nhân viên, phòng ban và hồ sơ tự xem.',
    keywords: ['STAFF', 'EMPLOYEE', 'NHAN_VIEN', 'NHÂN VIÊN'],
    endpoints: [
      { label: 'Xem danh sách nhân viên', method: 'GET', path: '/api/v1/staffs/admin' },
      { label: 'Xem chi tiết nhân viên', method: 'GET', path: '/api/v1/staffs/admin/**' },
      { label: 'Tạo nhân viên', method: 'POST', path: '/api/v1/staffs/admin' },
      { label: 'Cập nhật nhân viên', method: 'PUT', path: '/api/v1/staffs/admin/**' },
      { label: 'Xóa nhân viên', method: 'DELETE', path: '/api/v1/staffs/admin/**' },
      { label: 'Nhân viên tự xem hồ sơ', method: 'GET', path: '/api/v1/staffs/me' },
      { label: 'Nhân viên tự cập nhật hồ sơ', method: 'PUT', path: '/api/v1/staffs/me' },
    ],
  },
  {
    module: 'Tài khoản và RBAC',
    description: 'Quản lý tài khoản, vai trò, quyền, menu và yêu cầu đặt lại mật khẩu.',
    keywords: ['USER', 'ROLE', 'PERMISSION', 'MENU', 'RBAC', 'PASSWORD'],
    endpoints: [
      { label: 'Xem người dùng', method: 'GET', path: '/api/v1/users/admin' },
      { label: 'Xem chi tiết người dùng', method: 'GET', path: '/api/v1/users/admin/**' },
      { label: 'Cập nhật người dùng', method: 'PUT', path: '/api/v1/users/admin/**' },
      { label: 'Khóa tài khoản', method: 'PUT', path: '/api/v1/users/admin/**/lock' },
      { label: 'Mở khóa tài khoản', method: 'PUT', path: '/api/v1/users/admin/**/unlock' },
      { label: 'Gán vai trò cho người dùng', method: 'PUT', path: '/api/v1/users/admin/**/roles' },
      { label: 'Quản lý vai trò', method: 'GET', path: '/api/v1/roles/admin/**' },
      { label: 'Tạo vai trò', method: 'POST', path: '/api/v1/roles/admin' },
      { label: 'Cập nhật vai trò', method: 'PUT', path: '/api/v1/roles/admin/**' },
      { label: 'Xóa vai trò', method: 'DELETE', path: '/api/v1/roles/admin/**' },
      { label: 'Quản lý quyền', method: 'GET', path: '/api/v1/permissions/admin/**' },
      { label: 'Tạo quyền', method: 'POST', path: '/api/v1/permissions/admin' },
      { label: 'Cập nhật quyền', method: 'PUT', path: '/api/v1/permissions/admin/**' },
      { label: 'Xóa quyền', method: 'DELETE', path: '/api/v1/permissions/admin/**' },
      { label: 'Cấu hình API theo quyền', method: 'POST', path: '/api/v1/permissions/admin/apis' },
      { label: 'Quản lý menu', method: 'GET', path: '/api/v1/menus/admin/**' },
      { label: 'Tạo menu', method: 'POST', path: '/api/v1/menus/admin' },
      { label: 'Cập nhật menu', method: 'PUT', path: '/api/v1/menus/admin/**' },
      { label: 'Xóa menu', method: 'DELETE', path: '/api/v1/menus/admin/**' },
      { label: 'Xem yêu cầu đặt lại mật khẩu', method: 'GET', path: '/api/auth/admin/password-reset-requests' },
      { label: 'Duyệt yêu cầu đặt lại mật khẩu', method: 'PUT', path: '/api/auth/admin/password-reset-requests/**/approve' },
      { label: 'Từ chối yêu cầu đặt lại mật khẩu', method: 'PUT', path: '/api/auth/admin/password-reset-requests/**/reject' },
    ],
  },
  {
    module: 'Danh mục học vụ',
    description: 'Khoa, ngành, chuyên ngành, khóa, năm học, học kỳ, chương trình đào tạo.',
    keywords: ['ACADEMIC', 'DEPARTMENT', 'MAJOR', 'SPECIALIZATION', 'COHORT', 'SEMESTER', 'TRAINING', 'SCHOOL'],
    endpoints: [
      { label: 'Quản lý khoa', method: 'GET', path: '/api/v1/departments/admin/**' },
      { label: 'Tạo khoa', method: 'POST', path: '/api/v1/departments/admin' },
      { label: 'Cập nhật khoa', method: 'PUT', path: '/api/v1/departments/admin/**' },
      { label: 'Xóa khoa', method: 'DELETE', path: '/api/v1/departments/admin/**' },
      { label: 'Quản lý ngành', method: 'GET', path: '/api/v1/majors/admin/**' },
      { label: 'Tạo ngành', method: 'POST', path: '/api/v1/majors/admin' },
      { label: 'Cập nhật ngành', method: 'PUT', path: '/api/v1/majors/admin/**' },
      { label: 'Xóa ngành', method: 'DELETE', path: '/api/v1/majors/admin/**' },
      { label: 'Quản lý chuyên ngành', method: 'GET', path: '/api/v1/specializations/admin/**' },
      { label: 'Tạo chuyên ngành', method: 'POST', path: '/api/v1/specializations/admin' },
      { label: 'Cập nhật chuyên ngành', method: 'PUT', path: '/api/v1/specializations/admin/**' },
      { label: 'Xóa chuyên ngành', method: 'DELETE', path: '/api/v1/specializations/admin/**' },
      { label: 'Quản lý khóa đào tạo', method: 'GET', path: '/api/v1/academic-cohorts/admin/**' },
      { label: 'Quản lý năm học', method: 'GET', path: '/api/v1/school-years/admin/**' },
      { label: 'Quản lý học kỳ', method: 'GET', path: '/api/v1/semesters/admin/**' },
      { label: 'Quản lý chương trình đào tạo', method: 'GET', path: '/api/v1/training-programs/admin/**' },
      { label: 'Quản lý môn trong chương trình', method: 'GET', path: '/api/v1/training-program-courses/admin/**' },
    ],
  },
  {
    module: 'Môn học và lớp học phần',
    description: 'Môn học, môn tiên quyết, lớp học phần và danh sách sinh viên trong lớp học phần.',
    keywords: ['COURSE', 'COURSE_CLASS', 'REGISTRATION', 'PREREQUISITE'],
    endpoints: [
      { label: 'Xem môn học', method: 'GET', path: '/api/v1/courses/**' },
      { label: 'Tạo môn học', method: 'POST', path: '/api/v1/courses' },
      { label: 'Cập nhật môn học', method: 'PUT', path: '/api/v1/courses/**' },
      { label: 'Xóa môn học', method: 'DELETE', path: '/api/v1/courses/**' },
      { label: 'Quản lý lớp học phần', method: 'GET', path: '/api/v1/courses/classes/**' },
      { label: 'Tạo lớp học phần', method: 'POST', path: '/api/v1/courses/classes' },
      { label: 'Cập nhật lớp học phần', method: 'PUT', path: '/api/v1/courses/classes/**' },
      { label: 'Xóa lớp học phần', method: 'DELETE', path: '/api/v1/courses/classes/**' },
      { label: 'Quản lý môn tiên quyết', method: 'GET', path: '/api/v1/course-prerequisites/admin/**' },
      { label: 'Tạo môn tiên quyết', method: 'POST', path: '/api/v1/course-prerequisites/admin' },
      { label: 'Xóa môn tiên quyết', method: 'DELETE', path: '/api/v1/course-prerequisites/admin' },
      { label: 'Đăng ký học lại/cải thiện', method: 'POST', path: '/api/v1/students/me/retake-improvement-registrations' },
    ],
  },
  {
    module: 'Lớp hành chính và trạng thái sinh viên',
    description: 'Lớp hành chính, gán sinh viên vào lớp, trạng thái và lịch sử trạng thái.',
    keywords: ['CLASS', 'STUDENT_CLASS', 'STATUS'],
    endpoints: [
      { label: 'Quản lý lớp hành chính', method: 'GET', path: '/api/v1/classes/admin/**' },
      { label: 'Tạo lớp hành chính', method: 'POST', path: '/api/v1/classes/admin' },
      { label: 'Cập nhật lớp hành chính', method: 'PUT', path: '/api/v1/classes/admin/**' },
      { label: 'Xóa lớp hành chính', method: 'DELETE', path: '/api/v1/classes/admin/**' },
      { label: 'Quản lý sinh viên theo lớp', method: 'GET', path: '/api/v1/student-classes/admin/**' },
      { label: 'Gán sinh viên vào lớp', method: 'POST', path: '/api/v1/student-classes/admin' },
      { label: 'Cập nhật sinh viên theo lớp', method: 'PUT', path: '/api/v1/student-classes/admin/**' },
      { label: 'Xóa sinh viên khỏi lớp', method: 'DELETE', path: '/api/v1/student-classes/admin/**' },
      { label: 'Danh mục trạng thái sinh viên', method: 'GET', path: '/api/v1/student-status-catalog/admin/**' },
      { label: 'Lịch sử trạng thái sinh viên', method: 'GET', path: '/api/v1/student-status-histories/admin/**' },
    ],
  },
  {
    module: 'Lịch học và giảng dạy',
    description: 'Phân công giảng dạy, xếp lịch tự động, tiến độ dạy và yêu cầu nghỉ/bù.',
    keywords: ['SCHEDULE', 'TEACHING', 'PROGRESS', 'ADJUSTMENT', 'AUTO'],
    endpoints: [
      { label: 'Phân công giảng dạy', method: 'GET', path: '/api/v1/teaching-assignments/admin/**' },
      { label: 'Tạo phân công giảng dạy', method: 'POST', path: '/api/v1/teaching-assignments/admin' },
      { label: 'Tiến độ giảng dạy', method: 'GET', path: '/api/v1/teaching-progress/admin/**' },
      { label: 'Ghi nhận buổi dạy', method: 'POST', path: '/api/v1/teaching-progress/admin' },
      { label: 'Tự động xếp lịch', method: 'POST', path: '/api/v1/auto-schedules/**' },
      { label: 'Yêu cầu nghỉ/bù của giảng viên', method: 'GET', path: '/api/v1/schedule-adjustments/admin/**' },
      { label: 'Duyệt yêu cầu lịch', method: 'POST', path: '/api/v1/schedule-adjustments/admin/**' },
      { label: 'Giảng viên tạo yêu cầu lịch', method: 'POST', path: '/api/v1/schedule-adjustments/lecturer/**' },
    ],
  },
  {
    module: 'Cơ sở vật chất và nhân sự',
    description: 'Tòa nhà, phòng học, chức vụ, trình độ, phòng ban, hợp đồng.',
    keywords: ['ROOM', 'BUILDING', 'POSITION', 'DEGREE', 'DIVISION', 'CONTRACT'],
    endpoints: [
      { label: 'Quản lý tòa nhà', method: 'GET', path: '/api/v1/buildings/**' },
      { label: 'Tạo tòa nhà', method: 'POST', path: '/api/v1/buildings' },
      { label: 'Cập nhật tòa nhà', method: 'PUT', path: '/api/v1/buildings/**' },
      { label: 'Xóa tòa nhà', method: 'DELETE', path: '/api/v1/buildings/**' },
      { label: 'Quản lý phòng học', method: 'GET', path: '/api/v1/rooms/**' },
      { label: 'Tạo phòng học', method: 'POST', path: '/api/v1/rooms' },
      { label: 'Cập nhật phòng học', method: 'PUT', path: '/api/v1/rooms/**' },
      { label: 'Xóa phòng học', method: 'DELETE', path: '/api/v1/rooms/**' },
      { label: 'Quản lý chức vụ', method: 'GET', path: '/api/v1/positions/admin/**' },
      { label: 'Quản lý trình độ', method: 'GET', path: '/api/v1/degrees/admin/**' },
      { label: 'Quản lý phòng ban', method: 'GET', path: '/api/v1/divisions/admin/**' },
      { label: 'Quản lý hợp đồng', method: 'GET', path: '/api/v1/contracts/admin/**' },
    ],
  },
  {
    module: 'Điểm',
    description: 'Nhóm điểm, nhập điểm của giảng viên và tổng hợp điểm.',
    keywords: ['GRADE', 'SCORE'],
    endpoints: [
      { label: 'Admin quản lý nhóm điểm', method: 'GET', path: '/api/v1/admin/grades/**' },
      { label: 'Admin cập nhật điểm', method: 'POST', path: '/api/v1/admin/grades/**' },
      { label: 'Giảng viên xem lớp nhập điểm', method: 'GET', path: '/api/v1/instructors/grades/**' },
      { label: 'Giảng viên nhập điểm', method: 'POST', path: '/api/v1/instructors/grades/**' },
    ],
  },
];

const isSameApi = (left: Pick<RbacApi, 'method' | 'path'>, right: Pick<RbacApi, 'method' | 'path'>) =>
  left.method === right.method && left.path === right.path;

export function PermissionsTab() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: PermModalMode; perm?: Permission } | null>(null);
  const [form, setForm] = useState<CreatePermissionDto & { code: string; name: string; module: string }>({ code: '', name: '', description: '', module: '' });
  const [apis, setApis] = useState<RbacApi[]>([]);
  const [apiForm, setApiForm] = useState<CreateRbacApiDto>({ method: 'GET', path: '' });
  const [apiSearch, setApiSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('Gợi ý phù hợp');
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await permissionApi.getAll();
      setPermissions(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch {
      toast.error('Không thể tải danh sách quyền hạn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentPermissionText = `${modal?.perm?.code || ''} ${modal?.perm?.name || ''} ${modal?.perm?.module || ''}`.toUpperCase();

  const suggestedGroups = useMemo(() => {
    const matches = ENDPOINT_GROUPS.filter(group =>
      group.keywords.some(keyword => currentPermissionText.includes(keyword)) ||
      currentPermissionText.includes(group.module.toUpperCase()),
    );
    return matches.length > 0 ? matches : ENDPOINT_GROUPS;
  }, [currentPermissionText]);

  const visibleGroups = useMemo(() => {
    const groups = selectedModule === 'Gợi ý phù hợp'
      ? suggestedGroups
      : ENDPOINT_GROUPS.filter(group => group.module === selectedModule);
    const keyword = apiSearch.trim().toLowerCase();
    if (!keyword) return groups;
    return groups
      .map(group => ({
        ...group,
        endpoints: group.endpoints.filter(endpoint =>
          endpoint.label.toLowerCase().includes(keyword) ||
          endpoint.path.toLowerCase().includes(keyword) ||
          endpoint.method.toLowerCase().includes(keyword),
        ),
      }))
      .filter(group => group.endpoints.length > 0);
  }, [apiSearch, selectedModule, suggestedGroups]);

  const openCreate = () => {
    setForm({ code: '', name: '', description: '', module: '' });
    setModal({ mode: 'create' });
  };

  const openEdit = (perm: Permission) => {
    setForm({ code: perm.code || '', name: perm.name, description: perm.description || '', module: perm.module || '' });
    setModal({ mode: 'edit', perm });
  };

  const openApis = async (perm: Permission) => {
    const pId = perm.id || perm.permissionId;
    setApis([]);
    setApiForm({ method: 'GET', path: '' });
    setApiSearch('');
    setSelectedModule('Gợi ý phù hợp');
    setModal({ mode: 'apis', perm });
    if (!pId) return;
    try {
      const apiList: any = await permissionApi.getApis(pId);
      setApis(Array.isArray(apiList) ? apiList : []);
    } catch {
      toast.error('Không thể tải API bảo vệ của quyền');
    }
  };

  const openDelete = (perm: Permission) => setModal({ mode: 'delete', perm });
  const closeModal = () => setModal(null);

  const updateApiCount = (permissionId: string, count: number) => {
    setPermissions(prev => prev.map(permission => {
      const id = permission.id || permission.permissionId;
      return id === permissionId ? { ...permission, apiCount: count } : permission;
    }));
  };

  const handleSavePerm = async () => {
    if (!form.code.trim()) { toast.error('Mã quyền không được để trống'); return; }
    if (!form.name.trim()) { toast.error('Tên quyền không được để trống'); return; }
    setSaving(true);
    try {
      if (modal?.mode === 'create') {
        await permissionApi.create(form);
        toast.success('Tạo quyền hạn thành công');
      } else if (modal?.mode === 'edit' && modal.perm) {
        const pId = modal.perm.id || modal.perm.permissionId;
        if (pId) await permissionApi.update(pId, form);
        toast.success('Cập nhật quyền hạn thành công');
      }
      closeModal();
      await fetchData();
    } catch {
      toast.error('Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleImportExcel = async (data: any[]) => {
    let success = 0;
    let failed = 0;
    for (const row of data) {
      try {
        const dto = {
          code: String(row.Code || row.code || '').trim().toUpperCase(),
          name: String(row.Name || row.name || '').trim(),
          module: String(row.Module || row.module || '').trim(),
          description: String(row.Description || row.description || '').trim(),
        };
        if (dto.code && dto.name) {
          await permissionApi.create(dto);
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    if (success > 0) {
      toast.success(`Nhập thành công ${success} quyền hạn.`);
      fetchData();
    }
    if (failed > 0) {
      toast.warning(`Có ${failed} dòng bị lỗi hoặc thiếu dữ liệu.`);
    }
    setShowImport(false);
  };

  const addEndpoint = async (endpoint: EndpointPreset | CreateRbacApiDto) => {
    if (!modal?.perm) return false;
    const pId = modal.perm.id || modal.perm.permissionId;
    if (!pId) return false;
    const payload = { method: endpoint.method, path: endpoint.path.trim() };
    if (!payload.path) {
      toast.error('Đường dẫn API không được để trống');
      return false;
    }
    if (apis.some(api => isSameApi(api, payload))) {
      toast.info('API này đã được gắn cho quyền hiện tại');
      return false;
    }
    await permissionApi.addApi(pId, payload);
    const newApi: RbacApi = { id: `${payload.method}:${payload.path}`, ...payload, permissionId: pId };
    setApis(prev => {
      const next = [...prev, newApi];
      updateApiCount(pId, next.length);
      return next;
    });
    return true;
  };

  const handleAddApi = async () => {
    setSaving(true);
    try {
      const added = await addEndpoint(apiForm);
      if (added) {
        setApiForm({ method: 'GET', path: '' });
        toast.success('Đã thêm API bảo vệ');
      }
    } catch {
      toast.error('Thêm API thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPreset = async (endpoint: EndpointPreset) => {
    setSaving(true);
    try {
      const added = await addEndpoint(endpoint);
      if (added) toast.success(`Đã gắn "${endpoint.label}"`);
    } catch {
      toast.error('Gắn API thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGroup = async (endpoints: EndpointPreset[]) => {
    setSaving(true);
    let success = 0;
    let skipped = 0;
    try {
      for (const endpoint of endpoints) {
        if (apis.some(api => isSameApi(api, endpoint))) {
          skipped++;
          continue;
        }
        const added = await addEndpoint(endpoint);
        if (added) success++;
      }
      if (success > 0) toast.success(`Đã gắn ${success} API bảo vệ`);
      if (skipped > 0) toast.info(`Bỏ qua ${skipped} API đã tồn tại`);
    } catch {
      toast.error('Gắn nhóm API thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApi = async (api: RbacApi) => {
    if (!modal?.perm) return;
    const pId = modal.perm.id || modal.perm.permissionId;
    if (!pId) return;
    try {
      await permissionApi.removeApi(pId, api.path, api.method);
      setApis(prev => {
        const next = prev.filter(item => !isSameApi(item, api));
        updateApiCount(pId, next.length);
        return next;
      });
      toast.success('Đã xóa API bảo vệ');
    } catch {
      toast.error('Xóa API thất bại');
    }
  };

  const handleDelete = async () => {
    if (!modal?.perm) return;
    const pId = modal.perm.id || modal.perm.permissionId;
    if (!pId) return;
    setSaving(true);
    try {
      await permissionApi.delete(pId);
      toast.success(`Đã xóa quyền "${modal.perm.name}"`);
      closeModal();
      await fetchData();
    } catch {
      toast.error('Xóa quyền hạn thất bại');
    } finally {
      setSaving(false);
    }
  };

  const filtered = permissions.filter(permission =>
    permission.name.toLowerCase().includes(search.toLowerCase()) ||
    permission.code?.toLowerCase().includes(search.toLowerCase()) ||
    permission.description?.toLowerCase().includes(search.toLowerCase()) ||
    permission.module?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <Key size={16} /> Quyền nghiệp vụ
          </div>
          <p className="text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
            Ví dụ: Xem sinh viên, Tạo lớp học phần, Nhập điểm. Vai trò sẽ nhận các quyền này.
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
            <Globe size={16} /> API bảo vệ
          </div>
          <p className="text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">
            Chọn API từ nhóm nghiệp vụ có sẵn. Nhập thủ công chỉ dùng khi thêm endpoint mới.
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900/40 dark:bg-violet-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
            <MenuIcon size={16} /> Menu hiển thị
          </div>
          <p className="text-xs leading-5 text-violet-700/80 dark:text-violet-300/80">
            Menu dùng quyền này sẽ hiển thị với người dùng có vai trò chứa quyền.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Tìm quyền, mã quyền, module..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/80">
            <UploadCloud size={15} /> Nhập Excel
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">
            <Plus size={15} /> Tạo quyền hạn
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Mã quyền</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tên nghiệp vụ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Module</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">API bảo vệ</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} cols={5} />)
                : filtered.length === 0
                  ? (
                    <tr><td colSpan={5}>
                      <EmptyState
                        icon={<Key size={32} />}
                        title="Chưa có quyền hạn nào"
                        description="Tạo quyền hạn để gán cho các vai trò"
                        action={<button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"><Plus size={14} /> Tạo quyền hạn</button>}
                      />
                    </td></tr>
                  )
                  : filtered.map(permission => {
                    const pId = permission.id || permission.permissionId;
                    return (
                      <tr key={pId} className="border-b border-gray-100 transition-colors hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                              <Key size={14} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="rounded bg-emerald-50/50 px-2 py-1 font-mono text-xs font-semibold text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400">{permission.code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{permission.name}</span>
                          {permission.description && <span className="block max-w-[320px] truncate text-xs text-gray-400">{permission.description}</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{permission.module || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => openApis(permission)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:bg-gray-800 dark:text-gray-400"
                          >
                            <Globe size={11} />
                            {permission.apiCount ?? permission.apis?.length ?? 0} API
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ActionMenu>
                            <ActionMenuItem icon={<Pencil size={14} />} label="Chỉnh sửa" onClick={() => openEdit(permission)} />
                            <ActionMenuItem icon={<Globe size={14} />} label="Gắn API bảo vệ" onClick={() => openApis(permission)} />
                            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                            <ActionMenuItem icon={<Trash2 size={14} />} label="Xóa quyền" onClick={() => openDelete(permission)} danger />
                          </ActionMenu>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal?.mode === 'create' || modal?.mode === 'edit'} onClose={closeModal} className="max-w-md w-full mx-4">
        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <Key size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {modal?.mode === 'create' ? 'Tạo quyền hạn mới' : 'Chỉnh sửa quyền hạn'}
              </h2>
              <p className="text-xs text-gray-400">Cấu hình thông tin quyền nghiệp vụ</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Mã quyền <span className="text-red-500">*</span></label>
              <input
                value={form.code}
                onChange={event => setForm(prev => ({ ...prev, code: event.target.value.toUpperCase() }))}
                placeholder="VD: STUDENT_VIEW, COURSE_CREATE..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên hiển thị <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                  placeholder="VD: Xem sinh viên"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="w-1/3">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Module</label>
                <input
                  value={form.module}
                  onChange={event => setForm(prev => ({ ...prev, module: event.target.value }))}
                  placeholder="VD: Học vụ"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
              <textarea
                value={form.description}
                onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
                placeholder="Mô tả ngắn về quyền hạn này..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2.5">
            <button onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700">Hủy</button>
            <button onClick={handleSavePerm} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50">
              {saving && <RefreshCw size={13} className="animate-spin" />}
              {modal?.mode === 'create' ? 'Tạo quyền' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal?.mode === 'apis'} onClose={closeModal} className="max-w-5xl w-full mx-4">
        <div className="p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
                <Globe size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gắn API bảo vệ cho quyền</h2>
                <p className="text-xs text-gray-400">
                  Quyền: <span className="font-semibold text-emerald-600">{modal?.perm?.name}</span>
                  {modal?.perm?.code && <span className="ml-1 font-mono">({modal.perm.code})</span>}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs leading-5 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
              Vai trò không gắn API trực tiếp. Vai trò nhận quyền, quyền này mới quyết định các API được gọi.
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.3fr]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">API đang bảo vệ</h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">{apis.length}</span>
              </div>
              <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50/70 p-2 dark:border-gray-800 dark:bg-gray-950/40">
                {apis.length === 0
                  ? <p className="py-10 text-center text-sm text-gray-400">Chưa có API nào. Hãy chọn mẫu bên phải để gắn nhanh.</p>
                  : apis.map(api => (
                    <div key={`${api.method}-${api.path}`} className="group mb-2 flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900">
                      <MethodBadge method={api.method} />
                      <code className="min-w-0 flex-1 truncate text-xs text-gray-700 dark:text-gray-300">{api.path}</code>
                      <button
                        onClick={() => handleRemoveApi(api)}
                        className="rounded-lg p-1 text-gray-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                        title="Xóa API khỏi quyền"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <ShieldCheck size={15} className="text-emerald-600" /> Chọn nhanh theo nghiệp vụ
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">Hệ thống gợi ý theo mã quyền/module, vẫn có thể chuyển nhóm khác.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedModule}
                      onChange={event => setSelectedModule(event.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
                    >
                      <option value="Gợi ý phù hợp">Gợi ý phù hợp</option>
                      {ENDPOINT_GROUPS.map(group => <option key={group.module} value={group.module}>{group.module}</option>)}
                    </select>
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={apiSearch}
                        onChange={event => setApiSearch(event.target.value)}
                        placeholder="Tìm API..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 sm:w-48"
                      />
                    </div>
                  </div>
                </div>

                <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                  {visibleGroups.length === 0 ? (
                    <p className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400 dark:bg-gray-800/50">Không tìm thấy API phù hợp.</p>
                  ) : visibleGroups.map(group => (
                    <div key={group.module} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-950/40">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{group.module}</p>
                          <p className="text-xs text-gray-400">{group.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddGroup(group.endpoints)}
                          disabled={saving}
                          className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Gắn cả nhóm
                        </button>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        {group.endpoints.map(endpoint => {
                          const exists = apis.some(api => isSameApi(api, endpoint));
                          return (
                            <button
                              key={`${group.module}-${endpoint.method}-${endpoint.path}`}
                              type="button"
                              onClick={() => handleAddPreset(endpoint)}
                              disabled={saving || exists}
                              className={`rounded-lg border p-2 text-left transition ${
                                exists
                                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300'
                                  : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900/50 dark:hover:bg-purple-900/10'
                              }`}
                            >
                              <div className="mb-1 flex items-center gap-2">
                                <MethodBadge method={endpoint.method} />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{endpoint.label}</span>
                              </div>
                              <code className="block truncate text-[11px] text-gray-400">{endpoint.path}</code>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Nhập thủ công nâng cao</p>
                <p className="mb-3 text-xs leading-5 text-gray-400">
                  Dùng khi controller mới chưa có trong danh sách gợi ý. Có thể dùng <code className="rounded bg-gray-100 px-1 font-mono dark:bg-gray-800">/**</code> cho API chi tiết theo id.
                </p>
                <div className="flex gap-2">
                  <select
                    value={apiForm.method}
                    onChange={event => setApiForm(prev => ({ ...prev, method: event.target.value as HttpMethod }))}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                  <input
                    value={apiForm.path}
                    onChange={event => setApiForm(prev => ({ ...prev, path: event.target.value }))}
                    placeholder="/api/v1/users/**"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 font-mono text-sm text-gray-900 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={handleAddApi}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Plus size={14} /> Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700">Đóng</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal?.mode === 'delete'} onClose={closeModal} className="max-w-sm w-full mx-4">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Xóa quyền hạn?</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Bạn sắp xóa quyền <span className="font-semibold text-gray-800 dark:text-gray-200">"{modal?.perm?.name}"</span>. Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700">Hủy</button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {saving && <RefreshCw size={13} className="animate-spin" />}
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>

      <ExcelImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImportExcel}
        title="Nhập danh sách quyền hạn"
        expectedColumns={['Module', 'Code', 'Name']}
      />
    </div>
  );
}
