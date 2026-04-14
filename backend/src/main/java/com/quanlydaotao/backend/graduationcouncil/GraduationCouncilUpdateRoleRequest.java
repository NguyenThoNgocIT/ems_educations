package com.quanlydaotao.backend.graduationcouncil;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
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
public class GraduationCouncilUpdateRoleRequest {

    @NotNull
    private UUID userId;
}
