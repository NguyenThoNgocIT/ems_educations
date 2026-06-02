# CHƯƠNG 4. KẾT QUẢ ĐẠT ĐƯỢC VÀ HƯỚNG PHÁT TRIỂN

## 4.1. Kết quả đạt được của phần mềm

Sau quá trình phân tích, thiết kế và xây dựng, hệ thống quản lý đào tạo đại học đã triển khai được nhiều chức năng cốt lõi, đáp ứng các nghiệp vụ chính trong công tác quản lý đào tạo.

Về mặt kiến trúc, hệ thống được xây dựng theo mô hình web application với backend Spring Boot, frontend Next.js và cơ sở dữ liệu PostgreSQL. Backend được tổ chức theo hướng module nghiệp vụ, sử dụng RESTful API, DTO, MapStruct, Spring Security, JWT và Flyway migration để đảm bảo khả năng mở rộng, bảo trì và quản lý thay đổi cơ sở dữ liệu.

| Nhóm chức năng | Kết quả đạt được |
|---|---|
| Xác thực và phân quyền | Đăng nhập, đổi mật khẩu, đăng nhập lần đầu, quên mật khẩu, quản lý user, role, permission, menu theo RBAC |
| Quản lý người dùng | Tạo và quản lý sinh viên, giảng viên, nhân viên; tự sinh tài khoản, email nội bộ, mật khẩu mặc định và vai trò |
| Quản lý tổ chức nhân sự | Quản lý phòng ban, chức vụ, học vị/trình độ, hợp đồng và lịch nghỉ |
| Cấu hình đào tạo | Quản lý khoa, ngành, chuyên ngành, niên khóa, năm học, học kỳ |
| Vòng đời sinh viên | Gán sinh viên vào lớp hành chính theo học kỳ, quản lý trạng thái sinh viên, lịch sử trạng thái, lịch sử chuyên ngành |
| Chương trình đào tạo | Quản lý môn học, chương trình đào tạo, môn trong chương trình, môn tiên quyết, môn tương đương |
| Lớp học phần | Mở lớp học phần theo học kỳ, quản lý sĩ số và danh sách sinh viên |
| Đăng ký học lại/cải thiện | Sinh viên đăng ký học lại hoặc học cải thiện dựa trên kết quả điểm và đợt đăng ký |
| Quản lý điểm | Cấu hình thành phần điểm, nhập điểm, tổng kết điểm học phần |
| Phân công giảng dạy | Gán giảng viên phụ trách lớp học phần |
| Quản lý lịch học | Tạo lịch học, phòng học, tiết học; kiểm tra trùng giảng viên, phòng và lớp |
| Điều chỉnh lịch | Giảng viên gửi yêu cầu nghỉ/bù/tăng tiết, admin duyệt và tạo lịch override |
| Theo dõi tiến độ giảng dạy | Theo dõi số tiết học phần, số tiết đã dạy và số tiết còn lại |
| Cơ sở vật chất | Quản lý tòa nhà, tầng, phòng học và khung tiết học |

Hệ thống cũng đã có một số kiểm thử tự động cho các workflow quan trọng như tạo tài khoản đối tượng, đăng ký học lại/học cải thiện và xử lý điều chỉnh lịch.

## 4.2. Kết quả chưa đạt được

Do phạm vi hệ thống lớn, một số chức năng vẫn chưa hoàn thiện đầy đủ. Một số nhóm nghiệp vụ đã có định hướng hoặc thiết kế trong cơ sở dữ liệu nhưng chưa triển khai thành chức năng hoàn chỉnh trên backend và frontend.

| Nhóm chức năng | Tình trạng hiện tại |
|---|---|
| IX. Nhóm học phí - tài chính | Đã có định hướng thiết kế dữ liệu nhưng chưa triển khai đầy đủ nghiệp vụ thu học phí, công nợ, miễn giảm, thanh toán |
| X. Nhóm quản lý thi - khảo thí | Chưa triển khai đầy đủ quản lý kỳ thi, phòng thi, lịch thi, danh sách dự thi, kết quả thi |
| XI. Nhóm quản lý tốt nghiệp | Chưa triển khai xét điều kiện tốt nghiệp, hồ sơ tốt nghiệp, quyết định công nhận tốt nghiệp |
| XII. Nhóm thông báo - hệ thống | Chưa triển khai đầy đủ thông báo nội bộ, thông báo theo vai trò, cấu hình hệ thống và nhật ký hệ thống |

