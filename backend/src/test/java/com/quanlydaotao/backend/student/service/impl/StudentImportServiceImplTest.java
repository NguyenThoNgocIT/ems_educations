package com.quanlydaotao.backend.student.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentImportResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentImportServiceImplTest {
    @Mock AccountServiceImpl accountService;
    @InjectMocks StudentImportServiceImpl service;

    @Test
    void importStudentsFromExcel_createsValidRowsAndReportsFailedRows() throws Exception {
        UUID departmentId = UUID.randomUUID();
        UUID cohortId = UUID.randomUUID();
        MockMultipartFile file = excelFile(departmentId, cohortId);

        when(accountService.createStudentAccount(any(StudentAdminCreateRequest.class))).thenAnswer(invocation -> {
            StudentAdminCreateRequest request = invocation.getArgument(0);
            if ("Tran Thi Loi".equals(request.getFullName())) {
                throw new BusinessException("Ma sinh vien da ton tai");
            }
            return AccountCreationResponse.builder()
                    .studentCode("SV001")
                    .username("sv001")
                    .emailEdu("ansv001@donga.edu.vn")
                    .build();
        });

        StudentImportResponse response = service.importStudentsFromExcel(file);

        assertThat(response.getTotalRows()).isEqualTo(2);
        assertThat(response.getSuccessCount()).isEqualTo(1);
        assertThat(response.getFailureCount()).isEqualTo(1);
        assertThat(response.getRows()).anySatisfy(row -> {
            assertThat(row.getSuccess()).isTrue();
            assertThat(row.getFullName()).isEqualTo("Nguyen Van An");
            assertThat(row.getStudentCode()).isEqualTo("SV001");
            assertThat(row.getUsername()).isEqualTo("sv001");
        });
        assertThat(response.getRows()).anySatisfy(row -> {
            assertThat(row.getSuccess()).isFalse();
            assertThat(row.getFullName()).isEqualTo("Tran Thi Loi");
            assertThat(row.getMessage()).contains("Ma sinh vien da ton tai");
        });

        ArgumentCaptor<StudentAdminCreateRequest> captor = ArgumentCaptor.forClass(StudentAdminCreateRequest.class);
        verify(accountService, org.mockito.Mockito.times(2)).createStudentAccount(captor.capture());
        assertThat(captor.getAllValues().get(0).getDateOfBirth()).isEqualTo(LocalDate.of(2004, 9, 1));
        assertThat(captor.getAllValues().get(0).getDepartmentId()).isEqualTo(departmentId);
        assertThat(captor.getAllValues().get(0).getAcademicCohortId()).isEqualTo(cohortId);
    }

    private MockMultipartFile excelFile(UUID departmentId, UUID cohortId) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet("students");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("fullName");
            header.createCell(1).setCellValue("dateOfBirth");
            header.createCell(2).setCellValue("departmentId");
            header.createCell(3).setCellValue("academicCohortId");
            header.createCell(4).setCellValue("studentCode");
            header.createCell(5).setCellValue("phoneNumber");

            Row success = sheet.createRow(1);
            success.createCell(0).setCellValue("Nguyen Van An");
            success.createCell(1).setCellValue("2004-09-01");
            success.createCell(2).setCellValue(departmentId.toString());
            success.createCell(3).setCellValue(cohortId.toString());
            success.createCell(4).setCellValue("SV001");
            success.createCell(5).setCellValue("0909000001");

            Row failed = sheet.createRow(2);
            failed.createCell(0).setCellValue("Tran Thi Loi");
            failed.createCell(1).setCellValue("2004-09-02");
            failed.createCell(2).setCellValue(departmentId.toString());
            failed.createCell(3).setCellValue(cohortId.toString());
            failed.createCell(4).setCellValue("SV001");
            failed.createCell(5).setCellValue("0909000002");

            workbook.write(output);
            return new MockMultipartFile(
                    "file",
                    "students.xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    output.toByteArray());
        }
    }
}
