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
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
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
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final CourseClassMapper courseClassMapper;

    @Override
    @Transactional
    public CourseClassDto createCourseClass(CourseClassDto courseClassDto) {
        validateRequired(courseClassDto);
        Course course = courseRepository.findById(courseClassDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học"));
        Semester semester = semesterRepository.findById(courseClassDto.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));

        if (Boolean.FALSE.equals(course.getIsActive())) {
            throw new BusinessException("Không thể mở lớp cho môn học đang ngừng hoạt động");
        }
        validateCapacity(courseClassDto);
        validateDateRange(courseClassDto, semester);
        String classCode = normalizeCode(courseClassDto.getClassCode());

        if (courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(
                classCode,
                courseClassDto.getSemesterId(),
                courseClassDto.getCourseId()).isPresent()) {
            throw new BusinessException("Mã lớp học phần này đã tồn tại trong học kỳ");
        }

        CourseClass courseClass = courseClassMapper.toEntity(courseClassDto);
        courseClass.setClassCode(classCode);
        courseClass.setCurrentStudent(0);
        courseClass.setIsActive(true);
        return courseClassMapper.toDto(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseClassDto getCourseClassById(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
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
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));

        UUID semesterId = courseClassDto.getSemesterId() == null ? courseClass.getSemesterId() : courseClassDto.getSemesterId();
        UUID courseId = courseClassDto.getCourseId() == null ? courseClass.getCourseId() : courseClassDto.getCourseId();
        String classCode = StringUtils.hasText(courseClassDto.getClassCode())
                ? normalizeCode(courseClassDto.getClassCode())
                : courseClass.getClassCode();
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Không tìm thấy môn học");
        }
        validateCapacity(courseClassDto);
        validateDateRange(courseClassDto, semester);
        courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(classCode, semesterId, courseId)
                .filter(existing -> !existing.getCourseClassId().equals(id))
                .ifPresent(existing -> {
                    throw new BusinessException("Mã lớp học phần này đã tồn tại trong học kỳ");
                });

        courseClassMapper.updateEntityFromDto(courseClassDto, courseClass);
        courseClass.setClassCode(classCode);
        return courseClassMapper.toDto(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional
    public void deleteCourseClass(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        courseClass.setIsActive(false);
        courseClass.setDeletedAt(LocalDateTime.now());
        courseClassRepository.save(courseClass);
    }

    private void validateRequired(CourseClassDto request) {
        if (!StringUtils.hasText(request.getClassCode()) || request.getCourseId() == null || request.getSemesterId() == null) {
            throw new BusinessException("Mã lớp học phần, học kỳ và môn học không được để trống");
        }
    }

    private void validateCapacity(CourseClassDto request) {
        if (request.getMaxStudent() != null && request.getMaxStudent() <= 0) {
            throw new BusinessException("Sĩ số tối đa của lớp học phần phải lớn hơn 0");
        }
        if (request.getCurrentStudent() != null && request.getCurrentStudent() < 0) {
            throw new BusinessException("Sĩ số hiện tại của lớp học phần không được âm");
        }
        if (request.getCurrentStudent() != null && request.getMaxStudent() != null
                && request.getCurrentStudent() > request.getMaxStudent()) {
            throw new BusinessException("Sĩ số hiện tại không được lớn hơn sĩ số tối đa");
        }
    }

    private void validateDateRange(CourseClassDto request, Semester semester) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && request.getStartDate().isAfter(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu lớp học phần phải nhỏ hơn hoặc bằng ngày kết thúc");
        }
        if (request.getStartDate() != null && (request.getStartDate().isBefore(semester.getStartDate())
                || request.getStartDate().isAfter(semester.getEndDate()))) {
            throw new BusinessException("Ngày bắt đầu lớp học phần phải nằm trong học kỳ");
        }
        if (request.getEndDate() != null && (request.getEndDate().isBefore(semester.getStartDate())
                || request.getEndDate().isAfter(semester.getEndDate()))) {
            throw new BusinessException("Ngày kết thúc lớp học phần phải nằm trong học kỳ");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }
}
