# Buildify AI

## What This Is

A premium, production-grade frontend for an AI website builder. Users can generate modern websites from prompts, edit the generated code in Monaco editor, and instantly preview the results in a Sandpack-powered live preview. It looks and feels like a top-tier SaaS product (similar to Lovable, Bolt, V0).

## Core Value

Visually impressive, premium UI polish combined with highly optimized frontend performance and real-time live preview, delivering a startup-grade SaaS experience.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interactive AI Website Builder Workspace (prompt input, AI generate, Monaco editor, Sandpack preview, file explorer, theme switcher, export).
- [ ] Premium Landing Page (modern hero, AI demo, features, how it works, pricing, testimonials, CTA, footer).
- [ ] Real-time Live Preview (instant rendering, mobile/desktop toggle, smooth updates).
- [ ] Monaco Editor Integration (JSX highlighting, tabs, file explorer, auto formatting, dark premium theme).
- [ ] AI Generation UX (thinking animation, skeleton loaders, progressive rendering, smooth transitions).
- [ ] Highly optimized rendering (code splitting, lazy loading Monaco/Sandpack, memoization).
- [ ] Fully responsive layouts across all device sizes with no layout shifts.
- [ ] Smooth page transitions, hover interactions, and loading animations using Framer Motion.
- [ ] Premium UI using Tailwind CSS (Glassmorphism, gradients, blur effects, rounded UI, soft shadows).
- [ ] Scalable feature-based architecture with Zustand state management.
- [ ] Accessible UI (Semantic HTML, aria labels, keyboard navigation).

### Out of Scope

- [ ] Basic/Bootstrap style dashboard designs — (Fails the premium aesthetic requirement).
- [ ] Backend logic/AI model execution — (Focus is on the frontend interface and mocked/simulated integration first).

## Context

- **Objective**: Create a portfolio-worthy frontend that mirrors modern tools like Framer AI, Bolt, or V0.
- **Vibe**: Futuristic, modern, premium, smooth, minimal, startup-grade.
- **Tech Stack**: React + Vite, Tailwind CSS, Monaco Editor, Sandpack Preview, Zustand, Axios, Framer Motion.

## Constraints

- **Type**: Tech stack — Must use strictly the specified tech stack (React, Vite, Tailwind, Zustand, Framer Motion, Monaco, Sandpack).
- **Type**: Performance — Heavy components must be lazy-loaded, images optimized, and rendering memoized.
- **Type**: UI Quality — Avoid generic components, poor spacing, and old dashboard designs. Never show blank screens (use skeleton loaders).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Feature-based folder structure | Necessary for scalable and maintainable architecture for a complex editor app. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-11 after initialization*
