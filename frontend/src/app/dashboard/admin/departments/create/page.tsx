'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { departmentApi } from '@/api/department';

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã khoa');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên khoa');
      return;
    }

    setLoading(true);
    try {
      await departmentApi.create(formData);
      toast.success('Thêm khoa thành công');
      router.push('/dashboard/admin/majors/create'); // Quay lại trang tạo ngành
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thêm khoa thất bại');
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
            <Building2 className="mr-2 h-6 w-6 text-orange-600" />
            Thêm Khoa mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mã khoa */}
              <div className="space-y-2">
                <Label htmlFor="code">Mã khoa <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: CNTT"
                />
              </div>

              {/* Tên khoa */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên khoa <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Khoa Công nghệ thông tin"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về khoa..."
                rows={4}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Đang lưu..." : "Lưu khoa"}
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
