package com.quanlydaotao.backend.room;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {

    Optional<Room> findByRoomCode(String roomCode);

    List<Room> findByRoomNameContainingIgnoreCaseOrRoomCodeContainingIgnoreCaseAndIsActiveTrue(String roomName, String roomCode);

    List<Room> findByBuildingIdAndIsActiveTrue(UUID buildingId);

    List<Room> findByStatusAndIsActiveTrue(String status);

    List<Room> findByCapacityGreaterThanEqualAndIsActiveTrue(Integer capacity);

    List<Room> findByIsActiveTrue();

    Optional<Room> findByIdAndIsActiveTrue(UUID id);
}
