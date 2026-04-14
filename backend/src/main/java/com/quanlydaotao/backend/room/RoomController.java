package com.quanlydaotao.backend.room;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/rooms")
@RequiredArgsConstructor
@Tag(name = "room-controller")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable UUID id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable UUID id, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Room>> searchRoom(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(roomService.searchRoom(keyword));
    }

    @GetMapping("/building")
    public ResponseEntity<List<Room>> filterByBuilding(@RequestParam UUID buildingId) {
        return ResponseEntity.ok(roomService.filterByBuilding(buildingId));
    }

    @GetMapping("/status")
    public ResponseEntity<List<Room>> filterByStatus(@RequestParam String status) {
        return ResponseEntity.ok(roomService.filterByStatus(status));
    }

    @GetMapping("/capacity")
    public ResponseEntity<List<Room>> filterByCapacity(@RequestParam Integer capacity) {
        return ResponseEntity.ok(roomService.filterByCapacity(capacity));
    }
}
