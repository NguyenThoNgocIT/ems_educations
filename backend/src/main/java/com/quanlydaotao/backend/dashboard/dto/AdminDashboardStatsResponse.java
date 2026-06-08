package com.quanlydaotao.backend.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardStatsResponse {
    private long totalStudents;
    private long totalLecturers;
    private long totalClasses;
    private long totalCourses;
    private double studentGrowth;
    private double lecturerGrowth;
    private double classGrowth;
    private double courseGrowth;
}
