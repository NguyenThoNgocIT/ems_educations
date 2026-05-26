package com.quanlydaotao.backend.scheduling.domain;

import ai.timefold.solver.core.api.domain.solution.PlanningEntityCollectionProperty;
import ai.timefold.solver.core.api.domain.solution.PlanningScore;
import ai.timefold.solver.core.api.domain.solution.PlanningSolution;
import ai.timefold.solver.core.api.domain.solution.ProblemFactCollectionProperty;
import ai.timefold.solver.core.api.domain.valuerange.ValueRangeProvider;
import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@PlanningSolution
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePlan {

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "roomList")
    private List<Room> roomList;

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "timeSlotList")
    private List<TimeSlot> timeSlotList;

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "dayOfWeekList")
    private List<Integer> dayOfWeekList;

    @PlanningEntityCollectionProperty
    private List<Schedule> scheduleList;

    @PlanningScore
    private HardSoftScore score;
    
    public SchedulePlan(List<Room> roomList, List<TimeSlot> timeSlotList, List<Integer> dayOfWeekList, List<Schedule> scheduleList) {
        this.roomList = roomList;
        this.timeSlotList = timeSlotList;
        this.dayOfWeekList = dayOfWeekList;
        this.scheduleList = scheduleList;
    }
}