Một số hạn chế khác:

- Thuật toán gợi ý lịch bù/phòng học tối ưu trong module lịch chưa hoàn thiện. Hiện hệ thống mới kiểm tra xung đột và trả trạng thái khả dụng của slot/phòng để frontend hiển thị.
- Auto schedule bằng Timefold mới ở mức nền tảng, chưa hoàn thiện đầy đủ ràng buộc thực tế như ưu tiên giảng viên, loại phòng, số tiết liên tục, ngày tránh dạy, cân bằng tải.
- Một số màn hình frontend có thể chưa hoàn thiện đầy đủ so với toàn bộ API backend.
- Chưa tích hợp đầy đủ với các hệ thống ngoài như cổng thanh toán, email production, hệ thống khảo thí hoặc cổng thông tin sinh viên.
- Chưa triển khai đầy đủ các báo cáo thống kê tổng hợp phục vụ ban giám hiệu và phòng đào tạo.

## 4.3. Hướng phát triển phần mềm

Trong thời gian tới, hệ thống có thể tiếp tục phát triển theo các hướng sau:

- Hoàn thiện nhóm học phí - tài chính: tính học phí theo tín chỉ, công nợ, miễn giảm, học bổng, phiếu thu, lịch sử thanh toán và tích hợp cổng thanh toán.
- Triển khai nhóm quản lý thi - khảo thí: tạo kỳ thi, lịch thi, phòng thi, danh sách dự thi, phân công coi thi và xử lý kết quả thi.
- Phát triển nhóm quản lý tốt nghiệp: xét điều kiện tốt nghiệp theo tín chỉ, điểm trung bình, nghĩa vụ học phí và quyết định công nhận tốt nghiệp.
- Hoàn thiện nhóm thông báo - hệ thống: thông báo theo vai trò, theo lớp, theo học phần, thông báo lịch học, lịch thi, học phí và nhật ký hệ thống.
- Nâng cấp module lịch: xây dựng thuật toán gợi ý lịch bù/phòng học tối ưu, có chấm điểm lựa chọn theo sức chứa, tòa nhà, khoảng cách thời gian, tải giảng viên và mức độ gần ngày thi.
- Mở rộng báo cáo thống kê: thống kê sinh viên, lớp học phần, tiến độ giảng dạy, kết quả học tập, tỷ lệ học lại và tình hình phân công giảng dạy.
- Bổ sung kiểm thử tự động cho các workflow lớn, triển khai CI/CD, logging và monitoring phục vụ vận hành thực tế.
- Tối ưu giao diện người dùng theo hướng nhập liệu nhanh, lọc dữ liệu thuận tiện, cảnh báo lỗi rõ ràng và hỗ trợ nhiều kích thước màn hình.

## 4.4. Kết luận

Đề tài đã xây dựng được hệ thống quản lý đào tạo đại học với các chức năng nền tảng và nhiều nghiệp vụ quan trọng như quản lý tài khoản, phân quyền, hồ sơ sinh viên - giảng viên - nhân viên, cấu hình đào tạo, chương trình đào tạo, lớp học phần, điểm, đăng ký học lại/cải thiện, phân công giảng dạy và quản lý lịch học.

Hệ thống được thiết kế theo hướng module hóa, có cơ sở dữ liệu quan hệ rõ ràng, hỗ trợ phân quyền theo vai trò và có khả năng mở rộng cho các nghiệp vụ tiếp theo. Tuy nhiên, do phạm vi đề tài lớn, một số nhóm chức năng như học phí - tài chính, quản lý thi - khảo thí, quản lý tốt nghiệp, thông báo - hệ thống và thuật toán gợi ý lịch tối ưu chưa được triển khai hoàn chỉnh.

Trong tương lai, nếu tiếp tục phát triển các module còn thiếu và hoàn thiện giao diện, kiểm thử, thuật toán gợi ý lịch, báo cáo thống kê, hệ thống có thể trở thành một nền tảng hỗ trợ toàn diện cho công tác quản lý đào tạo trong trường đại học.

