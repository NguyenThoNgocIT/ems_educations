package com.quanlydaotao.backend.student.service;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalAnnouncementResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalAcademicResultResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalDocumentResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalExamResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalRegistrationResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalScheduleResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequestResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalTuitionResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface StudentService {
    AccountCreationResponse createStudentForAdmin(StudentAdminCreateRequest request);
    List<StudentAdminResponse> getAllStudentsForAdmin();
    StudentAdminResponse getStudentForAdmin(UUID id);
    StudentAdminResponse updateStudentForAdmin(UUID id, StudentAdminUpdateRequest request);
    void deleteStudentForAdmin(UUID id);
    StudentSelfResponse getCurrentStudent(String username);
    StudentSelfResponse updateCurrentStudent(String username, StudentSelfUpdateRequest request);
    List<StudentPortalScheduleResponse> getCurrentStudentSchedule(String username);
    StudentPortalAcademicResultResponse getCurrentStudentAcademicResult(String username);
    List<StudentPortalAnnouncementResponse> getCurrentStudentAnnouncements(String username);
    List<StudentPortalDocumentResponse> getCurrentStudentDocuments(String username);
    StudentPortalTuitionResponse getCurrentStudentTuition(String username);
    List<StudentPortalRegistrationResponse> getCurrentStudentRegistrations(String username);
    List<StudentPortalExamResponse> getCurrentStudentExams(String username);
    List<StudentPortalSupportRequestResponse> getCurrentStudentSupportRequests(String username);
    StudentPortalSupportRequestResponse createCurrentStudentSupportRequest(String username, StudentPortalSupportRequest request);
}
