package com.quanlydaotao.backend.lecturer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LecturerService {

    private final LecturerRepository lecturerRepository;

    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findByIsActiveTrue();
    }

    public Lecturer getLecturerById(UUID id) {
        return lecturerRepository.findById(id)
                .filter(Lecturer::getIsActive)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Lecturer createLecturer(Lecturer request) {
        lecturerRepository.findByLecturerCode(request.getLecturerCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        return lecturerRepository.save(request);
    }

    public Lecturer updateLecturer(UUID id, Lecturer request) {
        Lecturer existing = getLecturerById(id);
        if (!existing.getLecturerCode().equals(request.getLecturerCode())) {
            lecturerRepository.findByLecturerCode(request.getLecturerCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setLecturerCode(request.getLecturerCode());
        existing.setFullName(request.getFullName());
        existing.setDateOfBirth(request.getDateOfBirth());
        existing.setGender(request.getGender());
        existing.setPhone(request.getPhone());
        existing.setEmail(request.getEmail());
        existing.setAddress(request.getAddress());
        existing.setDepartmentId(request.getDepartmentId());
        existing.setDegreeId(request.getDegreeId());
        existing.setHireDate(request.getHireDate());
        existing.setStatus(request.getStatus());
        return lecturerRepository.save(existing);
    }

    public void deleteLecturer(UUID id) {
        Lecturer existing = getLecturerById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        lecturerRepository.save(existing);
    }

    public List<Lecturer> searchLecturers(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllLecturers();
        }
        return lecturerRepository.searchActiveByKeyword(keyword);
    }

    public List<Lecturer> getLecturersByDepartment(String departmentId) {
        return lecturerRepository.findByIsActiveTrueAndDepartmentId(departmentId);
    }
}
