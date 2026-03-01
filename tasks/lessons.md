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
## 5. Component Standardization for UI Continuity
**Issue:** Hardcoding common UI structures (like Card Headers containing an Icon, background color, and specific radius/spacing) across multiple grid components leads to visual fragmentation and duplicated, fragile CSS rules.
**Consequence:** When design standards change (e.g., AMOELD padding or specific gap adjustments), every individual card must be manually audited and updated, increasing the risk of "1 off" design errors.
**Solution:** Implement strict unified components (e.g., `CardHeader`) using DRY principles. Define exact token values (12px radius, 24x24 icons) in a single source of truth and inject specific data logic downstream.

## 6. Realistic Component Design vs. Flat UI
**Insight:** Representing physical objects (like credit cards) with loud, flat gradients breaks immersion in premium applications.
**Pattern:** To elevate an interface from "software" to "fintech tool", apply deep satin gradients, physical aspect ratios (ID-1 / 1.586:1), subtle noise textures, and realistic branding (chips, contactless tags). Hover states should mimic physical manipulation (e.g., lifting from a wallet) using top edge highlights to catch simulated light.
