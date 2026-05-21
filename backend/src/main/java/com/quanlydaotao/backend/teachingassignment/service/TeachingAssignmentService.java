package com.quanlydaotao.backend.teachingassignment.service;

import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentRequest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentResponse;

import java.util.List;
import java.util.UUID;

public interface TeachingAssignmentService {
    List<TeachingAssignmentResponse> search(UUID instructorId, UUID courseClassId, UUID classId, UUID semesterId, Boolean isActive);

    TeachingAssignmentResponse assign(TeachingAssignmentRequest request);
}
