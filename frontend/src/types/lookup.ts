export interface TrainingProgram {
  id?: string;
  trainingProgramId?: string;
  programId?: string;
  code?: string;
  programCode?: string;
  name?: string;
  programName?: string;
  majorId?: string;
  academicCohortId?: string;
  isActive?: boolean;
}

export interface Department {
  id?: string;
  departmentId?: string;
  code?: string;
  name?: string;
  isActive?: boolean;
}

export interface AcademicCohort {
  id?: string;
  academicCohortId?: string;
  cohortId?: string;
  code?: string;
  name?: string;
  startYear?: number;
  endYear?: number;
  isActive?: boolean;
}

export interface Major {
  id?: string;
  majorId?: string;
  code?: string;
  name?: string;
  departmentId?: string;
  isActive?: boolean;
}

export interface Degree {
  id?: string;
  degreeId?: string;
  code?: string;
  name?: string;
  majorId?: string;
  isActive?: boolean;
}

export interface AdministrativeClass {
  id?: string;
  classId?: string;
  classCode?: string;
  className?: string;
  departmentId?: string;
  advisorId?: string;
  academicCohortId?: string;
  maxSize?: number;
  status?: number;
  note?: string;
  isActive?: boolean;
}
