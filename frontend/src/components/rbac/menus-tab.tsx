import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Key,
  Layers,
  Lock,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Route,
  Trash2,
  Unlink,
  UploadCloud,
} from 'lucide-react';
import { toast } from 'sonner';
import { menuApi, permissionApi } from '@/api/rbac';
import type { CreateMenuDto, MenuItem as MenuItemType, Permission, UpdateMenuDto } from '@/types/rbac';
import { Modal } from '@/components/ui/modal';
import { ExcelImportModal } from './excel-import-modal';
import { EmptyState } from './shared';

const ICON_OPTIONS = [
  { value: 'layout-dashboard', label: 'Bảng điều khiển' },
  { value: 'users', label: 'Người dùng/Sinh viên' },
  { value: 'user', label: 'Cá nhân/Giảng viên' },
  { value: 'book-open', label: 'Học phần' },
  { value: 'calendar-days', label: 'Lịch học' },
  { value: 'landmark', label: 'Khoa/Đơn vị' },
  { value: 'graduation-cap', label: 'Đào tạo' },
  { value: 'building', label: 'Cơ sở vật chất' },
  { value: 'shield-check', label: 'Hệ thống/RBAC' },
  { value: 'key', label: 'Quyền' },
  { value: 'menu', label: 'Menu' },
  { value: 'file-text', label: 'Tài liệu' },
];

