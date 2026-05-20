package com.quanlydaotao.backend.studentspecialization.service;

import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationAssignRequest;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationHistoryResponse;

import java.util.List;
import java.util.UUID;

public interface StudentSpecializationService {
    List<StudentSpecializationHistoryResponse> search(UUID studentId, UUID majorId, UUID specializationId, Boolean isCurrent, Boolean isActive);

    StudentSpecializationHistoryResponse assignSpecialization(StudentSpecializationAssignRequest request);
}
