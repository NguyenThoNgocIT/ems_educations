package com.quanlydaotao.backend.major;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {

    Optional<Major> findByMajorCode(String majorCode);

    Optional<Major> findByIdAndIsActiveTrue(UUID id);

    Page<Major> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT m FROM Major m WHERE m.isActive = true AND (LOWER(m.majorCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.majorName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Major> searchActiveByKeyword(@Param("keyword") String keyword);
}
