package com.quanlydaotao.backend.semester;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SemesterService {

    private final SemesterRepository semesterRepository;

    public List<Semester> getAllSemesters() {
        return semesterRepository.findByIsActiveTrue();
    }

    public List<Semester> getActiveSemesters() {
        return semesterRepository.findByIsActiveTrue();
    }

    public Semester getSemesterById(UUID id) {
        return semesterRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<Semester> getSemestersByAcademicYear(String academicYear) {
        return semesterRepository.searchActiveByAcademicYearOrName(academicYear);
    }

    public Semester createSemester(SemesterRequest request) {
        semesterRepository.findByCode(request.getCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        }
        Semester semester = Semester.builder()
                .code(request.getCode())
                .name(request.getName())
                .academicYear(request.getAcademicYear())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();
        return semesterRepository.save(semester);
    }

    public Semester updateSemester(UUID id, SemesterRequest request) {
        Semester existing = getSemesterById(id);
        if (!existing.getCode().equals(request.getCode())) {
            semesterRepository.findByCode(request.getCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        }
        existing.setCode(request.getCode());
        existing.setName(request.getName());
        existing.setAcademicYear(request.getAcademicYear());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setDescription(request.getDescription());
        return semesterRepository.save(existing);
    }

    public void deleteSemester(UUID id) {
        Semester existing = getSemesterById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        semesterRepository.save(existing);
    }
}
