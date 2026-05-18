package com.quanlydaotao.backend.instructor.service;

<<<<<<< HEAD
import java.util.List;
import java.util.UUID;

import com.quanlydaotao.backend.instructor.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorProfileDto;
import com.quanlydaotao.backend.instructor.dto.InstructorUpdateRequest;

public interface InstructorService {
    // ✅ THÊM METHOD NÀY
    InstructorProfileDto createLecturer(InstructorCreateRequest request);
    
    InstructorProfileDto getLecturerById(UUID id);
    List<InstructorProfileDto> getAllLecturers();
    InstructorProfileDto updateLecturer(UUID id, InstructorUpdateRequest request);
    void deleteLecturer(UUID id);
=======
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
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
}