package com.quanlydaotao.backend.studentspecialization.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationAssignRequest;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationHistoryResponse;
import com.quanlydaotao.backend.studentspecialization.entity.StudentSpecializationHistory;
import com.quanlydaotao.backend.studentspecialization.mapper.StudentSpecializationHistoryMapper;
import com.quanlydaotao.backend.studentspecialization.repository.StudentSpecializationHistoryRepository;
import com.quanlydaotao.backend.studentspecialization.service.StudentSpecializationService;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentSpecializationServiceImpl implements StudentSpecializationService {
    private final StudentSpecializationHistoryRepository historyRepository;
    private final StudentRepository studentRepository;
    private final SpecializationRepository specializationRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final SemesterRepository semesterRepository;
    private final StudentClassService studentClassService;
    private final StudentSpecializationHistoryMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<StudentSpecializationHistoryResponse> search(UUID studentId, UUID majorId, UUID specializationId, Boolean isCurrent, Boolean isActive) {
        return mapper.toDtoList(historyRepository.search(studentId, majorId, specializationId, isCurrent, isActive));
    }

    @Override
    @Transactional
    public StudentSpecializationHistoryResponse assignSpecialization(StudentSpecializationAssignRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành"));
        TrainingProgram program = trainingProgramRepository.findById(request.getTrainingProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo chuyên ngành"));
        if (!semesterRepository.existsById(request.getEffectiveSemesterId())) {
            throw new ResourceNotFoundException("Không tìm thấy học kỳ hiệu lực");
        }
        if (!request.getMajorId().equals(specialization.getMajorId())) {
            throw new BusinessException("Chuyên ngành không thuộc ngành đã chọn");
        }
        if (!request.getMajorId().equals(program.getMajorId())
                || !request.getSpecializationId().equals(program.getSpecializationId())
                || !student.getAcademicCohortId().equals(program.getAcademicCohortId())) {
            throw new BusinessException("Chương trình đào tạo không khớp ngành/chuyên ngành/khóa của sinh viên");
        }

        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        historyRepository.findByStudentIdAndIsCurrentTrueAndIsActiveTrue(student.getStudentId()).ifPresent(current -> {
            current.setIsCurrent(false);
            current.setEndDate(startDate.minusDays(1).isBefore(current.getStartDate()) ? current.getStartDate() : startDate.minusDays(1));
            historyRepository.save(current);
        });

        student.setMajorId(request.getMajorId());
        student.setSpecializationId(request.getSpecializationId());
        student.setTrainingProgramId(request.getTrainingProgramId());
        student.setDepartmentId(program.getDepartmentId());
        studentRepository.save(student);

        if (request.getClassId() != null) {
            studentClassService.assignStudentToClass(student.getStudentId(), request.getClassId(), request.getEffectiveSemesterId(),
                    null, "ACTIVE", request.getReason());
            student.setClassId(request.getClassId());
            studentRepository.save(student);
        }

        StudentSpecializationHistory history = new StudentSpecializationHistory();
        history.setStudentId(student.getStudentId());
        history.setMajorId(request.getMajorId());
        history.setSpecializationId(request.getSpecializationId());
        history.setTrainingProgramId(request.getTrainingProgramId());
        history.setEffectiveSemesterId(request.getEffectiveSemesterId());
        history.setStartDate(startDate);
        history.setIsCurrent(true);
        history.setReason(request.getReason());
        history.setIsActive(true);
        return mapper.toDto(historyRepository.save(history));
    }
}
