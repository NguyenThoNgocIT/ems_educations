// TODO: Chuy?n d?i t? code AI Hosting
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
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { buildingApi } from '@/api/building';

// Định nghĩa type cho Building
interface Building {
  id: string;
  code: string;
  name: string;
  address: string;
  totalFloors: number;
  buildingType: string;
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    totalFloors: 3,
    buildingType: 'Giảng đường'
  });

  useEffect(() => {
    async function fetchBuildings() {
      try {
        const response = await buildingApi.getAll();
        setBuildings(response || []);
      } catch (error) {
        console.error(error);
        toast.error('Không thể lấy danh sách tòa nhà');
      }
    }
    fetchBuildings();
  }, []);

  // Filter buildings
  const filteredBuildings = buildings.filter(building =>
    building.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      code: building.code,
      name: building.name,
      address: building.address,
      totalFloors: building.totalFloors,
      buildingType: building.buildingType
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBuilding(null);
    setFormData({
      code: '',
      name: '',
      address: '',
      totalFloors: 3,
      buildingType: 'Giảng đường'
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingBuilding) {
        await buildingApi.update(editingBuilding.id, formData);
        setBuildings(prev => prev.map(b => b.id === editingBuilding.id ? { ...b, ...formData } : b));
        toast.success('Cập nhật tòa nhà thành công');
      } else {
        const newBuilding = await buildingApi.create(formData);
        setBuildings(prev => [...prev, newBuilding]);
        toast.success('Thêm tòa nhà thành công');
      }
      setModalOpen(false);
      setEditingBuilding(null);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi lưu tòa nhà');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await buildingApi.delete(id);
      setBuildings(prev => prev.filter(b => b.id !== id));
      toast.success(`Đã xóa tòa nhà ${name}`);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi xóa tòa nhà');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý tòa nhà</h1>
          <p className="text-muted-foreground">Danh sách và quản lý tòa nhà trong trường</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm tòa nhà
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã, tên tòa nhà, địa chỉ..."
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tên tòa nhà</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Địa chỉ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Số tầng</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Loại</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuildings.slice(0, 10).map((building) => (
                  <tr key={building.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{building.code}</td>
                    <td className="py-3 px-4 text-sm">{building.name}</td>
                    <td className="py-3 px-4 text-sm">{building.address}</td>
                    <td className="py-3 px-4 text-sm">{building.totalFloors}</td>
                    <td className="py-3 px-4 text-sm">{building.buildingType}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(building)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(building.id, building.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {Math.min(10, filteredBuildings.length)} / {filteredBuildings.length} bản ghi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBuilding ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="code">Mã tòa nhà *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1.5"
                placeholder="A"
              />
            </div>
            <div>
              <Label htmlFor="name">Tên tòa nhà *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
                placeholder="Tòa nhà A"
              />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1.5"
                placeholder="Khu A, Đại học Đông Á"
              />
            </div>
            <div>
              <Label htmlFor="totalFloors">Số tầng</Label>
              <Input
                id="totalFloors"
                type="number"
                value={formData.totalFloors}
                onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="buildingType">Loại tòa nhà</Label>
              <Input
                id="buildingType"
                value={formData.buildingType}
                onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                className="mt-1.5"
                placeholder="Giảng đường"
              />
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