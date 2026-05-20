'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { schoolYearApi } from '@/api/school-year';

interface SchoolYear {
  schoolYearId: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  isActive: boolean;
}

export default function SchoolYearsPage() {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState<SchoolYear | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    isActive: true
  });

  // Format YYYY-MM-DD → DD/MM/YYYY
  const formatDateDisplay = (date: string | undefined) => {
    if (!date) return '';
    const cleanDate = date.includes('T') ? date.split('T')[0] : date;
    const [year, month, day] = cleanDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Format DD/MM/YYYY → YYYY-MM-DD cho input date
  const formatDateForInput = (date: string | undefined) => {
    if (!date) return '';
    const cleanDate = date.includes('T') ? date.split('T')[0] : date;
    return cleanDate;
  };

  const fetchSchoolYears = async () => {
    setLoading(true);
    try {
      const response: any = await schoolYearApi.getAll({ keyword: searchTerm });
      let data = [];
      if (response?.data?.content) data = response.data.content;
      else if (response?.content) data = response.content;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response)) data = response;
      setSchoolYears(data);
    } catch (error) {
      toast.error('Không thể tải danh sách năm học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingSchoolYear(null);
    setFormData({
      code: '',
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (schoolYear: SchoolYear) => {
    setEditingSchoolYear(schoolYear);
    setFormData({
      code: schoolYear.code,
      name: schoolYear.name,
      startDate: formatDateForInput(schoolYear.startDate),
      endDate: formatDateForInput(schoolYear.endDate),
      description: schoolYear.description || '',
      isActive: schoolYear.isActive
    });
    setDialogOpen(true);
  };

  const validateDates = (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null;
    if (startDate >= endDate) {
      return 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc';
    }
    return null;
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const dateError = validateDates(formData.startDate, formData.endDate);
    if (dateError) {
      toast.error(dateError);
      return;
    }

    try {
      const submitData = {
        code: formData.code,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || '',
        isActive: formData.isActive
      };

      if (editingSchoolYear) {
        await schoolYearApi.update(editingSchoolYear.schoolYearId, submitData);
        toast.success('Cập nhật năm học thành công');
      } else {
        await schoolYearApi.create(submitData);
        toast.success('Thêm năm học thành công');
      }
      setDialogOpen(false);
      await fetchSchoolYears();
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Thao tác thất bại';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa năm học "${name}"?\nLưu ý: Các học kỳ liên quan cũng sẽ bị ảnh hưởng!`)) {
      try {
        await schoolYearApi.delete(id);
        toast.success('Xóa năm học thành công');
        await fetchSchoolYears();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Xóa thất bại');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Quản lý năm học
          </h1>
          <p className="text-muted-foreground">Quản lý các năm học của nhà trường</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSchoolYears} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={handleOpenCreate} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Thêm năm học
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã, tên năm học..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã năm học</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tên năm học</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ngày bắt đầu</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ngày kết thúc</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">Đang tải...</td></tr>
                ) : schoolYears.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">Chưa có năm học nào</td></tr>
                ) : (
                  schoolYears.map((item) => (
                    <tr key={item.schoolYearId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-4 text-sm">{item.name}</td>
                      <td className="py-3 px-4 text-sm">{formatDateDisplay(item.startDate)}</td>
                      <td className="py-3 px-4 text-sm">{formatDateDisplay(item.endDate)}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.schoolYearId, item.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Thêm/Sửa Năm học */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSchoolYear ? '✏️ Chỉnh sửa năm học' : '📚 Thêm năm học mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label className="text-sm font-semibold">Mã năm học *</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                placeholder="Ví dụ: 2024-2025"
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">Mã năm học, định dạng YYYY-YYYY</p>
            </div>

            <div>
              <Label className="text-sm font-semibold">Tên năm học *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Ví dụ: Năm học 2024-2025"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Ngày bắt đầu *</Label>
                <Input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">Định dạng: DD/MM/YYYY (VD: 01/09/2024)</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Ngày kết thúc *</Label>
                <Input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">Định dạng: DD/MM/YYYY (VD: 31/08/2025)</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Mô tả</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Mô tả thêm về năm học..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} className="bg-primary">💾 Lưu lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}