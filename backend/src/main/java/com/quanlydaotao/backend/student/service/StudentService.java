package com.quanlydaotao.backend.student.service;

<<<<<<< HEAD
import com.quanlydaotao.backend.student.dto.CreateStudentRequest;
import com.quanlydaotao.backend.student.dto.EnrollStudentRequest;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
=======
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;

>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
import java.util.List;
import java.util.UUID;

public interface StudentService {
<<<<<<< HEAD
    StudentDto createStudent(CreateStudentRequest request);      // ✅ THÊM
    StudentDto enrollStudent(EnrollStudentRequest request);      // ✅ THÊM
    StudentDto getStudentById(UUID id);
    List<StudentDto> getAllStudents();
    StudentDto updateStudent(UUID id, UpdateStudentRequest request);
    void deleteStudent(UUID id);
=======
    AccountCreationResponse createStudentForAdmin(StudentAdminCreateRequest request);
    List<StudentAdminResponse> getAllStudentsForAdmin();
    StudentAdminResponse getStudentForAdmin(UUID id);
    StudentAdminResponse updateStudentForAdmin(UUID id, StudentAdminUpdateRequest request);
    void deleteStudentForAdmin(UUID id);
    StudentSelfResponse getCurrentStudent(String username);
    StudentSelfResponse updateCurrentStudent(String username, StudentSelfUpdateRequest request);
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
}