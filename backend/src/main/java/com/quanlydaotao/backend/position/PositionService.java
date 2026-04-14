package com.quanlydaotao.backend.position;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepository;

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position getPositionById(UUID id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Position createPosition(Position position) {
        return positionRepository.save(position);
    }

    public Position updatePosition(UUID id, Position request) {
        Position existing = getPositionById(id);
        existing.setName(request.getName());
        existing.setAllowance(request.getAllowance());
        return positionRepository.save(existing);
    }

    public void deletePosition(UUID id) {
        if (!positionRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dữ liệu");
        }
        positionRepository.deleteById(id);
    }

    public List<Position> searchPositions(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllPositions();
        }
        return positionRepository.findByNameContainingIgnoreCase(keyword);
    }
}
