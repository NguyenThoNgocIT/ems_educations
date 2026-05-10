package com.quanlydaotao.backend.registration.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "CourseRegistrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRegistration extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CourseRegistrationId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID courseRegistrationId;
    
    @Column(name = "StudentId", nullable = false)
    private UUID studentId;
    
    @Column(name = "CourseClassId", nullable = false)
    private UUID courseClassId;
    
    @Column(name = "RegistrationPeriodId")
    private UUID registrationPeriodId;
    
    @Column(name = "registration_type")
    private Integer registrationType;
    
    @Column(name = "status")
    private Integer status;
    
    @Column(name = "is_paid")
    private Boolean isPaid;
    
    @Column(name = "registered_at")
    private LocalDateTime registeredAt;
}