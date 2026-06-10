package com.quanlydaotao.backend.trainingprogramcourse.mapper;

import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrainingProgramCourseMapper {
    @Mapping(target = "trainingProgramCode", source = "trainingProgram.code")
    @Mapping(target = "trainingProgramName", source = "trainingProgram.name")
    @Mapping(target = "courseCode", source = "course.code")
    @Mapping(target = "courseName", source = "course.name")
    @Mapping(target = "courseType", source = "course.courseType")
    @Mapping(target = "semesterCode", source = "semester.code")
    @Mapping(target = "semesterName", source = "semester.name")
    @Mapping(target = "prerequisiteCourseCode", source = "prerequisiteCourse.code")
    @Mapping(target = "prerequisiteCourseName", source = "prerequisiteCourse.name")
    TrainingProgramCourseResponse toDto(TrainingProgramCourse entity);

    @Mapping(target = "trainingProgram", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "semester", ignore = true)
    @Mapping(target = "prerequisiteCourse", ignore = true)
    TrainingProgramCourse toEntity(TrainingProgramCourseResponse dto);

    List<TrainingProgramCourseResponse> toDtoList(List<TrainingProgramCourse> entities);

    @Mapping(target = "trainingProgram", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "semester", ignore = true)
    @Mapping(target = "prerequisiteCourse", ignore = true)
    void updateEntityFromDto(TrainingProgramCourseResponse dto, @MappingTarget TrainingProgramCourse entity);
}
