"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { request } from '@/utils/request';
import { administrativeClassApi } from '@/api/administrative-class';
import type { AdministrativeClass } from '@/types/lookup';

export default function ClassesPage() {
  const [classes, setClasses] = useState<AdministrativeClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdministrativeClass | null>(null);
  const [formData, setFormData] = useState({
    classCode: '',
    className: '',
    departmentId: '',
    academicCohortId: '',
    advisorId: '',
    maxSize: 50,
    status: 1,
    note: '',
    isActive: true,
  });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await administrativeClassApi.getAll({
        keyword: searchTerm || undefined,
      });
      setClasses(response || []);
    } catch (error) {
      toast.error('Không thể tải danh sách lớp');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [searchTerm]);

  const filteredClasses = classes.filter(c =>
    c.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const openCreateDialog = () => {
    setEditingClass(null);
    setFormData({
      classCode: '',
      className: '',
      departmentId: '',
      academicCohortId: '',
      advisorId: '',
      maxSize: 50,
      status: 1,
      note: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditDialog = (item: AdministrativeClass) => {
    setEditingClass(item);
    setFormData({
      classCode: item.classCode || '',
      className: item.className || '',
      departmentId: item.departmentId || '',
      academicCohortId: item.academicCohortId || '',
      advisorId: item.advisorId || '',
      maxSize: item.maxSize || 50,
      status: item.status || 1,
      note: item.note || '',
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.classCode || !formData.className || !formData.departmentId || !formData.academicCohortId) {
      toast.error('Vui lòng điền đầy đủ mã lớp, tên lớp, khoa và khóa học');
      return;
    }

    try {
      if (editingClass) {
        await administrativeClassApi.update(editingClass.classId!, formData);
        toast.success('Cập nhật lớp thành công');
      } else {
        await administrativeClassApi.create(formData);
        toast.success('Thêm lớp thành công');
      }
      setModalOpen(false);
      fetchClasses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${name}?`)) {
      try {
        await administrativeClassApi.delete(id);
        toast.success('Xóa lớp thành công');
        fetchClasses();
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${type} ID: ${text.substring(0, 8)}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý lớp hành chính</h1>
          <p className="text-muted-foreground">Quản lý lớp hành chính theo khoa và khóa đào tạo.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm lớp
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã lớp, tên lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mã lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tên lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sĩ số</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClasses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">Chưa có dữ liệu</td>
                  </tr>
                ) : (
                  paginatedClasses.map((item) => (
                    <tr key={item.classId} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{item.classId?.substring(0, 8)}...</span>
                          <button
                            onClick={() => copyToClipboard(item.classId!, 'Lớp')}
                            className="text-blue-500 hover:text-blue-700"
                            title="Copy Class ID"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                       </td>
                      <td className="px-4 py-3 text-sm font-medium">{item.classCode}</td>
                      <td className="px-4 py-3 text-sm">{item.className}</td>
                      <td className="px-4 py-3 text-sm">{item.maxSize || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.classId!, item.className!)}>
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

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">trên tổng {filteredClasses.length} bản ghi</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Trang {currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Thêm/Sửa với nút Copy ID */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Chỉnh sửa lớp' : 'Thêm lớp mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingClass && (
              <div>
                <Label>ID Lớp (Class ID)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={editingClass.classId || ''} disabled className="bg-gray-100 font-mono text-sm" />
                  <Button type="button" size="sm" variant="outline" onClick={() => copyToClipboard(editingClass.classId!, 'Lớp')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Dùng để phân công sinh viên vào lớp</p>
              </div>
            )}
            <div>
              <Label>Mã lớp *</Label>
              <Input value={formData.classCode} onChange={(e) => setFormData({ ...formData, classCode: e.target.value })} placeholder="VD: K15_CNTT_01" />
            </div>
            <div>
              <Label>Tên lớp *</Label>
              <Input value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} placeholder="VD: K15 - Công nghệ thông tin 01" />
            </div>
            <div>
              <Label>Department ID (Khoa) *</Label>
              <Input value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} placeholder="UUID của khoa" />
            </div>
            <div>
              <Label>Academic Cohort ID (Khóa) *</Label>
              <Input value={formData.academicCohortId} onChange={(e) => setFormData({ ...formData, academicCohortId: e.target.value })} placeholder="UUID của khóa học" />
            </div>
            <div>
              <Label>Advisor ID (GVCN)</Label>
              <Input value={formData.advisorId} onChange={(e) => setFormData({ ...formData, advisorId: e.target.value })} placeholder="UUID của giảng viên" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sĩ số tối đa</Label>
                <Input type="number" value={formData.maxSize} onChange={(e) => setFormData({ ...formData, maxSize: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Trạng thái số</Label>
                <Input type="number" value={formData.status} onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
              <Label htmlFor="isActive" className="cursor-pointer">Đang hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}