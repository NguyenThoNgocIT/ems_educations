package com.quanlydaotao.backend.staff.service.impl;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.staff.dto.StaffDto;
import com.quanlydaotao.backend.staff.entity.Staff;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.staff.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    @Override
    public StaffDto getStaffById(UUID id) {
        Staff staff = staffRepository.findByEmployeeIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));
        return mapToDto(staff);
    }
    @Override
    public Page<StaffDto> getAllStaff(Pageable pageable) {
        return staffRepository.findByDeletedAtIsNull(pageable).map(this::mapToDto);
    }
    private StaffDto mapToDto(Staff staff) {
        StaffDto dto = new StaffDto();
        dto.setEmployeeId(staff.getEmployeeId());
        dto.setStaffCode(staff.getStaffCode());
        dto.setDivisionId(staff.getDivisionId());
        dto.setPositionId(staff.getPositionId());
        return dto;
    }
}
