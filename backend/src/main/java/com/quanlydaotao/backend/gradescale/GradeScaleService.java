package com.quanlydaotao.backend.gradescale;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GradeScaleService {

    private final GradeScaleRepository gradeScaleRepository;

    public List<GradeScale> getAllGradeScales() {
        return gradeScaleRepository.findByIsActiveTrue();
    }

    public GradeScale getGradeScaleById(UUID id) {
        return gradeScaleRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public GradeScale createGradeScale(GradeScaleRequest request) {
        validateScoreBounds(request.getMinScore(), request.getMaxScore());
        gradeScaleRepository.findByScaleName(request.getScaleName())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        GradeScale gradeScale = GradeScale.builder()
                .scaleName(request.getScaleName())
                .minScore(request.getMinScore())
                .maxScore(request.getMaxScore())
                .gradeLetter(request.getGradeLetter())
                .gpaValue(request.getGpaValue())
                .description(request.getDescription())
                .build();
        return gradeScaleRepository.save(gradeScale);
    }

    public GradeScale updateGradeScale(UUID id, GradeScaleRequest request) {
        validateScoreBounds(request.getMinScore(), request.getMaxScore());
        GradeScale existing = getGradeScaleById(id);
        if (!existing.getScaleName().equals(request.getScaleName())) {
            gradeScaleRepository.findByScaleName(request.getScaleName())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setScaleName(request.getScaleName());
        existing.setMinScore(request.getMinScore());
        existing.setMaxScore(request.getMaxScore());
        existing.setGradeLetter(request.getGradeLetter());
        existing.setGpaValue(request.getGpaValue());
        existing.setDescription(request.getDescription());
        return gradeScaleRepository.save(existing);
    }

    public void deleteGradeScale(UUID id) {
        GradeScale existing = getGradeScaleById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(java.time.LocalDateTime.now());
        gradeScaleRepository.save(existing);
    }

    public List<GradeScale> searchGradeScales(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllGradeScales();
        }
        return gradeScaleRepository.findByScaleNameContainingIgnoreCaseAndIsActiveTrue(keyword);
    }

    public GradeScaleConvertResponse convertScore(Double score) {
        GradeScale gradeScale = gradeScaleRepository.findByScoreBetween(score)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thang điểm phù hợp"));
        return new GradeScaleConvertResponse(score, gradeScale.getGradeLetter(), gradeScale.getGpaValue());
    }

    public record GradeScaleConvertResponse(Double score, String gradeLetter, Double gpa) {}

    private void validateScoreBounds(Double minScore, Double maxScore) {
        if (minScore == null || maxScore == null) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
        if (minScore < 0 || maxScore < 0 || minScore >= maxScore) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
