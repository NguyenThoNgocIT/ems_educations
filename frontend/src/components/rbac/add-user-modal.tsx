import React, { useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw, Search, ShieldCheck, UserPlus, X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { DatePicker } from '@/components/ui/date-picker';
import { request } from '@/utils/request';
import type { Role } from '@/types/rbac';
import { fixMojibakeText } from '@/utils/text';
import { parseUserList } from './shared';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRoles: Role[];
  onSave: (userData: any) => void;
}

type AccountType = 'STUDENT' | 'LECTURER' | 'STAFF';

const roleIdOf = (role: Role) => role.id || role.roleId || '';

function removeVietnameseTones(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getOptionId(item: any, keys: string[]) {
  for (const key of keys) {
    if (item?.[key]) return item[key];
  }
  return item?.id || '';
}

function getOptionName(item: any) {
  return fixMojibakeText(item?.name || item?.fullName || item?.code || 'Chưa có tên');
}

export function AddUserModal({ isOpen, onClose, allRoles, onSave }: AddUserModalProps) {
  const [fullName, setFullName] = useState('');
  const [fullNameNoAccent, setFullNameNoAccent] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('STUDENT');
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [roleSearch, setRoleSearch] = useState('');
  const [loadingLookups, setLoadingLookups] = useState(false);

  const [divisions, setDivisions] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [selectedCohortId, setSelectedCohortId] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');

  const isStudent = accountType === 'STUDENT';
  const isLecturer = accountType === 'LECTURER';
  const isStaff = accountType === 'STAFF';

  useEffect(() => {
    if (!isOpen) return;
    const fetchLookups = async () => {
      setLoadingLookups(true);
      try {
        const [divisionRes, positionRes, departmentRes, majorRes, cohortRes, programRes] = await Promise.all([
          request.get('/api/v1/divisions/admin'),
          request.get('/api/v1/positions/admin'),
          request.get('/api/v1/departments/admin'),
          request.get('/api/v1/majors/admin'),
          request.get('/api/v1/academic-cohorts/admin'),
          request.get('/api/v1/training-programs/admin'),
        ]);
        setDivisions(parseUserList(divisionRes));
        setPositions(parseUserList(positionRes));
        setDepartments(parseUserList(departmentRes));
        setMajors(parseUserList(majorRes));
        setCohorts(parseUserList(cohortRes));
        setPrograms(parseUserList(programRes));
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookups();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const baseRole = allRoles.find(role => role.code === accountType);
    const baseRoleId = baseRole ? roleIdOf(baseRole) : '';
    setSelectedRoles(prev => {
      const objectRoles = new Set(['STUDENT', 'LECTURER', 'STAFF']);
      const next = new Set(Array.from(prev).filter(roleId => {
        const role = allRoles.find(item => roleIdOf(item) === roleId);
        return !role || !objectRoles.has(role.code) || role.code === accountType;
      }));
      if (baseRoleId) next.add(baseRoleId);
      return next;
    });
  }, [accountType, allRoles, isOpen]);

  useEffect(() => {
    if (fullName.trim()) {
      setFullNameNoAccent(removeVietnameseTones(fullName));
    } else {
      setFullNameNoAccent('');
    }
  }, [fullName]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setSelectedMajorId('');
      setSelectedProgramId('');
      return;
    }
    const validMajor = majors.some(major =>
      String(getOptionId(major, ['majorId'])) === String(selectedMajorId) &&
      String(major.departmentId || major.department?.departmentId || '') === String(selectedDepartmentId),
    );
    if (!validMajor) {
      setSelectedMajorId('');
      setSelectedProgramId('');
    }
  }, [selectedDepartmentId, selectedMajorId, majors]);

  const filteredMajors = useMemo(() => {
    return selectedDepartmentId
      ? majors.filter(major => String(major.departmentId || major.department?.departmentId || '') === String(selectedDepartmentId))
      : majors;
  }, [majors, selectedDepartmentId]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const departmentId = String(program.departmentId || program.department?.departmentId || '');
      const majorId = String(program.majorId || program.major?.majorId || '');
      const cohortId = String(program.academicCohortId || program.cohortId || program.academicCohort?.academicCohortId || '');
      return (!selectedDepartmentId || !departmentId || departmentId === String(selectedDepartmentId))
        && (!selectedMajorId || !majorId || majorId === String(selectedMajorId))
        && (!selectedCohortId || !cohortId || cohortId === String(selectedCohortId));
    });
  }, [programs, selectedDepartmentId, selectedMajorId, selectedCohortId]);

  const filteredRoles = useMemo(() => {
    const keyword = roleSearch.trim().toLowerCase();
    if (!keyword) return allRoles;
    return allRoles.filter(role =>
      role.code.toLowerCase().includes(keyword) ||
      role.name.toLowerCase().includes(keyword) ||
      role.description?.toLowerCase().includes(keyword),
    );
  }, [allRoles, roleSearch]);

  const isFormValid = Boolean(fullName.trim() && dob)
    && (!isStudent || Boolean(selectedDepartmentId && selectedCohortId))
    && (!isLecturer || Boolean(selectedDepartmentId))
    && (!isStaff || Boolean(selectedDivisionId));

  const toggleRole = (role: Role) => {
    const id = roleIdOf(role);
    if (!id) return;
    setSelectedRoles(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const resetForm = () => {
    setFullName('');
    setFullNameNoAccent('');
    setDob('');
    setGender('');
    setPhoneNumber('');
    setContactEmail('');
    setAccountType('STUDENT');
    setSelectedRoles(new Set());
    setRoleSearch('');
    setSelectedDivisionId('');
    setSelectedPositionId('');
    setSelectedDepartmentId('');
    setSelectedMajorId('');
    setSelectedCohortId('');
    setSelectedProgramId('');
  };

  const handleSave = () => {
    const roleIds = new Set(selectedRoles);
    const baseRole = allRoles.find(role => role.code === accountType);
    const baseRoleId = baseRole ? roleIdOf(baseRole) : '';
    if (baseRoleId) roleIds.add(baseRoleId);

    onSave({
      fullName: fullName.trim(),
      fullNameNoAccent,
      dob,
      gender: gender || null,
      phoneNumber: phoneNumber || null,
      contactEmail: contactEmail || null,
      accountType,
      roles: Array.from(roleIds),
      isStudent,
      isLecturer,
      isStaff,
      divisionId: selectedDivisionId || null,
      positionId: selectedPositionId || null,
      departmentId: selectedDepartmentId || null,
      majorId: selectedMajorId || null,
      academicCohortId: selectedCohortId || null,
      trainingProgramId: selectedProgramId || null,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-5xl w-full mx-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-5 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thêm tài khoản người dùng</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Backend tự sinh mã số, username, email edu, mật khẩu ban đầu và gắn vai trò cơ bản.
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-200/60 dark:hover:bg-gray-700" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[74vh] overflow-y-auto p-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Thông tin cá nhân</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                      value={fullName}
                      onChange={event => setFullName(event.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên không dấu</label>
                    <input
                      value={fullNameNoAccent}
                      onChange={event => setFullNameNoAccent(event.target.value)}
                      placeholder="Tu sinh tu ho ten"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày sinh <span className="text-red-500">*</span></label>
                    <DatePicker value={dob} onChange={setDob} placeholder="Chọn ngày sinh" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Giới tính</label>
                    <select
                      value={gender}
                      onChange={event => setGender(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    >
                      <option value="">Chưa chọn</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                    <input
                      value={phoneNumber}
                      onChange={event => setPhoneNumber(event.target.value)}
                      placeholder="090..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email cá nhân</label>
                    <input
                      value={contactEmail}
                      onChange={event => setContactEmail(event.target.value)}
                      placeholder="email cá nhân nếu có"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Loại đối tượng</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'STUDENT', label: 'Sinh viên' },
                    { value: 'LECTURER', label: 'Giảng viên' },
                    { value: 'STAFF', label: 'Nhân viên' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAccountType(option.value as AccountType)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${accountType === option.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {loadingLookups ? (
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800">
                  <RefreshCw size={15} className="animate-spin" /> Đang tải dữ liệu nền...
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(isStudent || isLecturer) && (
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Khoa/Bộ môn <span className="text-red-500">*</span>
                      </label>
                      <select value={selectedDepartmentId} onChange={event => setSelectedDepartmentId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                        <option value="">-- Chọn khoa/bộ môn --</option>
                        {departments.map(item => <option key={getOptionId(item, ['departmentId'])} value={getOptionId(item, ['departmentId'])}>{getOptionName(item)}</option>)}
                      </select>
                    </div>
                  )}

                  {isStudent && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ngành</label>
                        <select value={selectedMajorId} onChange={event => setSelectedMajorId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                          <option value="">-- Có thể để trống giai đoạn cơ sở --</option>
                          {filteredMajors.map(item => <option key={getOptionId(item, ['majorId'])} value={getOptionId(item, ['majorId'])}>{getOptionName(item)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Niên khóa <span className="text-red-500">*</span></label>
                        <select value={selectedCohortId} onChange={event => setSelectedCohortId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                          <option value="">-- Chọn niên khóa --</option>
                          {cohorts.map(item => <option key={getOptionId(item, ['academicCohortId', 'cohortId'])} value={getOptionId(item, ['academicCohortId', 'cohortId'])}>{getOptionName(item)}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Chương trình đào tạo</label>
                        <select value={selectedProgramId} onChange={event => setSelectedProgramId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                          <option value="">-- Có thể để trống, chọn sau --</option>
                          {filteredPrograms.map(item => <option key={getOptionId(item, ['trainingProgramId'])} value={getOptionId(item, ['trainingProgramId'])}>{getOptionName(item)}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {isStaff && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phòng ban <span className="text-red-500">*</span></label>
                        <select value={selectedDivisionId} onChange={event => setSelectedDivisionId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                          <option value="">-- Chọn phòng ban --</option>
                          {divisions.map(item => <option key={getOptionId(item, ['divisionId'])} value={getOptionId(item, ['divisionId'])}>{getOptionName(item)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Chức vụ</label>
                        <select value={selectedPositionId} onChange={event => setSelectedPositionId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                          <option value="">-- Chọn chức vụ nếu có --</option>
                          {positions.map(item => <option key={getOptionId(item, ['positionId'])} value={getOptionId(item, ['positionId'])}>{getOptionName(item)}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
                <p className="font-semibold">Tài khoản tự động</p>
                <p className="mt-1 text-xs">
                  Sau khi lưu, backend sẽ sinh mã đối tượng, username/email edu theo mã đó, mật khẩu mặc định theo ngày sinh và đặt `requirePasswordChange = true`.
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Vai trò gán thêm</p>
                  <div className="relative w-44">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={roleSearch}
                      onChange={event => setRoleSearch(event.target.value)}
                      placeholder="Tìm vai trò..."
                      className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs dark:border-gray-700 dark:bg-gray-950"
                    />
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                      <tr>
                        <th className="w-10 px-3 py-2"></th>
                        <th className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Vai trò</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-gray-500">Quyền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoles.map(role => {
                        const id = roleIdOf(role);
                        const checked = selectedRoles.has(id);
                        const isBase = role.code === accountType;
                        return (
                          <tr key={id || role.code} onClick={() => !isBase && toggleRole(role)} className={`border-b border-gray-100 transition dark:border-gray-800 ${isBase ? 'bg-emerald-50/70 dark:bg-emerald-900/20' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}>
                            <td className="px-3 py-2.5">
                              <span className={`flex h-5 w-5 items-center justify-center rounded border-2 ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'}`}>
                                {checked && <Check size={12} />}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <p className="font-semibold text-gray-800 dark:text-gray-100">{fixMojibakeText(role.name)}</p>
                              <p className="text-xs text-gray-400">{role.code}{isBase ? ' · Vai trò cơ bản bắt buộc' : ''}</p>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">{role.permissionCount ?? role.permissions?.length ?? 0}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">
            <ShieldCheck size={14} />
            Sẵn sàng tạo tài khoản theo đúng vai trò đối tượng
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleClose} className="px-5 py-2 text-sm font-semibold text-gray-500 transition hover:text-gray-700">
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid}
              className={`flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold text-white shadow-lg transition ${isFormValid ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700' : 'cursor-not-allowed bg-gray-300 shadow-none'}`}
            >
              Tạo tài khoản <Check size={16} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
