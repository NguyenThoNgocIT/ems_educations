package com.quanlydaotao.backend.studentstatus.service;

import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusHistoryResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface StudentStatusHistoryService {
    List<StudentStatusHistoryResponse> search(UUID studentId, UUID studentStatusId, Boolean isCurrent, Boolean isActive);

    StudentStatusHistoryResponse getHistory(UUID id);

    StudentStatusHistoryResponse createHistory(StudentStatusHistoryRequest request);

    StudentStatusHistoryResponse updateHistory(UUID id, StudentStatusHistoryRequest request);

    void deleteHistory(UUID id);

    StudentStatusHistoryResponse setCurrentStatus(UUID studentId, UUID studentStatusId, LocalDate startDate, String reason);
}
