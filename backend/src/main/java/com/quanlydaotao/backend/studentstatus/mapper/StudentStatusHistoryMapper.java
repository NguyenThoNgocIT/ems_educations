package com.quanlydaotao.backend.studentstatus.mapper;

import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryResponse;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusHistory;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentStatusHistoryMapper {
    StudentStatusHistoryResponse toDto(StudentStatusHistory entity);

    StudentStatusHistory toEntity(StudentStatusHistoryResponse dto);

    List<StudentStatusHistoryResponse> toDtoList(List<StudentStatusHistory> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(StudentStatusHistoryRequest dto, @MappingTarget StudentStatusHistory entity);
}
