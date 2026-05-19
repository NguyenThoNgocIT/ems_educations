package com.quanlydaotao.backend.division.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.division.dto.DivisionDto;
import com.quanlydaotao.backend.division.entity.Division;
import com.quanlydaotao.backend.division.mapper.DivisionMapper;
import com.quanlydaotao.backend.division.repository.DivisionRepository;
import com.quanlydaotao.backend.division.service.DivisionService;
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
public class DivisionServiceImpl implements DivisionService {
    private final DivisionRepository divisionRepository;
    private final DivisionMapper divisionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<DivisionDto> searchDivisions(String keyword, Boolean isActive) {
        return divisionMapper.toDtoList(divisionRepository.search(normalizeBlank(keyword), isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public DivisionDto getDivision(UUID id) {
        return divisionMapper.toDto(findDivision(id));
    }

    @Override
    @Transactional
    public DivisionDto createDivision(DivisionDto request) {
        validateRequired(request);
        String code = normalizeCode(request.getCode());
        divisionRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã phòng ban đã tồn tại");
        });
        Division division = divisionMapper.toEntity(request);
        division.setCode(code);
        division.setName(request.getName().trim());
        division.setIsActive(request.getIsActive() == null || request.getIsActive());
        return divisionMapper.toDto(divisionRepository.save(division));
    }

    @Override
    @Transactional
    public DivisionDto updateDivision(UUID id, DivisionDto request) {
        Division division = findDivision(id);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            divisionRepository.findByCode(code)
                    .filter(existing -> !existing.getDivisionId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã phòng ban đã tồn tại");
                    });
            division.setCode(code);
        }
        divisionMapper.updateEntityFromDto(request, division);
        if (StringUtils.hasText(request.getCode())) division.setCode(normalizeCode(request.getCode()));
        if (StringUtils.hasText(request.getName())) division.setName(request.getName().trim());
        return divisionMapper.toDto(divisionRepository.save(division));
    }

    @Override
    @Transactional
    public void deleteDivision(UUID id) {
        Division division = findDivision(id);
        division.setIsActive(false);
        division.setDeletedAt(LocalDateTime.now());
        divisionRepository.save(division);
    }

    private Division findDivision(UUID id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban"));
    }

    private void validateRequired(DivisionDto request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())) {
            throw new BusinessException("Mã và tên phòng ban không được để trống");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
