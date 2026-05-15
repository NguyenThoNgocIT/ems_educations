package com.quanlydaotao.backend.staff.repository;
import com.quanlydaotao.backend.staff.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface StaffRepository extends JpaRepository<Staff, UUID> {
    Optional<Staff> findByEmployeeIdAndDeletedAtIsNull(UUID id);
    Page<Staff> findByDeletedAtIsNull(Pageable pageable);
}
