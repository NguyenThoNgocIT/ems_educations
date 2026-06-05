package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import java.util.List;
import java.util.UUID;

public interface CoursePrerequisiteService {
    List<PrerequisiteDto> getPrerequisitesByCourse(UUID courseId);
    PrerequisiteDto addPrerequisite(CreatePrerequisiteRequest request);
    void deletePrerequisite(UUID courseId, UUID prereqId);
    boolean checkExists(UUID courseId, UUID prereqId);
}
