package com.quanlydaotao.backend.position;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<Position, UUID> {

    List<Position> findByNameContainingIgnoreCase(String name);
}
