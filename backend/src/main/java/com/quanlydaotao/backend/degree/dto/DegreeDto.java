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
    private String name;
    private String major;
}

