package com.quanlydaotao.backend.contract.mapper;

import com.quanlydaotao.backend.contract.dto.ContractDto;
import com.quanlydaotao.backend.contract.entity.Contract;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContractMapper {
    @Mapping(target = "employeeId", source = "employee.employeeId")
    ContractDto toDto(Contract entity);

    @Mapping(target = "employee", ignore = true)
    Contract toEntity(ContractDto dto);

    List<ContractDto> toDtoList(List<Contract> entities);

    @Mapping(target = "employee", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ContractDto dto, @MappingTarget Contract entity);
}
