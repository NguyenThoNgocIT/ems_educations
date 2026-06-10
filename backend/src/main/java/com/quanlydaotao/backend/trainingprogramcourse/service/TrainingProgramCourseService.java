package com.quanlydaotao.backend.trainingprogramcourse.service;

import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseRequest;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;

import java.util.List;
import java.util.UUID;

public interface TrainingProgramCourseService {
    List<TrainingProgramCourseResponse> search(UUID trainingProgramId, UUID semesterId, String coursePhase, Boolean isRequired, Boolean isActive);

    List<TrainingProgramCourseResponse> getCoursesForStudent(UUID studentId, UUID semesterId);

    TrainingProgramCourseResponse create(TrainingProgramCourseRequest request);

    TrainingProgramCourseResponse update(UUID trainingProgramId, UUID courseId, TrainingProgramCourseRequest request);

    void delete(UUID trainingProgramId, UUID courseId);
}
