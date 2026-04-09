package com.quanlydaotao.backend.course;

import com.quanlydaotao.backend.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "course")
public class Course {

  @Id
  @GeneratedValue
  private Integer id;

  private String title;
  private String description;

  @ManyToOne
  @JoinColumn(name = "teacher_id", referencedColumnName = "id")
  private User teacher;

}
