'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { trainingProgramApi } from '@/api/training-program';

export default function TrainingProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response: any = await trainingProgramApi.getAll({ keyword: searchTerm, size: 100 });
      setPrograms(response.content || []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách chương trình đào tạo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chương trình đào tạo này?')) {
      try {
        await trainingProgramApi.delete(id);
        toast.success('Xóa chương trình thành công');
        fetchPrograms();
      } catch (error) {
        toast.error('Không thể xóa chương trình đào tạo');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chương trình đào tạo</h1>
          <p className="text-muted-foreground">Quản lý các chương trình đào tạo của nhà trường</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/training-programs/create')} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm chương trình
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chương trình..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPrograms()}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã chương trình</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tên chương trình</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ngành</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Khóa học</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tín chỉ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8">Đang tải...</td></tr>
                ) : programs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">Chưa có chương trình đào tạo nào</td></tr>
                ) : (
                  programs.map((item) => (
                    <tr key={item.trainingProgramId} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{item.programCode}</td>
                      <td className="py-3 px-4 text-sm">{item.programName}</td>
                      <td className="py-3 px-4 text-sm">{item.majorName || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{item.academicYear}</td>
                      <td className="py-3 px-4 text-sm">{item.totalCredits}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/admin/training-programs/${item.trainingProgramId}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.trainingProgramId)}>
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
    </div>
  );
}
