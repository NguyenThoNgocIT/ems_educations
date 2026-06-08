package com.quanlydaotao.backend.dashboard.service;

import com.quanlydaotao.backend.dashboard.dto.AdminDashboardStatsResponse;
import com.quanlydaotao.backend.dashboard.dto.AdminStudyStatsResponse;

public interface DashboardService {
    AdminDashboardStatsResponse getAdminStats();

    AdminStudyStatsResponse getAdminStudyStats();
}
