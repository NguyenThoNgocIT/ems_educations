package com.quanlydaotao.backend.scheduling.domain;

import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import ai.timefold.solver.core.api.score.stream.Constraint;
import ai.timefold.solver.core.api.score.stream.ConstraintFactory;
import ai.timefold.solver.core.api.score.stream.ConstraintProvider;
import ai.timefold.solver.core.api.score.stream.Joiners;
import com.quanlydaotao.backend.scheduling.entity.Schedule;

public class ScheduleConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
        return new Constraint[]{
                roomConflict(constraintFactory),
                courseClassConflict(constraintFactory),
                instructorConflict(constraintFactory),
                roomCapacity(constraintFactory)
        };
    }

    private Constraint roomConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .forEachUniquePair(Schedule.class,
                        Joiners.equal(Schedule::getRoom),
                        Joiners.equal(Schedule::getDayOfWeek),
                        Joiners.equal(Schedule::getTimeSlot),
                        Joiners.equal(Schedule::getSemesterId))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Room conflict");
    }

    private Constraint courseClassConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .forEachUniquePair(Schedule.class,
                        Joiners.equal(Schedule::getCourseClass),
                        Joiners.equal(Schedule::getDayOfWeek),
                        Joiners.equal(Schedule::getTimeSlot),
                        Joiners.equal(Schedule::getSemesterId))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Course class conflict");
    }

    private Constraint instructorConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .forEachUniquePair(Schedule.class,
                        Joiners.equal(Schedule::getInstructor),
                        Joiners.equal(Schedule::getDayOfWeek),
                        Joiners.equal(Schedule::getTimeSlot),
                        Joiners.equal(Schedule::getSemesterId))
                .filter((schedule1, schedule2) -> schedule1.getInstructor() != null && schedule2.getInstructor() != null)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Instructor conflict");
    }

    private Constraint roomCapacity(ConstraintFactory constraintFactory) {
        return constraintFactory
                .forEach(Schedule.class)
                .filter(schedule -> schedule.getRoom() != null && schedule.getCourseClass() != null
                        && schedule.getRoom().getCapacity() != null && schedule.getCourseClass().getMaxStudent() != null
                        && schedule.getRoom().getCapacity() < schedule.getCourseClass().getMaxStudent())
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Room capacity too small");
    }
}
