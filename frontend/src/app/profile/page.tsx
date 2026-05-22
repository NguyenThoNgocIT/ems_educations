'use client';

import { studentApi } from '@/api/student';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentSelfResponse, StudentSelfUpdateRequest } from '@/types/student';
import { CalendarDays, GraduationCap, Mail, MapPin, Phone, Save, UserRound } from 'lucide-react';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

const editableFields: Array<{
  key: keyof StudentSelfUpdateRequest;
  label: string;
  placeholder: string;
  type?: string;
}> = [
  { key: 'fullName', label: 'Họ và tên', placeholder: 'Nhập họ và tên' },
  { key: 'dateOfBirth', label: 'Ngày sinh', placeholder: '', type: 'date' },
  { key: 'gender', label: 'Giới tính', placeholder: 'Ví dụ: Nam' },
  { key: 'contactEmail', label: 'Email liên hệ', placeholder: 'email@donga.edu.vn', type: 'email' },
  { key: 'phoneNumber', label: 'Số điện thoại', placeholder: 'Nhập số điện thoại' },
  { key: 'placeOfBirth', label: 'Nơi sinh', placeholder: 'Nhập nơi sinh' },
  { key: 'permanentAddress', label: 'Địa chỉ thường trú', placeholder: 'Nhập địa chỉ thường trú' },
  { key: 'temporaryAddress', label: 'Địa chỉ tạm trú', placeholder: 'Nhập địa chỉ tạm trú' },
];

function getInitials(name?: string) {
  if (!name) return 'SV';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function toForm(student: StudentSelfResponse): StudentSelfUpdateRequest {
  return editableFields.reduce<StudentSelfUpdateRequest>((form, field) => {
    form[field.key] = student[field.key] ?? '';
    return form;
  }, {});
}

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentSelfResponse | null>(null);
  const [form, setForm] = useState<StudentSelfUpdateRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    studentApi
      .getMe()
      .then((data) => {
        if (!active) return;
        setStudent(data);
        setForm(toForm(data));
      })
      .catch(() => {
        if (active) setError('Hồ sơ sinh viên chưa tải được từ tài khoản hiện tại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (key: keyof StudentSelfUpdateRequest, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updated = await studentApi.updateMe(form);
      setStudent(updated);
      setForm(toForm(updated));
      toast.success('Đã cập nhật thông tin cá nhân');
    } catch {
      toast.error('Chưa thể cập nhật hồ sơ sinh viên');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">Đang tải hồ sơ sinh viên...</div>;
  }

  if (!student) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-6">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Không có hồ sơ sinh viên để hiển thị</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-8">
      <Card className="border-emerald-100 bg-white dark:border-emerald-900/40">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[auto_1fr]">
          <Avatar className="h-24 w-24 rounded-lg">
            <AvatarFallback className="rounded-lg bg-emerald-600 text-2xl font-bold text-white">
              {getInitials(student.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{student.fullName || 'Sinh viên'}</h1>
              <Badge variant="secondary">Sinh viên</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">Mã sinh viên: {student.studentCode || 'Chưa cập nhật'}</p>

            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4 dark:text-slate-300">
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" />{student.contactEmail || 'Chưa có email'}</span>
              <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-600" />{student.phoneNumber || 'Chưa có điện thoại'}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-600" />{student.admissionDate || 'Chưa có ngày nhập học'}</span>
              <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-emerald-600" />Chương trình đã gán</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cập nhật thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              {editableFields.map((field) => (
                <label key={field.key} className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {field.label}
                  <input
                    type={field.type ?? 'text'}
                    value={String(form[field.key] ?? '')}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>
              ))}

              <div className="md:col-span-2">
                <Button type="submit" size="lg" disabled={saving}>
                  <Save />
                  {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin đào tạo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <InfoRow icon={UserRound} label="Mã hồ sơ" value={student.personId} />
            <InfoRow icon={GraduationCap} label="Ngành học" value={student.majorId} />
            <InfoRow icon={GraduationCap} label="Chương trình" value={student.trainingProgramId} />
            <InfoRow icon={GraduationCap} label="Khóa đào tạo" value={student.academicCohortId} />
            <InfoRow icon={MapPin} label="Địa chỉ hiện tại" value={student.temporaryAddress || student.permanentAddress} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 break-all font-medium text-slate-800 dark:text-slate-100">{value || 'Chưa cập nhật'}</p>
    </div>
  );
}
