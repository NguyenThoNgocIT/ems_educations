package com.quanlydaotao.backend.instructor.service;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminUpdateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface InstructorService {
    AccountCreationResponse createInstructorForAdmin(InstructorAdminCreateRequest request);
    List<InstructorAdminResponse> getAllInstructorsForAdmin();
    InstructorAdminResponse getInstructorForAdmin(UUID id);
    InstructorAdminResponse updateInstructorForAdmin(UUID id, InstructorAdminUpdateRequest request);
    void deleteInstructorForAdmin(UUID id);
    InstructorSelfResponse getCurrentInstructor(String username);
    InstructorSelfResponse updateCurrentInstructor(String username, InstructorSelfUpdateRequest request);
}