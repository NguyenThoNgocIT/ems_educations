package com.quanlydaotao.backend.student.entity;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.user.entity.Person;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;
@Entity
@Table(name = "Students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends SoftDeleteEntity {

    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(generator = "UUID")
    @org.hibernate.annotations.GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @jakarta.persistence.Column(name = "StudentId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private java.util.UUID studentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonId", nullable = false, unique = true)
    private Person person;
    @Column(name = "StudentCode", nullable = false, length = 50, unique = true)
    private String studentCode;
    @Column(name = "Note", length = 255)
    private String note;
    @Column(name = "TrainingProgramId", nullable = false)
    private UUID trainingProgramId;
}
