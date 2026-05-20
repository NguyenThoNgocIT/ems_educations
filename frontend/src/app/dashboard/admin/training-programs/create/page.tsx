'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { trainingProgramApi } from '@/api/training-program';
import { majorApi } from '@/api/major';
import { academicCohortApi } from '@/api/academic-cohort';

export default function CreateTrainingProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [fetchingMajors, setFetchingMajors] = useState(true);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [fetchingCohorts, setFetchingCohorts] = useState(true);

  const [formData, setFormData] = useState({
    // Required fields
    code: '',
    name: '',
    programCode: '',
    programName: '',
    academicYear: '',
    majorId: '',
    academicCohortId: '',
    departmentId: '',
    // Optional fields with defaults
    nameEn: '',
    degreeLevel: 'Đại học',
    educationType: 'Chính quy',
    totalCredits: 0,
    requiredCredits: 0,
    electiveCredits: 0,
    internshipCredits: 0,
    thesisCredits: 0,
    admissionYear: new Date().getFullYear().toString(),
    durationYears: 4,
    maxDurationYears: 6,
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    description: '',
    objectives: '',
    learningOutcomes: '',
    version: '1.0',
    status: 'ACTIVE',
    isActive: true,
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsRes, cohortsRes]: any = await Promise.all([
          majorApi.getAll({ size: 100 }),
          academicCohortApi.getAll()
        ]);
        
        let majorsData = [];
        if (majorsRes?.data?.content) {
          majorsData = majorsRes.data.content;
        } else if (majorsRes?.content) {
          majorsData = majorsRes.content;
        } else if (Array.isArray(majorsRes?.data)) {
          majorsData = majorsRes.data;
        } else if (Array.isArray(majorsRes)) {
          majorsData = majorsRes;
        }
        setMajors(majorsData);
        
        let cohortsData = [];
        if (cohortsRes?.data?.content) {
          cohortsData = cohortsRes.data.content;
        } else if (cohortsRes?.content) {
          cohortsData = cohortsRes.content;
        } else if (Array.isArray(cohortsRes?.data)) {
          cohortsData = cohortsRes.data;
        } else if (Array.isArray(cohortsRes)) {
          cohortsData = cohortsRes;
        }
        setCohorts(cohortsData);
        
        if (cohortsData && cohortsData.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            academicCohortId: cohortsData[0].cohortId,
            academicYear: `${cohortsData[0].startYear}-${cohortsData[0].endYear}`
          }));
        }
        
        // Lấy departmentId từ major đầu tiên nếu có
        if (majorsData && majorsData.length > 0 && majorsData[0].departmentId) {
          setFormData(prev => ({ ...prev, departmentId: majorsData[0].departmentId }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Không thể tải dữ liệu từ máy chủ');
      } finally {
        setFetchingMajors(false);
        setFetchingCohorts(false);
      }
    };
    fetchData();
  }, []);

  // Cập nhật departmentId khi chọn major
  useEffect(() => {
    if (formData.majorId) {
      const selectedMajor = majors.find(m => m.majorId === formData.majorId);
      if (selectedMajor?.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: selectedMajor.departmentId }));
      }
    }
  }, [formData.majorId, majors]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.code) {
    toast.error('Vui lòng nhập mã chương trình');
    return;
  }
  if (!formData.name) {
    toast.error('Vui lòng nhập tên chương trình');
    return;
  }
  if (!formData.majorId) {
    toast.error('Vui lòng chọn ngành học');
    return;
  }
  if (!formData.academicCohortId) {
    toast.error('Vui lòng chọn khóa học');
    return;
  }
  if (!formData.departmentId) {
    toast.error('Không xác định được khoa');
    return;
  }

  setLoading(true);
  try {
    // Format admissionYear thành YYYY-MM-DD
    const admissionYearFormatted = formData.admissionYear 
      ? `${formData.admissionYear}-01-01` 
      : null;
    
    const submitData = {
      code: formData.code,
      name: formData.name,
      programCode: formData.code,
      programName: formData.name,
      nameEn: formData.nameEn || '',
      majorId: formData.majorId,
      departmentId: formData.departmentId,
      academicCohortId: formData.academicCohortId,
      academicYear: formData.academicYear,
      degreeLevel: formData.degreeLevel,
      educationType: formData.educationType,
      totalCredits: Number(formData.totalCredits),
      requiredCredits: Number(formData.requiredCredits),
      electiveCredits: Number(formData.electiveCredits),
      internshipCredits: Number(formData.internshipCredits),
      thesisCredits: Number(formData.thesisCredits),
      admissionYear: admissionYearFormatted,  // ← "2026-01-01"
      durationYears: Number(formData.durationYears),
      maxDurationYears: Number(formData.maxDurationYears),
      effectiveDate: formData.effectiveDate || null,
      expiryDate: formData.expiryDate || null,
      description: formData.description || '',
      objectives: formData.objectives || '',
      learningOutcomes: formData.learningOutcomes || '',
      version: formData.version || '1.0',
      status: formData.status,
      isActive: true,
      note: formData.note || ''
    };
    
    console.log('📦 Submit data:', submitData);
    await trainingProgramApi.create(submitData);
    toast.success('Thêm chương trình đào tạo thành công');
    router.push('/dashboard/admin/training-programs');
  } catch (error: any) {
    console.error('❌ Error:', error);
    console.error('❌ Response:', error.response?.data);
    toast.error(error.response?.data?.message || 'Thêm chương trình đào tạo thất bại');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-green-600" />
            Thêm Chương trình đào tạo mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã chương trình (code) */}
            <div className="space-y-2">
              <Label htmlFor="code" className="font-semibold">Mã chương trình <span className="text-red-500">*</span></Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value, programCode: e.target.value })}
                placeholder="VD: CTDT_CNTT_2024"
              />
            </div>

            {/* Tên chương trình (name) */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">Tên chương trình <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, programName: e.target.value })}
                placeholder="VD: Chương trình đào tạo CNTT Khóa 2024"
              />
            </div>

            {/* Tên tiếng Anh */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">Tên chương trình (Tiếng Anh)</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="VD: Information Technology Training Program"
              />
            </div>

            {/* Ngành học */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="majorId" className="font-semibold">Ngành học <span className="text-red-500">*</span></Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => router.push('/dashboard/admin/majors/create')}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm mới ngành
                </Button>
              </div>
              <select
                id="majorId"
                value={formData.majorId}
                onChange={(e) => setFormData({ ...formData, majorId: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                disabled={fetchingMajors}
              >
                <option value="">{fetchingMajors ? 'Đang tải ngành học...' : '-- Chọn ngành học --'}</option>
                {majors.map((major) => (
                  <option key={major.majorId} value={major.majorId}>
                    {major.code} - {major.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Khóa học */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="academicCohortId" className="font-semibold">Khóa học <span className="text-red-500">*</span></Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-xs text-green-600 hover:text-green-700"
                  onClick={() => router.push('/dashboard/admin/academic-cohorts/create')}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm mới khóa học
                </Button>
              </div>
              <select
                id="academicCohortId"
                value={formData.academicCohortId}
                onChange={(e) => {
                  const selected = cohorts.find(c => c.cohortId === e.target.value);
                  setFormData({ 
                    ...formData, 
                    academicCohortId: e.target.value,
                    academicYear: selected ? `${selected.startYear}-${selected.endYear}` : ''
                  });
                }}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                disabled={fetchingCohorts}
              >
                <option value="">{fetchingCohorts ? 'Đang tải khóa học...' : '-- Chọn khóa học --'}</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.cohortId} value={cohort.cohortId}>
                    {cohort.code} - {cohort.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Năm học */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="font-semibold">Năm học <span className="text-red-500">*</span></Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="VD: 2024-2028"
              />
            </div>

            {/* Năm tuyển sinh */}
            <div className="space-y-2">
              <Label htmlFor="admissionYear">Năm tuyển sinh</Label>
              <Input
                id="admissionYear"
                type="number"
                value={formData.admissionYear}
                onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                placeholder="2024"
              />
            </div>

            {/* Thời gian đào tạo */}
            <div className="space-y-2">
              <Label htmlFor="durationYears">Thời gian đào tạo (năm)</Label>
              <Input
                id="durationYears"
                type="number"
                value={formData.durationYears}
                onChange={(e) => setFormData({ ...formData, durationYears: parseInt(e.target.value) || 0 })}
                placeholder="4"
              />
            </div>

            {/* Thời gian đào tạo tối đa */}
            <div className="space-y-2">
              <Label htmlFor="maxDurationYears">Thời gian đào tạo tối đa (năm)</Label>
              <Input
                id="maxDurationYears"
                type="number"
                value={formData.maxDurationYears}
                onChange={(e) => setFormData({ ...formData, maxDurationYears: parseInt(e.target.value) || 0 })}
                placeholder="6"
              />
            </div>

            {/* Tổng số tín chỉ */}
            <div className="space-y-2">
              <Label htmlFor="totalCredits">Tổng số tín chỉ</Label>
              <Input
                id="totalCredits"
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 0 })}
                placeholder="120"
              />
            </div>

            {/* Tín chỉ bắt buộc */}
            <div className="space-y-2">
              <Label htmlFor="requiredCredits">Tín chỉ bắt buộc</Label>
              <Input
                id="requiredCredits"
                type="number"
                value={formData.requiredCredits}
                onChange={(e) => setFormData({ ...formData, requiredCredits: parseInt(e.target.value) || 0 })}
                placeholder="90"
              />
            </div>

            {/* Tín chỉ tự chọn */}
            <div className="space-y-2">
              <Label htmlFor="electiveCredits">Tín chỉ tự chọn</Label>
              <Input
                id="electiveCredits"
                type="number"
                value={formData.electiveCredits}
                onChange={(e) => setFormData({ ...formData, electiveCredits: parseInt(e.target.value) || 0 })}
                placeholder="30"
              />
            </div>

            {/* Bậc đào tạo */}
            <div className="space-y-2">
              <Label htmlFor="degreeLevel">Bậc đào tạo</Label>
              <select
                id="degreeLevel"
                value={formData.degreeLevel}
                onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="Đại học">Đại học</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>

            {/* Hình thức đào tạo */}
            <div className="space-y-2">
              <Label htmlFor="educationType">Hình thức đào tạo</Label>
              <select
                id="educationType"
                value={formData.educationType}
                onChange={(e) => setFormData({ ...formData, educationType: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="Chính quy">Chính quy</option>
                <option value="Vừa làm vừa học">Vừa làm vừa học</option>
                <option value="Từ xa">Từ xa</option>
              </select>
            </div>

            {/* Ngày hiệu lực */}
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Ngày hiệu lực</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>

            {/* Ngày hết hiệu lực */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Ngày hết hiệu lực</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            {/* Mô tả */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về chương trình đào tạo..."
                rows={3}
              />
            </div>

            {/* Mục tiêu */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="objectives">Mục tiêu đào tạo</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Mục tiêu của chương trình đào tạo..."
                rows={3}
              />
            </div>

            {/* Chuẩn đầu ra */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="learningOutcomes">Chuẩn đầu ra</Label>
              <Textarea
                id="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                placeholder="Chuẩn đầu ra của chương trình..."
                rows={3}
              />
            </div>

            {/* Ghi chú */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Ghi chú thêm..."
              />
            </div>

            {/* Phiên bản */}
            <div className="space-y-2">
              <Label htmlFor="version">Phiên bản</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="1.0"
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="ACTIVE">Đang áp dụng</option>
                <option value="INACTIVE">Ngừng áp dụng</option>
                <option value="DRAFT">Nháp</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4 flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Đang lưu..." : "Lưu chương trình"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}