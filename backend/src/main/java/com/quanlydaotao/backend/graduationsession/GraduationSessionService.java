package com.quanlydaotao.backend.graduationsession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GraduationSessionService {

    private final GraduationSessionRepository graduationSessionRepository;

    public List<GraduationSession> getAllSessions() {
        return graduationSessionRepository.findByIsActiveTrue();
    }

    public GraduationSession getSessionById(UUID id) {
        return graduationSessionRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public List<GraduationSession> searchSessions(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllSessions();
        }
        return graduationSessionRepository.findBySessionCodeContainingIgnoreCaseOrSessionNameContainingIgnoreCaseAndIsActiveTrue(
                keyword, keyword);
    }

    public List<GraduationSession> getActiveSessions() {
        LocalDate now = LocalDate.now();
        return graduationSessionRepository.findByStartDateLessThanEqualAndDueDateGreaterThanEqualAndIsActiveTrue(now, now);
    }

    public GraduationSession createSession(GraduationSessionRequest request) {
        validateRequest(request);
        graduationSessionRepository.findBySessionCode(request.getSessionCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        GraduationSession session = GraduationSession.builder()
                .sessionCode(request.getSessionCode())
                .sessionName(request.getSessionName())
                .academicYear(request.getAcademicYear())
                .semester(request.getSemester())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .description(request.getDescription())
                .build();
        return graduationSessionRepository.save(session);
    }

    public GraduationSession updateSession(UUID id, GraduationSessionRequest request) {
        validateRequest(request);
        GraduationSession existing = getSessionById(id);
        if (!existing.getSessionCode().equals(request.getSessionCode())) {
            graduationSessionRepository.findBySessionCode(request.getSessionCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setSessionCode(request.getSessionCode());
        existing.setSessionName(request.getSessionName());
        existing.setAcademicYear(request.getAcademicYear());
        existing.setSemester(request.getSemester());
        existing.setStartDate(request.getStartDate());
        existing.setDueDate(request.getDueDate());
        existing.setDescription(request.getDescription());
        return graduationSessionRepository.save(existing);
    }

    public void deleteSession(UUID id) {
        GraduationSession existing = getSessionById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        graduationSessionRepository.save(existing);
    }

    private void validateRequest(GraduationSessionRequest request) {
        if (request.getStartDate() == null || request.getDueDate() == null || request.getStartDate().isAfter(request.getDueDate())) {
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }
}
