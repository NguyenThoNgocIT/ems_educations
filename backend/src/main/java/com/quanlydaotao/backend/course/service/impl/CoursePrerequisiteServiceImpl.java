package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.entity.CoursePrerequisite;
import com.quanlydaotao.backend.course.entity.CoursePrerequisiteId;
import com.quanlydaotao.backend.course.repository.CoursePrerequisiteRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CoursePrerequisiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoursePrerequisiteServiceImpl implements CoursePrerequisiteService {

    private final CoursePrerequisiteRepository prerequisiteRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PrerequisiteDto> getPrerequisitesByCourse(UUID courseId) {
        return prerequisiteRepository.findAll().stream()
                .filter(p -> p.getCourseId().equals(courseId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrerequisiteDto addPrerequisite(CreatePrerequisiteRequest request) {
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.findById(request.getPrerequisiteId())
                .orElseThrow(() -> new RuntimeException("Prerequisite course not found"));

        CoursePrerequisite entity = new CoursePrerequisite();
        entity.setCourseId(request.getCourseId());
        entity.setPrerequisiteCourseId(request.getPrerequisiteId());
        entity.setType(request.getType() != null ? request.getType() : "PREREQUISITE");

        return mapToDto(prerequisiteRepository.save(entity));
    }

    @Override
    @Transactional
    public void deletePrerequisite(UUID id) {
        // Logic này cần UUID cũ của CoursePrerequisite hoặc composite ID
        // Nếu dùng id đơn, chúng ta cần tìm bản ghi trước
        // Tạm thời để trống hoặc throw lỗi nếu không dùng composite key
    }

    public void deletePrerequisite(UUID courseId, UUID prereqId) {
        CoursePrerequisiteId id = new CoursePrerequisiteId(courseId, prereqId);
        prerequisiteRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkExists(UUID courseId, UUID prereqId) {
        return prerequisiteRepository.existsById(new CoursePrerequisiteId(courseId, prereqId));
    }

    private PrerequisiteDto mapToDto(CoursePrerequisite entity) {
        PrerequisiteDto dto = new PrerequisiteDto();
        dto.setCourseId(entity.getCourseId());
        dto.setPrerequisiteCourseId(entity.getPrerequisiteCourseId());
        dto.setType(entity.getType());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}
