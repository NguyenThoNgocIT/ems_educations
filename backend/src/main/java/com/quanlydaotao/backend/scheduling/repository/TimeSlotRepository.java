package com.quanlydaotao.backend.scheduling.repository;

import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {
}
