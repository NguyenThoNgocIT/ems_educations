# API import sinh vien bang Excel

## Endpoint

```http
POST /api/v1/students/admin/import-excel
Content-Type: multipart/form-data
```

Role:

```text
ADMIN, SUPER_ADMIN
```

Form-data:

```text
file: students.xlsx
```

## Nghiep vu

Moi dong Excel duoc xu ly nhu workflow tao sinh vien tung nguoi:

```text
Tao Person
-> Tao Student
-> Gan StudentClass neu co classId + semesterId
-> Gan trang thai sinh vien neu co studentStatusId
-> Generate username/password/email edu
-> Tao User
-> Gan role STUDENT
```

Import xu ly tung dong doc lap:

```text
Dong hop le: tao sinh vien va tai khoan thanh cong.
Dong loi: rollback dong do, ghi message loi, cac dong khac tiep tuc import.
```

## Cot Excel ho tro

Dong dau tien la header. Header co the dung ten camelCase hoac ten tieng Viet khong dau.

Cot bat buoc:

```text
fullName / hoTen
dateOfBirth / ngaySinh
departmentId / khoaId
academicCohortId / khoahocId / nienkhoaId
```

Cot tuy chon:

```text
fullNameNoAccent / tenKhongDau
gender / gioiTinh
placeOfBirth / noiSinh
ethnicity / danToc
personalIdentificationNumber / cccd / cmnd
dateOfIssue / ngayCap
cardPlace / noiCap
nationality / quocTich
contactEmail / emailCaNhan
phoneNumber / soDienThoai / sdt
permanentAddress / diaChiThuongTru
temporaryAddress / diaChiTamTru
avatarUrl / avatar
note / ghiChu
studentCode / maSinhVien / mssv
majorId / nganhId
specializationId / chuyenNganhId
trainingProgramId / chuongTrinhDaoTaoId
classId / lopId
semesterId / hocKyId
admissionDate / ngayNhapHoc
studentStatusId / trangThaiSinhVienId
studentStatusStartDate / ngayBatDauTrangThai
studentStatusReason / lyDoTrangThai
```

## Dinh dang ngay

Ho tro:

```text
yyyy-MM-dd
dd/MM/yyyy
dd-MM-yyyy
MM/dd/yyyy
Excel Date cell
```

## Response

```json
{
  "success": true,
  "message": "Import sinh vien bang Excel hoan tat",
  "data": {
    "totalRows": 2,
    "successCount": 1,
    "failureCount": 1,
    "rows": [
      {
        "rowNumber": 2,
        "success": true,
        "fullName": "Nguyen Van An",
        "studentCode": "SV001",
        "username": "sv001",
        "emailEdu": "ansv001@donga.edu.vn",
        "message": "Import sinh vien thanh cong"
      },
      {
        "rowNumber": 3,
        "success": false,
        "fullName": "Tran Thi Loi",
        "studentCode": "SV001",
        "message": "Ma sinh vien da ton tai"
      }
    ]
  }
}
```
