// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { timeSlotApi } from '@/api/timeSlot';

// Định nghĩa type cho TimeSlot
interface TimeSlot {
  id: string;
  slotCode: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function TimeSlotPage() {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [slotToDelete, setSlotToDelete] = useState<TimeSlot | null>(null);

  useEffect(() => {
    async function fetchTimeSlots() {
      try {
        const response: any = await timeSlotApi.getAll();
        const listData = Array.isArray(response) ? response : (response?.data || []);
        setTimeSlots(listData);
      } catch (error) {
        console.error(error);
        toast.error('Không thể lấy danh sách ca học');
      }
    }
    fetchTimeSlots();
  }, []);

  const handleDelete = (slot: TimeSlot) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (slotToDelete) {
      try {
        await timeSlotApi.delete(slotToDelete.id);
        setTimeSlots(timeSlots.filter(s => s.id !== slotToDelete.id));
        toast.success(`Đã xóa ca học ${slotToDelete.slotCode}`);
      } catch (error) {
        console.error(error);
        toast.error('Lỗi khi xóa ca học');
      }
    }
    setDeleteDialogOpen(false);
    setSlotToDelete(null);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/time-slots/${id}/edit`);
  };

  const handleAdd = () => {
    router.push('/dashboard/admin/time-slots/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Quản lý ca học
          </h1>
          <p className="text-muted-foreground">Danh sách và quản lý thời gian các ca học</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm ca học
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-sm">Mã ca học</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Thời gian bắt đầu</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Thời gian kết thúc</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium">{slot.slotCode}</td>
                    <td className="py-4 px-6 text-sm">{slot.startTime}</td>
                    <td className="py-4 px-6 text-sm">{slot.endTime}</td>
                    <td className="py-4 px-6 text-sm">
                      <Badge variant={slot.isActive ? 'default' : 'secondary'}>
                        {slot.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(slot.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(slot)} 
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {timeSlots.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Không có dữ liệu ca học
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa ca học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ca học <strong>{slotToDelete?.slotCode}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}