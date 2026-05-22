import { studentApi } from '@/api/student';
import type {
  StudentAcademicResult,
  StudentAnnouncement,
  StudentDashboard,
  StudentPortalPayload,
  StudentScheduleItem,
} from '@/types/student-portal';
import type { StudentSelfResponse } from '@/types/student';

const schedules: StudentScheduleItem[] = [
  { id: 'web-mon', dayLabel: 'Thứ 2', dateLabel: '25/05', time: '07:30 - 09:50', courseCode: 'WEB302', courseName: 'Lập trình Web', classCode: 'WEB302.03', room: 'A3.05', lecturer: 'ThS. Nguyễn Văn An', mode: 'LT' },
  { id: 'db-tue', dayLabel: 'Thứ 3', dateLabel: '26/05', time: '09:15 - 11:35', courseCode: 'DBS201', courseName: 'Cơ sở dữ liệu', classCode: 'DBS201.02', room: 'B2.04', lecturer: 'ThS. Trần Thu Hà', mode: 'TH' },
  { id: 'se-thu', dayLabel: 'Thứ 5', dateLabel: '28/05', time: '13:30 - 15:50', courseCode: 'SWE301', courseName: 'Công nghệ phần mềm', classCode: 'SWE301.01', room: 'C1.12', lecturer: 'TS. Lê Minh Khôi', mode: 'LT' },
  { id: 'eng-fri', dayLabel: 'Thứ 6', dateLabel: '29/05', time: '07:30 - 09:00', courseCode: 'ENG214', courseName: 'Tiếng Anh chuyên ngành', classCode: 'ENG214.04', room: 'Online', lecturer: 'Cô Phạm Mai', mode: 'Online' },
];

const academicResult: StudentAcademicResult = {
  semesters: [
    { id: 'hk1-2025', label: 'Học kỳ 1 - 2025-2026' },
    { id: 'hk2-2025', label: 'Học kỳ 2 - 2025-2026' },
    { id: 'he-2026', label: 'Học kỳ hè - 2025-2026' },
  ],
  semesterLabel: 'Học kỳ 2 - 2025-2026',
  cumulativeGpa: 3.32,
  semesterGpa: 3.48,
  accumulatedCredits: 84,
  programCredits: 130,
  grades: [
    { id: 'oop201', semesterId: 'hk1-2025', semesterLabel: 'Học kỳ 1 - 2025-2026', courseCode: 'OOP201', courseName: 'Lập trình hướng đối tượng', credits: 3, processScore: 8.0, examScore: 8.4, finalScore: 8.2, gradePoint: 3.5, letterGrade: 'B+', status: 'Đạt' },
    { id: 'math221', semesterId: 'hk1-2025', semesterLabel: 'Học kỳ 1 - 2025-2026', courseCode: 'MTH221', courseName: 'Toán rời rạc', credits: 3, processScore: 7.2, examScore: 7.4, finalScore: 7.3, gradePoint: 3.0, letterGrade: 'B', status: 'Đạt' },
    { id: 'web302', semesterId: 'hk2-2025', semesterLabel: 'Học kỳ 2 - 2025-2026', courseCode: 'WEB302', courseName: 'Lập trình Web', credits: 3, processScore: 8.4, examScore: 8.7, finalScore: 8.6, gradePoint: 4.0, letterGrade: 'A', status: 'Đạt' },
    { id: 'dbs201', semesterId: 'hk2-2025', semesterLabel: 'Học kỳ 2 - 2025-2026', courseCode: 'DBS201', courseName: 'Cơ sở dữ liệu', credits: 3, processScore: 7.8, examScore: 8.2, finalScore: 8.0, gradePoint: 3.5, letterGrade: 'B+', status: 'Đạt' },
    { id: 'swe301', semesterId: 'hk2-2025', semesterLabel: 'Học kỳ 2 - 2025-2026', courseCode: 'SWE301', courseName: 'Công nghệ phần mềm', credits: 3, processScore: 8.9, examScore: 0, finalScore: 0, gradePoint: null, letterGrade: '--', status: 'Đang học' },
    { id: 'net220', semesterId: 'hk2-2025', semesterLabel: 'Học kỳ 2 - 2025-2026', courseCode: 'NET220', courseName: 'Mạng máy tính', credits: 3, processScore: 6.3, examScore: 6.5, finalScore: 6.4, gradePoint: 2.0, letterGrade: 'C', status: 'Cần cải thiện' },
    { id: 'mob401', semesterId: 'he-2026', semesterLabel: 'Học kỳ hè - 2025-2026', courseCode: 'MOB401', courseName: 'Phát triển ứng dụng di động', credits: 3, processScore: 0, examScore: 0, finalScore: 0, gradePoint: null, letterGrade: '--', status: 'Đang học' },
  ],
};

const announcements: StudentAnnouncement[] = [
  { id: 'exam-plan', title: 'Cập nhật kế hoạch thi cuối kỳ và phòng thi', sender: 'Phòng Đào tạo', date: '22/05/2026', type: 'Đào tạo' },
  { id: 'exam', title: 'Rà soát lịch thi và phòng thi trước ngày khóa lịch', sender: 'Phòng Khảo thí', date: '20/05/2026', type: 'Học vụ' },
  { id: 'tuition', title: 'Đối chiếu học phí trước khi xác nhận đăng ký', sender: 'Phòng Tài chính', date: '18/05/2026', type: 'Tài chính' },
];

function withMock<T>(data: T): StudentPortalPayload<T> {
  return { data, source: 'mock' };
}

export const studentPortalApi = {
  // Replace these mock-backed reads with /api/v1/students/me/* endpoints when available.
  getDashboard: async (): Promise<StudentPortalPayload<StudentDashboard>> =>
    withMock({
      semesterLabel: academicResult.semesterLabel,
      academic: academicResult,
      nextSchedules: schedules.slice(0, 3),
      announcements,
    }),

  getAcademicResult: async (): Promise<StudentPortalPayload<StudentAcademicResult>> =>
    withMock(academicResult),

  getMySchedule: async (): Promise<StudentPortalPayload<StudentScheduleItem[]>> =>
    withMock(schedules),

  getAnnouncements: async (): Promise<StudentPortalPayload<StudentAnnouncement[]>> =>
    withMock(announcements),

  getStudentProfile: async (): Promise<StudentSelfResponse | null> => {
    try {
      return await studentApi.getMe();
    } catch {
      return null;
    }
  },
};
