package com.quanlydaotao.backend.graduationresult;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GraduationResultService {

    private final GraduationResultRepository graduationResultRepository;

    public List<GraduationResult> getAllResults() {
        return graduationResultRepository.findByIsActiveTrue();
    }

    public GraduationResult getResultById(UUID id) {
        return graduationResultRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<GraduationResult> getResultsByStudent(UUID studentId) {
        return graduationResultRepository.findByStudentIdAndIsActiveTrue(studentId);
    }

    public List<GraduationResult> getResultsByStatus(String graduationStatus) {
        return graduationResultRepository.findByGraduationStatusAndIsActiveTrue(graduationStatus);
    }

    public List<GraduationResult> getResultsByRank(String graduationRank) {
        return graduationResultRepository.findByGraduationRankAndIsActiveTrue(graduationRank);
    }

    public List<GraduationResult> searchResults(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllResults();
        }
        return graduationResultRepository.findByDecisionNumberContainingIgnoreCaseAndIsActiveTrue(keyword);
    }

    public GraduationResult createResult(GraduationResultRequest request) {
        validateRequest(request);
        GraduationResult result = GraduationResult.builder()
                .studentId(request.getStudentId())
                .conditionId(request.getConditionId())
                .totalCredits(request.getTotalCredits())
                .gpa(request.getGpa())
                .failedCourses(request.getFailedCourses())
                .graduationStatus(request.getGraduationStatus())
                .graduationRank(request.getGraduationRank())
                .decisionNumber(request.getDecisionNumber())
                .decisionDate(request.getDecisionDate())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .build();
        return graduationResultRepository.save(result);
    }

    public GraduationResult updateResult(UUID id, GraduationResultRequest request) {
        validateRequest(request);
        GraduationResult existing = getResultById(id);
        existing.setStudentId(request.getStudentId());
        existing.setConditionId(request.getConditionId());
        existing.setTotalCredits(request.getTotalCredits());
        existing.setGpa(request.getGpa());
        existing.setFailedCourses(request.getFailedCourses());
        existing.setGraduationStatus(request.getGraduationStatus());
        existing.setGraduationRank(request.getGraduationRank());
        existing.setDecisionNumber(request.getDecisionNumber());
        existing.setDecisionDate(request.getDecisionDate());
        existing.setStartDate(request.getStartDate());
        existing.setDueDate(request.getDueDate());
        return graduationResultRepository.save(existing);
    }

    public GraduationResult updateDecision(UUID id, GraduationResultDecisionRequest request) {
        GraduationResult existing = getResultById(id);
        existing.setDecisionNumber(request.getDecisionNumber());
        existing.setDecisionDate(request.getDecisionDate());
        existing.setStartDate(request.getStartDate());
        existing.setDueDate(request.getDueDate());
        existing.setGraduationRank(request.getGraduationRank());
        return graduationResultRepository.save(existing);
    }

    public void deleteResult(UUID id) {
        GraduationResult existing = getResultById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        graduationResultRepository.save(existing);
    }

    private void validateRequest(GraduationResultRequest request) {
        if (request.getGpa() == null || request.getFailedCourses() == null || request.getTotalCredits() == null) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
        if (request.getGraduationStatus() == null || request.getGraduationStatus().isBlank()) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
