package com.quanlydaotao.backend.graduationcondition;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GraduationConditionService {

    private final GraduationConditionRepository graduationConditionRepository;

    public List<GraduationCondition> getAllConditions() {
        return graduationConditionRepository.findByIsActiveTrue();
    }

    public GraduationCondition getConditionById(UUID id) {
        return graduationConditionRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<GraduationCondition> searchConditions(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllConditions();
        }
        return graduationConditionRepository.findByConditionCodeContainingIgnoreCaseOrConditionNameContainingIgnoreCaseAndIsActiveTrue(
                keyword, keyword);
    }

    public List<GraduationCondition> getActiveConditions() {
        LocalDate now = LocalDate.now();
        return graduationConditionRepository.findByStartDateLessThanEqualAndDueDateGreaterThanEqualAndIsActiveTrue(now, now);
    }

    public GraduationCondition createCondition(GraduationConditionRequest request) {
        validateRequest(request);
        graduationConditionRepository.findByConditionCode(request.getConditionCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        GraduationCondition condition = GraduationCondition.builder()
                .conditionCode(request.getConditionCode())
                .conditionName(request.getConditionName())
                .minCredits(request.getMinCredits())
                .minGpa(request.getMinGpa())
                .maxFailedCourses(request.getMaxFailedCourses())
                .requiredCertificate(request.getRequiredCertificate())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .build();
        return graduationConditionRepository.save(condition);
    }

    public GraduationCondition updateCondition(UUID id, GraduationConditionRequest request) {
        validateRequest(request);
        GraduationCondition existing = getConditionById(id);
        if (!existing.getConditionCode().equals(request.getConditionCode())) {
            graduationConditionRepository.findByConditionCode(request.getConditionCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setConditionCode(request.getConditionCode());
        existing.setConditionName(request.getConditionName());
        existing.setMinCredits(request.getMinCredits());
        existing.setMinGpa(request.getMinGpa());
        existing.setMaxFailedCourses(request.getMaxFailedCourses());
        existing.setRequiredCertificate(request.getRequiredCertificate());
        existing.setDescription(request.getDescription());
        existing.setStartDate(request.getStartDate());
        existing.setDueDate(request.getDueDate());
        return graduationConditionRepository.save(existing);
    }

    public void deleteCondition(UUID id) {
        GraduationCondition existing = getConditionById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        graduationConditionRepository.save(existing);
    }

    private void validateRequest(GraduationConditionRequest request) {
        if (request.getMinCredits() == null || request.getMinCredits() <= 0) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
        if (request.getMinGpa() == null || request.getMinGpa() < 0 || request.getMinGpa() > 10) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
        if (request.getStartDate() == null || request.getDueDate() == null || request.getStartDate().isAfter(request.getDueDate())) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
