'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlotFormData {
  slotCode: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// Mock data - sẽ thay bằng API call sau
const mockTimeSlotData: Record<string, TimeSlotFormData> = {
  '1': { slotCode: 'T1', startTime: '07:30', endTime: '09:00', isActive: true },
  '2': { slotCode: 'T2', startTime: '09:15', endTime: '10:45', isActive: true },
  '3': { slotCode: 'T3', startTime: '11:00', endTime: '12:30', isActive: true },
};

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
    if (id) {
      // TODO: Gọi API lấy chi tiết ca học
      setTimeout(() => {
        const data = mockTimeSlotData[id] || {
          slotCode: '',
          startTime: '',
          endTime: '',
          isActive: true
        };
        setFormData(data);
        setPageLoading(false);
      }, 500);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slotCode || !formData.startTime || !formData.endTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    // TODO: Gọi API cập nhật ca học
    setTimeout(() => {
      setLoading(false);
      toast.success('Cập nhật ca học thành công');
      router.push('/dashboard/admin/time-slots');
    }, 1000);
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
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
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