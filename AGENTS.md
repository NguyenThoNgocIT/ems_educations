# Coding Agents in UEMS

Welcome to the UEMS (University Education Management System) project. This project is a full-stack application with a Java/Spring Boot backend and a Next.js frontend.

## 🛠 Tech Stack
- **Backend**: Java 17, Spring Boot 3.3.5, MS SQL Server, Flyway, MapStruct, Lombok.
- **Frontend**: Next.js (App Router), pnpm, Tailwind CSS, Cloudflare Workers.

## 📋 Core Rules (Summary)
Detailed rules are in [.cursorrules](.cursorrules). Below are the essentials:
- **UUIDs**: All primary keys must be UUIDs.
- **Soft Delete**: Entities must inherit from `SoftDeleteEntity`.
- **Database**: No `ddl-auto: update/create`. Use Flyway migrations in `backend/src/main/resources/db/migration/`.
- **API Responses**: Always wrap in `ApiResponse<T>`.
- **Documentation**: Use Swagger/OpenAPI annotations (`@Tag`, `@Operation`) in Vietnamese.

## 🚀 Commands
### Backend
- **Build**: `.\mvnw.cmd compile` (Mandatory after edits)
- **Run**: `.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"`
- **Repair DB**: `.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev" "-Dspring.flyway.repair-on-migrate=true"`

### Frontend
- **Install**: `pnpm install`
- **Dev**: `pnpm dev`
- **Build**: `pnpm build`

## 🛡️ Terminal & Task Confirmation
The setting `github.copilot.chat.terminal.untilConfirmation` is active. This means agents should follow this flow:
1. **Prepare**: Determine the necessary terminal commands.
2. **Execute & Wait**: Run commands (like `.\mvnw.cmd compile`) and WAIT for completion/output.
3. **Verify**: Do not report success until the command output confirms it (e.g., "BUILD SUCCESS").
4. **Iterate**: If a command fails (e.g., build error), analyze the output, fix the code, and retry automatically before asking the user.

## 📚 Documentation
- [API & Frontend Guide](backend/docs/2025010_api-frontend-guide.md)
- [Project Structure](backend/docs/cautruc.md)
- [Database Schema (Design)](backend/src/main/resources/db/migration)
