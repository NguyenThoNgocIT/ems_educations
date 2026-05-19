package com.quanlydaotao.backend.position.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.division.repository.DivisionRepository;
import com.quanlydaotao.backend.position.dto.PositionDto;
import com.quanlydaotao.backend.position.entity.Position;
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

    @Override
    @Transactional(readOnly = true)
    public List<PositionDto> searchPositions(String keyword, UUID divisionId, Boolean isActive) {
        return positionRepository.search(normalizeBlank(keyword), divisionId, isActive).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PositionDto getPosition(UUID id) {
        return toDto(findPosition(id));
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
        Position position = new Position();
        position.setCode(code);
        position.setName(request.getName().trim());
        apply(position, request);
        position.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toDto(positionRepository.save(position));
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
        if (StringUtils.hasText(request.getName())) position.setName(request.getName().trim());
        apply(position, request);
        return toDto(positionRepository.save(position));
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

    private void apply(Position position, PositionDto request) {
        if (request.getAllowance() != null) position.setAllowance(request.getAllowance());
        if (request.getDescription() != null) position.setDescription(request.getDescription());
        if (request.getLevel() != null) position.setLevel(request.getLevel());
        if (request.getDivisionId() != null) position.setDivisionId(request.getDivisionId());
        if (request.getIsActive() != null) position.setIsActive(request.getIsActive());
    }

    private PositionDto toDto(Position position) {
        return PositionDto.builder()
                .positionId(position.getPositionId())
                .code(position.getCode())
                .name(position.getName())
                .allowance(position.getAllowance())
                .description(position.getDescription())
                .level(position.getLevel())
                .divisionId(position.getDivisionId())
                .isActive(position.getIsActive())
                .build();
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
