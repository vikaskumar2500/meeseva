# MeeSeva: Integrated Citizen Services Portal (Enterprise Rebuild)

An enterprise-grade, full-stack citizen services platform designed to deliver government schemes, certificates, digital document locker verification, and real-time application tracking with vernacular multilingual speech assistance.

Engineered strictly following **Clean Architecture** and **S.O.L.I.D. Principles** to ensure an extensible, decoupled, and testable Software Development Life Cycle (SDLC).

---

## 🏛️ Architectural Overview & S.O.L.I.D Implementation

The project follows a **Hexagonal / Clean Layered Architecture**:

```
Presentation (Express REST Controllers & React 19 Frontend)
       │
Application (Use Cases / Domain Services: AuthService, ApplicationService, DocumentService...)
       │
Domain Abstractions (IUserRepository, IApplicationRepository, ISmsProvider, IStorageProvider...)
       │
Infrastructure (Mongoose Models, Twilio / Mock SMS, SendGrid / Mock Email, Disk Storage)
       │
Composition Root (src/container.ts - Dependency Injection)
```

### S.O.L.I.D. Principles in Code:
1. **S - Single Responsibility Principle (SRP):**
   - Controllers handle HTTP routing, serialization, and error translation.
   - Services contain pure business domain logic.
   - Repositories encapsulate database access.
   - Providers handle external side-effects (SMS dispatches, Email, Object Storage, Speech AI).
2. **O - Open/Closed Principle (OCP):**
   - Notification and storage systems are open for extension via provider interfaces (`ISmsProvider`, `IEmailProvider`, `IStorageProvider`, `ISpeechRecognitionProvider`).
   - New notification vendors (AWS SNS, Firebase, SendGrid, Twilio) can be registered without editing service code.
3. **L - Liskov Substitution Principle (LSP):**
   - `MockSmsProvider` and `TwilioSmsProvider` conform identically to `ISmsProvider`.
   - `MockSpeechProvider` seamlessly substitutes `GoogleSpeechProvider` when cloud credentials are not supplied.
4. **I - Interface Segregation Principle (ISP):**
   - Focused, granular domain interfaces (`IUserRepository`, `IOtpRepository`, `IApplicationRepository`, `ITrackingRepository`, `IDocumentRepository`, `IServiceRepository`).
5. **D - Dependency Inversion Principle (DIP):**
   - High-level use-case services depend solely on domain interfaces rather than concrete Mongoose models or external SDKs.
   - All wiring is performed at the Composition Root (`container.ts`).

---

## 🚀 Key Functional Capabilities

- **Official Services Directory:** Categorized citizen services with eligibility criteria, required documents, fee structures, processing SLA timelines, ratings, and instant search.
- **Dynamic 4-Step Application Filing:** Multi-step wizard supporting citizen particulars, service-specific inputs, digital document attachments, and self-declaration.
- **Real-Time Audit Tracker:** Public and authenticated status tracking by Application ID with a 4-stage visual progress stepper and complete officer timestamped remarks.
- **Encrypted Document Vault:** Citizen document locker for uploading, previewing, and verifying Aadhaar, PAN, certificates, and licenses.
- **Multilingual Vernacular Speech Assistant:** Built-in speech-to-text supporting Telugu, Hindi, Tamil, Kannada, and English.
- **Officer & Admin Review Console:** Official backoffice portal to review pending queues, inspect payloads, and issue approval/rejection orders.
- **Two-Step OTP Authentication:** Mobile-first authentication with phone verification and password recovery.

---

## 🛠️ Tech Stack

- **Backend:** Node.js (>=20), Express 5, TypeScript 5, Mongoose 9, MongoDB 8, JWT, Zod, Vitest.
- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS, Lucide Icons, Sonner.
- **Testing & Quality:** Vitest unit & integration test suites, ESLint, Prettier.

---

## 💻 Quick Start & Commands

### Prerequisites
- Node.js >= 20
- pnpm >= 10
- Local MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Installation
Install workspace dependencies:
```bash
# Root & backend
pnpm install --dir Meeseva-lite-backend

# Frontend
npm --prefix Meeseva-lite-frontend install
```

### 2. Environment Setup
```bash
cp Meeseva-lite-backend/.env.example Meeseva-lite-backend/.env
```

### 3. Seed Government Services Catalog
Populate MongoDB with 12 curated citizen services (Income, Caste, Residence, Land Records, Ration Cards, Pensions, etc.):
```bash
pnpm --dir Meeseva-lite-backend seed:services
```

### 4. Running Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5001/api/v1`

### 5. Running Automated Tests
Run Vitest automated test suite:
```bash
npm test
```

### 6. Linting & Formatting
```bash
npm run lint
pnpm --dir Meeseva-lite-backend format
```

### 7. Production Build
Compile both backend TypeScript and frontend Vite bundle:
```bash
npm run build
```
