package com.quanlydaotao.backend.trainingprogram.mapper;

import com.quanlydaotao.backend.trainingprogram.dto.request.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.UpdateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramDetailResponse;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TrainingProgramMapper {

    public TrainingProgram toEntity(CreateTrainingProgramRequest request) {
        if (request == null) return null;
        
        return TrainingProgram.builder()
                .code(request.getCode())
                .name(request.getName())
                .nameEn(request.getNameEn())
                .majorId(request.getMajorId())
                .departmentId(request.getDepartmentId())
                .academicCohortId(request.getAcademicCohortId())
                .degreeLevel(request.getDegreeLevel())
                .educationType(request.getEducationType())
                .totalCredits(request.getTotalCredits())
                .requiredCredits(request.getRequiredCredits())
                .electiveCredits(request.getElectiveCredits())
                .internshipCredits(request.getInternshipCredits())
                .thesisCredits(request.getThesisCredits())
                .admissionYear(request.getAdmissionYear())
                .durationYears(request.getDurationYears())
                .maxDurationYears(request.getMaxDurationYears())
                .effectiveDate(request.getEffectiveDate())
                .expiryDate(request.getExpiryDate())
                .description(request.getDescription())
                .isActive(true)
                .build();
    }

    public void updateEntity(UpdateTrainingProgramRequest request, TrainingProgram trainingProgram) {
        if (request == null) return;
        if (request.getCode() != null) trainingProgram.setCode(request.getCode());
        if (request.getName() != null) trainingProgram.setName(request.getName());
        if (request.getNameEn() != null) trainingProgram.setNameEn(request.getNameEn());
        if (request.getMajorId() != null) trainingProgram.setMajorId(request.getMajorId());
        if (request.getDepartmentId() != null) trainingProgram.setDepartmentId(request.getDepartmentId());
        if (request.getAcademicCohortId() != null) trainingProgram.setAcademicCohortId(request.getAcademicCohortId());
        if (request.getDegreeLevel() != null) trainingProgram.setDegreeLevel(request.getDegreeLevel());
        if (request.getEducationType() != null) trainingProgram.setEducationType(request.getEducationType());
        if (request.getTotalCredits() != null) trainingProgram.setTotalCredits(request.getTotalCredits());
        if (request.getRequiredCredits() != null) trainingProgram.setRequiredCredits(request.getRequiredCredits());
        if (request.getElectiveCredits() != null) trainingProgram.setElectiveCredits(request.getElectiveCredits());
        if (request.getInternshipCredits() != null) trainingProgram.setInternshipCredits(request.getInternshipCredits());
        if (request.getThesisCredits() != null) trainingProgram.setThesisCredits(request.getThesisCredits());
        if (request.getAdmissionYear() != null) trainingProgram.setAdmissionYear(request.getAdmissionYear());
        if (request.getDurationYears() != null) trainingProgram.setDurationYears(request.getDurationYears());
        if (request.getMaxDurationYears() != null) trainingProgram.setMaxDurationYears(request.getMaxDurationYears());
        if (request.getEffectiveDate() != null) trainingProgram.setEffectiveDate(request.getEffectiveDate());
        if (request.getExpiryDate() != null) trainingProgram.setExpiryDate(request.getExpiryDate());
        if (request.getDescription() != null) trainingProgram.setDescription(request.getDescription());
        if (request.getIsActive() != null) trainingProgram.setIsActive(request.getIsActive());
    }

    public TrainingProgramResponse toResponse(TrainingProgram trainingProgram) {
        if (trainingProgram == null) return null;
        
        return TrainingProgramResponse.builder()
                .trainingProgramId(trainingProgram.getTrainingProgramId() != null ? trainingProgram.getTrainingProgramId().toString() : null)
                .code(trainingProgram.getCode())
                .name(trainingProgram.getName())
                .nameEn(trainingProgram.getNameEn())
                .majorId(trainingProgram.getMajorId())
                .departmentId(trainingProgram.getDepartmentId())
                .academicCohortId(trainingProgram.getAcademicCohortId())
                .degreeLevel(trainingProgram.getDegreeLevel())
                .educationType(trainingProgram.getEducationType())
                .totalCredits(trainingProgram.getTotalCredits())
                .requiredCredits(trainingProgram.getRequiredCredits())
                .electiveCredits(trainingProgram.getElectiveCredits())
                .internshipCredits(trainingProgram.getInternshipCredits())
                .thesisCredits(trainingProgram.getThesisCredits())
                .admissionYear(trainingProgram.getAdmissionYear())
                .durationYears(trainingProgram.getDurationYears())
                .maxDurationYears(trainingProgram.getMaxDurationYears())
                .effectiveDate(trainingProgram.getEffectiveDate())
                .expiryDate(trainingProgram.getExpiryDate())
                .description(trainingProgram.getDescription())
                .isActive(trainingProgram.getIsActive())
                .build();
    }

    public TrainingProgramDetailResponse toDetailResponse(TrainingProgram trainingProgram) {
        if (trainingProgram == null) return null;
        
        return TrainingProgramDetailResponse.builder()
                .trainingProgramId(trainingProgram.getTrainingProgramId() != null ? trainingProgram.getTrainingProgramId().toString() : null)
                .code(trainingProgram.getCode())
                .name(trainingProgram.getName())
                .nameEn(trainingProgram.getNameEn())
                .majorId(trainingProgram.getMajorId())
                .departmentId(trainingProgram.getDepartmentId())
                .academicCohortId(trainingProgram.getAcademicCohortId())
                .degreeLevel(trainingProgram.getDegreeLevel())
                .educationType(trainingProgram.getEducationType())
                .totalCredits(trainingProgram.getTotalCredits())
                .requiredCredits(trainingProgram.getRequiredCredits())
                .electiveCredits(trainingProgram.getElectiveCredits())
                .internshipCredits(trainingProgram.getInternshipCredits())
                .thesisCredits(trainingProgram.getThesisCredits())
                .admissionYear(trainingProgram.getAdmissionYear())
                .durationYears(trainingProgram.getDurationYears())
                .maxDurationYears(trainingProgram.getMaxDurationYears())
                .effectiveDate(trainingProgram.getEffectiveDate())
                .expiryDate(trainingProgram.getExpiryDate())
                .description(trainingProgram.getDescription())
                .isActive(trainingProgram.getIsActive())
                .createdAt(trainingProgram.getCreatedAt())
                .createdBy(trainingProgram.getCreatedBy() != null ? trainingProgram.getCreatedBy().toString() : null)
                .updatedAt(trainingProgram.getUpdatedAt())
                .updatedBy(trainingProgram.getUpdatedBy() != null ? trainingProgram.getUpdatedBy().toString() : null)
                .build();
    }
}