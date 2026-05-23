package com.quanlydaotao.backend.studentstatus.repository;

import com.quanlydaotao.backend.studentstatus.entity.StudentStatusCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentStatusCatalogRepository extends JpaRepository<StudentStatusCatalog, UUID> {
    Optional<StudentStatusCatalog> findByCode(String code);

    @Query("""
            SELECT s
            FROM StudentStatusCatalog s
            WHERE (:keyword IS NULL OR LOWER(s.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:statusType IS NULL OR s.statusType = :statusType)
              AND (:isActive IS NULL OR s.isActive = :isActive)
            ORDER BY s.code ASC
            """)
    List<StudentStatusCatalog> search(String keyword, String statusType, Boolean isActive);
}
