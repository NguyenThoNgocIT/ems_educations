package com.quanlydaotao.backend.trainingprogramcourse.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseRequest;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourseId;
import com.quanlydaotao.backend.trainingprogramcourse.mapper.TrainingProgramCourseMapper;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import com.quanlydaotao.backend.trainingprogramcourse.service.TrainingProgramCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrainingProgramCourseServiceImpl implements TrainingProgramCourseService {
    private final TrainingProgramCourseRepository repository;
    private final TrainingProgramCourseMapper mapper;
    private final StudentRepository studentRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramCourseResponse> search(
            UUID trainingProgramId,
            UUID semesterId,
            String coursePhase,
            Boolean isRequired,
            Boolean isActive) {
        return repository.searchResponses(
                trainingProgramId,
                semesterId,
                normalizePhase(coursePhase),
                isRequired,
                isActive);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramCourseResponse> getCoursesForStudent(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        if (student.getTrainingProgramId() == null) {
            throw new BusinessException("Sinh viên chưa được gán chương trình đào tạo");
        }
        return search(student.getTrainingProgramId(), semesterId, null, null, true);
    }

    @Override
    @Transactional
    public TrainingProgramCourseResponse create(TrainingProgramCourseRequest request) {
        validateReferences(request);
        TrainingProgramCourseId id = new TrainingProgramCourseId(request.getTrainingProgramId(), request.getCourseId());
        if (repository.existsById(id)) {
            throw new BusinessException("Môn học đã tồn tại trong chương trình đào tạo");
        }
        TrainingProgramCourse entity = new TrainingProgramCourse();
        applyRequest(request, entity);
        entity.setIsActive(request.getIsActive() == null || request.getIsActive());
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public TrainingProgramCourseResponse update(UUID trainingProgramId, UUID courseId, TrainingProgramCourseRequest request) {
        TrainingProgramCourse entity = repository.findById(new TrainingProgramCourseId(trainingProgramId, courseId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học trong chương trình đào tạo"));
        request.setTrainingProgramId(trainingProgramId);
        request.setCourseId(courseId);
        validateReferences(request);
        applyRequest(request, entity);
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID trainingProgramId, UUID courseId) {
        TrainingProgramCourse entity = repository.findById(new TrainingProgramCourseId(trainingProgramId, courseId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học trong chương trình đào tạo"));
        entity.setIsActive(false);
        repository.save(entity);
    }

    private void validateReferences(TrainingProgramCourseRequest request) {
        if (!trainingProgramRepository.existsById(request.getTrainingProgramId())) {
            throw new ResourceNotFoundException("Không tìm thấy chương trình đào tạo");
        }
        if (!courseRepository.existsById(request.getCourseId())) {
            throw new ResourceNotFoundException("Không tìm thấy môn học");
        }
        if (request.getSemesterId() != null && !semesterRepository.existsById(request.getSemesterId())) {
            throw new ResourceNotFoundException("Không tìm thấy học kỳ");
        }
        if (request.getPrerequisiteCourseId() != null && !courseRepository.existsById(request.getPrerequisiteCourseId())) {
            throw new ResourceNotFoundException("Không tìm thấy môn tiên quyết");
        }
    }

    private void applyRequest(TrainingProgramCourseRequest request, TrainingProgramCourse entity) {
        entity.setTrainingProgramId(request.getTrainingProgramId());
        entity.setCourseId(request.getCourseId());
        entity.setSemesterId(request.getSemesterId());
        entity.setIsRequired(request.getIsRequired() == null || request.getIsRequired());
        entity.setGroupCode(normalizeText(request.getGroupCode()));
        entity.setCredits(request.getCredits());
        entity.setPrerequisiteCourseId(request.getPrerequisiteCourseId());
        entity.setIsPrerequisiteRequired(Boolean.TRUE.equals(request.getIsPrerequisiteRequired()));
        entity.setNote(request.getNote());
        entity.setSortOrder(request.getSortOrder());
        entity.setStatus(StringUtils.hasText(request.getStatus()) ? request.getStatus().trim().toUpperCase(Locale.ROOT) : "ACTIVE");
        entity.setCoursePhase(normalizePhase(request.getCoursePhase()));
    }

    private String normalizeText(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }

    private String normalizePhase(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}
