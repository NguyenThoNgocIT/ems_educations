package com.quanlydaotao.backend.grade.service;

import com.quanlydaotao.backend.grade.dto.GradeComponentRequest;
import com.quanlydaotao.backend.grade.dto.GradeComponentResponse;
import com.quanlydaotao.backend.grade.dto.InstructorCourseClassStudentGradeResponse;
import com.quanlydaotao.backend.grade.dto.InstructorGradeCourseClassResponse;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeRequest;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeResponse;
import com.quanlydaotao.backend.grade.dto.StudentSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface GradeService {
    GradeComponentResponse createComponent(GradeComponentRequest request);

    GradeComponentResponse updateComponent(UUID componentId, GradeComponentRequest request);

    List<GradeComponentResponse> getComponents(UUID courseId);

    StudentComponentGradeResponse upsertComponentScore(UUID courseRegistrationId, StudentComponentGradeRequest request);

    List<StudentComponentGradeResponse> getComponentScores(UUID courseRegistrationId);

    StudentSummaryResponse finalizeSummary(UUID courseRegistrationId);

    StudentSummaryResponse getSummary(UUID courseRegistrationId);

    List<StudentSummaryResponse> getStudentSummaries(UUID studentId);

    List<InstructorGradeCourseClassResponse> getCurrentInstructorCourseClasses(String username, UUID semesterId);

    List<GradeComponentResponse> getCurrentInstructorCourseClassComponents(String username, UUID courseClassId);

    List<InstructorCourseClassStudentGradeResponse> getCurrentInstructorCourseClassStudents(String username, UUID courseClassId);

    List<StudentComponentGradeResponse> getCurrentInstructorComponentScores(String username, UUID courseRegistrationId);

    StudentComponentGradeResponse upsertCurrentInstructorComponentScore(
            String username,
            UUID courseRegistrationId,
            StudentComponentGradeRequest request);
}
