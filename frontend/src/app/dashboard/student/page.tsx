'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Award, Calendar, BookOpen, TrendingUp, Star } from 'lucide-react';

// Mock data
const stats = [
  { label: 'Điểm trung bình (GPA)', value: '3.65', icon: Star, color: 'bg-yellow-500' },
  { label: 'Tín chỉ tích lũy', value: '72/120', icon: Award, color: 'bg-blue-500' },
  { label: 'Xếp hạng', value: '12/245', icon: TrendingUp, color: 'bg-green-500' },
  { label: 'Số môn đang học', value: '6', icon: BookOpen, color: 'bg-purple-500' },
];

const recentScores = [
  { id: 1, code: 'INT1001', name: 'Lập trình Web', credits: 3, score: 8.5, grade: 'A' },
  { id: 2, code: 'INT1002', name: 'Cơ sở dữ liệu', credits: 4, score: 7.8, grade: 'B+' },
  { id: 3, code: 'INT1003', name: 'Mạng máy tính', credits: 3, score: 8.2, grade: 'B+' },
  { id: 4, code: 'INT1004', name: 'Trí tuệ nhân tạo', credits: 3, score: 9.0, grade: 'A' },
];

const todaySchedule = [
  { time: '07:30 - 09:00', course: 'Lập trình Web', room: 'A101', lecturer: 'TS. Nguyễn Văn An' },
  { time: '09:15 - 10:45', course: 'Cơ sở dữ liệu', room: 'Lab3', lecturer: 'ThS. Trần Thị Bình' },
  { time: '13:00 - 14:30', course: 'Mạng máy tính', room: 'B201', lecturer: 'TS. Lê Văn Cường' },
];

const getGradeColor = (score: number) => {
  if (score >= 8.5) return 'text-green-600 font-bold';
  if (score >= 7.0) return 'text-blue-600';
  if (score >= 5.0) return 'text-yellow-600';
  return 'text-red-600';
};

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Chào mừng, Sinh viên!</h1>
        <p className="text-muted-foreground">Theo dõi kết quả học tập và lịch học của bạn</p>
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

      {/* Recent Scores & Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scores Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Kết quả học tập gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-sm">Mã môn</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Tên môn</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">TC</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">Điểm</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">Xếp loại</th>
                   </tr>
                </thead>
                <tbody>
                  {recentScores.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm font-medium">{item.code}</td>
                      <td className="py-3 px-2 text-sm">{item.name}</td>
                      <td className="py-3 px-2 text-sm text-center">{item.credits}</td>
                      <td className={`py-3 px-2 text-sm text-center ${getGradeColor(item.score)}`}>
                        {item.score}
                       </td>
                      <td className="py-3 px-2 text-sm text-center font-medium">{item.grade}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="link" className="mt-4 w-full">Xem tất cả điểm →</Button>
          </CardContent>
        </Card>

        {/* Today Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Lịch học hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-muted/30 rounded-lg">
                  <div className="w-24 text-sm font-medium">{item.time}</div>
                  <div className="flex-1">
                    <div className="font-medium">{item.course}</div>
                    <div className="text-xs text-muted-foreground">Phòng: {item.room} - GV: {item.lecturer}</div>
                  </div>
                  <Button variant="outline" size="sm">Chi tiết</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPA Progress Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Tiến độ học tập</h3>
              <p className="text-sm text-muted-foreground">Bạn đã hoàn thành 72/120 tín chỉ (60%)</p>
              <div className="w-full md:w-96 h-2 bg-gray-200 rounded-full mt-3">
                <div className="h-2 bg-primary rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <Button>Xem chi tiết</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}