package com.quanlydaotao.backend.trainingprogramcourse.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
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

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramCourseResponse> search(UUID trainingProgramId, UUID semesterId, String coursePhase, Boolean isRequired, Boolean isActive) {
        return mapper.toDtoList(repository.search(trainingProgramId, semesterId, normalizePhase(coursePhase), isRequired, isActive));
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

    private String normalizePhase(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}
