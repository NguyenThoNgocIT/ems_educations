'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { roomApi } from '@/api/room';
import { buildingApi } from '@/api/building';

interface Room {
  roomId: string;
  code: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floorNumber: number;
  capacity: number;
  type: string;
  status: string;
  hasProjector: boolean;
  hasAirConditioner: boolean;
  hasComputer: boolean;
  description?: string;
}

interface Building {
  buildingId: string;
  code: string;
  name: string;
}

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsData, buildingsData] = await Promise.all([
        roomApi.getAll(),
        buildingApi.getAll()
      ]);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
    } catch (error) {
      toast.error('Không thể lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = filterBuilding === 'all' || room.buildingId === filterBuilding;
    return matchesSearch && matchesBuilding;
  });

  const totalPages = Math.ceil(filteredRooms.length / rowsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (room: Room) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phòng ${room.name}?`)) {
      try {
        await roomApi.delete(room.roomId);
        toast.success(`Đã xóa phòng ${room.name}`);
        await fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa phòng');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'San sang' || status === 'Sẵn sàng') {
      return <Badge className="bg-green-100 text-green-700">Sẵn sàng</Badge>;
    }
    if (status === 'Dang su dung' || status === 'Đang sử dụng') {
      return <Badge className="bg-blue-100 text-blue-700">Đang sử dụng</Badge>;
    }
    return <Badge variant="secondary">Bảo trì</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý phòng học</h1>
          <p className="text-gray-500">Danh sách và quản lý phòng học</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/rooms/create')} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phòng học
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã phòng, tên phòng..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterBuilding} onValueChange={(val) => setFilterBuilding(val || 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building.buildingId} value={building.buildingId}>
                    {building.name}
                  </SelectItem>
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
                  <th className="text-left py-3 px-4">Mã phòng</th>
                  <th className="text-left py-3 px-4">Tên phòng</th>
                  <th className="text-left py-3 px-4">Tòa nhà</th>
                  <th className="text-left py-3 px-4">Tầng</th>
                  <th className="text-left py-3 px-4">Sức chứa</th>
                  <th className="text-left py-3 px-4">Loại</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thiết bị</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRooms.map((room) => (
                  <tr key={room.roomId} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{room.code}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => router.push(`/dashboard/admin/rooms/${room.roomId}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {room.name}
                      </button>
                    </td>
                    <td className="py-3 px-4">{room.buildingName}</td>
                    <td className="py-3 px-4">{room.floorNumber}</td>
                    <td className="py-3 px-4">{room.capacity}</td>
                    <td className="py-3 px-4">{room.type}</td>
                    <td className="py-3 px-4">{getStatusBadge(room.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {room.hasProjector && <Badge variant="outline">Máy chiếu</Badge>}
                        {room.hasAirConditioner && <Badge variant="outline">Điều hòa</Badge>}
                        {room.hasComputer && <Badge variant="outline">Máy tính</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/admin/rooms/${room.roomId}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(room)} className="text-red-600">
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
              <span className="text-sm">Hiển thị</span>
              <Select value={String(rowsPerPage)} onValueChange={(val) => setRowsPerPage(Number(val || 10))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm">trên tổng {filteredRooms.length} bản ghi</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Trang {currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}