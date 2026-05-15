'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { gradeApi } from '@/api/grade';

interface GradeFormData {
  id: string;
  studentName: string;
  studentCode: string;
  courseClassName: string;
  attendanceScore: number;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
}

export default function EditGradePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<GradeFormData>({
    id: '',
    studentName: '',
    studentCode: '',
    courseClassName: '',
    attendanceScore: 0,
    midtermScore: 0,
    finalScore: 0,
    totalScore: 0
  });

  useEffect(() => {
    if (id) {
      fetchGradeDetail();
    }
  }, [id]);

  const fetchGradeDetail = async () => {
    try {
      const response = await gradeApi.getById(id);
      const data = response?.data || response;
      setFormData(data);
    } catch (error) {
      toast.error('Không thể lấy thông tin điểm');
      router.push('/dashboard/lecturer/enter-grades');
    } finally {
      setPageLoading(false);
    }
  };

  // Auto calculate total score
  useEffect(() => {
    const att = Number(formData.attendanceScore) || 0;
    const mid = Number(formData.midtermScore) || 0;
    const fin = Number(formData.finalScore) || 0;
    const total = (att * 0.1) + (mid * 0.3) + (fin * 0.6);
    setFormData(prev => ({ ...prev, totalScore: Math.round(total * 10) / 10 }));
  }, [formData.attendanceScore, formData.midtermScore, formData.finalScore]);

  const validateScores = (): boolean => {
    const att = Number(formData.attendanceScore);
    const mid = Number(formData.midtermScore);
    const fin = Number(formData.finalScore);
    
    if (att < 0 || att > 10) {
      toast.error('Điểm chuyên cần phải từ 0 đến 10');
      return false;
    }
    if (mid < 0 || mid > 10) {
      toast.error('Điểm giữa kỳ phải từ 0 đến 10');
      return false;
    }
    if (fin < 0 || fin > 10) {
      toast.error('Điểm cuối kỳ phải từ 0 đến 10');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateScores()) return;

    setLoading(true);
    try {
      await gradeApi.update(id, {
        attendanceScore: formData.attendanceScore,
        midtermScore: formData.midtermScore,
        finalScore: formData.finalScore
      });
      toast.success('Cập nhật điểm thành công');
      router.push('/dashboard/lecturer/enter-grades');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật điểm thất bại');
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

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Cập nhật điểm sinh viên</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Student Info */}
          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Sinh viên:</span>{' '}
                <span className="font-medium">{formData.studentName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mã SV:</span>{' '}
                <span className="font-medium">{formData.studentCode}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Lớp học phần:</span>{' '}
                <span className="font-medium">{formData.courseClassName}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label htmlFor="attendanceScore">Chuyên cần (10%)</Label>
                <Input
                  id="attendanceScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.attendanceScore}
                  onChange={(e) => setFormData({ ...formData, attendanceScore: parseFloat(e.target.value) })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="midtermScore">Giữa kỳ (30%)</Label>
                <Input
                  id="midtermScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.midtermScore}
                  onChange={(e) => setFormData({ ...formData, midtermScore: parseFloat(e.target.value) })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="finalScore">Cuối kỳ (60%)</Label>
                <Input
                  id="finalScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.finalScore}
                  onChange={(e) => setFormData({ ...formData, finalScore: parseFloat(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Total Score Display */}
            <div className="pt-4 border-t border-border">
              <Label>Điểm tổng kết</Label>
              <div className="text-3xl font-bold text-primary mt-2">
                {formData.totalScore}
              </div>
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
                    Cập nhật điểm
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/lecturer/enter-grades')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}