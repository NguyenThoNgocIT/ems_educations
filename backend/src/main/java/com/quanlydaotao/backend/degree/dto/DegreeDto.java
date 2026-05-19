package com.quanlydaotao.backend.degree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DegreeDto {
    private UUID degreeId;
    private String code;
    private String name;
    private Integer level;
    private String academicRank;
    private String specialization;
    private String institution;
    private Integer graduationYear;
    private UUID majorId;
    private Boolean isActive;
}
