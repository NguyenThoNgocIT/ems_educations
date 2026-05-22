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
  processScore: number;
  examScore: number;
  finalScore: number;
  gradePoint: number | null;
  letterGrade: string;
  status: 'Đạt' | 'Đang học' | 'Cần cải thiện';
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
