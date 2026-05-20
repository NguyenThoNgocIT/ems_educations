package com.quanlydaotao.backend.studentstatus.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogResponse;
import com.quanlydaotao.backend.studentstatus.entity.StudentStatusCatalog;
import com.quanlydaotao.backend.studentstatus.mapper.StudentStatusCatalogMapper;
import com.quanlydaotao.backend.studentstatus.repository.StudentStatusCatalogRepository;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentStatusCatalogServiceImpl implements StudentStatusCatalogService {
    private final StudentStatusCatalogRepository studentStatusCatalogRepository;
    private final StudentStatusCatalogMapper studentStatusCatalogMapper;

    @Override
    @Transactional(readOnly = true)
    public List<StudentStatusCatalogResponse> search(String keyword, String statusType, Boolean isActive) {
        return studentStatusCatalogMapper.toDtoList(studentStatusCatalogRepository.search(normalizeBlank(keyword), normalizeBlank(statusType), isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentStatusCatalogResponse getStatus(UUID id) {
        return studentStatusCatalogMapper.toDto(findStatus(id));
    }

    @Override
    @Transactional
    public StudentStatusCatalogResponse createStatus(StudentStatusCatalogRequest request) {
        String code = normalizeCode(request.getCode());
        studentStatusCatalogRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã trạng thái sinh viên đã tồn tại");
        });
        StudentStatusCatalog status = new StudentStatusCatalog();
        status.setCode(code);
        status.setName(requiredName(request.getName()));
        status.setDescription(request.getDescription());
        status.setStatusType(normalizeBlank(request.getStatusType()));
        status.setIsActive(request.getIsActive() == null || request.getIsActive());
        return studentStatusCatalogMapper.toDto(studentStatusCatalogRepository.save(status));
    }

    @Override
    @Transactional
    public StudentStatusCatalogResponse updateStatus(UUID id, StudentStatusCatalogRequest request) {
        StudentStatusCatalog status = findStatus(id);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            studentStatusCatalogRepository.findByCode(code)
                    .filter(existing -> !existing.getStudentStatusId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã trạng thái sinh viên đã tồn tại");
                    });
            status.setCode(code);
        }
        studentStatusCatalogMapper.updateEntityFromDto(request, status);
        if (StringUtils.hasText(request.getName())) {
            status.setName(request.getName().trim());
        }
        if (StringUtils.hasText(request.getStatusType())) {
            status.setStatusType(request.getStatusType().trim().toUpperCase(Locale.ROOT));
        }
        return studentStatusCatalogMapper.toDto(studentStatusCatalogRepository.save(status));
    }

    @Override
    @Transactional
    public void deleteStatus(UUID id) {
        StudentStatusCatalog status = findStatus(id);
        status.setIsActive(false);
        status.setDeletedAt(LocalDateTime.now());
        studentStatusCatalogRepository.save(status);
    }

    private StudentStatusCatalog findStatus(UUID id) {
        return studentStatusCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạng thái sinh viên"));
    }

    private String normalizeCode(String code) {
        if (!StringUtils.hasText(code)) {
            throw new BusinessException("Mã trạng thái sinh viên không được để trống");
        }
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String requiredName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new BusinessException("Tên trạng thái sinh viên không được để trống");
        }
        return name.trim();
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}
