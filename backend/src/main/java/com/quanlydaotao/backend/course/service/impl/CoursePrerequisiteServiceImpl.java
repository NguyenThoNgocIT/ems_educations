package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.entity.CoursePrerequisite;
import com.quanlydaotao.backend.course.entity.CoursePrerequisiteId;
import com.quanlydaotao.backend.course.mapper.CoursePrerequisiteMapper;
import com.quanlydaotao.backend.course.repository.CoursePrerequisiteRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CoursePrerequisiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CoursePrerequisiteServiceImpl implements CoursePrerequisiteService {

    private static final List<String> ALLOWED_TYPES = List.of("PREREQUISITE", "PARALLEL", "COREQUISITE");

    private final CoursePrerequisiteRepository prerequisiteRepository;
    private final CourseRepository courseRepository;
    private final CoursePrerequisiteMapper coursePrerequisiteMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PrerequisiteDto> getPrerequisitesByCourse(UUID courseId) {
        return prerequisiteRepository.findByCourseId(courseId).stream()
                .filter(item -> !Boolean.FALSE.equals(item.getIsActive()))
                .map(coursePrerequisiteMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public PrerequisiteDto addPrerequisite(CreatePrerequisiteRequest request) {
        validateRequest(request);
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học"));
        courseRepository.findById(request.getPrerequisiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn tiên quyết/tương đương"));

        CoursePrerequisiteId id = new CoursePrerequisiteId(request.getCourseId(), request.getPrerequisiteId());
        prerequisiteRepository.findById(id)
                .filter(existing -> Boolean.TRUE.equals(existing.getIsActive()))
                .ifPresent(existing -> {
                    throw new BusinessException("Quan hệ môn học đã tồn tại");
                });

        CoursePrerequisite entity = prerequisiteRepository.findById(id).orElseGet(CoursePrerequisite::new);
        entity.setCourseId(request.getCourseId());
        entity.setPrerequisiteCourseId(request.getPrerequisiteId());
        entity.setType(resolveType(request.getType()));
        entity.setIsActive(true);
        entity.setDeletedAt(null);
        return coursePrerequisiteMapper.toDto(prerequisiteRepository.save(entity));
    }

    @Override
    @Transactional
    public void deletePrerequisite(UUID courseId, UUID prereqId) {
        CoursePrerequisite entity = prerequisiteRepository.findById(new CoursePrerequisiteId(courseId, prereqId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quan hệ môn học"));
        entity.setIsActive(false);
        entity.setDeletedAt(LocalDateTime.now());
        prerequisiteRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkExists(UUID courseId, UUID prereqId) {
        return prerequisiteRepository.findById(new CoursePrerequisiteId(courseId, prereqId))
                .filter(item -> Boolean.TRUE.equals(item.getIsActive()))
                .isPresent();
    }

    private void validateRequest(CreatePrerequisiteRequest request) {
        if (request.getCourseId() == null || request.getPrerequisiteId() == null) {
            throw new BusinessException("Môn học và môn liên quan không được để trống");
        }
        if (request.getCourseId().equals(request.getPrerequisiteId())) {
            throw new BusinessException("Môn học không được tự là môn tiên quyết/tương đương của chính nó");
        }
        resolveType(request.getType());
    }

    private String resolveType(String type) {
        String normalized = StringUtils.hasText(type) ? type.trim().toUpperCase(Locale.ROOT) : "PREREQUISITE";
        if (!ALLOWED_TYPES.contains(normalized)) {
            throw new BusinessException("Loại quan hệ môn học chỉ hỗ trợ PREREQUISITE, PARALLEL hoặc COREQUISITE");
        }
        return normalized;
    }
}
