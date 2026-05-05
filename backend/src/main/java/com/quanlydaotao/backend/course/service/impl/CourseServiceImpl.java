package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseDto createCourse(CourseDto courseDto) {
        // Check if code already exists
        if (courseRepository.findByCode(courseDto.getCode()).isPresent()) {
            throw new BusinessException("Course code already exists: " + courseDto.getCode());
        }

        Course course = new Course();
        course.setDepartmentId(courseDto.getDepartmentId());
        course.setCode(courseDto.getCode());
        course.setName(courseDto.getName());
        course.setNameEn(courseDto.getNameEn());
        course.setCourseType(courseDto.getCourseType());
        course.setCredits(courseDto.getCredits());
        course.setTheoryHours(courseDto.getTheoryHours());
        course.setPracticeHours(courseDto.getPracticeHours());
        course.setSelfStudyHours(courseDto.getSelfStudyHours());
        course.setInternshipCredits(courseDto.getInternshipCredits());
        course.setDescription(courseDto.getDescription());
        course.setIsActive(true);

        course = courseRepository.save(course);
        return mapToDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapToDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseByCod(String code) {
        Course course = courseRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + code));
        return mapToDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getCoursesByDepartment(UUID departmentId) {
        return courseRepository.findAll().stream()
                .filter(course -> departmentId.equals(course.getDepartmentId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseDto updateCourse(UUID id, CourseDto courseDto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        // Check if code is being changed and if new code already exists
        if (!course.getCode().equals(courseDto.getCode()) &&
<<<<<<< HEAD
            courseRepository.findByCodeAndIdNot(courseDto.getCode(), id).isPresent()) {
=======
            courseRepository.findByCodeAndCourseIdNot(courseDto.getCode(), id).isPresent()) {
>>>>>>> origin/develop
            throw new BusinessException("Course code already exists: " + courseDto.getCode());
        }

        course.setCode(courseDto.getCode());
        course.setName(courseDto.getName());
        course.setNameEn(courseDto.getNameEn());
        course.setCourseType(courseDto.getCourseType());
        course.setCredits(courseDto.getCredits());
        course.setTheoryHours(courseDto.getTheoryHours());
        course.setPracticeHours(courseDto.getPracticeHours());
        course.setSelfStudyHours(courseDto.getSelfStudyHours());
        course.setInternshipCredits(courseDto.getInternshipCredits());
        course.setDescription(courseDto.getDescription());
        course.setDepartmentId(courseDto.getDepartmentId());
        if (courseDto.getIsActive() != null) {
            course.setIsActive(courseDto.getIsActive());
        }

        course = courseRepository.save(course);
        return mapToDto(course);
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.setIsActive(false);
        course.setDeletedAt(LocalDateTime.now());
        courseRepository.save(course);
    }

    private CourseDto mapToDto(Course course) {
        CourseDto dto = new CourseDto();
<<<<<<< HEAD
        dto.setId(course.getId());
=======
        dto.setId(course.getCourseId());
>>>>>>> origin/develop
        dto.setDepartmentId(course.getDepartmentId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setNameEn(course.getNameEn());
        dto.setCourseType(course.getCourseType());
        dto.setCredits(course.getCredits());
        dto.setTheoryHours(course.getTheoryHours());
        dto.setPracticeHours(course.getPracticeHours());
        dto.setSelfStudyHours(course.getSelfStudyHours());
        dto.setInternshipCredits(course.getInternshipCredits());
        dto.setDescription(course.getDescription());
        dto.setIsActive(course.getIsActive());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        return dto;
    }
}
