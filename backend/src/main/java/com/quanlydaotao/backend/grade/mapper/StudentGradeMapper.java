package com.quanlydaotao.backend.grade.mapper;

import com.quanlydaotao.backend.grade.dto.StudentComponentGradeResponse;
import com.quanlydaotao.backend.grade.dto.StudentSummaryResponse;
import com.quanlydaotao.backend.grade.entity.StudentComponentGrade;
import com.quanlydaotao.backend.grade.entity.StudentSummary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentGradeMapper {
    @Mapping(target = "courseRegistrationId", source = "id.courseRegistrationId")
    @Mapping(target = "gradeComponentId", source = "id.gradeComponentId")
    @Mapping(target = "componentCode", source = "gradeComponent.componentCode")
    @Mapping(target = "componentName", source = "gradeComponent.componentName")
    @Mapping(target = "weightPercentage", source = "gradeComponent.weightPercentage")
    StudentComponentGradeResponse toComponentDto(StudentComponentGrade entity);

    List<StudentComponentGradeResponse> toComponentDtoList(List<StudentComponentGrade> entities);

    @Mapping(target = "studentId", source = "courseRegistration.studentId")
    @Mapping(target = "courseClassId", source = "courseRegistration.courseClassId")
    @Mapping(target = "courseId", source = "courseRegistration.courseClass.courseId")
    @Mapping(target = "courseCode", source = "courseRegistration.courseClass.course.code")
    @Mapping(target = "courseName", source = "courseRegistration.courseClass.course.name")
    @Mapping(target = "semesterId", source = "courseRegistration.courseClass.semesterId")
    StudentSummaryResponse toSummaryDto(StudentSummary entity);

    List<StudentSummaryResponse> toSummaryDtoList(List<StudentSummary> entities);
}
