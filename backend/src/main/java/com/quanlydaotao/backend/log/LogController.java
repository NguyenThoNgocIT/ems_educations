package com.quanlydaotao.backend.log;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
@Tag(name = "log-controller")
public class LogController {

    private final LogService logService;

    @GetMapping
    public ResponseEntity<List<Log>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Log> getLogById(@PathVariable UUID id) {
        return ResponseEntity.ok(logService.getLogById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Log>> getLogsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(logService.getLogsByUser(userId));
    }

    @GetMapping("/table/{tableName}")
    public ResponseEntity<List<Log>> getLogsByTable(@PathVariable String tableName) {
        return ResponseEntity.ok(logService.getLogsByTable(tableName));
    }

    @GetMapping("/action")
    public ResponseEntity<List<Log>> getLogsByAction(@RequestParam String action) {
        return ResponseEntity.ok(logService.getLogsByAction(action));
    }

    @PostMapping
    public ResponseEntity<Log> createLog(@Valid @RequestBody LogRequest request) {
        return ResponseEntity.ok(logService.createLog(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable UUID id) {
        logService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}
