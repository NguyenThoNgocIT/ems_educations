package com.quanlydaotao.backend.lecturercourseclass;

import com.quanlydaotao.backend.courseclass.CourseClassRepository;
import com.quanlydaotao.backend.lecturer.LecturerRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LecturerCourseClassService {

    private final LecturerCourseClassRepository repository;
    private final LecturerRepository lecturerRepository;
    private final CourseClassRepository courseClassRepository;

    public LecturerCourseClass createAssignment(LecturerCourseClassRequest request) {
        lecturerRepository.findById(request.getLecturerId())
                .filter(lecturer -> Boolean.TRUE.equals(lecturer.getIsActive()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        courseClassRepository.findByIdAndIsActiveTrue(request.getCourseClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        repository.findByLecturerIdAndCourseClassIdAndIsActiveTrue(request.getLecturerId(), request.getCourseClassId())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        LecturerCourseClass assignment = LecturerCourseClass.builder()
                .lecturerId(request.getLecturerId())
                .courseClassId(request.getCourseClassId())
                .role(request.getRole())
                .isActive(true)
                .build();
        return repository.save(assignment);
    }

    public List<LecturerCourseClass> getAllAssignments() {
        return repository.findByIsActiveTrue();
    }

    public LecturerCourseClass getAssignmentById(UUID id) {
        return repository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<LecturerCourseClass> searchAssignments(UUID lecturerId, UUID courseClassId, String role, Boolean isActive) {
        String normalizedRole = (role == null || role.isBlank()) ? null : role;
        return repository.searchActiveByParams(lecturerId, courseClassId, normalizedRole, isActive);
    }

    public List<LecturerCourseClass> getByLecturer(UUID lecturerId) {
        return repository.findByLecturerIdAndIsActiveTrue(lecturerId);
    }

    public List<LecturerCourseClass> getByCourseClass(UUID courseClassId) {
        return repository.findByCourseClassIdAndIsActiveTrue(courseClassId);
    }

    public LecturerCourseClass updateAssignment(UUID id, LecturerCourseClassRequest request) {
        LecturerCourseClass existing = getAssignmentById(id);
        existing.setRole(request.getRole());
        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
            if (!request.getIsActive()) {
                existing.setDeletedAt(LocalDateTime.now());
            }
        }
        return repository.save(existing);
    }

    public void deleteAssignment(UUID id) {
        LecturerCourseClass existing = getAssignmentById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        repository.save(existing);
    }
}
