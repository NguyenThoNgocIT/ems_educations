'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Sparkles, BookOpen, GraduationCap, Clock, Award, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { courseApi } from '@/api/course';
import LockedFieldInput from '@/components/ems/LockedFieldInput';
import CreditInput from '@/components/ems/CreditInput';
import DepartmentCombobox from '@/components/ems/DepartmentCombobox';
import { Badge } from '@/components/ui/badge';

interface CourseFormData {
  code: string;
  name: string;
  nameEn: string;
  departmentId: string;
  courseType: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  selfStudyHours: number;
  description: string;
  isActive: boolean;
}

interface FormErrors {
  code?: string;
  name?: string;
  departmentId?: string;
  credits?: string;
  theoryHours?: string;
  practiceHours?: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    nameEn: '',
    departmentId: '',
    courseType: 'Bắt buộc',
    credits: 0,
    theoryHours: 0,
    practiceHours: 0,
    selfStudyHours: 0,
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã môn học';
    } else if (!/^[A-Z0-9_-]{3,15}$/.test(formData.code.toUpperCase().trim())) {
      newErrors.code = 'Mã môn chỉ gồm chữ hoa, số, gạch dưới (3-15 ký tự)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên môn học';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Vui lòng chọn khoa phụ trách';
    }

    if (formData.credits <= 0) {
      newErrors.credits = 'Số tín chỉ phải lớn hơn 0';
    }

    if (formData.theoryHours < 0) {
      newErrors.theoryHours = 'Số tiết lý thuyết không thể âm';
    }

    if (formData.practiceHours < 0) {
      newErrors.practiceHours = 'Số tiết thực hành không thể âm';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Vui lòng kiểm tra lại các thông tin lỗi trên form.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading('Đang xử lý tạo môn học...');

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        nameEn: formData.nameEn.trim() || null,
        departmentId: formData.departmentId || null,
        courseType: formData.courseType || 'Bắt buộc',
        credits: Number(formData.credits),
        theoryHours: Number(formData.theoryHours),
        practiceHours: Number(formData.practiceHours),
        internshipCredits: null,
        description: formData.description.trim() || null,
        isActive: formData.isActive,
      };

      await courseApi.create(payload);
      
      toast.success('Tạo môn học mới thành công!', { id: toastId });
      
      // Navigate immediately
      router.push('/dashboard/admin/courses');
    } catch (error: any) {
      console.error('Lỗi khi tạo môn học:', error);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const clientMessage = error?.message || 'Có lỗi xảy ra khi tạo môn học';
      toast.error(serverMessage || clientMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const totalHours = Number(formData.theoryHours || 0) + Number(formData.practiceHours || 0) + Number(formData.selfStudyHours || 0);

  return (
    <div className="space-y-6">
      {/* BACK BUTTON & TOP QUICK ACTIONS */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/admin/courses')} 
          className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg py-1.5 px-3 -ml-2 font-semibold"
        >
          <ArrowLeft className="h-4.5 w-4.5 mr-1.5 stroke-[2px]" />
          Quay lại danh sách
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.push('/dashboard/admin/courses')}
            className="border-slate-200 dark:border-slate-800 rounded-xl px-4 h-9.5 text-xs hover:bg-slate-50 transition-all font-semibold"
          >
            Hủy
          </Button>
          <Button 
            onClick={() => handleSubmit()} 
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-4.5 h-9.5 text-xs transition-all flex items-center gap-1.5 shadow-sm" 
            disabled={loading}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu môn học
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MAIN FORM */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-850">
              <CardTitle className="text-2xl font-semibold text-slate-850 dark:text-slate-100">
                Tạo môn học mới
              </CardTitle>
              <CardDescription>
                Nhập đầy đủ thông tin bên dưới để khởi tạo một môn học chính thức trên hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mã môn học & Tên môn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LockedFieldInput
                    id="code"
                    label="Mã môn học *"
                    isLocked={false}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    error={errors.code}
                    placeholder="Ví dụ: INT3306"
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="courseType" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      Loại môn học
                    </Label>
                    <Select 
                      value={formData.courseType} 
                      onValueChange={(val) => setFormData({ ...formData, courseType: val || '' })}
                    >
                      <SelectTrigger className="h-11 border-slate-200 dark:border-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bắt buộc">Bắt buộc</SelectItem>
                        <SelectItem value="Tự chọn">Tự chọn</SelectItem>
                        <SelectItem value="Thực tập">Thực tập</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tên môn học tiếng Việt */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    Tên môn học (Tiếng Việt) *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 border-slate-200 dark:border-slate-800"
                    placeholder="Ví dụ: Phát triển ứng dụng Web"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>}
                </div>

                {/* Tên môn học tiếng Anh */}
                <div className="space-y-1.5">
                  <Label htmlFor="nameEn" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    Tên môn học (Tiếng Anh)
                  </Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="h-11 border-slate-200 dark:border-slate-800"
                    placeholder="Ví dụ: Web Application Development"
                  />
                </div>

                {/* DepartmentCombobox */}
                <div className="space-y-1.5">
                  <DepartmentCombobox
                    label="Khoa phụ trách *"
                    value={formData.departmentId}
                    onChange={(val) => setFormData({ ...formData, departmentId: val })}
                    error={errors.departmentId}
                  />
                </div>

                {/* CreditInput (Credits & Self-Study Hours) */}
                <div className="space-y-1.5">
                  <CreditInput
                    credits={formData.credits}
                    onChangeCredits={(val) => setFormData({ ...formData, credits: val })}
                    selfStudyHours={formData.selfStudyHours}
                    onChangeSelfStudy={(val) => setFormData({ ...formData, selfStudyHours: val })}
                    error={errors.credits}
                  />
                </div>

                {/* Số tiết lý thuyết & Số tiết thực hành */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="theoryHours" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      Số tiết lý thuyết
                    </Label>
                    <div className="relative">
                      <Input
                        id="theoryHours"
                        type="number"
                        min="0"
                        value={formData.theoryHours || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFormData({ ...formData, theoryHours: isNaN(val) ? 0 : val });
                        }}
                        className="h-11 border-slate-200 dark:border-slate-800 pr-14"
                      />
                      <span className="absolute inset-y-0 right-3.5 flex items-center text-xs text-slate-400 font-medium select-none">
                        tiết
                      </span>
                    </div>
                    {errors.theoryHours && <p className="text-xs text-destructive mt-1 font-medium">{errors.theoryHours}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="practiceHours" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      Số tiết thực hành
                    </Label>
                    <div className="relative">
                      <Input
                        id="practiceHours"
                        type="number"
                        min="0"
                        value={formData.practiceHours || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFormData({ ...formData, practiceHours: isNaN(val) ? 0 : val });
                        }}
                        className="h-11 border-slate-200 dark:border-slate-800 pr-14"
                      />
                      <span className="absolute inset-y-0 right-3.5 flex items-center text-xs text-slate-400 font-medium select-none">
                        tiết
                      </span>
                    </div>
                    {errors.practiceHours && <p className="text-xs text-destructive mt-1 font-medium">{errors.practiceHours}</p>}
                  </div>
                </div>

                {/* Mô tả */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    Mô tả môn học
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-slate-200 dark:border-slate-800 min-h-[110px]"
                    placeholder="Nhập tóm tắt mô tả chi tiết, nội dung môn học..."
                  />
                </div>

                {/* SUBMIT BUTTONS */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl px-6 h-11 transition-all flex items-center gap-2" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="h-4.5 w-4.5" />
                    )}
                    Thêm môn học mới
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/admin/courses')}
                    className="border-slate-200 dark:border-slate-800 rounded-xl px-5 h-11 hover:bg-slate-50 transition-all font-semibold"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <Card className="border-none bg-slate-900 text-slate-100 dark:bg-slate-950/80 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10">
            <div className="bg-radial-gradient from-primary/30 to-slate-900 p-6 pb-8 text-center relative overflow-hidden">
              <h3 className="text-lg font-bold uppercase tracking-widest text-primary/80">XEM TRƯỚC MÔN HỌC</h3>
              <p className="text-xs text-slate-400 mt-1">Thông tin chi tiết hiển thị trên hệ thống</p>

              {/* Gradient Credit Ring */}
              <div className="mt-8 flex justify-center">
                <div className="relative flex items-center justify-center h-32 w-32 rounded-full border border-white/5 bg-slate-950/40 p-4 shadow-inner">
                  <div className="absolute inset-0.5 rounded-full border border-primary/20 animate-spin-slow"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {Number(formData.credits || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">Tín chỉ</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Quick Info Grid */}
              <div className="space-y-4">
                {/* Code & Type */}
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-slate-450 font-medium flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    Mã môn học
                  </span>
                  <Badge className="bg-primary/20 text-primary border-none font-mono font-bold text-xs rounded-md">
                    {formData.code.toUpperCase().trim() || '—'}
                  </Badge>
                </div>

                {/* Name VI */}
                <div className="py-2 border-b border-white/5 space-y-1">
                  <span className="text-xs text-slate-450 font-medium">Tên môn học (VI)</span>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {formData.name.trim() || 'Chưa nhập tên môn học'}
                  </p>
                </div>

                {/* Name EN */}
                <div className="py-2 border-b border-white/5 space-y-1">
                  <span className="text-xs text-slate-450 font-medium">Tên môn học (EN)</span>
                  <p className="text-sm text-slate-300 font-medium italic">
                    {formData.nameEn.trim() || '—'}
                  </p>
                </div>

                {/* Department & Type */}
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-450 font-medium flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Khoa
                    </span>
                    <p className="text-sm font-semibold text-white truncate">
                      {formData.departmentId ? 'Đã liên kết' : 'Chưa chọn'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-450 font-medium">Loại môn</span>
                    <p className="text-sm font-semibold text-white">
                      {formData.courseType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours Breakdown Progress Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Cấu trúc thời lượng ({totalHours} tiết)
                </h4>

                <div className="space-y-3">
                  {/* Theory */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Lý thuyết</span>
                      <span className="text-slate-200 font-semibold">{formData.theoryHours} tiết</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300 rounded-full" 
                        style={{ width: `${totalHours > 0 ? (formData.theoryHours / totalHours) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Practice */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">Thực hành</span>
                      <span className="text-slate-200 font-semibold">{formData.practiceHours} tiết</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 transition-all duration-300 rounded-full" 
                        style={{ width: `${totalHours > 0 ? (formData.practiceHours / totalHours) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Self-Study */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400 flex items-center gap-1">
                        Tự học
                        <Badge className="bg-emerald-500/10 text-emerald-450 border-none font-semibold px-1 py-0 h-4 text-[8px] animate-pulse">
                          x2.0
                        </Badge>
                      </span>
                      <span className="text-slate-200 font-semibold">{formData.selfStudyHours} giờ</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-300 rounded-full" 
                        style={{ width: `${totalHours > 0 ? (formData.selfStudyHours / totalHours) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}