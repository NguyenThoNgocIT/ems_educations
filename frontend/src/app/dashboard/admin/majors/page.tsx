'use client';

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
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { request } from '@/utils/request';

interface Major {
  majorId: string;
  code: string;
  name: string;
  description: string;
  departmentId: string;
  isActive: boolean;
}

export default function MajorsPage() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Hàm tạo mã ngành từ tên ngành (viết tắt không dấu)
  const generateCode = (name: string) => {
    const vietnameseMap: Record<string, string> = {
      'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'đ': 'd',
      'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };
    
    let result = name.toLowerCase();
    for (const [viet, latin] of Object.entries(vietnameseMap)) {
      result = result.replace(new RegExp(viet, 'g'), latin);
    }
    result = result.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
    const words = result.split('_');
    let code = '';
    if (words.length === 1) {
      code = words[0].substring(0, 6).toUpperCase();
    } else {
      code = words.map(w => w.charAt(0)).join('').toUpperCase();
      if (code.length < 3) code = words[0].substring(0, 3).toUpperCase();
    }
    return code;
  };

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const response: any = await request.get('/api/majors');
      let data = [];
      if (response?.data?.content) {
        data = response.data.content;
      } else if (response?.content) {
        data = response.content;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      } else {
        data = [];
      }
      setMajors(data);
    } catch (error) {
      toast.error('Không thể tải danh sách ngành học');
      setMajors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const filteredMajors = majors.filter(major =>
    major.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    major.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMajors.length / rowsPerPage);
  const paginatedMajors = filteredMajors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleOpenModal = (major?: Major) => {
    if (major) {
      setEditingMajor(major);
      setFormData({
        name: major.name,
        description: major.description || ''
      });
    } else {
      setEditingMajor(null);
      setFormData({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Vui lòng nhập tên ngành');
      return;
    }

    try {
      if (editingMajor) {
        // Cập nhật: chỉ cập nhật tên và mô tả, giữ nguyên code
        await request.put(`/api/majors/${editingMajor.majorId}`, {
          code: editingMajor.code,
          name: formData.name,
          description: formData.description,
          departmentId: editingMajor.departmentId
        });
        toast.success('Cập nhật ngành học thành công');
      } else {
        // Thêm mới: tự động sinh mã ngành từ tên
        const newCode = generateCode(formData.name);
        await request.post('/api/majors', {
          code: newCode,
          name: formData.name,
          description: formData.description,
          departmentId: null
        });
        toast.success(`Thêm ngành học thành công. Mã ngành: ${newCode}`);
      }
      setModalOpen(false);
      fetchMajors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa ngành ${name}?`)) {
      try {
        await request.delete(`/api/majors/${id}`);
        toast.success(`Đã xóa ngành ${name}`);
        fetchMajors();
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
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
          <h1 className="text-3xl font-bold mb-2">Quản lý ngành học</h1>
          <p className="text-muted-foreground">Danh sách các ngành đào tạo</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Thêm ngành học
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã ngành, tên ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {paginatedMajors.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Chưa có dữ liệu ngành học. Hãy thêm ngành học mới.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">ID ngành</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Mã ngành</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Tên ngành</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Mô tả</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMajors.map((major) => (
                      <tr key={major.majorId} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-mono text-xs">{major.majorId.substring(0, 8)}...</td>
                        <td className="py-3 px-4 text-sm font-medium">{major.code}</td>
                        <td className="py-3 px-4 text-sm">{major.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 truncate max-w-md">
                          {major.description || '—'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(major)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(major.majorId, major.name)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                  <span className="text-sm text-muted-foreground">
                    trên tổng {filteredMajors.length} bản ghi
                  </span>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Thêm/Sửa */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMajor ? 'Chỉnh sửa ngành học' : 'Thêm ngành học mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingMajor && (
              <div>
                <Label>Mã ngành</Label>
                <Input value={editingMajor.code} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-400 mt-1">Mã ngành không thể thay đổi</p>
              </div>
            )}
            <div>
              <Label htmlFor="name">Tên ngành *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Công nghệ thông tin"
              />
              {!editingMajor && (
                <p className="text-xs text-gray-400 mt-1">Mã ngành sẽ tự động sinh từ tên ngành</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả ngành học..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} className="bg-primary">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}