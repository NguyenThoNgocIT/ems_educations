package com.quanlydaotao.backend.prerequisite;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursePrerequisiteRepository extends JpaRepository<CoursePrerequisite, UUID> {

    List<CoursePrerequisite> findByIsActiveTrue();

    List<CoursePrerequisite> findByCourseIdAndIsActiveTrue(UUID courseId);

    Optional<CoursePrerequisite> findByCourseIdAndPrerequisiteIdAndIsActiveTrue(UUID courseId, UUID prerequisiteId);
}
