package com.quanlydaotao.backend.scheduling.mapper;

import com.quanlydaotao.backend.scheduling.dto.ScheduleDto;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ScheduleMapper {

    @Mapping(target = "courseClassId", source = "courseClass.courseClassId")
    @Mapping(target = "courseClassName", source = "courseClass.classCode")
    @Mapping(target = "courseName", source = "courseClass.course.name")
    @Mapping(target = "instructorId", source = "instructor.employeeId")
    @Mapping(target = "instructorName", source = "instructor.person.fullName")
    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "roomCode", source = "room.code")
    @Mapping(target = "timeSlotId", source = "timeSlot.timeSlotId")
    @Mapping(target = "slotCode", source = "timeSlot.slotCode")
    ScheduleDto toDto(Schedule entity);

    @Mapping(target = "courseClass.courseClassId", source = "courseClassId")
    @Mapping(target = "instructor.employeeId", source = "instructorId")
    @Mapping(target = "room.roomId", source = "roomId")
    @Mapping(target = "timeSlot.timeSlotId", source = "timeSlotId")
    Schedule toEntity(ScheduleDto dto);

    List<ScheduleDto> toDtoList(List<Schedule> entities);

    @Mapping(target = "courseClass", ignore = true)
    @Mapping(target = "instructor", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "timeSlot", ignore = true)
    void updateEntityFromDto(ScheduleDto dto, @MappingTarget Schedule entity);
}
