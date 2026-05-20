package com.quanlydaotao.backend.trainingprogramcourse.mapper;

import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrainingProgramCourseMapper {
    TrainingProgramCourseResponse toDto(TrainingProgramCourse entity);

    TrainingProgramCourse toEntity(TrainingProgramCourseResponse dto);

    List<TrainingProgramCourseResponse> toDtoList(List<TrainingProgramCourse> entities);

    void updateEntityFromDto(TrainingProgramCourseResponse dto, @MappingTarget TrainingProgramCourse entity);
}
