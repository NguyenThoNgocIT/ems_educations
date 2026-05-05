package com.quanlydaotao.backend.student.repository;
import com.quanlydaotao.backend.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByStudentCode(String studentCode);
<<<<<<< HEAD
    Optional<Student> findByPersonId(UUID personId);
=======
    Optional<Student> findByPersonPersonId(UUID personId);
>>>>>>> origin/develop
}
