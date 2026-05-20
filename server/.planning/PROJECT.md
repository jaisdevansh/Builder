# Buildify AI Backend

## What This Is
A production-grade, highly scalable backend for an AI website builder platform that generates responsive websites from prompts. It leverages Fastify for extreme performance, Neon PostgreSQL + Prisma for database operations, Redis for caching, Gemini 2.5 Flash for website planning, and Groq API for lightning-fast code generation.

## Core Value
To provide an ultra-fast, robust, and scalable API architecture that avoids beginner patterns. The backend must be highly optimized, async-safe, modular, and built for future SaaS scaling (subscriptions, authentication, realtime collaboration).

## Context
- **Objective**: Create a backend infrastructure that feels startup-grade and supports high traffic with low latency.
- **Tech Stack**: Node.js, Fastify, Neon PostgreSQL, Prisma ORM, Redis, Gemini 2.5 Flash, Groq API.
- **Architecture**: Clean, modular feature-based architecture with separated routes, controllers, services, cache layer, and AI integration.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fastify over Express | Fastify offers significantly higher throughput and optimized JSON serialization necessary for AI pipelines. | Active |
| Split AI Responsibilities | Gemini handles planning/logic, Groq handles code-gen. This optimizes for reasoning vs speed. | Active |
| Redis Caching | Critical for prompt caching and session speed to minimize redundant AI calls. | Active |
| Prisma + Neon DB | Neon provides serverless Postgres; Prisma offers type-safe, lean querying to avoid overfetching. | Active |

## Evolution
This document serves as the foundation for the Buildify AI Backend. Next step is executing the roadmap phases.