const PATH_OPTIONS = [
  { group: 'Tổng quan', items: [{ label: 'Bảng điều khiển', value: '/dashboard/admin' }] },
  {
    group: 'Hồ sơ nhân sự',
    items: [
      { label: 'Sinh viên', value: '/dashboard/admin/students' },
      { label: 'Giảng viên', value: '/dashboard/admin/lecturers' },
      { label: 'Nhân viên', value: '/dashboard/admin/staffs' },
      { label: 'Phân lớp theo học kỳ', value: '/dashboard/admin/student-class-assignments' },
    ],
  },
  {
    group: 'Cơ cấu đào tạo',
    items: [
      { label: 'Khoa / đơn vị', value: '/dashboard/admin/departments' },
      { label: 'Bộ phận chuyên môn', value: '/dashboard/admin/divisions' },
      { label: 'Chức vụ', value: '/dashboard/admin/positions' },
      { label: 'Bằng cấp', value: '/dashboard/admin/degrees' },
      { label: 'Ngành học', value: '/dashboard/admin/majors' },
      { label: 'Chuyên ngành', value: '/dashboard/admin/specializations' },
      { label: 'Khóa đào tạo', value: '/dashboard/admin/academic-cohorts' },
      { label: 'Chương trình đào tạo', value: '/dashboard/admin/training-programs' },
    ],
  },
  {
    group: 'Niên khóa và giảng dạy',
    items: [
      { label: 'Năm học', value: '/dashboard/admin/school-years' },
      { label: 'Học kỳ', value: '/dashboard/admin/semesters' },
      { label: 'Lớp hành chính', value: '/dashboard/admin/classes' },
      { label: 'Môn học', value: '/dashboard/admin/courses' },
      { label: 'Lớp học phần', value: '/dashboard/admin/course-classes' },
      { label: 'Lịch học', value: '/dashboard/admin/schedules' },
      { label: 'Duyệt điều chỉnh lịch', value: '/dashboard/admin/schedule-adjustments' },
    ],
  },
  {
    group: 'Cơ sở vật chất',
    items: [
      { label: 'Tòa nhà', value: '/dashboard/admin/buildings' },
      { label: 'Phòng học', value: '/dashboard/admin/rooms' },
      { label: 'Ca học', value: '/dashboard/admin/time-slots' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { label: 'Tài khoản người dùng', value: '/dashboard/admin/users' },
      { label: 'Phân quyền RBAC', value: '/dashboard/admin/rbac' },
      { label: 'Yêu cầu đặt lại mật khẩu', value: '/dashboard/admin/password-reset-requests' },
    ],
  },
];

const flatPathOptions = PATH_OPTIONS.flatMap(group => group.items);

const permissionIdOf = (permission: Permission) => permission.id || permission.permissionId || '';

export function MenusTab() {
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'delete'; item?: MenuItemType; parentId?: string | null } | null>(null);
  const [form, setForm] = useState<CreateMenuDto>({ name: '', path: '', icon: 'menu', orderIndex: 0, parentId: null, permissionId: null });
  const [menuKind, setMenuKind] = useState<'group' | 'screen'>('screen');
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [menuRes, permRes] = await Promise.all([menuApi.getAll(), permissionApi.getAll()]);
      setMenus(menuRes);
      setAllPermissions(permRes);
      setExpandedIds(new Set(menuRes.filter(menu => !menu.parentId).map(menu => menu.id)));
    } catch {
      toast.error('Không thể tải danh sách menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const buildTree = (items: MenuItemType[], parentId: string | null = null, visited = new Set<string>()): MenuItemType[] => {
    return items
      .filter(item => (item.parentId ?? null) === parentId)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map(item => {
        if (visited.has(item.id)) return { ...item, children: [] };
        const nextVisited = new Set(visited);
        nextVisited.add(item.id);
        return { ...item, children: buildTree(items, item.id, nextVisited) };
      });
  };

  const tree = buildTree(menus);
  const parentMenu = menus.find(menu => menu.id === form.parentId);
  const selectedPermission = allPermissions.find(permission => permissionIdOf(permission) === form.permissionId);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCreate = (parentId?: string | null) => {
    const normalizedParentId = parentId ?? null;
    const siblingsCount = menus.filter(menu => (menu.parentId ?? null) === normalizedParentId).length;
    setMenuKind(normalizedParentId ? 'screen' : 'group');
    setForm({
      name: '',
      path: '',
      icon: normalizedParentId ? 'file-text' : 'menu',
      orderIndex: siblingsCount,
      parentId: normalizedParentId,
      permissionId: null,
    });
    setModal({ mode: 'create', parentId: normalizedParentId });
  };

  const openEdit = (item: MenuItemType) => {
    setMenuKind(item.path ? 'screen' : 'group');
    setForm({
      name: item.name,
      path: item.path || '',
      icon: item.icon || 'menu',
      orderIndex: item.orderIndex ?? 0,
      parentId: item.parentId ?? null,
      permissionId: item.permissionId ?? null,
    });
    setModal({ mode: 'edit', item });
  };

  const openDelete = (item: MenuItemType) => setModal({ mode: 'delete', item });
  const closeModal = () => setModal(null);

  const applyPathOption = (path: string) => {
    const option = flatPathOptions.find(item => item.value === path);
    setForm(prev => ({
      ...prev,
      path,
      name: prev.name || option?.label || prev.name,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Tên menu không được để trống');
      return;
    }
    const payload: CreateMenuDto = {
      ...form,
      path: menuKind === 'group' ? '' : form.path?.trim(),
      permissionId: form.permissionId || null,
    };
    setSaving(true);
    try {
      if (modal?.mode === 'create') {
        await menuApi.create(payload);
        toast.success('Tạo menu thành công');
      } else if (modal?.mode === 'edit' && modal.item) {
        await menuApi.update(modal.item.id, payload as UpdateMenuDto);
        toast.success('Cập nhật menu thành công');
      }
      closeModal();
      await fetchData();
    } catch {
      toast.error('Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!modal?.item) return;
    setSaving(true);
    try {
      await menuApi.delete(modal.item.id);
      toast.success(`Đã xóa menu "${modal.item.name}"`);
      closeModal();
      await fetchData();
    } catch {
      toast.error('Xóa menu thất bại');
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
          name: String(row.Name || row.name || '').trim(),
          path: String(row.Path || row.path || '').trim(),
          icon: String(row.Icon || row.icon || 'menu').trim(),
          orderIndex: Number(row.OrderIndex || row.orderIndex || 0),
          parentId: null,
          permissionId: null,
        };
        if (dto.name) {
          await menuApi.create(dto);
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    if (success > 0) {
      toast.success(`Nhập thành công ${success} menu gốc.`);
      fetchData();
    }
    if (failed > 0) {
      toast.warning(`Có ${failed} dòng bị lỗi hoặc thiếu dữ liệu.`);
    }
    setShowImport(false);
  };

  const MenuNode = ({ item, depth }: { item: MenuItemType; depth: number }) => {
    const hasChildren = (item.children?.length ?? 0) > 0;
    const isExpanded = expandedIds.has(item.id);
    const linkedPerm = allPermissions.find(permission => permissionIdOf(permission) === item.permissionId);
    const isGroup = !item.path;

    return (
      <div>
        <div
          className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/40 ${depth > 0 ? 'ml-6' : ''}`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          <button
            type="button"
            onClick={() => hasChildren && toggleExpand(item.id)}
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center ${hasChildren ? 'text-gray-400 hover:text-gray-600' : 'text-transparent'}`}
          >
            {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="block h-3.5 w-3.5 rounded-sm border border-gray-200 dark:border-gray-700" />}
          </button>

          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
            {isGroup ? <Layers size={14} /> : <Route size={14} />}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isGroup ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
                {isGroup ? 'Nhóm' : 'Màn hình'}
              </span>
            </div>
            {item.path && <code className="mt-0.5 block truncate text-xs text-gray-400">{item.path}</code>}
          </div>

          {linkedPerm ? (
            <span className="hidden max-w-[220px] items-center gap-1 truncate rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 sm:inline-flex">
              <Key size={9} /> {linkedPerm.name}
            </span>
          ) : (
            <span className="hidden items-center gap-1 rounded-full border border-dashed border-gray-200 px-2 py-0.5 text-[11px] text-gray-400 dark:border-gray-700 sm:inline-flex">
              <Unlink size={9} /> Công khai
            </span>
          )}

          <span className="w-8 text-center text-xs text-gray-300 dark:text-gray-600">{item.orderIndex}</span>

          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button type="button" onClick={() => openCreate(item.id)} className="rounded-lg p-1 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600" title="Thêm menu con">
              <Plus size={13} />
            </button>
            <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-1 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600" title="Chỉnh sửa">
              <Pencil size={13} />
            </button>
            <button type="button" onClick={() => openDelete(item)} className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Xóa">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => <MenuNode key={child.id} item={child} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <Layers size={16} /> Nhóm menu
          </div>
          <p className="text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
            Menu gốc không có đường dẫn sẽ là nhóm lớn trên sidebar, ví dụ Hồ sơ nhân sự hoặc Giảng dạy.
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
            <Route size={16} /> Màn hình
          </div>
          <p className="text-xs leading-5 text-blue-700/80 dark:text-blue-300/80">
            Menu có đường dẫn là màn hình người dùng bấm vào, ví dụ Sinh viên, Môn học, RBAC.
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900/40 dark:bg-violet-900/10">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-300">
            <Lock size={16} /> Quyền hiển thị
          </div>
          <p className="text-xs leading-5 text-violet-700/80 dark:text-violet-300/80">
            Gắn quyền để menu chỉ hiện với người dùng có vai trò chứa quyền đó. Không gắn quyền nghĩa là công khai.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
        Menu chỉ điều khiển việc hiển thị trên sidebar. API vẫn phải được bảo vệ ở tab Quyền hạn bằng phần API bảo vệ. Nên dùng cùng một quyền cho cả menu và API để tránh thấy menu nhưng gọi API bị chặn.
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => setShowImport(true)} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/80">
          <UploadCloud size={15} /> Nhập Excel
        </button>
        <button onClick={() => openCreate(null)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">
          <Plus size={15} /> Thêm nhóm/menu gốc
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <span className="flex-1 pl-7 text-xs font-semibold uppercase tracking-wider text-gray-500">Tên menu / đường dẫn</span>
          <span className="hidden w-52 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:block">Quyền hiển thị</span>
          <span className="w-10 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Thứ tự</span>
          <span className="w-24" />
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800" />
            ))}
          </div>
        ) : tree.length === 0 ? (
          <EmptyState
            icon={<Menu size={32} />}
            title="Chưa có menu nào"
            description="Tạo nhóm/menu gốc đầu tiên để cấu hình sidebar"
            action={<button onClick={() => openCreate(null)} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"><Plus size={14} /> Thêm nhóm/menu gốc</button>}
          />
        ) : (
          <div className="space-y-0.5 p-2">
            {tree.map(item => <MenuNode key={item.id} item={item} depth={0} />)}
          </div>
        )}
      </div>

      <Modal isOpen={modal?.mode === 'create' || modal?.mode === 'edit'} onClose={closeModal} className="max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <Menu size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {modal?.mode === 'create' ? (modal.parentId ? 'Thêm menu con' : 'Thêm nhóm/menu gốc') : 'Chỉnh sửa menu'}
              </h2>
              <p className="text-xs text-gray-400">
                {parentMenu ? `Menu cha: ${parentMenu.name}` : 'Menu gốc sẽ nằm cấp đầu tiên trên sidebar'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Loại menu</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMenuKind('group')}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${menuKind === 'group' ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700'}`}
                >
                  Nhóm menu
                </button>
                <button
                  type="button"
                  onClick={() => setMenuKind('screen')}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${menuKind === 'screen' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700'}`}
                >
                  Màn hình có đường dẫn
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                <select
                  value={form.icon || 'menu'}
                  onChange={event => setForm(prev => ({ ...prev, icon: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {ICON_OPTIONS.map(icon => <option key={icon.value} value={icon.value}>{icon.label}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên menu <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                  placeholder={menuKind === 'group' ? 'VD: Hồ sơ nhân sự' : 'VD: Sinh viên'}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {menuKind === 'screen' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Đường dẫn màn hình</label>
                <select
                  value={flatPathOptions.some(option => option.value === form.path) ? form.path : 'CUSTOM'}
                  onChange={event => {
                    if (event.target.value === 'CUSTOM') {
                      setForm(prev => ({ ...prev, path: '' }));
                    } else {
                      applyPathOption(event.target.value);
                    }
                  }}
                  className="mb-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Chọn màn hình có sẵn --</option>
                  {PATH_OPTIONS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </optgroup>
                  ))}
                  <option value="CUSTOM">Tự nhập đường dẫn khác</option>
                </select>
                <input
                  value={form.path || ''}
                  onChange={event => setForm(prev => ({ ...prev, path: event.target.value }))}
                  placeholder="/dashboard/admin/tuy-chinh"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.orderIndex ?? 0}
                  onChange={event => setForm(prev => ({ ...prev, orderIndex: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-1"><Lock size={12} /> Quyền hiển thị menu</span>
                </label>
                <select
                  value={form.permissionId ?? ''}
                  onChange={event => setForm(prev => ({ ...prev, permissionId: event.target.value || null }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Công khai - ai đăng nhập cũng thấy</option>
                  {allPermissions.map(permission => (
                    <option key={permissionIdOf(permission)} value={permissionIdOf(permission)}>
                      {permission.code ? `${permission.code} - ${permission.name}` : permission.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`rounded-xl border px-3 py-2 text-xs leading-5 ${selectedPermission ? 'border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-300' : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400'}`}>
              {selectedPermission ? (
                <span>Menu này chỉ hiển thị khi người dùng có quyền <strong>{selectedPermission.code}</strong>. Hãy đảm bảo quyền này cũng được gắn API tương ứng ở tab Quyền hạn.</span>
              ) : (
                <span>Menu công khai sẽ hiện với mọi tài khoản đã đăng nhập. Chỉ nên dùng cho trang tổng quan hoặc trang không có dữ liệu nhạy cảm.</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700">Hủy</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50">
              {saving && <RefreshCw size={13} className="animate-spin" />}
              {modal?.mode === 'create' ? 'Tạo menu' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal?.mode === 'delete'} onClose={closeModal} className="max-w-sm w-full mx-4">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Xóa menu?</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Xóa menu <span className="font-semibold text-gray-800 dark:text-gray-200">"{modal?.item?.name}"</span>.
            {(modal?.item?.children?.length ?? 0) > 0 && (
              <span className="mt-1 block text-xs text-amber-600">Menu này có {modal?.item?.children?.length} menu con. Hãy kiểm tra trước khi xóa.</span>
            )}
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Hủy</button>
            <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50">
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
        title="Nhập danh sách menu gốc"
        expectedColumns={['Name', 'Path', 'Icon']}
      />
    </div>
  );
}
