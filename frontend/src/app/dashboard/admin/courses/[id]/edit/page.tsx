'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Sparkles, BookOpen, GraduationCap, Clock, Award, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { courseApi, courseClassApi } from '@/api/course';
import LockedFieldInput from '@/components/ems/LockedFieldInput';
import CreditInput from '@/components/ems/CreditInput';
import DepartmentCombobox from '@/components/ems/DepartmentCombobox';
import { Badge } from '@/components/ui/badge';

interface CourseFormData {
  id: string;
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
  name?: string;
  departmentId?: string;
  credits?: string;
  theoryHours?: string;
  practiceHours?: string;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [hasClasses, setHasClasses] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<CourseFormData>({
    id: '',
    code: '',
    name: '',
    nameEn: '',
    departmentId: '',
    courseType: 'Bắt buộc',
    credits: 3.0,
    theoryHours: 30,
    practiceHours: 30,
    selfStudyHours: 6.0,
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch course details & classes open check
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setPageLoading(true);
        
        // 1. Fetch course details
        const courseRes: any = await courseApi.getById(id);
        if (!courseRes) throw new Error('Không tìm thấy môn học');

        // Handle flexible API wrappers
        const item = courseRes.data ? courseRes.data : courseRes;
        
        const mappedData: CourseFormData = {
          id: item.courseId || item.id || id,
          code: item.code || '',
          name: item.name || '',
          nameEn: item.nameEn || '',
          departmentId: item.departmentId || '',
          courseType: item.courseType || 'Bắt buộc',
          credits: typeof item.credits === 'number' ? item.credits : parseFloat(item.credits) || 3.0,
          theoryHours: typeof item.theoryHours === 'number' ? item.theoryHours : parseInt(item.theoryHours) || 0,
          practiceHours: typeof item.practiceHours === 'number' ? item.practiceHours : parseInt(item.practiceHours) || 0,
          selfStudyHours: typeof item.selfStudyHours === 'number' ? item.selfStudyHours : parseFloat(item.selfStudyHours) || 0.0,
          description: item.description || '',
          isActive: item.isActive !== undefined ? item.isActive : true,
        };

        setFormData(mappedData);

        // 2. Fetch classes under this course to check if they exist
        const classesRes: any = await courseClassApi.getByCourse(id);
        let classesList = [];
        if (classesRes && Array.isArray(classesRes)) {
          classesList = classesRes;
        } else if (classesRes && Array.isArray(classesRes.data)) {
          classesList = classesRes.data;
        }

        if (classesList.length > 0) {
          setHasClasses(true);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết môn học:', err);
        toast.error('Không thể tải chi tiết môn học hoặc môn học không tồn tại');
        router.push('/dashboard/admin/courses');
      } finally {
        setPageLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaveLoading(true);
    const toastId = toast.loading('Đang cập nhật môn học...');

    try {
      const payload = {
        courseId: formData.id,
        code: formData.code,
        name: formData.name.trim(),
        nameEn: formData.nameEn.trim() || null,
        departmentId: formData.departmentId,
        courseType: formData.courseType,
        credits: formData.credits,
        theoryHours: formData.theoryHours,
        practiceHours: formData.practiceHours,
        selfStudyHours: formData.selfStudyHours,
        description: formData.description.trim() || null,
        isActive: formData.isActive
      };

      await courseApi.update(id, payload);
      
      toast.success('Cập nhật thông tin môn học thành công!', { id: toastId });
      router.push('/dashboard/admin/courses');
    } catch (error: any) {
      console.error('Lỗi khi cập nhật môn học:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin môn học', { id: toastId });
    } finally {
      setSaveLoading(false);
    }
  };

  const totalHours = Number(formData.theoryHours || 0) + Number(formData.practiceHours || 0) + Number(formData.selfStudyHours || 0);

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-450 gap-2">
        <RefreshCw className="h-9 w-9 animate-spin text-primary" />
        <span className="text-sm font-semibold">Đang tải thông tin môn học...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/admin/courses')} 
          className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg py-1.5 px-3 -ml-2 font-semibold"
        >
          <ArrowLeft className="h-4.5 w-4.5 mr-1.5 stroke-[2px]" />
          Quay lại danh sách
        </Button>
      </div>

      {/* CLASSS WARNING BANNER */}
      {hasClasses && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-850 dark:text-amber-400 flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertTriangle className="h-6 w-6 stroke-[2px] shrink-0 text-amber-550 dark:text-amber-500" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Cảnh báo: Môn học đã mở lớp học phần!</h4>
            <p className="text-xs leading-relaxed opacity-90">
              Môn học này hiện đang có các lớp học phần được mở trong học kỳ này. Bất kỳ sửa đổi nào đối với cơ cấu tín chỉ, loại học phần, lý thuyết/thực hành có thể ảnh hưởng trực tiếp đến dữ liệu đào tạo và phân chia thời khóa biểu hiện có. Hãy cẩn trọng trước khi lưu thay đổi!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MAIN EDIT FORM */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-855">
              <CardTitle className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
                Chỉnh sửa môn học
              </CardTitle>
              <CardDescription>
                Mã môn học được giữ cố định. Bạn có thể thay đổi các thông tin chi tiết khác của môn học bên dưới.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mã môn học (LOCKED) & Loại */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LockedFieldInput
                    id="code"
                    label="Mã môn học *"
                    isLocked={true}
                    lockMessage="Mã môn học là trường định danh cốt lõi và không thể sửa đổi sau khi khởi tạo để duy trì tính toàn vẹn của dữ liệu."
                    value={formData.code}
                    placeholder="INT3306"
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="courseType" className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      Loại môn học
                    </Label>
                    <Select 
                      value={formData.courseType} 
                      onValueChange={(val) => setFormData({ ...formData, courseType: val || '' })}
                    >
                      <SelectTrigger className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium">
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
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="h-4.5 w-4.5" />
                    )}
                    Cập nhật thay đổi
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

        {/* RIGHT COLUMN: PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <Card className="border-none bg-slate-900 text-slate-100 dark:bg-slate-950/80 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10">
            <div className="bg-radial-gradient from-primary/30 to-slate-900 p-6 pb-8 text-center relative overflow-hidden">
              <div className="absolute top-3 right-3 text-primary animate-pulse opacity-40">
                <Sparkles className="h-6 w-6" />
              </div>
              
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
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