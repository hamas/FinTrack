    # Tech Stack & Structural Audit Report

## 1. Dependency & Version Audit

| Package | Current Version | Latest Stable (March 2026) | Risk Level | Upgrade Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `next` | `^15.4.9` | `15.x.x` (React 19 enabled) | Low | Retain. This is already a very modern version. |
| `react` & `react-dom` | `^19.2.1` | `19.x.x` | Low | Retain. Project is already using React 19. |
| `@google/genai` | `^1.17.0` | `~2.x / 1.43+` | Medium | **Recommended**. If building new AI features, Google's generative SDKs evolve rapidly. Ensure you have the latest stable for multimodal capabilities and bug fixes. |
| `better-sqlite3` | `^12.6.2` | `12.x` / `13.x` | Low | Retain. Fast synchronous SQL wrapper; current version is stable for local use. |
| `motion` (Framer Motion) | `^12.23.24` | `12.x / 13.x` | Low | Retain. |
| `tailwind-merge` & `clsx` | `^3.3.1`, `^2.1.1` | Stable | Low | Retain. |

**Dependency Summary:** The project is already on the bleeding edge for 2026 standards, utilizing Next.js 15, React 19, and the new `@tailwindcss/postcss` setup. The primary recommendation is checking `@google/genai` for any breaking changes if AI features are imminently planned.

## 2. Structural & Architectural Review

### Current Structure: "Folder-by-Type" (Monolithic UI)
Currently, the application mixes heavy UI components, business logic, and API calls within the same React components. 
- **`app/api/`**: Contains raw DB queries (`lib/db.ts`) directly in the route handlers.
- **`components/`**: A flat list of 13 heavily mixed components (e.g., `add-transaction-modal.tsx` contains both complex state/fetch logic and presentation UI).
- **`lib/`**: Contains direct database initialization and types, but lacks a dedicated "Service" or "Repository" layer.

### 2026 Industry Alignment (Clean Architecture / Feature-Sliced Design)
For a Staff-level FinTech application, the current structure is a **Medium Risk** for scalability. Best practices in 2026 favor "Feature-Based" or "Clean Architecture" to separate concerns:
1. **Domain/Entities**: TypeScript interfaces and core business rules (e.g., Budget calculation logic).
2. **Data/Repositories**: Abstracting `better-sqlite3` calls so components/APIs don't write raw SQL.
3. **Services/Use-Cases**: Handling the API fetch logic and AI integrations separate from React UI.
4. **Presentation**: Pure React components that only accept props and emit events.

### Code Quality Scan
- **Naming Conventions:** Good. Uses standard `kebab-case` for files and `PascalCase` for React components.
- **DRY Compliance:** Needs improvement. API fetching (`fetch('/api/transactions')`) is repeated directly inside components like `page.tsx`, making it hard to add global error handling or caching (like React Query/SWR).
- **Elegance:** The UI code is elegant (Tailwind + Motion), but the data-fetching layer is tightly coupled to the render cycle.

## 3. Gap Analysis (Standardization Report)
To reach "Staff Engineer" enterprise standards:
1. **Missing Data Access Layer (DAL):** SQL queries are hardcoded in API routes. Need a Repository pattern or an ORM (like Drizzle/Prisma) for type-safe database access.
2. **Missing Client State Manager:** Uses raw `useState/useEffect` for complex data fetching. Should use React Query (`@tanstack/react-query`) or Nuqs for URL state.
3. **Missing Service Layer:** The GenAI integration will become messy if crammed into API routes alongside SQL. Needs a dedicated `services/ai.service.ts`.
4. **Missing Error Boundary/Toast Notifications:** No global error handling for failed API requests.

*Refactoring Plan added to `tasks/todo.md`.*
*Anti-patterns added to `tasks/lessons.md`.*

---

## 4. Typography & Scaling Standard (The "Flex" Standard)
**Target**: Global Compact UI & Typography Overhaul

### Typography Standard
- **Primary Typeface**: `Google Sans Flex` (Variable Font)
- **Integration Strategy**: Sourced via standard `<link>` tags pointing to Google Fonts `css2?family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap` to maximize high-end "Flex" rendering features.
- **Fallbacks**: `system-ui, sans-serif` (maintaining a robust modern stack if network interruptions occur).
- **Weight Configurations**:
  - `Default Body`: 400 (for high legibility on density data displays)
  - `Headlines (h2/h3)`: 600 (Semibold, tight tracking)
  - `Hero Headers (h1)`: 700 (Bold, tight tracking)

### Global Compact Scaling Protocol
The entire application has been scaled down to maximize information density while maintaining a "Premium Minimalist" aesthetic.

- **Base Root Font**: Scaled from 16px to **14px** (**0.875rem**) globally inside `app/globals.css`.
- **Heading Hierarchy Adjustments**:
  - `h1`: Shifted gracefully down by one step (from `text-3xl` to `text-2xl`) to avoid feeling overly "bulky".
  - `h2`: Shifted gracefully down (from `text-xl` to `text-lg`).
  - `h3`: Shifted gracefully down (relative scaling inside components).
- **Proportional Spacing Reduction**:
  - The base Tailwind spacing token `--spacing` has been reduced from the default `0.25rem` to **`0.2rem`**.
  - This effectively reduces all margins and padding across the application by **20%**, ensuring UI components like Cards, Sidebars, Modals, and Headers are consistently tighter.
- **Component Specific Adjustments**:
  - **StatsCards**: Padding reduced to `p-3 lg:p-5`, aligning with the high-density financial layout.
  - **Header**: Height clipped from `h-14` to `h-12`; padding reduced by roughly 15%.
  - **Pages**: Top-level margins, hero padding, and section gaps have been consistently decreased.
- **Structural Integrity**: 100% clean implementation via `@theme` variables inside Tailwind v4. No CSS hacks or fragile style overrides were introduced.
