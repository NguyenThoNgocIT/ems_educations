package com.quanlydaotao.backend.user.mapper;

import com.quanlydaotao.backend.user.dto.UpdateUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UserAdminResponse;
import com.quanlydaotao.backend.user.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    @Mapping(target = "personId", source = "person.personId")
    UserAdminResponse toDto(User entity);

    @Mapping(target = "person", ignore = true)
    User toEntity(UserAdminResponse dto);

    List<UserAdminResponse> toDtoList(List<User> entities);

    @Mapping(target = "person", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateUserAdminRequest dto, @MappingTarget User entity);
}
