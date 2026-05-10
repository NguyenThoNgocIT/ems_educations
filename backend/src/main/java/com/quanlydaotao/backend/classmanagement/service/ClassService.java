package com.quanlydaotao.backend.classmanagement.service;

import com.quanlydaotao.backend.classmanagement.dto.request.CreateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.ClassSearchRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.UpdateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassDetailResponse;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ClassService {
    
    ClassResponse createClass(CreateClassRequest request);
    
    ClassResponse updateClass(UUID id, UpdateClassRequest request);
    
    ClassDetailResponse getClassById(UUID id);
    
    Page<ClassResponse> searchClasses(ClassSearchRequest request, Pageable pageable);
    
    void deleteClass(UUID id);
}