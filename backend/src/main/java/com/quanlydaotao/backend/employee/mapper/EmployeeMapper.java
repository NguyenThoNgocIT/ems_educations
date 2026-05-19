package com.quanlydaotao.backend.employee.mapper;

import com.quanlydaotao.backend.employee.dto.EmployeeAdminResponse;
import com.quanlydaotao.backend.employee.entity.Employee;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper {
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
    EmployeeAdminResponse toDto(Employee entity);

    @Mapping(target = "person", ignore = true)
    Employee toEntity(EmployeeAdminResponse dto);

    List<EmployeeAdminResponse> toDtoList(List<Employee> entities);

    @Mapping(target = "person", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(EmployeeAdminResponse dto, @MappingTarget Employee entity);
}
