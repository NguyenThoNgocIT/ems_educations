package com.quanlydaotao.backend.role.mapper;

import com.quanlydaotao.backend.role.dto.MenuDto;
import com.quanlydaotao.backend.role.entity.Menus;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MenuMapper {
    @Mapping(target = "permissionId", source = "permission.permissionId")
    @Mapping(target = "permissionCode", source = "permission.code")
    MenuDto toDto(Menus entity);

    @Mapping(target = "permission", ignore = true)
    Menus toEntity(MenuDto dto);

    List<MenuDto> toDtoList(List<Menus> entities);

    @Mapping(target = "permission", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(MenuDto dto, @MappingTarget Menus entity);
}
