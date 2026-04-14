package com.quanlydaotao.backend.graduationcouncil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GraduationCouncilService {

    private final GraduationCouncilRepository graduationCouncilRepository;

    public List<GraduationCouncil> getAllCouncils() {
        return graduationCouncilRepository.findByIsActiveTrue();
    }

    public GraduationCouncil getCouncilById(UUID id) {
        return graduationCouncilRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<GraduationCouncil> searchCouncils(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllCouncils();
        }
        return graduationCouncilRepository.findByCouncilCodeContainingIgnoreCaseOrCouncilNameContainingIgnoreCaseAndIsActiveTrue(
                keyword, keyword);
    }

    public List<GraduationCouncil> getCouncilsByYear(String schoolYear) {
        return graduationCouncilRepository.findBySchoolYearAndIsActiveTrue(schoolYear);
    }

    public List<GraduationCouncil> getCouncilsBySemester(String semester) {
        return graduationCouncilRepository.findBySemesterAndIsActiveTrue(semester);
    }

    public GraduationCouncil createCouncil(GraduationCouncilRequest request) {
        validateRequest(request);
        graduationCouncilRepository.findByCouncilCode(request.getCouncilCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        GraduationCouncil council = GraduationCouncil.builder()
                .councilCode(request.getCouncilCode())
                .councilName(request.getCouncilName())
                .schoolYear(request.getSchoolYear())
                .semester(request.getSemester())
                .decisionNumber(request.getDecisionNumber())
                .decisionDate(request.getDecisionDate())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return graduationCouncilRepository.save(council);
    }

    public GraduationCouncil updateCouncil(UUID id, GraduationCouncilRequest request) {
        validateRequest(request);
        GraduationCouncil existing = getCouncilById(id);
        if (!existing.getCouncilCode().equals(request.getCouncilCode())) {
            graduationCouncilRepository.findByCouncilCode(request.getCouncilCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setCouncilCode(request.getCouncilCode());
        existing.setCouncilName(request.getCouncilName());
        existing.setSchoolYear(request.getSchoolYear());
        existing.setSemester(request.getSemester());
        existing.setDecisionNumber(request.getDecisionNumber());
        existing.setDecisionDate(request.getDecisionDate());
        existing.setDescription(request.getDescription());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        return graduationCouncilRepository.save(existing);
    }

    public GraduationCouncil assignChairman(UUID id, UUID chairmanId) {
        GraduationCouncil existing = getCouncilById(id);
        existing.setChairmanId(chairmanId);
        return graduationCouncilRepository.save(existing);
    }

    public GraduationCouncil assignSecretary(UUID id, UUID secretaryId) {
        GraduationCouncil existing = getCouncilById(id);
        existing.setSecretaryId(secretaryId);
        return graduationCouncilRepository.save(existing);
    }

    public void deleteCouncil(UUID id) {
        GraduationCouncil existing = getCouncilById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        graduationCouncilRepository.save(existing);
    }

    private void validateRequest(GraduationCouncilRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null || request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
