package com.quanlydaotao.backend.student.service;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
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
}
