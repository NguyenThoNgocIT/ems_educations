package com.quanlydaotao.backend.role.mapper;

import com.quanlydaotao.backend.role.dto.PermissionApiDto;
import com.quanlydaotao.backend.role.dto.PermissionDto;
import com.quanlydaotao.backend.role.entity.Permission;
import com.quanlydaotao.backend.role.entity.PermissionApis;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper {
    PermissionDto toDto(Permission entity);

    Permission toEntity(PermissionDto dto);

    List<PermissionDto> toDtoList(List<Permission> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(PermissionDto dto, @MappingTarget Permission entity);

    @Mapping(target = "permissionId", source = "permission.permissionId")
    @Mapping(target = "permissionCode", source = "permission.code")
    @Mapping(target = "apiPath", source = "id.apiPath")
    @Mapping(target = "httpMethod", source = "id.httpMethod")
    PermissionApiDto toApiDto(PermissionApis entity);
}
