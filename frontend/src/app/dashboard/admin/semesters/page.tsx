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
import { Search, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { semesterApi } from '@/api/semester';
import { schoolYearApi } from '@/api/school-year';

interface Semester {
  semesterId: string;
  code: string;
  name: string;
  schoolYearId: string;
  startDate: string;
  endDate: string;
  status: boolean;
  description?: string;
  isActive: boolean;
}

interface SchoolYear {
  schoolYearId: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
}

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    schoolYearId: '',
    startDate: '',
    endDate: '',
    status: true,
    description: '',
    isActive: true
  });

  // Chuyển đổi YYYY-MM-DD -> DD/MM/YYYY để hiển thị
  const formatDateDisplay = (date: string | undefined) => {
    if (!date) return '';
    const cleanDate = date.includes('T') ? date.split('T')[0] : date;
    const [year, month, day] = cleanDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Lấy YYYY-MM-DD từ string (giữ nguyên cho input date)
  const formatDateForInput = (date: string | undefined) => {
    if (!date) return '';
    return date.includes('T') ? date.split('T')[0] : date;
  };

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const response: any = await semesterApi.getAll({ keyword: searchTerm });
      let data = [];
      if (response?.data?.content) data = response.data.content;
      else if (response?.content) data = response.content;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response)) data = response;
      setSemesters(data);
    } catch (error) {
      toast.error('Không thể tải danh sách học kỳ');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const response: any = await schoolYearApi.getAll();
      let data = [];
      if (response?.data?.content) data = response.data.content;
      else if (response?.content) data = response.content;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response)) data = response;
      setSchoolYears(data);
    } catch (error) {
      console.error('Không thể tải năm học');
    }
  };

  useEffect(() => {
    fetchSemesters();
    fetchSchoolYears();
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingSemester(null);
    setFormData({
      code: '',
      name: '',
      schoolYearId: schoolYears[0]?.schoolYearId || '',
      startDate: '',
      endDate: '',
      status: true,
      description: '',
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setFormData({
      code: semester.code,
      name: semester.name,
      schoolYearId: semester.schoolYearId,
      startDate: formatDateForInput(semester.startDate),
      endDate: formatDateForInput(semester.endDate),
      status: semester.status ?? true,
      description: semester.description || '',
      isActive: semester.isActive
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.schoolYearId || !formData.startDate || !formData.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const submitData = {
        code: formData.code,
        name: formData.name,
        schoolYearId: formData.schoolYearId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        description: formData.description || '',
        isActive: formData.isActive
      };

      if (editingSemester) {
        await semesterApi.update(editingSemester.semesterId, submitData);
        toast.success('Cập nhật học kỳ thành công');
      } else {
        await semesterApi.create(submitData);
        toast.success('Thêm học kỳ thành công');
      }
      setDialogOpen(false);
      await fetchSemesters();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Thao tác thất bại';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa học kỳ "${name}"?`)) {
      try {
        await semesterApi.delete(id);
        toast.success('Xóa học kỳ thành công');
        await fetchSemesters();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Xóa thất bại');
      }
    }
  };

  const getSchoolYearName = (id: string) => {
    const schoolYear = schoolYears.find(sy => sy.schoolYearId === id);
    return schoolYear ? schoolYear.name : id.substring(0, 8);
  };

  const selectedSchoolYear = schoolYears.find(sy => sy.schoolYearId === formData.schoolYearId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý học kỳ</h1>
          <p className="text-muted-foreground">Danh sách các học kỳ trong năm học</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSemesters} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={handleOpenCreate} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Thêm học kỳ
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học kỳ..."
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã học kỳ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tên học kỳ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Năm học</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ngày bắt đầu</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ngày kết thúc</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8">Đang tải...</td></tr>
                ) : semesters.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8">Chưa có học kỳ nào</td></tr>
                ) : (
                  semesters.map((item) => (
                    <tr key={item.semesterId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-4 text-sm">{item.name}</td>
                      <td className="py-3 px-4 text-sm">{getSchoolYearName(item.schoolYearId)}</td>
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
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.semesterId, item.name)}>
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

      {/* Dialog Thêm/Sửa Học Kỳ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSemester ? '✏️ Chỉnh sửa học kỳ' : '📚 Thêm học kỳ mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Mã học kỳ */}
            <div>
              <Label className="text-sm font-semibold">Mã học kỳ *</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                placeholder="HK1, HK2, HK3, HE"
                className="mt-1"
              />
            </div>

            {/* Tên học kỳ */}
            <div>
              <Label className="text-sm font-semibold">Tên học kỳ *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Học kỳ 1, Học kỳ 2, Học kỳ hè"
                className="mt-1"
              />
            </div>

            {/* Năm học */}
            <div>
              <Label className="text-sm font-semibold">Năm học *</Label>
              <select
                value={formData.schoolYearId}
                onChange={(e) => setFormData({...formData, schoolYearId: e.target.value, startDate: '', endDate: ''})}
                className="w-full rounded-md border px-3 py-2 mt-1 bg-white"
              >
                <option value="">-- Chọn năm học --</option>
                {schoolYears.map((sy) => (
                  <option key={sy.schoolYearId} value={sy.schoolYearId}>
                    {sy.name}
                  </option>
                ))}
              </select>
              
              {/* Gợi ý khoảng thời gian của năm học */}
              {selectedSchoolYear && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-md border">
                  📅 <span className="font-medium">Năm học:</span> {formatDateDisplay(selectedSchoolYear.startDate)} → {formatDateDisplay(selectedSchoolYear.endDate)}
                  <br />
                  ⚠️ Ngày bắt đầu và kết thúc học kỳ phải nằm trong khoảng này.
                </div>
              )}
              
              {schoolYears.length === 0 && (
                <p className="text-xs text-red-500 mt-1">⚠️ Chưa có năm học. Vào "Quản lý năm học" để thêm.</p>
              )}
            </div>

            {/* Ngày tháng */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Ngày bắt đầu *</Label>
                <Input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-1"
                />
                {selectedSchoolYear && (
                  <p className="text-xs text-gray-400 mt-1">
                    Phải từ {formatDateDisplay(selectedSchoolYear.startDate)} trở đi
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-semibold">Ngày kết thúc *</Label>
                <Input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="mt-1"
                />
                {selectedSchoolYear && (
                  <p className="text-xs text-gray-400 mt-1">
                    Phải đến {formatDateDisplay(selectedSchoolYear.endDate)} trở xuống
                  </p>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <Label className="text-sm font-semibold">Mô tả</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Mô tả thêm..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} className="bg-primary" disabled={!selectedSchoolYear}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}