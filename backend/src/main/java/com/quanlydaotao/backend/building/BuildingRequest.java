package com.quanlydaotao.backend.building;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingRequest {

    @NotBlank
    private String buildingCode;

    @NotBlank
    private String buildingName;

    @NotBlank
    private String address;

    private String description;
}
