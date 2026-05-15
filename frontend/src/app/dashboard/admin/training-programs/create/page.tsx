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

export default function CreateTrainingProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [fetchingMajors, setFetchingMajors] = useState(true);

  const [formData, setFormData] = useState({
    programCode: '',
    programName: '',
    majorId: '',
    academicYear: '',
    totalCredits: 0,
    description: '',
    note: ''
  });

  // Lấy danh sách ngành học từ BE
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response: any = await majorApi.getAll({ size: 100 });
        setMajors(response.content || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ngành:', error);
        toast.error('Không thể tải danh sách ngành học');
      } finally {
        setFetchingMajors(false);
      }
    };
    fetchMajors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.programCode.trim()) {
      toast.error('Vui lòng nhập mã chương trình');
      return;
    }
    if (!formData.programName.trim()) {
      toast.error('Vui lòng nhập tên chương trình');
      return;
    }
    if (!formData.majorId) {
      toast.error('Vui lòng chọn ngành học');
      return;
    }
    if (!formData.academicYear.trim()) {
      toast.error('Vui lòng nhập khóa học/năm học');
      return;
    }

    setLoading(true);
    try {
      await trainingProgramApi.create(formData);
      toast.success('Thêm chương trình đào tạo thành công');
      router.push('/dashboard/admin/students/create'); // Quay lại trang tạo sinh viên để chọn
    } catch (error: any) {
      console.error(error);
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
            {/* Mã chương trình */}
            <div className="space-y-2">
              <Label htmlFor="programCode" className="font-semibold">Mã chương trình <span className="text-red-500">*</span></Label>
              <Input
                id="programCode"
                value={formData.programCode}
                onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                placeholder="VD: CTDT_CNTT_2024"
              />
            </div>

            {/* Tên chương trình */}
            <div className="space-y-2">
              <Label htmlFor="programName" className="font-semibold">Tên chương trình <span className="text-red-500">*</span></Label>
              <Input
                id="programName"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                placeholder="VD: Chương trình đào tạo CNTT Khóa 2024"
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

            {/* Khóa học/Năm học */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="font-semibold">Khóa học/Năm học <span className="text-red-500">*</span></Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="VD: 2024-2028"
              />
            </div>

            {/* Số tín chỉ */}
            <div className="space-y-2">
              <Label htmlFor="totalCredits" className="font-semibold">Tổng số tín chỉ <span className="text-red-500">*</span></Label>
              <Input
                id="totalCredits"
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Mô tả */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="font-semibold">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về chương trình đào tạo..."
                rows={3}
              />
            </div>

            {/* Ghi chú */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note" className="font-semibold">Ghi chú</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Ghi chú thêm..."
              />
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
