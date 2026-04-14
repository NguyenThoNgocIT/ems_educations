package com.quanlydaotao.backend.major;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MajorService {

    private final MajorRepository majorRepository;

    public List<Major> getAllMajors() {
        return majorRepository.findAll().stream()
                .filter(Major::getIsActive)
                .toList();
    }

    public Major getMajorById(UUID id) {
        return majorRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Major createMajor(MajorRequest request) {
        majorRepository.findByMajorCode(request.getMajorCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        Major major = Major.builder()
                .majorCode(request.getMajorCode())
                .majorName(request.getMajorName())
                .description(request.getDescription())
                .departmentId(request.getDepartmentId())
                .build();
        return majorRepository.save(major);
    }

    public Major updateMajor(UUID id, MajorRequest request) {
        Major existing = getMajorById(id);
        if (!existing.getMajorCode().equals(request.getMajorCode())) {
            majorRepository.findByMajorCode(request.getMajorCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setMajorCode(request.getMajorCode());
        existing.setMajorName(request.getMajorName());
        existing.setDescription(request.getDescription());
        existing.setDepartmentId(request.getDepartmentId());
        return majorRepository.save(existing);
    }

    public void deleteMajor(UUID id) {
        Major existing = getMajorById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        majorRepository.save(existing);
    }

    public List<Major> searchMajors(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllMajors();
        }
        return majorRepository.searchActiveByKeyword(keyword);
    }

    public Page<Major> getMajorsPage(int page, int size) {
        return majorRepository.findByIsActiveTrue(PageRequest.of(page, size));
    }
}
