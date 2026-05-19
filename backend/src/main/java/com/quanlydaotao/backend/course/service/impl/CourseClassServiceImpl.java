package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.mapper.CourseClassMapper;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CourseClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;
    private final CourseRepository courseRepository;
    private final CourseClassMapper courseClassMapper;

    @Override
    @Transactional
    public CourseClassDto createCourseClass(CourseClassDto courseClassDto) {
        // 1. Kiểm tra môn học có hợp lệ để mở lớp không
        Course course = courseRepository.findById(courseClassDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học gốc"));
        
        if (Boolean.FALSE.equals(course.getIsActive())) {
            throw new BusinessException("Không thể mở lớp cho môn học đang ở trạng thái ngừng hoạt động");
        }

        // Check if combination already exists
        if (courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(
                courseClassDto.getClassCode(),
                courseClassDto.getSemesterId(),
                courseClassDto.getCourseId()).isPresent()) {
            throw new BusinessException("Mã lớp học phần này đã tồn tại trong học kỳ");
        }

        CourseClass courseClass = courseClassMapper.toEntity(courseClassDto);
        courseClass.setCurrentStudent(0);
        courseClass.setIsActive(true);

        courseClass = courseClassRepository.save(courseClass);
        return courseClassMapper.toDto(courseClass);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseClassDto getCourseClassById(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course class not found with id: " + id));
        return courseClassMapper.toDto(courseClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getAllCourseClasses() {
        return courseClassMapper.toDtoList(courseClassRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesByCourse(UUID courseId) {
        return courseClassMapper.toDtoList(courseClassRepository.findByCourseId(courseId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesBySemester(UUID semesterId) {
        return courseClassMapper.toDtoList(courseClassRepository.findBySemesterId(semesterId));
    }

    @Override
    @Transactional
    public CourseClassDto updateCourseClass(UUID id, CourseClassDto courseClassDto) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course class not found with id: " + id));

        courseClassMapper.updateEntityFromDto(courseClassDto, courseClass);

        courseClass = courseClassRepository.save(courseClass);
        return courseClassMapper.toDto(courseClass);
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

}
