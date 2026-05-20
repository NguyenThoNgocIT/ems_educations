'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, GraduationCap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { majorApi } from '@/api/major';
import { departmentApi } from '@/api/department';
import type { Department } from '@/types/lookup';

interface MajorFormData {
  code: string;
  name: string;
  description: string;
  departmentId: string;
}

const getDepartmentId = (department: Department) => department.departmentId || department.id || '';
const getDepartmentLabel = (department: Department) =>
  department.code ? `${department.code} - ${department.name}` : department.name || 'Khoa';

export default function CreateMajorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [fetchingDepts, setFetchingDepts] = useState(true);

  const [formData, setFormData] = useState<MajorFormData>({
    code: '',
    name: '',
    description: '',
    departmentId: '',
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await departmentApi.getAll({ isActive: true });
        setDepartments(response || []);
        if (response && response.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: getDepartmentId(response[0]) }));
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
    
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã ngành');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên ngành');
      return;
    }
    if (!formData.departmentId) {
      toast.error('Vui lòng chọn khoa');
      return;
    }

    setLoading(true);
    try {
      await majorApi.create({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        departmentId: formData.departmentId,
        isActive: true,
      });
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
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: CNTT"
                />
              </div>

              {/* Tên ngành */}
              <div className="space-y-2">
                <Label htmlFor="majorName">Tên ngành <span className="text-red-500">*</span></Label>
                <Input
                  id="majorName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  className="p-0 h-auto text-xs text-primary"
                  onClick={() => router.push('/dashboard/admin/departments/create')}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm mới khoa
                </Button>
              </div>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value || '' })}
                disabled={fetchingDepts}
              >
                <SelectTrigger id="departmentId" className="h-10 w-full">
                  <SelectValue placeholder={fetchingDepts ? 'Đang tải danh sách khoa...' : 'Chọn khoa'} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => {
                    const departmentId = getDepartmentId(dept);
                    return (
                      <SelectItem key={departmentId} value={departmentId}>
                        {getDepartmentLabel(dept)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" disabled={loading}>
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
