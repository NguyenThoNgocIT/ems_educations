package com.quanlydaotao.backend.classroom;

import com.quanlydaotao.backend.course.Course;
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
@Table(name = "classroom")
public class Classroom {

  @Id
  @GeneratedValue
  private Integer id;

  private String name;

  @ManyToOne
  @JoinColumn(name = "course_id", referencedColumnName = "id")
  private Course course;

  @ManyToOne
  @JoinColumn(name = "manager_id", referencedColumnName = "id")
  private User manager;

}
