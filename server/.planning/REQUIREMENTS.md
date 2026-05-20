# Requirements: Buildify AI Backend

**Defined:** 2026-05-12
**Core Value:** A production-grade, highly optimized Fastify backend for AI website generation.

## v1 Requirements

### Architecture & Foundation (ARCH)
- [ ] **ARCH-01**: Initialize Node.js + Fastify server with clean modular structure (`routes/`, `controllers/`, `services/`, etc.).
- [ ] **ARCH-02**: Integrate essential Fastify plugins (cors, helmet, rate-limit, compress).
- [ ] **ARCH-03**: Implement centralized error handling and structured logging.
- [ ] **ARCH-04**: Set up request validation using Zod.

### Database & ORM (DB)
- [ ] **DB-01**: Configure Prisma ORM with Neon PostgreSQL connection pooling.
- [ ] **DB-02**: Define schema models (`User`, `Project`, `GeneratedFile`, `PromptHistory`, `AiGeneration`).
- [ ] **DB-03**: Ensure lean queries, selective field fetching, and proper indexing.

### Caching (CACHE)
- [ ] **CACHE-01**: Integrate Redis for prompt caching, session caching, and rate limiting.
- [ ] **CACHE-02**: Implement cache invalidation and optimized keys.

### AI Integration (AI)
- [ ] **AI-01**: Implement Gemini 2.5 Flash service for website planning and JSON structure generation.
- [ ] **AI-02**: Implement Groq API service for high-speed React/Tailwind code generation.
- [ ] **AI-03**: Create async pipeline chaining Gemini plan → Groq code gen.

### Core API Routes (API)
- [ ] **API-01**: `POST /api/generate` - Accept prompt, generate site via AI pipeline, store to DB, return preview.
- [ ] **API-02**: `POST /api/regenerate` - Regenerate specific section.
- [ ] **API-03**: `GET /api/projects` - Fetch paginated list of projects.
- [ ] **API-04**: `GET /api/projects/:id` - Fetch single project with generated files.
- [ ] **API-05**: `DELETE /api/projects/:id` - Delete project.
- [ ] **API-06**: `GET /api/export/:projectId` - Generate and return a downloadable ZIP with code, package.json, and Tailwind config.

## Traceability
| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Pending |
| ARCH-02 | Phase 1 | Pending |
| ARCH-03 | Phase 1 | Pending |
| ARCH-04 | Phase 1 | Pending |
| DB-01 | Phase 2 | Pending |
| DB-02 | Phase 2 | Pending |
| DB-03 | Phase 2 | Pending |
| CACHE-01 | Phase 3 | Pending |
| CACHE-02 | Phase 3 | Pending |
| AI-01 | Phase 4 | Pending |
| AI-02 | Phase 4 | Pending |
| AI-03 | Phase 4 | Pending |
| API-01 | Phase 5 | Pending |
| API-02 | Phase 5 | Pending |
| API-03 | Phase 5 | Pending |
| API-04 | Phase 5 | Pending |
| API-05 | Phase 5 | Pending |
| API-06 | Phase 5 | Pending |
