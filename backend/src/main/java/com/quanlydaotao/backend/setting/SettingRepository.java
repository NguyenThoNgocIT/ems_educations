package com.quanlydaotao.backend.setting;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRepository extends JpaRepository<Setting, UUID> {

    Optional<Setting> findByConfigKey(String configKey);

    Optional<Setting> findByIdAndIsActiveTrue(UUID id);

    List<Setting> findByIsActiveTrue();
}
