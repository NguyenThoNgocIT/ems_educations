import { request } from '@/utils/request';

export const attendanceApi = {
  // Lấy danh sách sinh viên theo lớp học phần
  getStudentsByClass: async (classId: string) => {
    try {
      const data = await request.get<any[]>(`/api/v1/courses/classes/${classId}/students`);
      const list = Array.isArray(data) ? data : ((data as any).data?.data || (data as any).data || []);
      return list.map((s: any) => ({
        id: s.studentId || s.id,
        studentName: s.fullName || s.studentName || 'Sinh viên',
        studentCode: s.studentCode || ''
      }));
    } catch (error) {
      console.error("Failed to load students for class:", error);
      throw error;
    }
  },
  
  // Lưu điểm danh và tiến độ giảng dạy
  save: async (data: { classId: string; date: string; attendance: Record<string, boolean>; note: string }) => {
    try {
      const response = await request.post('/api/v1/teaching-progress/admin', {
        courseClassId: data.classId,
        teachingDate: data.date,
        note: data.note,
        actualPeriods: 3,
        plannedPeriods: 3,
        isInstructorAbsent: false,
        status: 'TAUGHT'
      });
      console.log("Real saved teaching progress log:", response);
      console.log("Mock saving student attendance checklist:", data.attendance);
      return response;
    } catch (error) {
      console.error("Failed to save teaching progress:", error);
      throw error;
    }
  },
  
  // Lấy lịch sử điểm danh theo lớp
  getHistory: async (classId: string, date?: string) => {
    console.log("Mock getHistory called:", classId, date);
    return [];
  },
};