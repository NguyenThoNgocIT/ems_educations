# API tu dong xep lich va goi y lich bu
- Thêm API gợi ý lịch bù/tăng tiết:POST /api/v1/schedule-adjustments/suggestions cho giảng viên.
POST /api/v1/admin/schedule-adjustments/suggestions cho admin.

Thêm thuật toán generate candidates -> hard filter -> soft scoring trong ScheduleAdjustmentSuggestionServiceImpl.java.
Tự check:giảng viên trùng lịch,
giảng viên có đơn nghỉ,
phòng trùng lịch,
phòng đủ sức chứa,
trạng thái phòng,
lớp học phần trùng lịch,
sinh viên trong lớp có bị trùng học phần khác,
ngày nằm trong học kỳ/lớp học phần,
cảnh báo gần cuối kỳ.

Trả về score, checks, warnings để FE hiển thị rõ vì sao hệ thống gợi ý phương án đó.
Nâng auto schedule trong AutoScheduleService.java: tạo nhiều buổi học thật trong Schedules theo tổng số tiết môn học, không còn chỉ tạo 1 lịch/lớp học phần.
## 1. Tu dong xep lich goc cho lop hoc phan

Endpoint:

```http
POST /api/v1/auto-schedules/generate/{semesterId}
```

Role:

```text
ADMIN, SUPER_ADMIN
```

Nghiep vu:

```text
CourseClasses da duoc mo trong hoc ky
-> TeachingAssignments da gan giang vien phu trach
-> He thong tinh tong so tiet cua Courses
-> Tao nhieu buoi hoc that trong Schedules
-> Moi buoi duoc gan ngay, tiet, phong
```

He thong tu dong kiem tra:

```text
Phong khong trung ngay/tiet.
Giang vien khong trung ngay/tiet.
Lop hoc phan khong trung ngay/tiet.
Giang vien khong co don nghi da duyet trong ngay do.
Phong du suc chua so voi MaxStudent.
Phong khong o trang thai CLOSED/MAINTENANCE/UNAVAILABLE/DISABLED.
Ngay hoc nam trong StartDate/EndDate cua lop hoc phan hoac hoc ky.
```

Du lieu duoc ghi:

```text
Schedules.ScheduleType = FIXED
Schedules.ScheduleStatus = PLANNED
Schedules.Status = AUTO_GENERATED
```

## 2. Goi y lich bu/tang tiet/doi lich

Endpoint giang vien:

```http
POST /api/v1/schedule-adjustments/suggestions
```

Role:

```text
LECTURER
```

Endpoint admin:

```http
POST /api/v1/admin/schedule-adjustments/suggestions
```

Role:

```text
ADMIN, SUPER_ADMIN
```

Request mau:

```json
{
  "courseClassId": "00000000-0000-0000-0000-000000000000",
  "originalScheduleId": "00000000-0000-0000-0000-000000000000",
  "requestedByInstructorId": "00000000-0000-0000-0000-000000000000",
  "requestType": "ABSENT_MAKEUP",
  "absentDate": "2026-12-14",
  "absentTimeSlotId": "00000000-0000-0000-0000-000000000000",
  "absentPeriods": 3,
  "proposedPeriods": 3,
  "fromDate": "2026-12-15",
  "toDate": "2026-12-31",
  "preferredDayOfWeeks": [5, 7],
  "preferredTimeSlotIds": [
    "00000000-0000-0000-0000-000000000000"
  ],
  "preferredRoomId": null,
  "preferredBuildingId": null,
  "preferSameRoom": true,
  "maxSuggestions": 10
}
```

Ghi chu:

```text
requestedByInstructorId chi bat buoc voi API admin.
Voi API giang vien, backend tu lay giang vien hien tai tu JWT.
requestType gom: ABSENT_MAKEUP, EXTRA_SESSION, RESCHEDULE, ROOM_CHANGE.
preferredDayOfWeeks dung quy uoc: 1 = Chu nhat, 2 = Thu 2, ..., 7 = Thu 7.
```

Response mau:

```json
{
  "success": true,
  "message": "Goi y lich dieu chinh thanh cong",
  "data": {
    "courseClassId": "00000000-0000-0000-0000-000000000000",
    "instructorId": "00000000-0000-0000-0000-000000000000",
    "requestType": "ABSENT_MAKEUP",
    "fromDate": "2026-12-15",
    "toDate": "2026-12-31",
    "proposedPeriods": 3,
    "totalCandidates": 120,
    "validCandidates": 8,
    "suggestions": [
      {
        "date": "2026-12-19",
        "dayOfWeek": 7,
        "dayLabel": "Thu 7",
        "timeSlotId": "00000000-0000-0000-0000-000000000000",
        "slotCode": "T7_9",
        "timeSlotLabel": "T7_9 (13:00-15:15)",
        "roomId": "00000000-0000-0000-0000-000000000000",
        "roomCode": "A201",
        "roomName": "Phong A201",
        "buildingName": "Toa A",
        "floorNumber": 2,
        "capacity": 80,
        "proposedPeriods": 3,
        "score": 92,
        "checks": [
          {
            "rule": "R3_INSTRUCTOR_BUSY",
            "status": "OK",
            "message": "Giang vien ranh o ngay/tiet nay"
          },
          {
            "rule": "R5_ROOM_BUSY",
            "status": "OK",
            "message": "Phong con trong"
          }
        ],
        "warnings": [
          "Ngay de xuat gan cuoi hoc ky, nen thong bao som cho sinh vien"
        ]
      }
    ]
  }
}
```

## 3. Cach FE hien thi

FE nen hien thi danh sach goi y theo thu tu `score` giam dan.

Moi goi y nen co:

```text
Ngay hoc bu
Thu
Tiet/khung gio
Phong - toa - tang
Diem goi y
Danh sach check OK
Canh bao WARN neu co
Nut "Chon phuong an nay"
```

Sau khi giang vien chon phuong an, FE dung ngay/tiet/phong do de submit:

```http
POST /api/v1/schedule-adjustments
```

Admin duyet:

```http
POST /api/v1/admin/schedule-adjustments/{requestId}/approve
```

Khi duyet, backend tao `TeachingSessionOverrides`, khong sua truc tiep `Schedules` goc.
