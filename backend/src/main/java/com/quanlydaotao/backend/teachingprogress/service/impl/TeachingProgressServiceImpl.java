package com.quanlydaotao.backend.teachingprogress.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogRequest;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogResponse;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressSummaryResponse;
import com.quanlydaotao.backend.teachingprogress.entity.TeachingProgressLog;
import com.quanlydaotao.backend.teachingprogress.mapper.TeachingProgressLogMapper;
import com.quanlydaotao.backend.teachingprogress.repository.TeachingProgressLogRepository;
import com.quanlydaotao.backend.teachingprogress.service.TeachingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingProgressServiceImpl implements TeachingProgressService {
    private final TeachingProgressLogRepository repository;
    private final CourseClassRepository courseClassRepository;
    private final CourseRepository courseRepository;
    private final TeachingProgressLogMapper mapper;

    @Override
    @Transactional
    public TeachingProgressLogResponse logSession(TeachingProgressLogRequest request) {
        if (request.getActualPeriods() != null && request.getActualPeriods() < 0) {
            throw new BusinessException("Số tiết đã dạy không được âm");
        }
        courseClassRepository.findById(request.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        TeachingProgressLog log = new TeachingProgressLog();
        mapper.updateEntityFromDto(request, log);
        log.setIsInstructorAbsent(Boolean.TRUE.equals(request.getIsInstructorAbsent()));
        log.setActualPeriods(Boolean.TRUE.equals(log.getIsInstructorAbsent()) ? 0 : (request.getActualPeriods() == null ? 0 : request.getActualPeriods()));
        log.setStatus(request.getStatus() == null ? "TAUGHT" : request.getStatus().trim().toUpperCase(Locale.ROOT));
        log.setIsActive(true);
        return mapper.toDto(repository.save(log));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeachingProgressLogResponse> getLogs(UUID courseClassId) {
        return mapper.toDtoList(repository.findByCourseClassIdAndIsActiveTrue(courseClassId));
    }

    @Override
    @Transactional(readOnly = true)
    public TeachingProgressSummaryResponse getSummary(UUID courseClassId) {
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        Course course = courseRepository.findById(courseClass.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học phần"));
        int requiredPeriods = resolveRequiredPeriods(course);
        Integer taught = repository.sumTaughtPeriods(courseClassId);
        long absentSessions = repository.countInstructorAbsentSessions(courseClassId);
        return TeachingProgressSummaryResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseName(course.getName())
                .credits(course.getCredits())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .requiredPeriods(requiredPeriods)
                .instructorAbsentSessions(absentSessions)
                .taughtPeriods(taught == null ? 0 : taught)
                .remainingPeriods(Math.max(requiredPeriods - (taught == null ? 0 : taught), 0))
                .build();
    }

    private int resolveRequiredPeriods(Course course) {
        if (course.getTheoryHours() != null && course.getTheoryHours() > 0) {
            return course.getTheoryHours().intValue();
        }
        if (course.getPracticeHours() != null && course.getPracticeHours() > 0) {
            return course.getPracticeHours().intValue();
        }
        if (course.getInternshipCredits() != null && course.getInternshipCredits() > 0) {
            return (int) Math.round(course.getInternshipCredits() * 45);
        }
        double credits = course.getCredits() == null ? 0 : course.getCredits();
        return (int) Math.round(credits * 15);
    }
}
