export type StudentPortalSource = 'api' | 'mock';

export type StudentPortalPayload<T> = {
  data: T;
  source: StudentPortalSource;
};

export type StudentScheduleItem = {
  id: string;
  dayLabel: string;
  dateLabel: string;
  time: string;
  courseCode: string;
  courseName: string;
  classCode: string;
  room: string;
  lecturer: string;
  mode: 'LT' | 'TH' | 'Online';
};

export type StudentGradeItem = {
  id: string;
  semesterId: string;
  semesterLabel: string;
  courseCode: string;
  courseName: string;
  credits: number;
  processScore: number | null;
  examScore: number | null;
  finalScore: number | null;
  gradePoint: number | null;
  letterGrade: string;
  status: 'Đạt' | 'Đang học' | 'Cần cải thiện';
};

export type StudentPortalScheduleApiItem = {
  scheduleId: string;
  dayOfWeek: number | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  courseCode: string | null;
  courseName: string | null;
  classCode: string | null;
  roomCode: string | null;
  instructorName: string | null;
  mode: string | null;
};

export type StudentPortalAcademicResultApi = {
  semesterLabel: string | null;
  cumulativeGpa: number | null;
  semesterGpa: number | null;
  accumulatedCredits: number | null;
  programCredits: number | null;
  semesters: Array<{ semesterId: string; label: string | null }>;
  grades: Array<{
    gradeId: string;
    semesterId: string | null;
    semesterLabel: string | null;
    courseCode: string | null;
    courseName: string | null;
    credits: number | null;
    finalScore: number | null;
    gradePoint: number | null;
    letterGrade: string | null;
    status: string | null;
  }>;
};

export type StudentAcademicResult = {
  semesters: Array<{ id: string; label: string }>;
  semesterLabel: string;
  cumulativeGpa: number;
  semesterGpa: number;
  accumulatedCredits: number;
  programCredits: number;
  grades: StudentGradeItem[];
};

export type StudentAnnouncement = {
  id: string;
  title: string;
  sender: string;
  date: string;
  type: 'Đào tạo' | 'Học vụ' | 'Tài chính';
};

export type StudentDashboard = {
  semesterLabel: string;
  academic: StudentAcademicResult;
  nextSchedules: StudentScheduleItem[];
  announcements: StudentAnnouncement[];
};
