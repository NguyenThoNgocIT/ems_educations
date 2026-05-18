// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Shield, AlertCircle } from 'lucide-react';

// Sử dụng session từ NextAuth hoặc context của bạn
interface UserData {
  fullName?: string;
  email?: string;
  role?: string;
  username?: string;
  requirePasswordChange?: boolean;
}

// Mock user - sẽ thay bằng session.user thật
const mockUser: UserData = {
  fullName: 'Nguyễn Văn Admin',
  email: 'admin@donga.edu.vn',
  role: 'admin',
  username: 'admin',
  requirePasswordChange: false
};

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getRoleLabel = (role?: string): string => {
  const labels: Record<string, string> = {
    admin: 'Quản trị viên',
    lecturer: 'Giảng viên',
    student: 'Sinh viên'
  };
  return labels[role || ''] || role || 'Người dùng';
};

const getRoleBadgeVariant = (role?: string): 'default' | 'destructive' | 'secondary' => {
  const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
    admin: 'destructive',
    lecturer: 'default',
    student: 'secondary'
  };
  return variants[role || ''] || 'default';
};

export default function ProfilePage() {
  // TODO: Lấy user từ session
  const user = mockUser;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 rounded-xl">
              <AvatarFallback className="bg-primary text-white rounded-xl text-2xl font-bold">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Họ và tên</span>
                </div>
                <p className="text-lg font-semibold">{user?.fullName}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                </div>
                <p className="text-lg">{user?.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Vai trò</span>
                </div>
                <Badge variant={getRoleBadgeVariant(user?.role)}>
                  {getRoleLabel(user?.role)}
                </Badge>
              </div>

              {user?.requirePasswordChange && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Yêu cầu đổi mật khẩu</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Bạn cần đổi mật khẩu để tiếp tục sử dụng hệ thống
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin bổ sung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Tên đăng nhập</span>
              <p className="text-base mt-1">{user?.username}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Trạng thái</span>
              <p className="text-base mt-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Đang hoạt động
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}