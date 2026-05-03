package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.CoursePrerequisite;
import com.quanlydaotao.backend.course.entity.CoursePrerequisiteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CoursePrerequisiteRepository extends JpaRepository<CoursePrerequisite, CoursePrerequisiteId> {
    List<CoursePrerequisite> findByCourseId(UUID courseId);
    List<CoursePrerequisite> findByPrerequisiteCourseId(UUID prerequisiteCourseId);
    void deleteByCourseIdAndPrerequisiteCourseId(UUID courseId, UUID prerequisiteCourseId);
}
