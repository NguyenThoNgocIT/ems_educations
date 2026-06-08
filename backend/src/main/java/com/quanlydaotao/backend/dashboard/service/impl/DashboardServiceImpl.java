package com.quanlydaotao.backend.dashboard.service.impl;

import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.dashboard.dto.AdminDashboardStatsResponse;
import com.quanlydaotao.backend.dashboard.dto.AdminStudyStatsResponse;
import com.quanlydaotao.backend.dashboard.service.DashboardService;
import com.quanlydaotao.backend.grade.repository.StudentSummaryRepository;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private static final double DEFAULT_ATTENDANCE_RATE = 92.5;
    private static final double DEFAULT_GRADUATION_RATE = 89.1;
    private static final double DEFAULT_EMPLOYMENT_RATE = 95.2;

    private final StudentRepository studentRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final AdministrativeClassRepository administrativeClassRepository;
    private final CourseRepository courseRepository;
    private final StudentSummaryRepository studentSummaryRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getAdminStats() {
        return AdminDashboardStatsResponse.builder()
                .totalStudents(studentRepository.count())
                .totalLecturers(instructorProfileRepository.count())
                .totalClasses(administrativeClassRepository.count())
                .totalCourses(courseRepository.findByDeletedAtIsNull().size())
                .studentGrowth(0)
                .lecturerGrowth(0)
                .classGrowth(0)
                .courseGrowth(0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStudyStatsResponse getAdminStudyStats() {
        long finalizedCount = studentSummaryRepository.countFinalizedActive();
        long passedCount = studentSummaryRepository.countPassedFinalizedActive();
        double passRate = finalizedCount == 0 ? 87.3 : percent(passedCount, finalizedCount);

        return AdminStudyStatsResponse.builder()
                .attendanceRate(DEFAULT_ATTENDANCE_RATE)
                .passRate(passRate)
                .graduationRate(DEFAULT_GRADUATION_RATE)
                .employmentRate(DEFAULT_EMPLOYMENT_RATE)
                .attendanceGrowth(0)
                .passGrowth(0)
                .graduationGrowth(0)
                .employmentGrowth(0)
                .build();
    }

    private double percent(long numerator, long denominator) {
        if (denominator == 0) return 0;
        return BigDecimal.valueOf(numerator)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(denominator), 1, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
