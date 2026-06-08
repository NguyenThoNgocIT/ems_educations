package com.quanlydaotao.backend.student.service;

import com.quanlydaotao.backend.student.dto.StudentImportResponse;
import org.springframework.web.multipart.MultipartFile;

public interface StudentImportService {
    StudentImportResponse importStudentsFromExcel(MultipartFile file);
}
