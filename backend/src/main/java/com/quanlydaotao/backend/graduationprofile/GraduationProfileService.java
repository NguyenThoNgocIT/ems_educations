package com.quanlydaotao.backend.graduationprofile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GraduationProfileService {

    private final GraduationProfileRepository graduationProfileRepository;

    public List<GraduationProfile> getAllProfiles() {
        return graduationProfileRepository.findByIsActiveTrue();
    }

    public GraduationProfile getProfileById(UUID id) {
        return graduationProfileRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<GraduationProfile> searchProfiles(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllProfiles();
        }
        return graduationProfileRepository.findByProfileCodeContainingIgnoreCaseAndIsActiveTrue(keyword);
    }

    public List<GraduationProfile> getProfilesByStudent(UUID studentId) {
        return graduationProfileRepository.findByStudentIdAndIsActiveTrue(studentId);
    }

    public List<GraduationProfile> getProfilesByStatus(String status) {
        return graduationProfileRepository.findByStatusAndIsActiveTrue(status);
    }

    public GraduationProfile createProfile(GraduationProfileRequest request) {
        validateRequest(request);
        GraduationProfile profile = GraduationProfile.builder()
                .studentId(request.getStudentId())
                .councilId(request.getCouncilId())
                .conditionId(request.getConditionId())
                .profileCode(request.getProfileCode())
                .submissionDate(request.getSubmissionDate())
                .status(request.getStatus())
                .note(request.getNote())
                .build();
        return graduationProfileRepository.save(profile);
    }

    public GraduationProfile updateProfile(UUID id, GraduationProfileRequest request) {
        validateRequest(request);
        GraduationProfile existing = getProfileById(id);
        existing.setStudentId(request.getStudentId());
        existing.setCouncilId(request.getCouncilId());
        existing.setConditionId(request.getConditionId());
        existing.setProfileCode(request.getProfileCode());
        existing.setSubmissionDate(request.getSubmissionDate());
        existing.setStatus(request.getStatus());
        existing.setNote(request.getNote());
        return graduationProfileRepository.save(existing);
    }

    public GraduationProfile reviewProfile(UUID id, GraduationProfileReviewRequest request) {
        GraduationProfile existing = getProfileById(id);
        existing.setStatus(request.getStatus());
        existing.setReviewerId(request.getReviewerId());
        existing.setReviewDate(LocalDate.now());
        existing.setNote(request.getNote());
        return graduationProfileRepository.save(existing);
    }

    public void deleteProfile(UUID id) {
        GraduationProfile existing = getProfileById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        graduationProfileRepository.save(existing);
    }

    private void validateRequest(GraduationProfileRequest request) {
        if (request.getSubmissionDate() == null) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
