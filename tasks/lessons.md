# Codebase Lessons & Anti-Patterns

This document tracks anti-patterns found during architectural audits to ensure they are avoided in future iterations of the FinTrack project or other enterprise applications.

## 1. The "God Component" Anti-Pattern
**Issue:** `app/page.tsx` and `components/add-transaction-modal.tsx` handle multiple distinct responsibilities: fetching data, managing local state, calculating derived state (e.g., savings rate, budget progress), and rendering complex UI.
**Consequence:** Makes components difficult to test, hard to reuse, and prone to breaking when one aspect (like the API response) changes.
**Solution:** Extract data fetching to generic hooks (e.g., `useTransactions`). Extract business logic (like calculating savings rate) to utility functions in `lib/`.

## 2. Injected Raw SQL in UI/Route Handlers
**Issue:** Route handlers (e.g., `app/api/transactions/route.ts`) contain raw SQL queries (`db.prepare(...)`).
**Consequence:** Tightly couples the application to `better-sqlite3`. Difficult to add middleware, auditing, or switch databases in the future.
**Solution:** Implement a Repository Pattern (e.g., `lib/repositories/transaction.repository.ts`) or use a type-safe ORM to decouple the database from network routes.

## 3. Un-abstracted API Fetching (Missing Client caching)
**Issue:** Standard `fetch()` calls are placed directly inside `useEffect` blocks.
**Consequence:** Leads to race conditions, no automatic retries, and manual `isLoading` state management.
**Solution:** Use robust async state management like React Query (`@tanstack/react-query`) or Next.js built-in caching mechanisms.

### 4. AI Data Sovereignty & Sanitization
**Insight:** When integrating LLMs (like Gemini) into financial apps, passing raw transaction data is a significant PII risk.
**Pattern:** Implement a `sanitizeForAI` utility that masks sensitive fields (name, description) and strips injection control characters BEFORE the data leaves the trusted environment.

### 5. Architectural Elegance via Custom Hooks
**Insight:** The "God Component" (main dashboard) is a common bottleneck in Next.js apps.
**Pattern:** Extract orchestration, state, and fetching into a domain-aware `useDashboard` hook. This achieves 100% SRP for the page component and makes the business logic testable in isolation.

## 4. Local Environment Tooling Dependencies
**Issue:** Advanced architecture migrations and TS compilations implicitly assume that `node` and `npm` are universally available in the PATH.
**Consequence:** When the CI/CD or host agent machine lacks these tools, verification (`npm run build`) is completely blocked, leading to false-positive IDE lint warnings regarding "Missing Modules".
**Solution:** Always verify environment requirements via `Get-Command node` or `npm -v` before planning automated verifications, and document missing tooling explicitly to avoid debugging phantom TS errors that just need a package install.
