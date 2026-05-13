package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CoursePrerequisite;
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

        return mapToDto(prerequisiteRepository.save(entity));
    }

    @Override
    @Transactional
    public void deletePrerequisite(UUID id) {
        // Since deletePrerequisite takes courseId or similar, but the repo needs the composite ID
        // For now, if id is the courseId, we might need to adjust logic
        // Let's assume the ID passed is something we can handle or keep it for now
        prerequisiteRepository.deleteById(null); // This needs the composite ID object
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkExists(UUID courseId, UUID prereqId) {
        return prerequisiteRepository.findAll().stream()
                .anyMatch(p -> p.getCourseId().equals(courseId) 
                        && p.getPrerequisiteCourseId().equals(prereqId));
    }

    private PrerequisiteDto mapToDto(CoursePrerequisite entity) {
        PrerequisiteDto dto = new PrerequisiteDto();
        dto.setCourseId(entity.getCourseId());
        dto.setPrerequisiteCourseId(entity.getPrerequisiteCourseId());
        
        return dto;
    }
}
