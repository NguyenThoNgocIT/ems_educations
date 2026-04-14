package com.quanlydaotao.backend.schedule;

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
public class ScheduleRequest {

    @NotNull
    private UUID courseClassId;

    @NotNull
    private UUID roomId;

    @NotNull
    private UUID semesterId;

    @NotNull
    private Integer dayOfWeek;

    @NotNull
    private Integer startPeriod;

    @NotNull
    private Integer endPeriod;
}
