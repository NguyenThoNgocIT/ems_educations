package com.quanlydaotao.backend.person.mapper;

import com.quanlydaotao.backend.person.dto.PersonAdminResponse;
import com.quanlydaotao.backend.person.entity.Person;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PersonMapper {
    PersonAdminResponse toDto(Person entity);

    Person toEntity(PersonAdminResponse dto);

    List<PersonAdminResponse> toDtoList(List<Person> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(PersonAdminResponse dto, @MappingTarget Person entity);
}
