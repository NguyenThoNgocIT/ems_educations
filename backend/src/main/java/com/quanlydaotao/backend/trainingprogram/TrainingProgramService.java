package com.quanlydaotao.backend.trainingprogram;

import com.quanlydaotao.backend.major.Major;
import com.quanlydaotao.backend.major.MajorRepository;
import com.quanlydaotao.backend.subject.Subject;
import com.quanlydaotao.backend.subject.SubjectRepository;
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
    private final SubjectRepository subjectRepository;

    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingProgramRepository.findByIsActiveTrue();
    }

    public TrainingProgram getTrainingProgramById(UUID id) {
        return trainingProgramRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public TrainingProgram createTrainingProgram(TrainingProgramRequest request) {
        String code = request.getProgramCode().trim();
        if (request.getTotalCredits() == null || request.getTotalCredits() <= 0) {
            throw new RuntimeException("Tổng tín chỉ phải lớn hơn 0");
        }
        trainingProgramRepository.findByProgramCodeIgnoreCase(code)
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        Major major = majorRepository.findByIdAndIsActiveTrue(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        TrainingProgram program = TrainingProgram.builder()
                .programCode(code)
                .programName(request.getProgramName())
                .majorId(major.getId())
                .academicYear(request.getAcademicYear())
                .totalCredits(request.getTotalCredits())
                .description(request.getDescription())
                .status(request.getStatus())
                .note(request.getNote())
                .approvalStatus("DRAFT")
                .build();
        return trainingProgramRepository.save(program);
    }

    public TrainingProgram updateTrainingProgram(UUID id, TrainingProgramRequest request) {
        TrainingProgram existing = getTrainingProgramById(id);
        String code = request.getProgramCode().trim();
        if (!existing.getProgramCode().equalsIgnoreCase(code)) {
            trainingProgramRepository.findByProgramCodeIgnoreCase(code)
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        Major major = majorRepository.findByIdAndIsActiveTrue(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setProgramCode(code);
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

    public TrainingProgramValidationResponse validateTrainingProgram(UUID id) {
        TrainingProgram program = getTrainingProgramById(id);
        List<Subject> subjects = subjectRepository.findByProgramIdAndIsActiveTrue(program.getId());
        int sumCredits = subjects.stream().mapToInt(Subject::getCredits).sum();
        boolean valid = sumCredits == program.getTotalCredits();
        String message = valid ? "CTĐT hợp lệ" : String.format("Tổng tín chỉ môn: %d khác với tổng tín chỉ CTĐT: %d", sumCredits, program.getTotalCredits());
        return new TrainingProgramValidationResponse(
                program.getId(),
                program.getProgramCode(),
                program.getProgramName(),
                program.getMajorId(),
                program.getAcademicYear(),
                program.getTotalCredits(),
                sumCredits,
                valid,
                message
        );
    }

    public TrainingProgram submitTrainingProgramForApproval(UUID id) {
        TrainingProgram existing = getTrainingProgramById(id);
        existing.setApprovalStatus("PENDING");
        existing.setApprovalComment(null);
        return trainingProgramRepository.save(existing);
    }

    public TrainingProgram approveTrainingProgram(UUID id, String comment) {
        TrainingProgram existing = getTrainingProgramById(id);
        if (!"PENDING".equals(existing.getApprovalStatus())) {
            throw new RuntimeException("Chỉ có thể duyệt CTĐT đang chờ duyệt");
        }
        existing.setApprovalStatus("APPROVED");
        existing.setApprovalComment(comment);
        existing.setApprovedAt(LocalDateTime.now());
        return trainingProgramRepository.save(existing);
    }

    public TrainingProgram rejectTrainingProgram(UUID id, String comment) {
        TrainingProgram existing = getTrainingProgramById(id);
        if (!"PENDING".equals(existing.getApprovalStatus())) {
            throw new RuntimeException("Chỉ có thể từ chối CTĐT đang chờ duyệt");
        }
        existing.setApprovalStatus("REJECTED");
        existing.setApprovalComment(comment);
        existing.setApprovedAt(LocalDateTime.now());
        return trainingProgramRepository.save(existing);
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
                            program.getApprovalStatus(),
                            program.getApprovalComment(),
                            program.getApprovedAt(),
                            program.getCreatedAt(),
                            program.getUpdatedAt(),
                            program.getDeletedAt(),
                            program.getIsActive()
                    );
                })
                .toList();
    }

    public record TrainingProgramValidationResponse(
            UUID id,
            String programCode,
            String programName,
            UUID majorId,
            String academicYear,
            Integer totalCredits,
            Integer subjectCredits,
            Boolean valid,
            String message
    ) {}

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
            String approvalStatus,
            String approvalComment,
            java.time.LocalDateTime approvedAt,
            java.time.LocalDateTime createdAt,
            java.time.LocalDateTime updatedAt,
            java.time.LocalDateTime deletedAt,
            Boolean isActive
    ) {}
}
