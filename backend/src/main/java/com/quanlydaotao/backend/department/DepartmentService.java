package com.quanlydaotao.backend.department;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Department createDepartment(Department department) {
        departmentRepository.findByDepartmentCode(department.getDepartmentCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        return departmentRepository.save(department);
    }

    public Department updateDepartment(UUID id, Department request) {
        Department existing = getDepartmentById(id);
        if (!existing.getDepartmentCode().equals(request.getDepartmentCode())) {
            departmentRepository.findByDepartmentCode(request.getDepartmentCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setDepartmentCode(request.getDepartmentCode());
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dữ liệu");
        }
        departmentRepository.deleteById(id);
    }

    public List<Department> searchDepartments(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllDepartments();
        }
        return departmentRepository.findByDepartmentCodeContainingIgnoreCaseOrNameContainingIgnoreCase(
                keyword,
                keyword
        );
    }
}
