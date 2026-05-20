'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { timeSlotApi } from '@/api/timeSlot';

interface TimeSlotFormData {
  slotCode: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function EditTimeSlotPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<TimeSlotFormData>({
    slotCode: '',
    startTime: '',
    endTime: '',
    isActive: true
  });

  useEffect(() => {
    async function fetchTimeSlot() {
      if (!id) return;
      
      try {
        setPageLoading(true);
        const response: any = await timeSlotApi.getById(id);
        const data = response?.data || response;
        
        // Xử lý cả 2 trường hợp: string hoặc object
        let startTimeStr = '';
        let endTimeStr = '';
        
        if (typeof data.startTime === 'string') {
          startTimeStr = data.startTime.substring(0, 5);
          endTimeStr = data.endTime.substring(0, 5);
        } else if (data.startTime?.hour !== undefined) {
          startTimeStr = `${String(data.startTime.hour).padStart(2, '0')}:${String(data.startTime.minute).padStart(2, '0')}`;
          endTimeStr = `${String(data.endTime.hour).padStart(2, '0')}:${String(data.endTime.minute).padStart(2, '0')}`;
        }
        
        setFormData({
          slotCode: data.slotCode || '',
          startTime: startTimeStr,
          endTime: endTimeStr,
          isActive: data.isActive ?? true
        });
      } catch (error) {
        console.error(error);
        toast.error('Không thể lấy thông tin ca học');
        router.push('/dashboard/admin/time-slots');
      } finally {
        setPageLoading(false);
      }
    }
    
    fetchTimeSlot();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slotCode || !formData.startTime || !formData.endTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    
    try {
      // GỬI DƯỚI DẠNG STRING (Backend hiện tại chỉ nhận format này)
      const submitData = {
        slotCode: formData.slotCode,
        startTime: `${formData.startTime}:00`,  // "14:45" → "14:45:00"
        endTime: `${formData.endTime}:00`,      // "16:15" → "16:15:00"
        isActive: formData.isActive
      };
      
      console.log('Submitting data (string format):', submitData);
      await timeSlotApi.update(id, submitData);
      toast.success('Cập nhật ca học thành công');
      router.push('/dashboard/admin/time-slots');
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMsg = error?.response?.data?.message || 'Lỗi khi cập nhật ca học';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa ca học</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="slotCode">Mã ca học *</Label>
              <Input
                id="slotCode"
                value={formData.slotCode}
                onChange={(e) => setFormData({ ...formData, slotCode: e.target.value })}
                className="mt-1.5"
                placeholder="T1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="startTime">Thời gian bắt đầu *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="endTime">Thời gian kết thúc *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <button
                type="button"
                id="isActive"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.isActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Cập nhật
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/time-slots')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}