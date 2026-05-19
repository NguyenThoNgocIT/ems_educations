package com.quanlydaotao.backend.instructor.mapper;

import com.quanlydaotao.backend.instructor.dto.InstructorAdminResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminUpdateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfResponse;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InstructorMapper {
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "startWorkDate", source = "employee.startWorkDate")
    @Mapping(target = "endWorkDate", source = "employee.endWorkDate")
    @Mapping(target = "employeeStatus", source = "employee.status")
    @Mapping(target = "employeeType", source = "employee.employeeType")
    @Mapping(target = "contractType", source = "employee.contractType")
    @Mapping(target = "note", source = "employee.note")
    @Mapping(target = "personId", source = "employee.person.personId")
    @Mapping(target = "fullName", source = "employee.person.fullName")
    @Mapping(target = "fullNameNoAccent", source = "employee.person.fullNameNoAccent")
    @Mapping(target = "gender", source = "employee.person.gender")
    @Mapping(target = "dateOfBirth", source = "employee.person.dateOfBirth")
    @Mapping(target = "placeOfBirth", source = "employee.person.placeOfBirth")
    @Mapping(target = "ethnicity", source = "employee.person.ethnicity")
    @Mapping(target = "personalIdentificationNumber", source = "employee.person.personalIdentificationNumber")
    @Mapping(target = "dateOfIssue", source = "employee.person.dateOfIssue")
    @Mapping(target = "cardPlace", source = "employee.person.cardPlace")
    @Mapping(target = "nationality", source = "employee.person.nationality")
    @Mapping(target = "contactEmail", source = "employee.person.contactEmail")
    @Mapping(target = "phoneNumber", source = "employee.person.phoneNumber")
    @Mapping(target = "permanentAddress", source = "employee.person.permanentAddress")
    @Mapping(target = "temporaryAddress", source = "employee.person.temporaryAddress")
    @Mapping(target = "avatarUrl", source = "employee.person.avatarUrl")
    InstructorAdminResponse toDto(InstructorProfile entity);

    @Mapping(target = "employee", ignore = true)
    InstructorProfile toEntity(InstructorAdminResponse dto);

    List<InstructorAdminResponse> toDtoList(List<InstructorProfile> entities);

    @Mapping(target = "employee", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(InstructorAdminUpdateRequest dto, @MappingTarget InstructorProfile entity);

    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "startWorkDate", source = "employee.startWorkDate")
    @Mapping(target = "employeeStatus", source = "employee.status")
    @Mapping(target = "contractType", source = "employee.contractType")
    @Mapping(target = "personId", source = "employee.person.personId")
    @Mapping(target = "fullName", source = "employee.person.fullName")
    @Mapping(target = "fullNameNoAccent", source = "employee.person.fullNameNoAccent")
    @Mapping(target = "gender", source = "employee.person.gender")
    @Mapping(target = "dateOfBirth", source = "employee.person.dateOfBirth")
    @Mapping(target = "placeOfBirth", source = "employee.person.placeOfBirth")
    @Mapping(target = "ethnicity", source = "employee.person.ethnicity")
    @Mapping(target = "personalIdentificationNumber", source = "employee.person.personalIdentificationNumber")
    @Mapping(target = "dateOfIssue", source = "employee.person.dateOfIssue")
    @Mapping(target = "cardPlace", source = "employee.person.cardPlace")
    @Mapping(target = "nationality", source = "employee.person.nationality")
    @Mapping(target = "contactEmail", source = "employee.person.contactEmail")
    @Mapping(target = "phoneNumber", source = "employee.person.phoneNumber")
    @Mapping(target = "permanentAddress", source = "employee.person.permanentAddress")
    @Mapping(target = "temporaryAddress", source = "employee.person.temporaryAddress")
    @Mapping(target = "avatarUrl", source = "employee.person.avatarUrl")
    InstructorSelfResponse toSelfDto(InstructorProfile entity);
}
