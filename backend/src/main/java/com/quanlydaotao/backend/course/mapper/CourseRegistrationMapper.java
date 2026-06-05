package com.quanlydaotao.backend.course.mapper;

import com.quanlydaotao.backend.course.dto.CourseRegistrationResponse;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourseRegistrationMapper {
    @Mapping(target = "courseClassCode", source = "courseClass.classCode")
    @Mapping(target = "courseId", source = "courseClass.courseId")
    @Mapping(target = "courseCode", source = "courseClass.course.code")
    @Mapping(target = "courseName", source = "courseClass.course.name")
    @Mapping(target = "semesterId", source = "courseClass.semesterId")
    @Mapping(target = "registrationTypeName", expression = "java(toRegistrationTypeName(entity.getRegistrationType()))")
    CourseRegistrationResponse toDto(CourseRegistration entity);

    List<CourseRegistrationResponse> toDtoList(List<CourseRegistration> entities);

    default String toRegistrationTypeName(Integer registrationType) {
        if (registrationType == null) {
            return null;
        }
        return switch (registrationType) {
            case 1 -> "Học lại";
            case 2 -> "Học cải thiện";
            default -> "Không xác định";
        };
    }
}
