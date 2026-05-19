Yêu cầu fix:
-font chữ medium 12px hết nha , các mục lớn thì 13px font-semibold
- Giữ nguyên style shadcn/ui chuẩn (không thay đổi component gốc như Button, Table, Sheet, Dialog…)
- Mobile-first: responsive hoàn hảo trên mobile (320px), tablet (768px), desktop (1024px+)
- Sử dụng Tailwind classes: flex, grid, container, max-w-*, overflow-auto, responsive prefixes (sm:, md:, lg:, xl:)
- Sidebar collapsible không overlap content
- DataTable: horizontal scroll khi cần nhưng header + checkbox vẫn cố định, không tràn
- Không thêm thư viện mới, không thay đổi cấu trúc folder
- Giữ Server Component tối đa, chỉ "use client" khi thật sự cần
- Code sạch, comment rõ ràng những thay đổi responsive
- Dark mode phải tương thích hoàn hảo
- shadcn style chuẩn
- Server Component tối đa
- Code sạch, không comment thừa
- Giữ Server Component tối đa
- Không thay đổi component shadcn gốc
- Giữ nguyên cấu trúc folder
- Không thêm thư viện mới
- Code clean, comment rõ ràng
Hãy đưa ra toàn bộ code đã fix của component/file đó.
- Đảm bảo component giữ nguyên design và style gốc của shadcn/ui
- Không thay đổi bất kỳ props, class name, hoặc API component native nào
- Giữ nguyên giao diện gốc (look & feel)
- Chỉ thêm logic responsive bằng Tailwind utilities
- Không thay đổi cấu trúc code, thư viện, hoặc thành phần dựng sẵn
- Response dưới dạng code đã chỉnh sửa của file đó.
- Đảm bảo chart hiển thị trên tất cả màn hình (desktop, tablet, mobile)
- Không dùng position absolute/fixed phá vỡ layout
- Sử dụng flex-grow/shrink, min-w/max-w để chart tự điều chỉnh
- Không hardcode height/width phá vỡ responsive
- Container không được có overflow-hidden gây cắt xén
- Chart phải tự scale phù hợp với không gian có sẵn
- Giữ nguyên design gốc, chỉ chỉnh responsive
- Không thay đổi props, config, hoặc thư viện
- Chỉ dùng Tailwind utilities cho responsive

# 🚀 CÁC PHẦN ĐÃ HOÀN THIỆN (UI MÔN HỌC - COURSES)

Chúng tôi đã hoàn thiện toàn bộ phân hệ **Quản lý Môn học (`/dashboard/admin/courses`)** đáp ứng 100% các tiêu chuẩn Premium UI/UX, Mobile-responsive chuẩn mực (320px - 1024px+), kế thừa nguyên vẹn Shadcn/ui gốc, và tối đa hóa Server Component.

## 📁 1. Các File & Component Đã Xây Dựng/Chỉnh Sửa
*   **Danh sách môn học:** [courses/page.tsx](file:///d:/ems_educations/frontend/src/app/dashboard/admin/courses/page.tsx)
    *   Tích hợp thanh tìm kiếm, bộ lọc khoa đa chọn (Combobox), phân trang và copy mã môn nhanh kèm thông báo Sonner Toast.
*   **Thêm mới môn học:** [courses/create/page.tsx](file:///d:/ems_educations/frontend/src/app/dashboard/admin/courses/create/page.tsx)
    *   Layout 2 cột (Desktop). Tự động tính số giờ tự học (`tự học = tín chỉ * 2`) hiển thị trực quan ở cột bên phải dạng Card Preview.
*   **Chỉnh sửa môn học:** [courses/[id]/edit/page.tsx](file:///d:/ems_educations/frontend/src/app/dashboard/admin/courses/%5Bid%5D/edit/page.tsx)
    *   Tự động khóa các trường cốt lõi nếu môn học đã mở lớp học phần. Hiển thị Banner cảnh báo màu vàng ở đầu trang cực kỳ nổi bật.
*   **Chi tiết môn học:** [courses/[id]/page.tsx](file:///d:/ems_educations/frontend/src/app/dashboard/admin/courses/%5Bid%5D/page.tsx)
    *   Gồm 3 Tabs: *Thông tin chung* (thẻ read-only) | *Lớp học phần* (gọi API danh sách lớp) | *Môn tiên quyết & Song hành* (Dual-list kéo thả gán môn).
*   **Thành phần tái sử dụng (Shared Components):**
    *   [LockedFieldInput.tsx](file:///d:/ems_educations/frontend/src/components/ems/LockedFieldInput.tsx): Input thông minh hiển thị ổ khóa và Tooltip cảnh báo khi bị vô hiệu hóa.
    *   [CreditInput.tsx](file:///d:/ems_educations/frontend/src/components/ems/CreditInput.tsx): Input chọn tín chỉ chuyên biệt.
    *   [DepartmentCombobox.tsx](file:///d:/ems_educations/frontend/src/components/ems/DepartmentCombobox.tsx): Bộ lọc Khoa đa chọn (Multi-select) hiện đại dạng Popover.
    *   [PrerequisiteDualList.tsx](file:///d:/ems_educations/frontend/src/components/ems/PrerequisiteDualList.tsx): Giao diện 2 cột chuyển giao môn học tiên quyết/song hành mượt mà.

## 💎 2. Các Tiêu Chuẩn UI/UX Đã Áp Dụng (Theo cautrucfix.md)
1.  **Typography & Font size:** Căn chỉnh toàn bộ văn bản thường về `text-xs` (12px) hoặc `text-[13px]`, tiêu đề lớn đạt `text-sm font-semibold` (13px font-semibold), tạo cấu trúc phân cấp thông tin rõ nét.
2.  **Shadcn/ui Gốc:** Giữ nguyên vẹn toàn bộ các component nguyên bản từ shadcn/ui như `Table`, `Button`, `Dialog`, `Sheet`... không can thiệp sửa đổi component lõi.
3.  **Hệ Thống Responsive & Flex/Grid:** Sử dụng triệt để `grid-cols-1 md:grid-cols-2`, `overflow-x-auto`, `w-full` và các tiền tố `sm:`, `md:`, `lg:` để giao diện hiển thị xuất sắc từ màn hình điện thoại 320px đến màn hình máy tính lớn.
4.  **Dark Mode Tương Thích:** Sử dụng các màu nền và màu chữ động như `bg-white dark:bg-gray-900` và `text-gray-900 dark:text-white` giúp bảo vệ mắt của người dùng trong môi trường thiếu sáng.

