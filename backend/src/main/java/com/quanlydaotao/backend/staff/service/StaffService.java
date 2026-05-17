package com.quanlydaotao.backend.staff.service;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.staff.dto.StaffAdminCreateRequest;
import com.quanlydaotao.backend.staff.dto.StaffAdminResponse;
import com.quanlydaotao.backend.staff.dto.StaffAdminUpdateRequest;
import com.quanlydaotao.backend.staff.dto.StaffSelfResponse;
import com.quanlydaotao.backend.staff.dto.StaffSelfUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface StaffService {
    AccountCreationResponse createStaffForAdmin(StaffAdminCreateRequest request);
    List<StaffAdminResponse> getAllStaffsForAdmin();
    StaffAdminResponse getStaffForAdmin(UUID id);
    StaffAdminResponse updateStaffForAdmin(UUID id, StaffAdminUpdateRequest request);
    void deleteStaffForAdmin(UUID id);
    StaffSelfResponse getCurrentStaff(String username);
    StaffSelfResponse updateCurrentStaff(String username, StaffSelfUpdateRequest request);
}
