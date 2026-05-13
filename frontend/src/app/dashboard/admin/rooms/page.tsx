// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type cho Room
interface Room {
  id: number;
  code: string;
  name: string;
  buildingName: string;
  floorNumber: number;
  capacity: number;
  type: string;
  status: string;
  hasProjector: boolean;
  hasAirConditioner: boolean;
  hasComputer: boolean;
}

// Mock data - sẽ thay bằng API call sau
const mockRooms: Room[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  code: `${String.fromCharCode(65 + (i % 5))}${String(Math.floor(i / 5) + 101)}`,
  name: `Phòng ${String.fromCharCode(65 + (i % 5))}${String(Math.floor(i / 5) + 101)}`,
  buildingName: `Tòa ${String.fromCharCode(65 + (i % 5))}`,
  floorNumber: (i % 5) + 1,
  capacity: 30 + (i % 20) * 5,
  type: ['Lý thuyết', 'Thực hành', 'Hội thảo'][i % 3],
  status: ['Sẵn sàng', 'Đang sử dụng', 'Bảo trì'][i % 3],
  hasProjector: i % 2 === 0,
  hasAirConditioner: i % 3 !== 0,
  hasComputer: i % 4 === 0
}));

// Lấy danh sách building unique cho filter
const buildings = [...new Set(mockRooms.map(r => r.buildingName))];

export default function RoomsPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBuilding, setFilterBuilding] = useState<string>('all');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    buildingName: '',
    floorNumber: 1,
    capacity: 50,
    type: 'Lý thuyết',
    status: 'Sẵn sàng',
    hasProjector: false,
    hasAirConditioner: false,
    hasComputer: false
  });

  // Filter rooms
  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = filterBuilding === 'all' || room.buildingName === filterBuilding;
    return matchesSearch && matchesBuilding;
  });

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      code: room.code,
      name: room.name,
      buildingName: room.buildingName,
      floorNumber: room.floorNumber,
      capacity: room.capacity,
      type: room.type,
      status: room.status,
      hasProjector: room.hasProjector,
      hasAirConditioner: room.hasAirConditioner,
      hasComputer: room.hasComputer
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({
      code: '',
      name: '',
      buildingName: '',
      floorNumber: 1,
      capacity: 50,
      type: 'Lý thuyết',
      status: 'Sẵn sàng',
      hasProjector: false,
      hasAirConditioner: false,
      hasComputer: false
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    toast.success(editingRoom ? 'Cập nhật phòng học thành công' : 'Thêm phòng học thành công');
    setModalOpen(false);
    setEditingRoom(null);
  };

  const handleDelete = (name: string) => {
    toast.success(`Đã xóa phòng ${name}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sẵn sàng':
        return <Badge className="bg-green-100 text-green-700">Sẵn sàng</Badge>;
      case 'Đang sử dụng':
        return <Badge className="bg-blue-100 text-blue-700">Đang sử dụng</Badge>;
      case 'Bảo trì':
        return <Badge variant="secondary">Bảo trì</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý phòng học</h1>
          <p className="text-muted-foreground">Danh sách và quản lý phòng học</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phòng học
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã phòng, tên phòng..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterBuilding} onValueChange={setFilterBuilding}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã phòng</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tòa nhà</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tầng</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Sức chứa</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Loại</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thiết bị</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.slice(0, 10).map((room) => (
                  <tr key={room.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{room.code}</td>
                    <td className="py-3 px-4 text-sm">{room.buildingName}</td>
                    <td className="py-3 px-4 text-sm">{room.floorNumber}</td>
                    <td className="py-3 px-4 text-sm">{room.capacity}</td>
                    <td className="py-3 px-4 text-sm">{room.type}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(room.status)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {room.hasProjector && <Badge variant="outline" className="text-xs">Máy chiếu</Badge>}
                        {room.hasAirConditioner && <Badge variant="outline" className="text-xs">Điều hòa</Badge>}
                        {room.hasComputer && <Badge variant="outline" className="text-xs">Máy tính</Badge>}
                        {!room.hasProjector && !room.hasAirConditioner && !room.hasComputer && (
                          <span className="text-xs text-muted-foreground">Không</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(room.name)}>
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
            <span className="text-sm text-muted-foreground">
              Hiển thị {Math.min(10, filteredRooms.length)} / {filteredRooms.length} bản ghi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRoom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Mã phòng *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1.5"
                  placeholder="A101"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Sức chứa *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Tên phòng *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
                placeholder="Phòng A101"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buildingName">Tòa nhà</Label>
                <Input
                  id="buildingName"
                  value={formData.buildingName}
                  onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                  className="mt-1.5"
                  placeholder="Tòa A"
                />
              </div>
              <div>
                <Label htmlFor="floorNumber">Tầng</Label>
                <Input
                  id="floorNumber"
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Loại phòng</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lý thuyết">Lý thuyết</SelectItem>
                    <SelectItem value="Thực hành">Thực hành</SelectItem>
                    <SelectItem value="Hội thảo">Hội thảo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sẵn sàng">Sẵn sàng</SelectItem>
                    <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
                    <SelectItem value="Bảo trì">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}