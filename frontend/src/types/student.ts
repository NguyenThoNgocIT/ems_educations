export interface StudentAdminCreateRequest {
  fullName: string;
  fullNameNoAccent?: string;
  dateOfBirth: string;
  gender?: string;
  placeOfBirth?: string;
  ethnicity?: string;
  personalIdentificationNumber?: string;
  dateOfIssue?: string;
  cardPlace?: string;
  nationality?: string;
  contactEmail?: string;
  phoneNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  avatarUrl?: string;
  note?: string;
  studentCode?: string;
  majorId: string;
  trainingProgramId: string;
  academicCohortId: string;
  classId?: string;
  admissionDate?: string;
}

export interface StudentAdminUpdateRequest extends Partial<StudentAdminCreateRequest> {
  isActive?: boolean;
}

export interface StudentAdminResponse {
  studentId: string;
  personId: string;
  studentCode?: string;
  majorId?: string;
  trainingProgramId?: string;
  academicCohortId?: string;
  classId?: string;
  admissionDate?: string;
  note?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
  fullNameNoAccent?: string;
  gender?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  ethnicity?: string;
  personalIdentificationNumber?: string;
  dateOfIssue?: string;
  cardPlace?: string;
  nationality?: string;
  contactEmail?: string;
  phoneNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  avatarUrl?: string;
}

export type StudentListItem = StudentAdminResponse & {
  id: string;
};

export interface StudentAdminFormData {
  fullName: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  contactEmail: string;
  permanentAddress: string;
  trainingProgramId: string;
  majorId: string;
  academicCohortId: string;
  classId: string;
  admissionDate: string;
  isActive?: boolean;
  note: string;
}
