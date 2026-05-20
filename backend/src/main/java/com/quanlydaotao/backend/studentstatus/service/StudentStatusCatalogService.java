package com.quanlydaotao.backend.studentstatus.service;

import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogResponse;

import java.util.List;
import java.util.UUID;

public interface StudentStatusCatalogService {
    List<StudentStatusCatalogResponse> search(String keyword, String statusType, Boolean isActive);

    StudentStatusCatalogResponse getStatus(UUID id);

    StudentStatusCatalogResponse createStatus(StudentStatusCatalogRequest request);

    StudentStatusCatalogResponse updateStatus(UUID id, StudentStatusCatalogRequest request);

    void deleteStatus(UUID id);
}
