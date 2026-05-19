package com.quanlydaotao.backend.student.mapper;

import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.entity.Student;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {
    @Mapping(target = "personId", source = "person.personId")
    @Mapping(target = "fullName", source = "person.fullName")
    @Mapping(target = "fullNameNoAccent", source = "person.fullNameNoAccent")
    @Mapping(target = "gender", source = "person.gender")
    @Mapping(target = "dateOfBirth", source = "person.dateOfBirth")
    @Mapping(target = "placeOfBirth", source = "person.placeOfBirth")
    @Mapping(target = "ethnicity", source = "person.ethnicity")
    @Mapping(target = "personalIdentificationNumber", source = "person.personalIdentificationNumber")
    @Mapping(target = "dateOfIssue", source = "person.dateOfIssue")
    @Mapping(target = "cardPlace", source = "person.cardPlace")
    @Mapping(target = "nationality", source = "person.nationality")
    @Mapping(target = "contactEmail", source = "person.contactEmail")
    @Mapping(target = "phoneNumber", source = "person.phoneNumber")
    @Mapping(target = "permanentAddress", source = "person.permanentAddress")
    @Mapping(target = "temporaryAddress", source = "person.temporaryAddress")
    @Mapping(target = "avatarUrl", source = "person.avatarUrl")
    StudentAdminResponse toDto(Student entity);

    @Mapping(target = "person", ignore = true)
    Student toEntity(StudentAdminResponse dto);

    List<StudentAdminResponse> toDtoList(List<Student> entities);

    @Mapping(target = "person", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(StudentAdminUpdateRequest dto, @MappingTarget Student entity);

    @Mapping(target = "personId", source = "person.personId")
    @Mapping(target = "fullName", source = "person.fullName")
    @Mapping(target = "fullNameNoAccent", source = "person.fullNameNoAccent")
    @Mapping(target = "gender", source = "person.gender")
    @Mapping(target = "dateOfBirth", source = "person.dateOfBirth")
    @Mapping(target = "placeOfBirth", source = "person.placeOfBirth")
    @Mapping(target = "ethnicity", source = "person.ethnicity")
    @Mapping(target = "personalIdentificationNumber", source = "person.personalIdentificationNumber")
    @Mapping(target = "dateOfIssue", source = "person.dateOfIssue")
    @Mapping(target = "cardPlace", source = "person.cardPlace")
    @Mapping(target = "nationality", source = "person.nationality")
    @Mapping(target = "contactEmail", source = "person.contactEmail")
    @Mapping(target = "phoneNumber", source = "person.phoneNumber")
    @Mapping(target = "permanentAddress", source = "person.permanentAddress")
    @Mapping(target = "temporaryAddress", source = "person.temporaryAddress")
    @Mapping(target = "avatarUrl", source = "person.avatarUrl")
    StudentSelfResponse toSelfDto(Student entity);
}
