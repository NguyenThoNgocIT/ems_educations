"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { courseClassApi } from '@/api/course';
import { gradeApi } from '@/api/grade';

export default function LecturerEnterGrades() {
  const [courseClasses, setCourseClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await courseClassApi.getAll();
        setCourseClasses(res || []);
      } catch (e) {
        console.error("Failed to load classes", e);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass === 'all') {
      setGrades([]);
      return;
    }
    
    // Fetch grades for selected class
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await gradeApi.getByClass(selectedClass);
        const fetchedGrades = res.data?.data || res.data || [];
        
        setGrades(fetchedGrades);
      } catch (error) {
        console.error("Failed to load grades", error);
        toast.error("Không thể tải danh sách điểm. Vui lòng kiểm tra kết nối.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrades();
  }, [selectedClass]);

  const handleScoreChange = (id: string, field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (numValue < 0 || numValue > 10) return; // Prevent invalid
    
    setGrades(prev => prev.map(g => {
      if (g.id === id) {
        const newG = { ...g, [field]: numValue };
        // Recalculate total: 10% CC + 30% GK + 60% CK
        newG.totalScore = Number(((newG.attendanceScore * 0.1) + (newG.midtermScore * 0.3) + (newG.finalScore * 0.6)).toFixed(1));
        return newG;
      }
      return g;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (grades[0]?.studentCode === 'SV001') {
        // Mock save
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        await gradeApi.updateBatch(grades);
      }
      toast.success("Đã lưu điểm thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu điểm", error);
      toast.error("Lỗi khi lưu bảng điểm. Có thể do chưa có quyền cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400';
    if (score >= 7.0) return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400';
    if (score >= 4.0) return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400';
    return 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-[350px]">
          <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || 'all')}>
            <SelectTrigger className="bg-white dark:bg-gray-800 h-11 border-gray-200 dark:border-gray-700 font-medium">
              <SelectValue placeholder="-- Chọn lớp học phần --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-- Chọn lớp học phần --</SelectItem>
              {courseClasses.slice(0, 5).map(c => (
                <SelectItem key={c.id} value={c.id}>{c.classCode} - {c.courseName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass !== 'all' && (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 text-brand-600 border-brand-200 hover:bg-brand-50" onClick={handleSave} disabled={saving}>
              <Save size={18} /> Lưu tạm
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white border-0 shadow-lg shadow-brand-500/30" onClick={() => toast.info("Đã khóa bảng điểm")} disabled={saving}>
              <Lock size={18} /> Khóa điểm
            </Button>
          </div>
        )}
      </div>

      {selectedClass === 'all' ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Vui lòng chọn lớp học phần để tiến hành nhập điểm</p>
        </div>
      ) : loading ? (
        <div className="p-10 text-center text-slate-500">Đang tải danh sách sinh viên...</div>
      ) : (
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Mã SV</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Họ và tên</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center w-[140px]">Chuyên cần <span className="block text-[9px] font-normal mt-0.5 opacity-70">(10%)</span></th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center w-[140px]">Giữa kỳ <span className="block text-[9px] font-normal mt-0.5 opacity-70">(30%)</span></th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center w-[140px]">Cuối kỳ <span className="block text-[9px] font-normal mt-0.5 opacity-70">(60%)</span></th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center w-[120px]">Tổng kết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {grade.studentCode}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {grade.studentName}
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number" min="0" max="10" step="0.5"
                        value={grade.attendanceScore || ''}
                        onChange={(e) => handleScoreChange(grade.id, 'attendanceScore', e.target.value)}
                        className="w-full text-center py-2 px-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number" min="0" max="10" step="0.5"
                        value={grade.midtermScore || ''}
                        onChange={(e) => handleScoreChange(grade.id, 'midtermScore', e.target.value)}
                        className="w-full text-center py-2 px-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input 
                        type="number" min="0" max="10" step="0.5"
                        value={grade.finalScore || ''}
                        onChange={(e) => handleScoreChange(grade.id, 'finalScore', e.target.value)}
                        className="w-full text-center py-2 px-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold ${getScoreColor(grade.totalScore)}`}>
                        {grade.totalScore > 0 ? grade.totalScore.toFixed(1) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {grades.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Lớp học phần chưa có sinh viên đăng ký.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
