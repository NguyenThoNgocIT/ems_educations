# PostgreSQL Flyway Migrations

Đặt các migration dành riêng cho PostgreSQL ở thư mục này.

Profile `postgresql` sẽ dùng `classpath:db/migration-postgresql`, còn profile `dev` hiện tại vẫn dùng bộ migration SQL Server ở `classpath:db/migration`.

Lưu ý: các file migration hiện tại đang viết theo cú pháp SQL Server, nên cần chuyển đổi sang cú pháp PostgreSQL trước khi Neon có thể chạy đầy đủ schema.

Set-Location D:\K22-DATN\ems_educations\backend
$env:SPRING_PROFILES_ACTIVE = 'postgresql'
.\mvnw.cmd spring-boot:run
