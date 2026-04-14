package com.quanlydaotao.backend.setting;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;

    public List<Setting> getAllSettings() {
        return settingRepository.findByIsActiveTrue();
    }

    public Setting getSettingById(UUID id) {
        return settingRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Setting getSettingByKey(String key) {
        return settingRepository.findByConfigKey(key)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Setting createSetting(SettingRequest request) {
        settingRepository.findByConfigKey(request.getConfigKey())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        Setting setting = Setting.builder()
                .configKey(request.getConfigKey())
                .configValue(request.getConfigValue())
                .description(request.getDescription())
                .category(request.getCategory())
                .build();
        return settingRepository.save(setting);
    }

    public Setting updateSetting(UUID id, SettingRequest request) {
        Setting existing = getSettingById(id);
        if (!existing.getConfigKey().equals(request.getConfigKey())) {
            settingRepository.findByConfigKey(request.getConfigKey())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setConfigKey(request.getConfigKey());
        existing.setConfigValue(request.getConfigValue());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory());
        return settingRepository.save(existing);
    }

    public void deleteSetting(UUID id) {
        Setting existing = getSettingById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        settingRepository.save(existing);
    }
}
