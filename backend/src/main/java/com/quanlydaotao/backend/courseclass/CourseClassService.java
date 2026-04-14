package com.quanlydaotao.backend.courseclass;

import com.quanlydaotao.backend.semester.SemesterRepository;
import com.quanlydaotao.backend.subject.SubjectRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseClassService {

    private final CourseClassRepository courseClassRepository;
    private final SubjectRepository subjectRepository;
    private final SemesterRepository semesterRepository;

    public List<CourseClass> getAllCourseClasses() {
        return courseClassRepository.findByIsActiveTrue();
    }

    public CourseClass getCourseClassById(UUID id) {
        return courseClassRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public CourseClass createCourseClass(CourseClassRequest request) {
        courseClassRepository.findByClassCode(request.getClassCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        subjectRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        semesterRepository.findByIdAndIsActiveTrue(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        CourseClass courseClass = CourseClass.builder()
                .courseId(request.getCourseId())
                .semesterId(request.getSemesterId())
                .classCode(request.getClassCode())
                .maxStudent(request.getMaxStudent())
                .currentStudent(0)
                .schedule(request.getSchedule())
                .room(request.getRoom())
                .status(request.getStatus())
                .build();
        return courseClassRepository.save(courseClass);
    }

    public CourseClass updateCourseClass(UUID id, CourseClassRequest request) {
        CourseClass existing = getCourseClassById(id);
        if (!existing.getClassCode().equals(request.getClassCode())) {
            courseClassRepository.findByClassCode(request.getClassCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        subjectRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        semesterRepository.findByIdAndIsActiveTrue(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
        existing.setCourseId(request.getCourseId());
        existing.setSemesterId(request.getSemesterId());
        existing.setClassCode(request.getClassCode());
        existing.setMaxStudent(request.getMaxStudent());
        existing.setSchedule(request.getSchedule());
        existing.setRoom(request.getRoom());
        existing.setStatus(request.getStatus());
        return courseClassRepository.save(existing);
    }

    public void deleteCourseClass(UUID id) {
        CourseClass existing = getCourseClassById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        courseClassRepository.save(existing);
    }

    public List<CourseClass> searchCourseClasses(String keyword, UUID courseId, UUID semesterId, Integer status, String room) {
        if ((keyword == null || keyword.isBlank()) && courseId == null && semesterId == null && status == null && (room == null || room.isBlank())) {
            return getAllCourseClasses();
        }
        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword;
        String normalizedRoom = (room == null || room.isBlank()) ? null : room;
        return courseClassRepository.searchActiveByParams(normalizedKeyword, courseId, semesterId, status, normalizedRoom);
    }

    public List<CourseClass> getActiveCourseClasses() {
        return courseClassRepository.findByStatusAndIsActiveTrue(1);
    }

    public CourseClassStats getCourseClassStats() {
        List<CourseClass> all = getAllCourseClasses();
        long totalClasses = all.size();
        long activeClasses = all.stream().filter(clazz -> clazz.getStatus() != null && clazz.getStatus().equals(1)).count();
        long totalStudents = all.stream().mapToLong(clazz -> clazz.getCurrentStudent() == null ? 0 : clazz.getCurrentStudent()).sum();
        return new CourseClassStats(totalClasses, activeClasses, totalStudents);
    }

    public record CourseClassStats(long totalClasses, long activeClasses, long totalStudents) {}
}
