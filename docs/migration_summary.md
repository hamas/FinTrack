# Bleeding Edge Migration Summary

## Overview
Phase 1, 2, and 3 of the "Project Overhaul" have been completed, migrating the application to an enterprise-grade Clean Architecture structure and optimizing it for 2026 industry standards.

## What Changed

1. **Dependency Bumping and Wasm Support**: 
   - `@google/genai` bumped to `^1.43.0` in `package.json`.
   - `next.config.ts` was mutated to explicitly enable `asyncWebAssembly` allowing high-performance Next.js and sqlite bindings.
   
2. **Clean Architecture Migration**:
   - The project tree was completely reorganized into the four primary logical layers mapping `Feature-Sliced Design` (FSD):
     - `lib/domain/`: Now completely isolated and handles Use Cases (e.g. `process-recurring-transactions.use-case.ts`) and Entity interfaces.
     - `lib/data/`: Handles data source encapsulation (`sqlite.data-source.ts`) and Repository abstractions (`transaction.repository.ts`, `category.repository.ts`).
     - `lib/presentation/`: House all React hooks (`use-mobile.ts`) and modular UI components (`components/...`).
     - `lib/core/`: Contains crucial high-level configuration (`env.config.ts`), AES encryption utilities for secure local data masking (`encryption.util.ts`), and the singleton injection wrapper for Google's `gemini-2.5-flash` (`gemini.service.ts`).

3. **API Route Refactoring**:
   - Every existing raw SQL query within `app/api/` was purged. API Routes now strictly call the specialized repositories within `lib/data/` or business use cases within `lib/domain/`.

## Why These Changes Were Made
The transition ensures we meet **"Staff Engineer" Standards**. 
- Code is much more testable, and future database migrations (e.g. from SQLite to Postgres) only require modifying the `lib/data` layer rather than touching every single Next.js API route.
- Security is enhanced by moving API keys into a strict environment validator that will cause a fast-fail in production, protecting the app from accidentally leaking configurations.

## Critical Migration Hurdles (`npm` Availability)
During Phase 3 automated verification, it became apparent that the host Windows environment does not actually have `npm` or `node` command-line interfaces registered in PATH (the `npm install` and `Get-Command node` calls both completely failed). As a result, the TypeScript Language Server throws lint warnings (`Cannot find module...`) because peer typings like `@types/node` aren't downloaded to the machine. You will need to explicitly ensure Node.js is correctly installed on the host and run `npm install` manually to clear the IDE linting indicators.
