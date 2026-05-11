package com.quanlydaotao.backend.role.mapper;

import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper {
    RoleDto toDto(Role entity);
    Role toEntity(RoleDto dto);
    List<RoleDto> toDtoList(List<Role> entities);
    void updateEntityFromDto(RoleDto dto, @MappingTarget Role entity);
}