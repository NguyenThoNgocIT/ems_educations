// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, DoorOpen, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Định nghĩa type cho stats
interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change: string;
}

// Định nghĩa type cho schedule
interface ScheduleItem {
  time: string;
  course: string;
  room: string;
  lecturer: string;
  students: string;
}

// Định nghĩa type cho enrollment data
interface EnrollmentData {
  month: string;
  students: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const stats: StatItem[] = [
    { label: 'Tổng sinh viên', value: '2,847', icon: GraduationCap, color: 'bg-blue-500', change: '+12.3%' },
    { label: 'Tổng giảng viên', value: '187', icon: Users, color: 'bg-green-500', change: '+5.7%' },
    { label: 'Tổng môn học', value: '342', icon: BookOpen, color: 'bg-purple-500', change: '+8.1%' },
    { label: 'Tổng phòng học', value: '124', icon: DoorOpen, color: 'bg-orange-500', change: '+2.4%' }
  ];

  const enrollmentData: EnrollmentData[] = [
    { month: 'T1', students: 2400 },
    { month: 'T2', students: 2510 },
    { month: 'T3', students: 2680 },
    { month: 'T4', students: 2720 },
    { month: 'T5', students: 2847 },
    { month: 'T6', students: 2900 }
  ];

  const todaySchedule: ScheduleItem[] = [
    { time: '07:00 - 09:00', course: 'Lập trình Web', room: 'A301', lecturer: 'TS. Nguyễn Văn An', students: '45/50' },
    { time: '09:15 - 11:15', course: 'Cơ sở dữ liệu', room: 'B205', lecturer: 'ThS. Trần Thị Bình', students: '38/45' },
    { time: '13:00 - 15:00', course: 'Mạng máy tính', room: 'C102', lecturer: 'TS. Lê Văn Cường', students: '42/50' },
    { time: '15:15 - 17:15', course: 'Trí tuệ nhân tạo', room: 'A401', lecturer: 'PGS. Phạm Thị Dung', students: '35/40' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống quản lý giáo dục</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold mb-2">{stat.value}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">{stat.change}</span>
                          <span className="text-muted-foreground">so với tháng trước</span>
                        </div>
                      </div>
                      <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng tuyển sinh</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="hsl(150, 100%, 20%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(150, 100%, 20%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Today Schedule */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch học hôm nay
              </CardTitle>
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Thời gian</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Môn học</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Phòng</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Giảng viên</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Sĩ số</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySchedule.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm">{item.time}</td>
                        <td className="py-3 px-4 text-sm font-medium">{item.course}</td>
                        <td className="py-3 px-4 text-sm">{item.room}</td>
                        <td className="py-3 px-4 text-sm">{item.lecturer}</td>
                        <td className="py-3 px-4 text-sm">{item.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-blue-900">Quản lý sinh viên</h3>
                <p className="text-sm text-blue-700 mb-4">Thêm, sửa, xóa thông tin sinh viên</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-green-900">Quản lý giảng viên</h3>
                <p className="text-sm text-green-700 mb-4">Quản lý thông tin giảng viên</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-purple-900">Quản lý môn học</h3>
                <p className="text-sm text-purple-700 mb-4">Cập nhật danh sách môn học</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}