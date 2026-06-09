package com.quanlydaotao.backend.student.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentImportResponse;
import com.quanlydaotao.backend.student.dto.StudentImportRowResultResponse;
import com.quanlydaotao.backend.student.service.StudentImportService;
import com.quanlydaotao.backend.utils.StringUtil;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentImportServiceImpl implements StudentImportService {
    private static final List<DateTimeFormatter> DATE_FORMATTERS = List.of(
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy")
    );

    private final AccountServiceImpl accountService;

    @Override
    public StudentImportResponse importStudentsFromExcel(MultipartFile file) {
        validateFile(file);
        List<StudentImportRowResultResponse> results = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null || sheet.getPhysicalNumberOfRows() < 2) {
                throw new BusinessException("File Excel phai co dong tieu de va it nhat mot dong du lieu");
            }
            DataFormatter formatter = new DataFormatter(Locale.ROOT);
            Map<String, Integer> headers = readHeaders(sheet.getRow(0), formatter);
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (isBlankRow(row, formatter)) {
                    continue;
                }
                results.add(importRow(row, headers, formatter));
            }
        } catch (IOException ex) {
            throw new BusinessException("Khong the doc file Excel: " + ex.getMessage());
        }

        long successCount = results.stream().filter(result -> Boolean.TRUE.equals(result.getSuccess())).count();
        return StudentImportResponse.builder()
                .totalRows(results.size())
                .successCount((int) successCount)
                .failureCount(results.size() - (int) successCount)
                .rows(results)
                .build();
    }

    private StudentImportRowResultResponse importRow(Row row, Map<String, Integer> headers, DataFormatter formatter) {
        int rowNumber = row.getRowNum() + 1;
        String fullName = text(row, headers, formatter, "fullName", "hoten");
        String studentCode = text(row, headers, formatter, "studentCode", "masinhvien", "mssv");
        try {
            StudentAdminCreateRequest request = toCreateRequest(row, headers, formatter);
            AccountCreationResponse account = accountService.createStudentAccount(request);
            return StudentImportRowResultResponse.builder()
                    .rowNumber(rowNumber)
                    .success(true)
                    .fullName(request.getFullName())
                    .studentCode(account.getStudentCode())
                    .username(account.getUsername())
                    .emailEdu(account.getEmailEdu())
                    .message("Import sinh vien thanh cong")
                    .account(account)
                    .build();
        } catch (RuntimeException ex) {
            return StudentImportRowResultResponse.builder()
                    .rowNumber(rowNumber)
                    .success(false)
                    .fullName(fullName)
                    .studentCode(studentCode)
                    .message(ex.getMessage())
                    .build();
        }
    }

    private StudentAdminCreateRequest toCreateRequest(Row row, Map<String, Integer> headers, DataFormatter formatter) {
        StudentAdminCreateRequest request = new StudentAdminCreateRequest();
        request.setFullName(requiredText(row, headers, formatter, "fullName", "hoten"));
        request.setFullNameNoAccent(text(row, headers, formatter, "fullNameNoAccent", "tenkhongdau"));
        request.setDateOfBirth(requiredDate(row, headers, formatter, "dateOfBirth", "ngaysinh"));
        request.setGender(text(row, headers, formatter, "gender", "gioitinh"));
        request.setPlaceOfBirth(text(row, headers, formatter, "placeOfBirth", "noisinh"));
        request.setEthnicity(text(row, headers, formatter, "ethnicity", "dantoc"));
        request.setPersonalIdentificationNumber(text(row, headers, formatter, "personalIdentificationNumber", "cccd", "cmnd"));
        request.setDateOfIssue(date(row, headers, formatter, "dateOfIssue", "ngaycap"));
        request.setCardPlace(text(row, headers, formatter, "cardPlace", "noicap"));
        request.setNationality(text(row, headers, formatter, "nationality", "quoctich"));
        request.setContactEmail(text(row, headers, formatter, "contactEmail", "emailcanhan"));
        request.setPhoneNumber(text(row, headers, formatter, "phoneNumber", "sodienthoai", "sdt"));
        request.setPermanentAddress(text(row, headers, formatter, "permanentAddress", "diachithuongtru"));
        request.setTemporaryAddress(text(row, headers, formatter, "temporaryAddress", "diachitamtru"));
        request.setAvatarUrl(text(row, headers, formatter, "avatarUrl", "avatar"));
        request.setNote(text(row, headers, formatter, "note", "ghichu"));
        request.setStudentCode(text(row, headers, formatter, "studentCode", "masinhvien", "mssv"));
        request.setDepartmentId(requiredUuid(row, headers, formatter, "departmentId", "khoaId"));
        request.setMajorId(uuid(row, headers, formatter, "majorId", "nganhId"));
        request.setSpecializationId(uuid(row, headers, formatter, "specializationId", "chuyennganhId"));
        request.setTrainingProgramId(uuid(row, headers, formatter, "trainingProgramId", "chuongtrinhdaotaoId"));
        request.setAcademicCohortId(requiredUuid(row, headers, formatter, "academicCohortId", "khoahocId", "nienkhoaId"));
        request.setClassId(uuid(row, headers, formatter, "classId", "lopId"));
        request.setSemesterId(uuid(row, headers, formatter, "semesterId", "hockyId"));
        request.setAdmissionDate(date(row, headers, formatter, "admissionDate", "ngaynhaphoc"));
        request.setStudentStatusId(uuid(row, headers, formatter, "studentStatusId", "trangthaisinhvienId"));
        request.setStudentStatusStartDate(date(row, headers, formatter, "studentStatusStartDate", "ngaybatdautrangthai"));
        request.setStudentStatusReason(text(row, headers, formatter, "studentStatusReason", "lydotrangthai"));
        return request;
    }

    private Map<String, Integer> readHeaders(Row headerRow, DataFormatter formatter) {
        if (headerRow == null) {
            throw new BusinessException("Dong tieu de khong duoc de trong");
        }
        Map<String, Integer> headers = new HashMap<>();
        for (Cell cell : headerRow) {
            String header = normalizeHeader(formatter.formatCellValue(cell));
            if (StringUtils.hasText(header)) {
                headers.put(header, cell.getColumnIndex());
            }
        }
        return headers;
    }

    private boolean isBlankRow(Row row, DataFormatter formatter) {
        if (row == null) {
            return true;
        }
        for (Cell cell : row) {
            if (StringUtils.hasText(formatter.formatCellValue(cell))) {
                return false;
            }
        }
        return true;
    }

    private String requiredText(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        String value = text(row, headers, formatter, aliases);
        if (!StringUtils.hasText(value)) {
            throw new BusinessException("Thieu cot bat buoc: " + aliases[0]);
        }
        return value;
    }

    private String text(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        Cell cell = cell(row, headers, aliases);
        if (cell == null) {
            return null;
        }
        String value = formatter.formatCellValue(cell);
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private UUID requiredUuid(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        UUID value = uuid(row, headers, formatter, aliases);
        if (value == null) {
            throw new BusinessException("Thieu cot bat buoc: " + aliases[0]);
        }
        return value;
    }

    private UUID uuid(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        String value = text(row, headers, formatter, aliases);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return UUID.fromString(value.trim());
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Gia tri UUID khong hop le cho cot " + aliases[0] + ": " + value);
        }
    }

    private LocalDate requiredDate(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        LocalDate value = date(row, headers, formatter, aliases);
        if (value == null) {
            throw new BusinessException("Thieu cot bat buoc: " + aliases[0]);
        }
        return value;
    }

    private LocalDate date(Row row, Map<String, Integer> headers, DataFormatter formatter, String... aliases) {
        Cell cell = cell(row, headers, aliases);
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        String value = formatter.formatCellValue(cell);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        for (DateTimeFormatter dateFormatter : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(value.trim(), dateFormatter);
            } catch (DateTimeParseException ignored) {
                // Try the next supported format.
            }
        }
        throw new BusinessException("Gia tri ngay khong hop le cho cot " + aliases[0] + ": " + value);
    }

    private Cell cell(Row row, Map<String, Integer> headers, String... aliases) {
        for (String alias : aliases) {
            Integer index = headers.get(normalizeHeader(alias));
            if (index != null) {
                return row.getCell(index);
            }
        }
        return null;
    }

    private String normalizeHeader(String value) {
        return StringUtil.normalizeForAccountCode(value);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File Excel khong duoc de trong");
        }
        String filename = file.getOriginalFilename();
        if (!StringUtils.hasText(filename)) {
            return;
        }
        String lower = filename.toLowerCase(Locale.ROOT);
        if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls")) {
            throw new BusinessException("Chi ho tro file Excel .xlsx hoac .xls");
        }
    }
}
