import { unwrapApiResponse } from '@/api/response';
import { studentApi } from '@/api/student';
import { request } from '@/utils/request';
import type {
  StudentAcademicResult,
  StudentAnnouncement,
  StudentDashboard,
  StudentPortalAcademicResultApi,
  StudentPortalPayload,
  StudentPortalScheduleApiItem,
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

function withApi<T>(data: T): StudentPortalPayload<T> {
  return { data, source: 'api' };
}

async function readAcademicResult(): Promise<StudentPortalPayload<StudentAcademicResult>> {
  try {
    const response = await request.get('/api/v1/students/me/academic-results');
    const data = normalizeAcademicResult(unwrapApiResponse<StudentPortalAcademicResultApi>(response));
    return data.grades.length ? withApi(data) : withMock(academicResult);
  } catch {
    return withMock(academicResult);
  }
}

async function readSchedule(): Promise<StudentPortalPayload<StudentScheduleItem[]>> {
  try {
    const response = await request.get('/api/v1/students/me/schedule');
    const data = unwrapApiResponse<StudentPortalScheduleApiItem[]>(response).map(normalizeSchedule);
    return data.length ? withApi(data) : withMock(schedules);
  } catch {
    return withMock(schedules);
  }
}

export const studentPortalApi = {
  getDashboard: async (): Promise<StudentPortalPayload<StudentDashboard>> => {
    const [academic, mySchedule] = await Promise.all([readAcademicResult(), readSchedule()]);
    return {
      data: {
        semesterLabel: academic.data.semesterLabel,
        academic: academic.data,
        nextSchedules: mySchedule.data.slice(0, 3),
        announcements,
      },
      source: academic.source === 'api' || mySchedule.source === 'api' ? 'api' : 'mock',
    };
  },

  getAcademicResult: readAcademicResult,

  getMySchedule: readSchedule,

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

function normalizeAcademicResult(data: StudentPortalAcademicResultApi): StudentAcademicResult {
  const grades = data.grades.map((grade) => ({
    id: grade.gradeId,
    semesterId: grade.semesterId || 'unassigned',
    semesterLabel: grade.semesterLabel || 'Chưa xác định học kỳ',
    courseCode: grade.courseCode || '--',
    courseName: grade.courseName || 'Học phần chưa đặt tên',
    credits: grade.credits ?? 0,
    processScore: null,
    examScore: null,
    finalScore: grade.finalScore,
    gradePoint: grade.gradePoint,
    letterGrade: grade.letterGrade || '--',
    status: normalizeGradeStatus(grade.status),
  }));
  const semesters = data.semesters
    .filter((semester) => semester.semesterId)
    .map((semester) => ({
      id: semester.semesterId,
      label: semester.label || 'Học kỳ chưa đặt tên',
    }));
  if (grades.some((grade) => grade.semesterId === 'unassigned')) {
    semesters.unshift({ id: 'unassigned', label: 'Chưa xác định học kỳ' });
  }

  return {
    semesters,
    semesterLabel: data.semesterLabel || semesters.at(-1)?.label || 'Học kỳ hiện tại',
    cumulativeGpa: data.cumulativeGpa ?? 0,
    semesterGpa: data.semesterGpa ?? 0,
    accumulatedCredits: data.accumulatedCredits ?? 0,
    programCredits: data.programCredits ?? 0,
    grades,
  };
}

function normalizeGradeStatus(status: string | null): StudentAcademicResult['grades'][number]['status'] {
  if (status === 'IN_PROGRESS') return 'Đang học';
  if (status === 'FAILED') return 'Cần cải thiện';
  return 'Đạt';
}

function normalizeSchedule(item: StudentPortalScheduleApiItem): StudentScheduleItem {
  return {
    id: item.scheduleId,
    dayLabel: toDayLabel(item.dayOfWeek),
    dateLabel: formatDate(item.date),
    time: formatTimeRange(item.startTime, item.endTime),
    courseCode: item.courseCode || '--',
    courseName: item.courseName || 'Học phần chưa đặt tên',
    classCode: item.classCode || '--',
    room: item.roomCode || 'Chưa xếp phòng',
    lecturer: item.instructorName || 'Chưa phân công',
    mode: normalizeScheduleMode(item.mode),
  };
}

function toDayLabel(dayOfWeek: number | null) {
  if (dayOfWeek === 1) return 'Chủ nhật';
  if (dayOfWeek && dayOfWeek >= 2 && dayOfWeek <= 7) return `Thứ ${dayOfWeek}`;
  return 'Chưa xếp ngày';
}

function formatDate(date: string | null) {
  if (!date) return '--';
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}/${month}` : date;
}

function formatTimeRange(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return 'Chưa xếp ca';
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
}

function normalizeScheduleMode(mode: string | null): StudentScheduleItem['mode'] {
  if (mode?.toLowerCase().includes('online')) return 'Online';
  if (mode?.toUpperCase().includes('TH')) return 'TH';
  return 'LT';
}
