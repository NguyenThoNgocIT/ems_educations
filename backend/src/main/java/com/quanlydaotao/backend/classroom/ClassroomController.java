package com.quanlydaotao.backend.classroom;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manager/classrooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class ClassroomController {

  private final ClassroomService classroomService;

  @GetMapping
  public ResponseEntity<List<Classroom>> getAllClassrooms() {
    return ResponseEntity.ok(classroomService.getAllClassrooms());
  }

  @PostMapping
  public ResponseEntity<Classroom> createClassroom(
      @RequestBody ClassroomRequest request,
      Authentication authentication
  ) {
    Integer managerId = (Integer) authentication.getPrincipal();
    return ResponseEntity.ok(classroomService.createClassroom(request, managerId));
  }

}
