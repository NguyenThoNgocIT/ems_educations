package com.quanlydaotao.backend.classmanagement.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.classmanagement.dto.request.CreateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.ClassSearchRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.UpdateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassDetailResponse;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassResponse;
import com.quanlydaotao.backend.classmanagement.entity.Class;
import com.quanlydaotao.backend.classmanagement.mapper.ClassMapper;
import com.quanlydaotao.backend.classmanagement.repository.ClassRepository;
import com.quanlydaotao.backend.classmanagement.service.ClassService;
import com.quanlydaotao.backend.classmanagement.spec.ClassSpecification;
import com.quanlydaotao.backend.classmanagement.validator.ClassValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final ClassMapper classMapper;
    private final ClassValidator classValidator;

    @Override
    @Transactional
    public ClassResponse createClass(CreateClassRequest request) {
        classValidator.validateCreateClass(request);
        
        Class classEntity = classMapper.toEntity(request);
        classEntity = classRepository.save(classEntity);
        
        return classMapper.toResponse(classEntity);
    }

    @Override
    @Transactional
    public ClassResponse updateClass(UUID id, UpdateClassRequest request) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));
        
        classValidator.validateUpdateClass(classEntity, request);
        classMapper.updateEntity(request, classEntity);
        
        classEntity = classRepository.save(classEntity);
        return classMapper.toResponse(classEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailResponse getClassById(UUID id) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));
        
        return classMapper.toDetailResponse(classEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassResponse> searchClasses(ClassSearchRequest request, Pageable pageable) {
        var spec = ClassSpecification.filterByCriteria(request);
        Page<Class> classes = classRepository.findAll(spec, pageable);
        return classes.map(classMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteClass(UUID id) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));
        
        classValidator.validateBeforeDelete(classEntity);
        
        classEntity.setDeletedAt(LocalDateTime.now());
        classEntity.setIsActive(false);
        classRepository.save(classEntity);
    }
}