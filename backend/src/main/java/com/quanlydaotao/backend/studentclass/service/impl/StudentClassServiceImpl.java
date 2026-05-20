package com.quanlydaotao.backend.studentclass.service.impl;

import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.studentclass.dto.StudentClassRequest;
import com.quanlydaotao.backend.studentclass.dto.StudentClassResponse;
import com.quanlydaotao.backend.studentclass.entity.StudentClass;
import com.quanlydaotao.backend.studentclass.mapper.StudentClassMapper;
import com.quanlydaotao.backend.studentclass.repository.StudentClassRepository;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentClassServiceImpl implements StudentClassService {
    private final StudentClassRepository studentClassRepository;
    private final StudentRepository studentRepository;
    private final AdministrativeClassRepository administrativeClassRepository;
    private final SemesterRepository semesterRepository;
    private final StudentClassMapper studentClassMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StudentClassResponse> search(UUID studentId, UUID classId, UUID semesterId, Boolean isActive) {
        return studentClassMapper.toDtoList(studentClassRepository.search(studentId, classId, semesterId, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentClassResponse getStudentClass(UUID id) {
        return studentClassMapper.toDto(findStudentClass(id));
    }

    @Override
    @Transactional
    public StudentClassResponse createStudentClass(StudentClassRequest request) {
        return assignStudentToClass(request.getStudentId(), request.getClassId(), request.getSemesterId(),
                request.getRoleInClass(), request.getStatus(), request.getNote());
    }

    @Override
    @Transactional
    public StudentClassResponse updateStudentClass(UUID id, StudentClassRequest request) {
        StudentClass studentClass = findStudentClass(id);
        UUID studentId = request.getStudentId() != null ? request.getStudentId() : studentClass.getStudentId();
        UUID classId = request.getClassId() != null ? request.getClassId() : studentClass.getClassId();
        UUID semesterId = request.getSemesterId() != null ? request.getSemesterId() : studentClass.getSemesterId();
        validateReferences(studentId, classId, semesterId);
        validateOneActiveClassPerSemester(studentId, classId, semesterId, id);

        studentClassMapper.updateEntityFromDto(request, studentClass);
        if (request.getIsActive() == null) {
            studentClass.setIsActive(true);
        }
        return studentClassMapper.toDto(studentClassRepository.save(studentClass));
    }

    @Override
    @Transactional
    public void deleteStudentClass(UUID id) {
        StudentClass studentClass = findStudentClass(id);
        studentClass.setIsActive(false);
        studentClass.setDeletedAt(LocalDateTime.now());
        studentClassRepository.save(studentClass);
    }

    @Override
    @Transactional
    public StudentClassResponse assignStudentToClass(UUID studentId, UUID classId, UUID semesterId, String roleInClass, String status, String note) {
        validateReferences(studentId, classId, semesterId);
        validateOneActiveClassPerSemester(studentId, classId, semesterId, null);

        StudentClass studentClass = studentClassRepository.findByStudentIdAndClassIdAndSemesterId(studentId, classId, semesterId)
                .orElseGet(StudentClass::new);
        studentClass.setStudentId(studentId);
        studentClass.setClassId(classId);
        studentClass.setSemesterId(semesterId);
        studentClass.setRoleInClass(StringUtils.hasText(roleInClass) ? roleInClass.trim() : null);
        studentClass.setStatus(StringUtils.hasText(status) ? status.trim().toUpperCase() : "ACTIVE");
        studentClass.setNote(note);
        studentClass.setIsActive(true);
        return studentClassMapper.toDto(studentClassRepository.save(studentClass));
    }

    private StudentClass findStudentClass(UUID id) {
        return studentClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bản ghi lớp hành chính của sinh viên"));
    }

    private void validateReferences(UUID studentId, UUID classId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        AdministrativeClass administrativeClass = administrativeClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp hành chính"));
        if (!Boolean.TRUE.equals(student.getIsActive())) {
            throw new BusinessException("Sinh viên không còn hoạt động");
        }
        if (!Boolean.TRUE.equals(administrativeClass.getIsActive())) {
            throw new BusinessException("Lớp hành chính không còn hoạt động");
        }
        if (!semesterRepository.existsById(semesterId)) {
            throw new ResourceNotFoundException("Không tìm thấy học kỳ");
        }
        if (student.getAcademicCohortId() != null && administrativeClass.getAcademicCohortId() != null
                && !student.getAcademicCohortId().equals(administrativeClass.getAcademicCohortId())) {
            throw new BusinessException("Lớp hành chính không thuộc niên khóa của sinh viên");
        }
    }

    private void validateOneActiveClassPerSemester(UUID studentId, UUID classId, UUID semesterId, UUID currentStudentClassId) {
        studentClassRepository.findByStudentIdAndSemesterIdAndIsActiveTrue(studentId, semesterId)
                .filter(existing -> currentStudentClassId == null || !existing.getStudentClassId().equals(currentStudentClassId))
                .filter(existing -> !existing.getClassId().equals(classId))
                .ifPresent(existing -> {
                    throw new BusinessException("Sinh viên đã được gán lớp hành chính trong học kỳ này");
                });
    }
}
