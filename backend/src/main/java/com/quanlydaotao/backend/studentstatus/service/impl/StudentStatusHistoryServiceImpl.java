package com.quanlydaotao.backend.studentstatus.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryResponse;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusCatalog;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusHistory;
import com.quanlydaotao.backend.studentstatus.mapper.StudentStatusHistoryMapper;
import com.quanlydaotao.backend.studentstatus.repository.StudentStatusCatalogRepository;
import com.quanlydaotao.backend.studentstatus.repository.StudentStatusHistoryRepository;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentStatusHistoryServiceImpl implements StudentStatusHistoryService {
    private final StudentStatusHistoryRepository studentStatusHistoryRepository;
    private final StudentStatusCatalogRepository studentStatusCatalogRepository;
    private final StudentRepository studentRepository;
    private final StudentStatusHistoryMapper studentStatusHistoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StudentStatusHistoryResponse> search(UUID studentId, UUID studentStatusId, Boolean isCurrent, Boolean isActive) {
        return studentStatusHistoryMapper.toDtoList(studentStatusHistoryRepository.search(studentId, studentStatusId, isCurrent, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentStatusHistoryResponse getHistory(UUID id) {
        return studentStatusHistoryMapper.toDto(findHistory(id));
    }

    @Override
    @Transactional
    public StudentStatusHistoryResponse createHistory(StudentStatusHistoryRequest request) {
        if (Boolean.TRUE.equals(request.getIsCurrent())) {
            return setCurrentStatus(request.getStudentId(), request.getStudentStatusId(), request.getStartDate(), request.getReason());
        }
        validateReferences(request.getStudentId(), request.getStudentStatusId());
        StudentStatusHistory history = new StudentStatusHistory();
        studentStatusHistoryMapper.updateEntityFromDto(request, history);
        history.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        history.setIsCurrent(false);
        history.setAllowRegister(request.getAllowRegister() == null || request.getAllowRegister());
        history.setAllowExam(request.getAllowExam() == null || request.getAllowExam());
        history.setIsActive(request.getIsActive() == null || request.getIsActive());
        return studentStatusHistoryMapper.toDto(studentStatusHistoryRepository.save(history));
    }

    @Override
    @Transactional
    public StudentStatusHistoryResponse updateHistory(UUID id, StudentStatusHistoryRequest request) {
        StudentStatusHistory history = findHistory(id);
        UUID studentId = request.getStudentId() != null ? request.getStudentId() : history.getStudentId();
        UUID studentStatusId = request.getStudentStatusId() != null ? request.getStudentStatusId() : history.getStudentStatusId();
        validateReferences(studentId, studentStatusId);
        studentStatusHistoryMapper.updateEntityFromDto(request, history);
        if (Boolean.TRUE.equals(request.getIsCurrent())) {
            closeCurrentHistory(studentId, history.getStartDate(), id);
        }
        if (history.getStartDate() == null) {
            history.setStartDate(LocalDate.now());
        }
        if (history.getAllowRegister() == null) {
            history.setAllowRegister(true);
        }
        if (history.getAllowExam() == null) {
            history.setAllowExam(true);
        }
        return studentStatusHistoryMapper.toDto(studentStatusHistoryRepository.save(history));
    }

    @Override
    @Transactional
    public void deleteHistory(UUID id) {
        StudentStatusHistory history = findHistory(id);
        history.setIsActive(false);
        history.setDeletedAt(LocalDateTime.now());
        studentStatusHistoryRepository.save(history);
    }

    @Override
    @Transactional
    public StudentStatusHistoryResponse setCurrentStatus(UUID studentId, UUID studentStatusId, LocalDate startDate, String reason) {
        validateReferences(studentId, studentStatusId);
        LocalDate effectiveStartDate = startDate != null ? startDate : LocalDate.now();
        closeCurrentHistory(studentId, effectiveStartDate, null);

        StudentStatusHistory history = new StudentStatusHistory();
        history.setStudentId(studentId);
        history.setStudentStatusId(studentStatusId);
        history.setStartDate(effectiveStartDate);
        history.setIsCurrent(true);
        history.setReason(reason);
        history.setAllowRegister(true);
        history.setAllowExam(true);
        history.setIsActive(true);
        return studentStatusHistoryMapper.toDto(studentStatusHistoryRepository.save(history));
    }

    private StudentStatusHistory findHistory(UUID id) {
        return studentStatusHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch sử trạng thái sinh viên"));
    }

    private void validateReferences(UUID studentId, UUID studentStatusId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        StudentStatusCatalog status = studentStatusCatalogRepository.findById(studentStatusId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạng thái sinh viên"));
        if (!Boolean.TRUE.equals(student.getIsActive())) {
            throw new BusinessException("Sinh viên không còn hoạt động");
        }
        if (!Boolean.TRUE.equals(status.getIsActive())) {
            throw new BusinessException("Trạng thái sinh viên không còn hoạt động");
        }
    }

    private void closeCurrentHistory(UUID studentId, LocalDate newStartDate, UUID ignoredHistoryId) {
        studentStatusHistoryRepository.findByStudentIdAndIsCurrentTrueAndIsActiveTrue(studentId)
                .filter(existing -> ignoredHistoryId == null || !existing.getStudentStatusHistoryId().equals(ignoredHistoryId))
                .ifPresent(existing -> {
                    existing.setIsCurrent(false);
                    LocalDate endDate = newStartDate.minusDays(1);
                    existing.setEndDate(endDate.isBefore(existing.getStartDate()) ? existing.getStartDate() : endDate);
                    studentStatusHistoryRepository.save(existing);
                });
    }
}
