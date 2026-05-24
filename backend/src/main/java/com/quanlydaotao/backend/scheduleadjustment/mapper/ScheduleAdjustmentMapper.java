package com.quanlydaotao.backend.scheduleadjustment.mapper;

import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSubmitRequest;
import com.quanlydaotao.backend.scheduleadjustment.entity.ScheduleAdjustmentRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ScheduleAdjustmentMapper {
    ScheduleAdjustmentResponse toDto(ScheduleAdjustmentRequest entity);

    ScheduleAdjustmentRequest toEntity(ScheduleAdjustmentResponse dto);

    List<ScheduleAdjustmentResponse> toDtoList(List<ScheduleAdjustmentRequest> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ScheduleAdjustmentSubmitRequest dto, @MappingTarget ScheduleAdjustmentRequest entity);
}
