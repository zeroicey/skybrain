# Project: SkyBrain(天枢)

Drone management system

## Tech Stack
- Frontend: React, Typescript, Tailwindcss, Shadcn, Zustand, Tanstack-Query.
- Backend: Nestjs, jest, prisma
- Database: PostgreSQL, Minio
- Other: Docker

## Command
### Backend
pnpm start
pnpm start:dev
pnpm build

### Frontend
bun run dev
bun run build

## Architecture
apps/web/               # Frontend
apps/api/               # Backend

## Import Notes
- Backend must use pnpm(not npm)
- Frontend must use bun(not npm)
