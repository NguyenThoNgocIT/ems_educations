'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, GraduationCap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { majorApi } from '@/api/major';
import { departmentApi } from '@/api/department';

export default function CreateMajorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [fetchingDepts, setFetchingDepts] = useState(true);

  const [formData, setFormData] = useState({
    majorCode: '',
    majorName: '',
    description: '',
    departmentId: '' 
  });

  // Lấy danh sách khoa từ BE
  React.useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response: any = await departmentApi.getAll();
        setDepartments(response || []);
        if (response && response.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: response[0].departmentId }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khoa:', error);
        toast.error('Không thể tải danh sách khoa');
      } finally {
        setFetchingDepts(false);
      }
    };
    fetchDepts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.majorCode.trim()) {
      toast.error('Vui lòng nhập mã ngành');
      return;
    }
    if (!formData.majorName.trim()) {
      toast.error('Vui lòng nhập tên ngành');
      return;
    }

    setLoading(true);
    try {
      await (majorApi as any).create(formData);
      toast.success('Thêm ngành học thành công');
      router.push('/dashboard/admin/training-programs/create'); // Quay lại trang tạo CTĐT
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thêm ngành học thất bại');
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
            <GraduationCap className="mr-2 h-6 w-6 text-blue-600" />
            Thêm Ngành học mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mã ngành */}
              <div className="space-y-2">
                <Label htmlFor="majorCode">Mã ngành <span className="text-red-500">*</span></Label>
                <Input
                  id="majorCode"
                  value={formData.majorCode}
                  onChange={(e) => setFormData({ ...formData, majorCode: e.target.value })}
                  placeholder="VD: CNTT"
                />
              </div>

              {/* Tên ngành */}
              <div className="space-y-2">
                <Label htmlFor="majorName">Tên ngành <span className="text-red-500">*</span></Label>
                <Input
                  id="majorName"
                  value={formData.majorName}
                  onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                  placeholder="VD: Công nghệ thông tin"
                />
              </div>
            </div>

            {/* Khoa */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="departmentId">Thuộc Khoa <span className="text-red-500">*</span></Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-xs text-orange-600 hover:text-orange-700"
                  onClick={() => router.push('/dashboard/admin/departments/create')}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm mới khoa
                </Button>
              </div>
              <select
                id="departmentId"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                disabled={fetchingDepts}
              >
                <option value="">{fetchingDepts ? 'Đang tải danh sách khoa...' : '-- Chọn Khoa --'}</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngành học..."
                rows={4}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Đang lưu..." : "Lưu ngành học"}
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
