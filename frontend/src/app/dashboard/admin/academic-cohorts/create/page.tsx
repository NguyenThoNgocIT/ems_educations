'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { academicCohortApi } from '@/api/academic-cohort';

export default function CreateAcademicCohortPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 4
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã khóa học');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên khóa học');
      return;
    }

    setLoading(true);
    try {
      await academicCohortApi.create(formData);
      toast.success('Thêm khóa học thành công');
      router.push('/dashboard/admin/training-programs/create'); // Quay lại trang tạo CTDT
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thêm khóa học thất bại');
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
            <Calendar className="mr-2 h-6 w-6 text-blue-600" />
            Thêm Khóa học mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mã khóa học */}
              <div className="space-y-2">
                <Label htmlFor="code">Mã khóa học <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: K2024"
                />
              </div>

              {/* Tên khóa học */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên khóa học <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Khóa 2024"
                />
              </div>

              {/* Năm bắt đầu */}
              <div className="space-y-2">
                <Label htmlFor="startYear">Năm bắt đầu</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Năm kết thúc */}
              <div className="space-y-2">
                <Label htmlFor="endYear">Năm kết thúc</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Đang lưu..." : "Lưu khóa học"}
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
