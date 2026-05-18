'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { roomApi } from '@/api/room';
import { buildingApi } from '@/api/building';

interface Building {
  buildingId: string;
  code: string;
  name: string;
}

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const roomTypes = [
  { value: 'Ly thuyet', label: 'Lý thuyết' },
  { value: 'Thuc hanh', label: 'Thực hành' },
  { value: 'Hoi thao', label: 'Hội thảo' },
];

const roomStatuses = [
  { value: 'San sang', label: 'Sẵn sàng' },
  { value: 'Dang su dung', label: 'Đang sử dụng' },
  { value: 'Bao tri', label: 'Bảo trì' },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    buildingId: '',
    floorNumber: 1,
    capacity: 50,
    type: 'Ly thuyet',
    status: 'San sang',
    hasProjector: false,
    hasAirConditioner: false,
    hasComputer: false,
    description: ''
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const data = await buildingApi.getAll();
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Không thể tải danh sách tòa nhà');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã phòng');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên phòng');
      return;
    }
    if (!formData.buildingId) {
      toast.error('Vui lòng chọn tòa nhà');
      return;
    }

    const payload = {
      code: formData.code,
      name: removeAccents(formData.name),
      buildingId: formData.buildingId,
      floorNumber: Number(formData.floorNumber),
      capacity: Number(formData.capacity),
      type: removeAccents(formData.type),
      status: removeAccents(formData.status),
      hasProjector: formData.hasProjector,
      hasAirConditioner: formData.hasAirConditioner,
      hasComputer: formData.hasComputer,
      description: formData.description ? removeAccents(formData.description) : ''
    };

    try {
      await roomApi.create(payload);
      toast.success('Thêm phòng học thành công');
      router.push('/dashboard/admin/rooms');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi thêm phòng');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thêm phòng học mới</h1>
          <p className="text-gray-500">Nhập thông tin phòng học</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Mã phòng *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1"
                placeholder="A101"
              />
            </div>

            <div>
              <Label>Tên phòng *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                placeholder="Phòng A101"
              />
            </div>

            <div>
              <Label>Tòa nhà *</Label>
              <Select value={formData.buildingId} onValueChange={(val) => setFormData({ ...formData, buildingId: val })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn tòa nhà" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map(building => (
                    <SelectItem key={building.buildingId} value={building.buildingId}>
                      {building.code} - {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tầng</Label>
                <Input
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Sức chứa</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khác</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Loại phòng</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Thiết bị</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasProjector}
                    onChange={(e) => setFormData({ ...formData, hasProjector: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Máy chiếu
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasAirConditioner}
                    onChange={(e) => setFormData({ ...formData, hasAirConditioner: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Điều hòa
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasComputer}
                    onChange={(e) => setFormData({ ...formData, hasComputer: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Máy tính
                </label>
              </div>
            </div>

            <div>
              <Label>Mô tả</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                placeholder="Mô tả thêm về phòng học"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
      </div>
    </div>
  );
}