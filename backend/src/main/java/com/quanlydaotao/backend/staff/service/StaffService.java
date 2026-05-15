package com.quanlydaotao.backend.staff.service;
import com.quanlydaotao.backend.staff.dto.StaffDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
public interface StaffService {
    StaffDto getStaffById(UUID id);
    Page<StaffDto> getAllStaff(Pageable pageable);
}
