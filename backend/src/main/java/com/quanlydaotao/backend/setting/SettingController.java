package com.quanlydaotao.backend.setting;

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
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@Tag(name = "setting-controller")
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    public ResponseEntity<List<Setting>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setting> getSettingById(@PathVariable UUID id) {
        return ResponseEntity.ok(settingService.getSettingById(id));
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<Setting> getSettingByKey(@PathVariable String key) {
        return ResponseEntity.ok(settingService.getSettingByKey(key));
    }

    @PostMapping
    public ResponseEntity<Setting> createSetting(@Valid @RequestBody SettingRequest request) {
        return ResponseEntity.ok(settingService.createSetting(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Setting> updateSetting(@PathVariable UUID id, @Valid @RequestBody SettingRequest request) {
        return ResponseEntity.ok(settingService.updateSetting(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSetting(@PathVariable UUID id) {
        settingService.deleteSetting(id);
        return ResponseEntity.noContent().build();
    }
}
