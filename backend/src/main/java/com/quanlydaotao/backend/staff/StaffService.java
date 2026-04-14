package com.quanlydaotao.backend.staff;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Staff createStaff(Staff staff) {
        staffRepository.findByStaffCode(staff.getStaffCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        return staffRepository.save(staff);
    }

    public Staff updateStaff(UUID id, Staff request) {
        Staff existing = getStaffById(id);
        if (!existing.getStaffCode().equals(request.getStaffCode())) {
            staffRepository.findByStaffCode(request.getStaffCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setStaffCode(request.getStaffCode());
        existing.setFullName(request.getFullName());
        existing.setDepartmentId(request.getDepartmentId());
        existing.setPositionId(request.getPositionId());
        existing.setPhone(request.getPhone());
        existing.setEmail(request.getEmail());
        existing.setHireDate(request.getHireDate());
        existing.setStatus(request.getStatus());
        return staffRepository.save(existing);
    }

    public void deleteStaff(UUID id) {
        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dữ liệu");
        }
        staffRepository.deleteById(id);
    }

    public List<Staff> searchStaff(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllStaff();
        }
        return staffRepository.findByStaffCodeContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                keyword,
                keyword,
                keyword
        );
    }
}
