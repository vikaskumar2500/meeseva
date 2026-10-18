# MeeSeva

A digital citizen services portal for government scheme applications, certificate issuance, application tracking, and digital document verification with multilingual voice search.

Built as a TypeScript monorepo with an Express REST API backend and a React + Vite frontend.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Sonner
- **Backend:** Node.js, Express 5, TypeScript, Mongoose, MongoDB, Zod, Vitest
- **Monorepo:** pnpm workspaces, Turborepo
- **DevOps:** Docker, Docker Compose, Nginx, GitHub Actions

## Project Structure

```
.
├── packages/
│   ├── shared/             # Shared types, DTOs, Zod schemas, constants (@meeseva/shared)
│   ├── typescript-config/  # Shared tsconfigs
│   └── eslint-config/      # Shared ESLint rules
├── Meeseva-lite-backend/   # Express API backend (@meeseva/backend)
├── Meeseva-lite-frontend/  # React frontend (@meeseva/frontend)
├── docker-compose.yml      # Local multi-container setup (MongoDB + Backend + Frontend)
├── pnpm-workspace.yaml     # Workspace configuration
└── turbo.json              # Turborepo task pipeline
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10 (`npm install -g pnpm`)
- MongoDB running locally on port 27017 (or use Docker)

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment configuration:**
   ```bash
   cp Meeseva-lite-backend/.env.example Meeseva-lite-backend/.env
   ```

3. **Seed the database:**
   Populates MongoDB with initial government service categories and services:
   ```bash
   pnpm seed
   ```

4. **Start the development servers:**
   ```bash
   pnpm dev
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5001/api/v1](http://localhost:5001/api/v1)
   - Health check: [http://localhost:5001/health](http://localhost:5001/health)

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start backend and frontend in development mode |
| `pnpm build` | Build all workspace packages |
| `pnpm test` | Run test suites (Vitest) |
| `pnpm lint` | Run ESLint and type checks across all packages |
| `pnpm typecheck` | Run TypeScript type checks (`tsc --noEmit`) |
| `pnpm seed` | Seed service catalog in MongoDB |
| `pnpm docker:up` | Run full stack with Docker Compose |
| `pnpm docker:down` | Stop Docker containers |
| `pnpm clean` | Clean build outputs and Turbo cache |

## Running with Docker

To run the entire application (MongoDB, Backend, and Frontend) in Docker:

```bash
docker compose up --build -d
```

- Web UI: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001](http://localhost:5001)

To view logs or stop:
```bash
docker compose logs -f
docker compose down
```

## Architecture Notes

- **Separation of Concerns:** Business logic lives in domain services (`src/modules/*/*.service.ts`), decoupled from Express controllers and Mongoose repositories.
- **Shared Contracts:** All DTOs, API contracts, enums, and Zod validation schemas are maintained in `packages/shared` (`@meeseva/shared`) and consumed by both backend and frontend.
- **Provider Abstractions:** Notifications (SMS/Email), Object Storage, and Speech Recognition use provider interfaces with mock implementations for local offline development.
