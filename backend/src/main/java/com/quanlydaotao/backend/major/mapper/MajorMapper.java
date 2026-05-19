package com.quanlydaotao.backend.major.mapper;

import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.entity.Major;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MajorMapper {
    MajorResponse toDto(Major entity);

    Major toEntity(MajorRequest dto);

    List<MajorResponse> toDtoList(List<Major> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(MajorRequest dto, @MappingTarget Major entity);
}
