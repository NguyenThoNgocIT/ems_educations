package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.service.CourseClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;

    @Override
    @Transactional
    public CourseClassDto createCourseClass(CourseClassDto courseClassDto) {
        // Check if combination already exists
        if (courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(
                courseClassDto.getClassCode(),
                courseClassDto.getSemesterId(),
                courseClassDto.getCourseId()).isPresent()) {
            throw new BusinessException("Course class already exists for this semester and course");
        }

        CourseClass courseClass = new CourseClass();
        courseClass.setClassCode(courseClassDto.getClassCode());
        courseClass.setMaxStudent(courseClassDto.getMaxStudent());
        courseClass.setCurrentStudent(0);
        courseClass.setRoomId(courseClassDto.getRoomId());
        courseClass.setStatus(courseClassDto.getStatus());
        courseClass.setSemesterId(courseClassDto.getSemesterId());
        courseClass.setCourseId(courseClassDto.getCourseId());
        courseClass.setIsActive(true);

        courseClass = courseClassRepository.save(courseClass);
        return mapToDto(courseClass);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseClassDto getCourseClassById(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course class not found with id: " + id));
        return mapToDto(courseClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getAllCourseClasses() {
        return courseClassRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesByCourse(UUID courseId) {
        return courseClassRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesBySemester(UUID semesterId) {
        return courseClassRepository.findBySemesterId(semesterId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseClassDto updateCourseClass(UUID id, CourseClassDto courseClassDto) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course class not found with id: " + id));

        courseClass.setClassCode(courseClassDto.getClassCode());
        courseClass.setMaxStudent(courseClassDto.getMaxStudent());
        courseClass.setRoomId(courseClassDto.getRoomId());
        courseClass.setStatus(courseClassDto.getStatus());
        if (courseClassDto.getCurrentStudent() != null) {
            courseClass.setCurrentStudent(courseClassDto.getCurrentStudent());
        }
        if (courseClassDto.getIsActive() != null) {
            courseClass.setIsActive(courseClassDto.getIsActive());
        }

        courseClass = courseClassRepository.save(courseClass);
        return mapToDto(courseClass);
    }

    @Override
    @Transactional
    public void deleteCourseClass(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course class not found with id: " + id));
        courseClass.setIsActive(false);
        courseClass.setDeletedAt(LocalDateTime.now());
        courseClassRepository.save(courseClass);
    }

    private CourseClassDto mapToDto(CourseClass courseClass) {
        CourseClassDto dto = new CourseClassDto();
        dto.setId(courseClass.getId());
        dto.setClassCode(courseClass.getClassCode());
        dto.setMaxStudent(courseClass.getMaxStudent());
        dto.setCurrentStudent(courseClass.getCurrentStudent());
        dto.setRoomId(courseClass.getRoomId());
        dto.setStatus(courseClass.getStatus());
        dto.setSemesterId(courseClass.getSemesterId());
        dto.setCourseId(courseClass.getCourseId());
        dto.setIsActive(courseClass.getIsActive());
        dto.setCreatedAt(courseClass.getCreatedAt());
        dto.setUpdatedAt(courseClass.getUpdatedAt());
        return dto;
    }
}
