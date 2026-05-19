package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.mapper.CourseMapper;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseClassRepository courseClassRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseDto createCourse(CourseDto courseDto) {
        // 1. Validation: Tín chỉ phải > 0 và <= 10
        if (courseDto.getCredits() == null || courseDto.getCredits() <= 0 || courseDto.getCredits() > 10.0) {
            throw new BusinessException("Số tín chỉ phải từ 0.5 đến 10.0");
        }

        // 2. Validation: Giờ học không được âm
        if ((courseDto.getTheoryHours() != null && courseDto.getTheoryHours() < 0) ||
            (courseDto.getPracticeHours() != null && courseDto.getPracticeHours() < 0)) {
            throw new BusinessException("Số tiết học không được là số âm");
        }

        // 3. Check if code already exists
        if (courseRepository.findByCode(courseDto.getCode()).isPresent()) {
            throw new BusinessException("Mã môn học đã tồn tại: " + courseDto.getCode());
        }

        Course course = courseMapper.toEntity(courseDto);
        
        // 4. Tự động tính giờ tự học: credits * 2
        course.setSelfStudyHours(courseDto.getCredits() * 2);
        
        course.setInternshipCredits(courseDto.getInternshipCredits());
        course.setDescription(courseDto.getDescription());
        course.setIsActive(true);

        course = courseRepository.save(course);
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseByCode(String code) {
        Course course = courseRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + code));
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        return courseMapper.toDtoList(courseRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getCoursesByDepartment(UUID departmentId) {
        return courseRepository.findAll().stream()
                .filter(course -> departmentId.equals(course.getDepartmentId()))
                .map(courseMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public CourseDto updateCourse(UUID id, CourseDto courseDto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học với ID: " + id));

        // 1. Kiểm tra xem môn học đã được mở lớp chưa
        boolean hasClasses = !courseClassRepository.findByCourseId(id).isEmpty();

        if (hasClasses) {
            // Logic Field Locking: Nếu đã có lớp, không cho sửa các trường cốt lõi
            if (!course.getCode().equals(courseDto.getCode())) {
                throw new BusinessException("Không được thay đổi mã môn học của môn đã có lớp học phần");
            }
            if (!Objects.equals(course.getCredits(), courseDto.getCredits())) {
                throw new BusinessException("Không được thay đổi số tín chỉ của môn đã có lớp học phần");
            }
            if (!Objects.equals(course.getDepartmentId(), courseDto.getDepartmentId())) {
                throw new BusinessException("Không được thay đổi khoa quản lý của môn đã có lớp học phần");
            }
        } else {
            // Nếu chưa có lớp, cho phép sửa mã và kiểm tra trùng
            if (!course.getCode().equals(courseDto.getCode()) &&
                courseRepository.findByCodeAndCourseIdNot(courseDto.getCode(), id).isPresent()) {
                throw new BusinessException("Mã môn học đã tồn tại: " + courseDto.getCode());
            }
            course.setCode(courseDto.getCode());
            course.setCredits(courseDto.getCredits());
            course.setDepartmentId(courseDto.getDepartmentId());
            
            // Cập nhật lại giờ tự học nếu credits thay đổi
            course.setSelfStudyHours(courseDto.getCredits() * 2);
        }

        // Các trường luôn được phép sửa
        course.setName(courseDto.getName());
        course.setNameEn(courseDto.getNameEn());
        course.setCourseType(courseDto.getCourseType());
        course.setTheoryHours(courseDto.getTheoryHours());
        course.setPracticeHours(courseDto.getPracticeHours());
        course.setInternshipCredits(courseDto.getInternshipCredits());
        course.setDescription(courseDto.getDescription());
        
        if (courseDto.getIsActive() != null) {
            course.setIsActive(courseDto.getIsActive());
        }

        course = courseRepository.save(course);
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học với ID: " + id));
        
        // 2. Kiểm tra logic xóa
        boolean hasClasses = !courseClassRepository.findByCourseId(id).isEmpty();
        
        if (hasClasses) {
            // Nếu đã có lớp học phần, chỉ được chuyển trạng thái isActive = false (Xóa logic)
            course.setIsActive(false);
            courseRepository.save(course);
            // Có thể log lại hoặc thông báo người dùng là chỉ deactivate chứ không xóa hẳn
        } else {
            // Nếu chưa có lớp, thực hiện soft delete bằng cách set deletedAt
            course.setIsActive(false);
            course.setDeletedAt(LocalDateTime.now());
            courseRepository.save(course);
        }
    }

}
