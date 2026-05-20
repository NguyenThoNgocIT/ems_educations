package com.quanlydaotao.backend.studentclass.service;

import com.quanlydaotao.backend.studentclass.dto.StudentClassRequest;
import com.quanlydaotao.backend.studentclass.dto.StudentClassResponse;

import java.util.List;
import java.util.UUID;

public interface StudentClassService {
    List<StudentClassResponse> search(UUID studentId, UUID classId, UUID semesterId, Boolean isActive);

    StudentClassResponse getStudentClass(UUID id);

    StudentClassResponse createStudentClass(StudentClassRequest request);

    StudentClassResponse updateStudentClass(UUID id, StudentClassRequest request);

    void deleteStudentClass(UUID id);

    StudentClassResponse assignStudentToClass(UUID studentId, UUID classId, UUID semesterId, String roleInClass, String status, String note);
}
