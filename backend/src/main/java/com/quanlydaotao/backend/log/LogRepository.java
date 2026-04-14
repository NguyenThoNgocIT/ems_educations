package com.quanlydaotao.backend.log;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, UUID> {

    List<Log> findByUserId(UUID userId);

    List<Log> findByTableName(String tableName);

    List<Log> findByAction(String action);
}
