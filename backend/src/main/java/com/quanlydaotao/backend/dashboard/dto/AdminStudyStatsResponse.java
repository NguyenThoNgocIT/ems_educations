package com.quanlydaotao.backend.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStudyStatsResponse {
    private double attendanceRate;
    private double passRate;
    private double graduationRate;
    private double employmentRate;
    private double attendanceGrowth;
    private double passGrowth;
    private double graduationGrowth;
    private double employmentGrowth;
}
