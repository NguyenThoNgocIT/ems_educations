package com.quanlydaotao.backend.teachingassignment.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentRequest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentResponse;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.mapper.TeachingAssignmentMapper;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.teachingassignment.service.TeachingAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssignmentServiceImpl implements TeachingAssignmentService {
    private final TeachingAssignmentRepository repository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final CourseClassRepository courseClassRepository;
    private final SemesterRepository semesterRepository;
    private final TeachingAssignmentMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<TeachingAssignmentResponse> search(UUID instructorId, UUID courseClassId, UUID classId, UUID semesterId, Boolean isActive) {
        return mapper.toDtoList(repository.search(instructorId, courseClassId, classId, semesterId, isActive));
    }

    @Override
    @Transactional
    public TeachingAssignmentResponse assign(TeachingAssignmentRequest request) {
        validateReferences(request);
        var existingAssignment = repository.search(
                        request.getInstructorId(), request.getCourseClassId(), null, request.getSemesterId(), null)
                .stream()
                .findFirst();
        if (existingAssignment.isPresent() && Boolean.TRUE.equals(existingAssignment.get().getIsActive())) {
            throw new BusinessException("Phân công giảng dạy đã tồn tại");
        }
        if (repository.existsByCourseClassIdAndSemesterIdAndIsActiveTrue(request.getCourseClassId(), request.getSemesterId())) {
            throw new BusinessException("Lớp học phần đã có giảng viên được phân công");
        }
        TeachingAssignment assignment = existingAssignment.orElseGet(TeachingAssignment::new);
        mapper.updateEntityFromDto(request, assignment);
        assignment.setIsActive(request.getIsActive() == null || request.getIsActive());
        assignment.setDeletedAt(null);
        return mapper.toDto(repository.save(assignment));
    }

    @Override
    @Transactional
    public TeachingAssignmentResponse update(UUID assignmentId, TeachingAssignmentRequest request) {
        TeachingAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phân công giảng dạy"));
        validateReferences(request);
        boolean courseClassAlreadyAssigned = repository
                .search(null, request.getCourseClassId(), null, request.getSemesterId(), true)
                .stream()
                .anyMatch(existing -> !existing.getAssignmentId().equals(assignmentId));
        if (courseClassAlreadyAssigned) {
            throw new BusinessException("Lớp học phần đã có giảng viên được phân công");
        }
        repository.search(request.getInstructorId(), request.getCourseClassId(), null, request.getSemesterId(), true)
                .stream()
                .findFirst()
                .filter(existing -> !existing.getAssignmentId().equals(assignmentId))
                .ifPresent(existing -> {
                    throw new BusinessException("Phân công giảng dạy đã tồn tại");
                });

        mapper.updateEntityFromDto(request, assignment);
        assignment.setIsActive(request.getIsActive() == null || request.getIsActive());
        if (Boolean.TRUE.equals(assignment.getIsActive())) {
            assignment.setDeletedAt(null);
        }
        return mapper.toDto(repository.save(assignment));
    }

    @Override
    @Transactional
    public void delete(UUID assignmentId) {
        TeachingAssignment assignment = repository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phân công giảng dạy"));
        assignment.setIsActive(false);
        assignment.setDeletedAt(LocalDateTime.now());
        repository.save(assignment);
    }

    private void validateReferences(TeachingAssignmentRequest request) {
        if (!instructorProfileRepository.existsById(request.getInstructorId())) {
            throw new ResourceNotFoundException("Không tìm thấy giảng viên");
        }
        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        if (!request.getSemesterId().equals(courseClass.getSemesterId())) {
            throw new BusinessException("Học kỳ phân công không khớp lớp học phần");
        }
        if (!semesterRepository.existsById(request.getSemesterId())) {
            throw new ResourceNotFoundException("Không tìm thấy học kỳ");
        }
    }
}
