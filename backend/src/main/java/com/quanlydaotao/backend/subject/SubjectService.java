package com.quanlydaotao.backend.subject;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findByIsActiveTrue();
    }

    public Subject getSubjectById(UUID id) {
        return subjectRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Subject createSubject(SubjectRequest request) {
        subjectRepository.findByCourseCode(request.getCourseCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });
        Subject subject = Subject.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .credits(request.getCredits())
                .theoryHours(request.getTheoryHours())
                .practiceHours(request.getPracticeHours())
                .description(request.getDescription())
                .semester(request.getSemester())
                .isMandatory(request.getIsMandatory())
                .programId(request.getProgramId())
                .build();
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(UUID id, SubjectRequest request) {
        Subject existing = getSubjectById(id);
        if (!existing.getCourseCode().equals(request.getCourseCode())) {
            subjectRepository.findByCourseCode(request.getCourseCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        existing.setCourseCode(request.getCourseCode());
        existing.setCourseName(request.getCourseName());
        existing.setCredits(request.getCredits());
        existing.setTheoryHours(request.getTheoryHours());
        existing.setPracticeHours(request.getPracticeHours());
        existing.setDescription(request.getDescription());
        existing.setSemester(request.getSemester());
        existing.setIsMandatory(request.getIsMandatory());
        existing.setProgramId(request.getProgramId());
        return subjectRepository.save(existing);
    }

    public void softDeleteSubject(UUID id) {
        Subject existing = getSubjectById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        subjectRepository.save(existing);
    }

    public void hardDeleteSubject(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dữ liệu");
        }
        subjectRepository.deleteById(id);
    }

    public Subject restoreSubject(UUID id) {
        Subject existing = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setIsActive(true);
        existing.setDeletedAt(null);
        return subjectRepository.save(existing);
    }

    public List<Subject> searchSubjects(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllSubjects();
        }
        return subjectRepository.searchActiveByKeyword(keyword);
    }

    public Page<Subject> getSubjectsPage(int page, int size) {
        return subjectRepository.findByIsActiveTrue(PageRequest.of(page, size));
    }
}
