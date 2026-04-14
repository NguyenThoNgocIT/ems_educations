package com.quanlydaotao.backend.prerequisite;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePrerequisiteRequest {

    @NotNull
    private UUID courseId;

    @NotNull
    private UUID prerequisiteId;
}
