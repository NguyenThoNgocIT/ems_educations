package com.quanlydaotao.backend.trainingprogram.mapper;

import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrainingProgramMapper {
    TrainingProgramResponse toDto(TrainingProgram entity);

    TrainingProgram toEntity(TrainingProgramRequest dto);

    List<TrainingProgramResponse> toDtoList(List<TrainingProgram> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TrainingProgramRequest dto, @MappingTarget TrainingProgram entity);
}
