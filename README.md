<div align="center">
<img width="1200" height="475" alt="FinTrack Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# FinTrack
### *FinTech-Grade Personal Finance Management*
</div>

---

## 🌟 Overview

**FinTrack** is a high-performance, security-hardened personal finance dashboard built with **Next.js 15** and **React 19**. It leverages **Clean Architecture** to ensure long-term maintainability and integrates **Google Gemini 2.5 Flash** for deep financial reasoning and automated insights.

Designed with a "Vault-First" mentality, FinTrack encrypts sensitive financial data at rest and sanitizes all AI interactions to protect user privacy.

---

## 🚀 Key Features

- **🏛️ Clean Architecture**: Strict separation of Domain, Data, Presentation, and Core layers.
- **🤖 AI Financial Advisor**: Integration with Gemini 2.5 Flash for automated expense analysis and budgeting advice.
- **🔒 AES-256 Security**: Field-level encryption (GCM mode) for transaction records in the local SQLite database.
- **☣️ AI Safety Layer**: Reactive sanitization of prompts and context to prevent PII leakage to LLM providers.
- **🔄 Recurring Engine**: Automated processing of chronological recurring expenses and income.
- **📊 Dynamic Analytics**: Interactive charts powered by Recharts with a premium, responsive UI.
- **🌑 Dark Mode Architecture**: System-aware theming with a high-contrast, premium aesthetic.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **State**: React Hooks + Domain-aware custom logic
- **AI**: @google/genai (Gemini 2.5/3.0 Flash targeting)
- **Database**: SQLite via `better-sqlite3`
- **Styling**: Tailwind CSS + Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Security**: Web Crypto API (SubtleCrypto) + Custom Sanitization Utilities

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hamas/FinTrack.git
   cd FinTrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 📁 Architecture Overview

FinTrack follows a **Clean Architecture** pattern to ensure the business logic is independent of frameworks:

- **`lib/domain`**: Pure Entities and Repository Interfaces (The "What").
- **`lib/data`**: SQLite implementations, Model mappings, and AES encryption (The "How").
- **`lib/presentation`**: React components and the optimized `useDashboard` hook.
- **`lib/core`**: Global security utilities, AI service wrappers, and environment configuration.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with 💚 for the Future of Personal Finance.
</div>
