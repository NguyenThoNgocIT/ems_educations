'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';
import { courseApi } from '@/api/course';

interface StudentDetail {
  id: string;
  studentCode: string;
  fullName: string;
  trainingProgramId: string;
  note: string;
  isActive: boolean;
  createdAt: string;
  phoneNumber?: string;
  contactEmail?: string;
}

interface TrainingProgram {
  trainingProgramId: string;
  code: string;
  name: string;
}

// Hàm tính năm đào tạo
const getTrainingYear = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - createdDate.getFullYear();
  
  if (yearDiff >= 5) return 'Đã tốt nghiệp';
  if (yearDiff >= 4) return 'Sinh viên năm 5';
  if (yearDiff >= 3) return 'Sinh viên năm 4';
  if (yearDiff >= 2) return 'Sinh viên năm 3';
  if (yearDiff >= 1) return 'Sinh viên năm 2';
  return 'Sinh viên năm 1';
};

// Hàm tính thời gian còn lại
const getRemainingTime = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const expiryDate = new Date(createdDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  const currentDate = new Date();
  
  if (currentDate > expiryDate) return 'Đã hết hạn';
  
  const diffTime = expiryDate.getTime() - currentDate.getTime();
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  if (diffMonths >= 12) return `${Math.floor(diffMonths / 12)} năm ${diffMonths % 12} tháng`;
  if (diffMonths >= 1) return `${diffMonths} tháng`;
  return `${Math.floor(diffTime / (1000 * 60 * 60 * 24))} ngày`;
};

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [formData, setFormData] = useState({
    note: '',
    trainingProgramId: '',
    isActive: true,
    phoneNumber: '',
    contactEmail: ''
  });
  const [studentInfo, setStudentInfo] = useState<StudentDetail | null>(null);

  // Lấy danh sách chương trình đào tạo từ API
  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      const response = await courseApi.getTrainingPrograms();
      const data = response?.data || response || [];
      setTrainingPrograms(data);
    } catch (error) {
      console.error('Không thể lấy danh sách chương trình đào tạo');
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudentDetail();
    }
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      const response = await studentApi.getById(id);
      const data = response?.data || response;
      setStudentInfo(data);
      setFormData({
        note: data?.note || '',
        trainingProgramId: data?.trainingProgramId || '',
        isActive: data?.isActive ?? true,
        phoneNumber: data?.phoneNumber || '',
        contactEmail: data?.contactEmail || ''
      });
    } catch (error) {
      toast.error('Không thể lấy thông tin sinh viên');
      router.push('/dashboard/admin/students');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentApi.update(id, {
        note: formData.note,
        trainingProgramId: formData.trainingProgramId,
        isActive: formData.isActive,
        phoneNumber: formData.phoneNumber,
        contactEmail: formData.contactEmail
      });
      toast.success('Cập nhật sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
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

  const trainingYear = studentInfo ? getTrainingYear(studentInfo.createdAt) : '';
  const remainingTime = studentInfo ? getRemainingTime(studentInfo.createdAt) : '';

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa sinh viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Thông tin sinh viên */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Mã sinh viên</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{studentInfo?.studentCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Họ và tên</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{studentInfo?.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Ngày tạo</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {studentInfo?.createdAt ? new Date(studentInfo.createdAt).toLocaleDateString('vi-VN') : 'Chưa có'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Năm học</span>
                <p className="text-sm">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {trainingYear}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Thời gian còn lại</span>
                <p className="text-sm">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    ⏳ {remainingTime}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Trạng thái hiện tại</span>
                <p className="text-sm">
                  {studentInfo?.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                      ● Hoạt động
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                      ● Ngừng hoạt động
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Chương trình đào tạo - Lấy từ API, không hardcode */}
            <div>
              <Label htmlFor="trainingProgramId" className="font-semibold text-gray-700 dark:text-gray-300">
                Chương trình đào tạo
              </Label>
              <select
                id="trainingProgramId"
                value={formData.trainingProgramId}
                onChange={(e) => setFormData({ ...formData, trainingProgramId: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              >
                <option value="">-- Chọn chương trình --</option>
                {trainingPrograms.map((program) => (
                  <option key={program.trainingProgramId} value={program.trainingProgramId}>
                    {program.code} - {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Số điện thoại */}
            <div>
              <Label htmlFor="phoneNumber" className="font-semibold text-gray-700 dark:text-gray-300">
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1.5"
                placeholder="VD: 0987654321"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="contactEmail" className="font-semibold text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="mt-1.5"
                placeholder="example@donga.edu.vn"
              />
            </div>

            {/* Ghi chú */}
            <div>
              <Label htmlFor="note" className="font-semibold text-gray-700 dark:text-gray-300">
                Ghi chú
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="mt-1.5"
                rows={4}
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <Label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Trạng thái</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isActive === true}
                    onChange={() => setFormData({ ...formData, isActive: true })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                    ● Hoạt động
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isActive === false}
                    onChange={() => setFormData({ ...formData, isActive: false })}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                    ● Ngừng hoạt động
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "💾 Cập nhật"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/admin/students')}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}