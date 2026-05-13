'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, BookOpen, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

// Mock data
const stats = [
  { label: 'Lớp đang dạy', value: '4', icon: BookOpen, color: 'bg-blue-500' },
  { label: 'Tổng sinh viên', value: '156', icon: Users, color: 'bg-green-500' },
  { label: 'Số tiết/tuần', value: '16', icon: Clock, color: 'bg-purple-500' },
  { label: 'Tỷ lệ chuyên cần', value: '94.2%', icon: TrendingUp, color: 'bg-orange-500' },
];

const myClasses = [
  { id: 1, code: 'CNTT101-01', name: 'Lập trình Web', students: 45, attendance: 92 },
  { id: 2, code: 'CNTT102-01', name: 'Cơ sở dữ liệu', students: 38, attendance: 88 },
  { id: 3, code: 'CNTT103-01', name: 'Mạng máy tính', students: 42, attendance: 95 },
  { id: 4, code: 'KTPM201-01', name: 'Lập trình nâng cao', students: 31, attendance: 90 },
];

const todaySchedule = [
  { time: '07:30 - 09:00', course: 'Lập trình Web', class: 'CNTT101-01', room: 'A101' },
  { time: '09:15 - 10:45', course: 'Cơ sở dữ liệu', class: 'CNTT102-01', room: 'Lab3' },
  { time: '13:00 - 14:30', course: 'Mạng máy tính', class: 'CNTT103-01', room: 'B201' },
];

export default function LecturerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tổng quan giảng dạy</h1>
        <p className="text-muted-foreground">Chào mừng bạn quay trở lại!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
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

      {/* My Classes & Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Lớp học của tôi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-sm">Mã lớp</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Tên môn</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">Sĩ số</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">Chuyên cần</th>
                   </tr>
                </thead>
                <tbody>
                  {myClasses.map((cls) => (
                    <tr key={cls.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm font-medium">{cls.code}</td>
                      <td className="py-3 px-2 text-sm">{cls.name}</td>
                      <td className="py-3 px-2 text-sm text-center">{cls.students}</td>
                      <td className="py-3 px-2 text-sm text-center">
                        <span className="text-green-600 font-medium">{cls.attendance}%</span>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Today Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Lịch giảng dạy hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-muted/30 rounded-lg">
                  <div className="w-24 text-sm font-medium">{item.time}</div>
                  <div className="flex-1">
                    <div className="font-medium">{item.course}</div>
                    <div className="text-xs text-muted-foreground">Lớp: {item.class} - Phòng: {item.room}</div>
                  </div>
                  <Button variant="outline" size="sm">Điểm danh</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Thao tác nhanh</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Điểm danh</Button>
            <Button variant="outline">Nhập điểm</Button>
            <Button variant="outline">Xem lịch dạy</Button>
            <Button variant="outline">Danh sách lớp</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}