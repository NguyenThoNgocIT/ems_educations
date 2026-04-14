package com.quanlydaotao.backend.trainingprogram;

import com.quanlydaotao.backend.major.Major;
import com.quanlydaotao.backend.major.MajorRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final MajorRepository majorRepository;

    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingProgramRepository.findByIsActiveTrue();
    }

    public TrainingProgram getTrainingProgramById(UUID id) {
        return trainingProgramRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public TrainingProgram createTrainingProgram(TrainingProgramRequest request) {
        trainingProgramRepository.findByProgramCode(request.getProgramCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        Major major = majorRepository.findByIdAndIsActiveTrue(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        TrainingProgram program = TrainingProgram.builder()
                .programCode(request.getProgramCode())
                .programName(request.getProgramName())
                .majorId(major.getId())
                .academicYear(request.getAcademicYear())
                .totalCredits(request.getTotalCredits())
                .description(request.getDescription())
                .status(request.getStatus())
                .note(request.getNote())
                .build();
        return trainingProgramRepository.save(program);
    }

    public TrainingProgram updateTrainingProgram(UUID id, TrainingProgramRequest request) {
        TrainingProgram existing = getTrainingProgramById(id);
        if (!existing.getProgramCode().equals(request.getProgramCode())) {
            trainingProgramRepository.findByProgramCode(request.getProgramCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        Major major = majorRepository.findByIdAndIsActiveTrue(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setProgramCode(request.getProgramCode());
        existing.setProgramName(request.getProgramName());
        existing.setMajorId(major.getId());
        existing.setAcademicYear(request.getAcademicYear());
        existing.setTotalCredits(request.getTotalCredits());
        existing.setDescription(request.getDescription());
        existing.setStatus(request.getStatus());
        existing.setNote(request.getNote());
        return trainingProgramRepository.save(existing);
    }

    public void deleteTrainingProgram(UUID id) {
        TrainingProgram existing = getTrainingProgramById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        trainingProgramRepository.save(existing);
    }

    public List<TrainingProgram> searchTrainingPrograms(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllTrainingPrograms();
        }
        return trainingProgramRepository.searchActiveByKeyword(keyword);
    }

    public Page<TrainingProgram> getTrainingProgramsPage(int page, int size) {
        return trainingProgramRepository.findByIsActiveTrue(PageRequest.of(page, size));
    }

    public List<TrainingProgramDetailsResponse> getTrainingProgramDetails() {
        return getAllTrainingPrograms().stream()
                .map(program -> {
                    Major major = majorRepository.findByIdAndIsActiveTrue(program.getMajorId())
                            .orElse(null);
                    return new TrainingProgramDetailsResponse(
                            program.getId(),
                            program.getProgramCode(),
                            program.getProgramName(),
                            program.getMajorId(),
                            major != null ? major.getMajorName() : null,
                            program.getAcademicYear(),
                            program.getTotalCredits(),
                            program.getDescription(),
                            program.getStatus(),
                            program.getNote(),
                            program.getCreatedAt(),
                            program.getUpdatedAt(),
                            program.getDeletedAt(),
                            program.getIsActive()
                    );
                })
                .toList();
    }

    public record TrainingProgramDetailsResponse(
            UUID id,
            String programCode,
            String programName,
            UUID majorId,
            String majorName,
            String academicYear,
            Integer totalCredits,
            String description,
            Boolean status,
            String note,
            java.time.LocalDateTime createdAt,
            java.time.LocalDateTime updatedAt,
            java.time.LocalDateTime deletedAt,
            Boolean isActive
    ) {}
}
