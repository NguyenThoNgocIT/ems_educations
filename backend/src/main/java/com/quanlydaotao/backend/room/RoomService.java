package com.quanlydaotao.backend.room;

import com.quanlydaotao.backend.building.BuildingRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findByIsActiveTrue();
    }

    public Room getRoomById(UUID id) {
        return roomRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Room createRoom(RoomRequest request) {
        roomRepository.findByRoomCode(request.getRoomCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        buildingRepository.findByIdAndIsActiveTrue(request.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        Room room = Room.builder()
                .roomCode(request.getRoomCode())
                .roomName(request.getRoomName())
                .buildingId(request.getBuildingId())
                .capacity(request.getCapacity())
                .roomType(request.getRoomType())
                .status(request.getStatus())
                .build();
        return roomRepository.save(room);
    }

    public Room updateRoom(UUID id, RoomRequest request) {
        Room existing = getRoomById(id);
        if (!existing.getRoomCode().equals(request.getRoomCode())) {
            roomRepository.findByRoomCode(request.getRoomCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        buildingRepository.findByIdAndIsActiveTrue(request.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setRoomCode(request.getRoomCode());
        existing.setRoomName(request.getRoomName());
        existing.setBuildingId(request.getBuildingId());
        existing.setCapacity(request.getCapacity());
        existing.setRoomType(request.getRoomType());
        existing.setStatus(request.getStatus());
        return roomRepository.save(existing);
    }

    public void deleteRoom(UUID id) {
        Room existing = getRoomById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        roomRepository.save(existing);
    }

    public List<Room> searchRoom(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllRooms();
        }
        return roomRepository.findByRoomNameContainingIgnoreCaseOrRoomCodeContainingIgnoreCaseAndIsActiveTrue(keyword, keyword);
    }

    public List<Room> filterByBuilding(UUID buildingId) {
        return roomRepository.findByBuildingIdAndIsActiveTrue(buildingId);
    }

    public List<Room> filterByStatus(String status) {
        return roomRepository.findByStatusAndIsActiveTrue(status);
    }

    public List<Room> filterByCapacity(Integer capacity) {
        return roomRepository.findByCapacityGreaterThanEqualAndIsActiveTrue(capacity);
    }
}
