package com.quanlydaotao.backend.log;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }

    public Log getLogById(UUID id) {
        return logRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<Log> getLogsByUser(UUID userId) {
        return logRepository.findByUserId(userId);
    }

    public List<Log> getLogsByTable(String tableName) {
        return logRepository.findByTableName(tableName);
    }

    public List<Log> getLogsByAction(String action) {
        return logRepository.findByAction(action);
    }

    public Log createLog(LogRequest request) {
        Log log = Log.builder()
                .userId(request.getUserId())
                .action(request.getAction())
                .tableName(request.getTableName())
                .recordId(request.getRecordId())
                .oldValue(request.getOldValue())
                .newValue(request.getNewValue())
                .ipAddress(request.getIpAddress())
                .userAgent(request.getUserAgent())
                .build();
        return logRepository.save(log);
    }

    public void deleteLog(UUID id) {
        logRepository.deleteById(id);
    }
}
