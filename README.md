# MeeSeva: Full-Stack Citizen Services Portal (Enterprise Monorepo)

An enterprise-grade, full-stack citizen e-governance platform architected as a high-performance **pnpm + Turborepo Monorepo**. Delivers government schemes, digital document locker verification, 4-step e-filing, real-time application tracking, and multilingual vernacular speech assistance.

Engineered strictly following **Clean Architecture** and **S.O.L.I.D. Principles** across all workspace packages to ensure a resilient, decoupled, and scalable Software Development Life Cycle (SDLC).

---

## 🏗️ Monorepo Architecture

```
meeseva/
├── packages/
│   ├── shared/                # @meeseva/shared: Domain types, DTOs, Zod schemas, constants
│   ├── typescript-config/     # @meeseva/typescript-config: Base, Node, and React tsconfigs
│   └── eslint-config/         # @meeseva/eslint-config: Shared linting configurations
├── Meeseva-lite-backend/      # @meeseva/backend: Express 5 + Node + TypeScript + Mongoose
├── Meeseva-lite-frontend/     # @meeseva/frontend: React 19 + TypeScript + Vite + Tailwind CSS
├── scripts/
│   └── dev.mjs                # Monorepo development orchestrator
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated GitHub Actions CI/CD Pipeline
├── Dockerfile.backend         # Production multi-stage Docker container for Backend
├── Dockerfile.frontend        # Production multi-stage Docker container with Nginx SPA reverse proxy
├── docker-compose.yml         # Fullstack orchestration (MongoDB + Backend + Frontend)
├── pnpm-workspace.yaml        # Workspace configuration
└── turbo.json                 # Turborepo task pipelines & cache orchestration
```

---

## 🏛️ S.O.L.I.D. Principles in Code

1. **S - Single Responsibility Principle (SRP):**
   - Controllers handle HTTP transport and validation translation.
   - Domain services encapsulate pure business use cases.
   - Repositories isolate data persistence.
   - Providers handle external side-effects (SMS dispatches, Email, Storage, Speech AI).
2. **O - Open/Closed Principle (OCP):**
   - Infrastructure providers (`ISmsProvider`, `IEmailProvider`, `IStorageProvider`, `ISpeechRecognitionProvider`) allow registering new third-party cloud services without touching business code.
3. **L - Liskov Substitution Principle (LSP):**
   - `MockSmsProvider` and `TwilioSmsProvider` conform identically to `ISmsProvider`.
   - `MockSpeechProvider` seamlessly substitutes `GoogleSpeechProvider` when GCP credentials are not supplied.
4. **I - Interface Segregation Principle (ISP):**
   - Granular, decoupled domain interfaces (`IUserRepository`, `IOtpRepository`, `IApplicationRepository`, `ITrackingRepository`, `IDocumentRepository`, `IServiceRepository`).
5. **D - Dependency Inversion Principle (DIP):**
   - High-level domain services depend exclusively on abstractions (`src/domain/interfaces/`).
   - Wiring and dependency injection occur at the Composition Root (`container.ts`).
   - `@meeseva/shared` provides a single source of truth for contracts shared across backend and frontend.

---

## 🚀 Fullstack Features

- **Official Services Directory:** Categorized citizen services with eligibility criteria, required documents, fee structures, SLA timelines, ratings, and instant search with regex fallback.
- **Dynamic 4-Step Application Filing:** Multi-step wizard supporting citizen particulars, service-specific inputs, digital document attachments, and self-declaration.
- **Real-Time Audit Tracker:** Public and authenticated status tracking by Application ID with a 4-stage visual progress stepper and complete officer timestamped remarks.
- **Encrypted Document Vault:** Citizen document locker for uploading, previewing, and verifying Aadhaar, PAN, certificates, and licenses.
- **Multilingual Vernacular Speech Assistant:** Built-in speech-to-text supporting Telugu, Hindi, Tamil, and English.
- **Officer Review Console:** Official backoffice portal to review pending queues, inspect payloads, and issue approval/rejection orders.
- **Two-Step OTP Authentication:** Mobile-first authentication with phone verification and password recovery.

---

## 🛠️ Tech Stack & Workspace Tooling

- **Workspace Manager:** [pnpm Workspaces](https://pnpm.io/workspaces) (v10) with single root lockfile.
- **Build System:** [Turborepo](https://turbo.build) (v2) with intelligent task dependency graph and artifact caching.
- **Backend:** Node.js (>=20), Express 5, TypeScript 5, Mongoose 9, MongoDB 8, JWT, Zod, Vitest.
- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS, Lucide Icons, Sonner.
- **Containerization:** Docker Multi-stage builds, Nginx reverse proxy, Docker Compose.
- **CI/CD:** GitHub Actions workflow validating lint, typecheck, builds, and unit/integration tests.

---

## 💻 Quick Start & Commands

### Prerequisites
- Node.js >= 20
- pnpm >= 10 (`npm install -g pnpm`)
- Local MongoDB running on `mongodb://127.0.0.1:27017` (or Docker)

### 1. Install All Dependencies
```bash
pnpm install
```

### 2. Environment Setup
```bash
cp Meeseva-lite-backend/.env.example Meeseva-lite-backend/.env
```

### 3. Seed Government Services Catalog
Populate MongoDB with 12 curated citizen services:
```bash
pnpm seed
```

### 4. Run Development Servers
Start backend (`5001`) and frontend (`3000`) in parallel:
```bash
pnpm dev
# or with orchestrated colored logs:
pnpm dev:orchestrated
```
- **Frontend Portal:** `http://localhost:3000`
- **Backend API:** `http://localhost:5001/api/v1`
- **Health Check:** `http://localhost:5001/health`

---

## ⚡ Monorepo CLI Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Run all workspace applications concurrently with Turborepo |
| `pnpm build` | Build all packages (`@meeseva/shared`, backend, frontend) with caching |
| `pnpm test` | Run Vitest unit and integration test suites |
| `pnpm lint` | Lint all packages across the monorepo |
| `pnpm typecheck` | Run TypeScript typechecking across all packages |
| `pnpm seed` | Seed database with government citizen services |
| `pnpm docker:up` | Launch full stack in Docker (MongoDB + Backend + Frontend/Nginx) |
| `pnpm docker:down` | Stop and remove Docker containers |
| `pnpm clean` | Clean build artifacts and Turbo cache |

---

## 🐳 Docker Deployment

To run the entire fullstack platform in isolated Docker containers:

```bash
pnpm docker:up
```

This starts:
1. `meeseva-mongodb`: MongoDB 7.0 database with persistent volume.
2. `meeseva-backend`: Node.js Express API on port `5001`.
3. `meeseva-frontend`: Production Vite build served with Nginx on port `3000` with reverse-proxying for `/api/` and `/uploads/`.
