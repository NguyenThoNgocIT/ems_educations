package com.quanlydaotao.backend.prerequisite;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CoursePrerequisiteService {

    private final CoursePrerequisiteRepository coursePrerequisiteRepository;

    public List<CoursePrerequisite> getAllPrerequisites() {
        return coursePrerequisiteRepository.findByIsActiveTrue();
    }

    public CoursePrerequisite createPrerequisite(CoursePrerequisiteRequest request) {
        coursePrerequisiteRepository.findByCourseIdAndPrerequisiteIdAndIsActiveTrue(request.getCourseId(), request.getPrerequisiteId())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        CoursePrerequisite prerequisite = CoursePrerequisite.builder()
                .courseId(request.getCourseId())
                .prerequisiteId(request.getPrerequisiteId())
                .build();
        return coursePrerequisiteRepository.save(prerequisite);
    }

    public void deletePrerequisite(UUID id) {
        CoursePrerequisite existing = coursePrerequisiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        coursePrerequisiteRepository.save(existing);
    }

    public List<CoursePrerequisite> getPrerequisitesByCourse(UUID courseId) {
        return coursePrerequisiteRepository.findByCourseIdAndIsActiveTrue(courseId);
    }
}
