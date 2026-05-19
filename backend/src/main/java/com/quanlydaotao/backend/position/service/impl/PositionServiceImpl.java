package com.quanlydaotao.backend.position.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.division.repository.DivisionRepository;
import com.quanlydaotao.backend.position.dto.PositionDto;
import com.quanlydaotao.backend.position.entity.Position;
import com.quanlydaotao.backend.position.mapper.PositionMapper;
import com.quanlydaotao.backend.position.repository.PositionRepository;
import com.quanlydaotao.backend.position.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
    private final DivisionRepository divisionRepository;
    private final PositionMapper positionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PositionDto> searchPositions(String keyword, UUID divisionId, Boolean isActive) {
        return positionMapper.toDtoList(positionRepository.search(normalizeBlank(keyword), divisionId, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public PositionDto getPosition(UUID id) {
        return positionMapper.toDto(findPosition(id));
    }

    @Override
    @Transactional
    public PositionDto createPosition(PositionDto request) {
        validateRequired(request);
        validateFields(request);
        String code = normalizeCode(request.getCode());
        positionRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã chức vụ đã tồn tại");
        });
        Position position = positionMapper.toEntity(request);
        position.setCode(code);
        position.setName(request.getName().trim());
        position.setIsActive(request.getIsActive() == null || request.getIsActive());
        return positionMapper.toDto(positionRepository.save(position));
    }

    @Override
    @Transactional
    public PositionDto updatePosition(UUID id, PositionDto request) {
        Position position = findPosition(id);
        validateFields(request);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            positionRepository.findByCode(code)
                    .filter(existing -> !existing.getPositionId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã chức vụ đã tồn tại");
                    });
            position.setCode(code);
        }
        positionMapper.updateEntityFromDto(request, position);
        if (StringUtils.hasText(request.getCode())) position.setCode(normalizeCode(request.getCode()));
        if (StringUtils.hasText(request.getName())) position.setName(request.getName().trim());
        return positionMapper.toDto(positionRepository.save(position));
    }

    @Override
    @Transactional
    public void deletePosition(UUID id) {
        Position position = findPosition(id);
        position.setIsActive(false);
        position.setDeletedAt(LocalDateTime.now());
        positionRepository.save(position);
    }

    private Position findPosition(UUID id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chức vụ"));
    }

    private void validateRequired(PositionDto request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())) {
            throw new BusinessException("Mã và tên chức vụ không được để trống");
        }
    }

    private void validateFields(PositionDto request) {
        if (request.getDivisionId() != null && !divisionRepository.existsById(request.getDivisionId())) {
            throw new ResourceNotFoundException("Không tìm thấy phòng ban của chức vụ");
        }
        if (request.getAllowance() != null && request.getAllowance().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Phụ cấp chức vụ không được âm");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
