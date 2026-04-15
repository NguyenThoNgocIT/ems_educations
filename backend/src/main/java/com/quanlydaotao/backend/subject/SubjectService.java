package com.quanlydaotao.backend.subject;

import com.quanlydaotao.backend.trainingprogram.TrainingProgramRepository;
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
    private final TrainingProgramRepository trainingProgramRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findByIsActiveTrue();
    }

    public Subject getSubjectById(UUID id) {
        return subjectRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Subject createSubject(SubjectRequest request) {

        // ✅ validate trước
        if (request.getCredits() <= 0) {
            throw new RuntimeException("Credits phải > 0");
        }

        String code = request.getCourseCode().trim();

        subjectRepository.findByCourseCodeIgnoreCase(code)
                .ifPresent(existing -> {
                    throw new RuntimeException("Mã đã tồn tại");
                });

        trainingProgramRepository.findByIdAndIsActiveTrue(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("CTĐT không tồn tại hoặc đã bị vô hiệu hóa"));

        Subject subject = Subject.builder()
                .courseCode(code)
                .courseName(request.getCourseName())
                .credits(request.getCredits())
                .theoryHours(request.getTheoryHours())
                .practiceHours(request.getPracticeHours())
                .description(request.getDescription())
                .semester(request.getSemester())
                .isMandatory(request.getIsMandatory())
                .programId(request.getProgramId())
                .isActive(true)
                .build();
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(UUID id, SubjectRequest request) {
        Subject existing = getSubjectById(id);
        String code = request.getCourseCode().trim();
        if (!existing.getCourseCode().equalsIgnoreCase(code)) {
            subjectRepository.findByCourseCodeIgnoreCase(code)
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Mã đã tồn tại");
                    });
        }
        trainingProgramRepository.findByIdAndIsActiveTrue(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("CTĐT không tồn tại hoặc đã bị vô hiệu hóa"));
        existing.setCourseCode(code);
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

    public String exportSubjectsCsv() {
        List<Subject> subjects = getAllSubjects();
        StringBuilder csv = new StringBuilder(
                "courseCode,courseName,credits,theoryHours,practiceHours,semester,isMandatory,programId,description\n");
        for (Subject subject : subjects) {
            csv.append(escapeCsv(subject.getCourseCode())).append(",")
                    .append(escapeCsv(subject.getCourseName())).append(",")
                    .append(subject.getCredits()).append(",")
                    .append(subject.getTheoryHours()).append(",")
                    .append(subject.getPracticeHours()).append(",")
                    .append(subject.getSemester()).append(",")
                    .append(subject.getIsMandatory()).append(",")
                    .append(subject.getProgramId()).append(",")
                    .append(escapeCsv(subject.getDescription())).append("\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\n") || escaped.contains("\r")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }
}
