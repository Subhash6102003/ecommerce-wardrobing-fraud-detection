# E-Commerce Wardrobing & Return Fraud Behavioral Scoring Pipeline

> Velocity profiling, seasonal festival window cross-referencing, and proactive policy enforcement (tamper tag & exchange-only gates).

**Domain:** E-Commerce / Trust & Safety  
**Architecture Pattern:** Typed Stage-based Pipeline DAG with Sagas & State Machine  

---

# E2 — E-Commerce Return Fraud / Wardrobing Detection: Architecture

## Problem

E-commerce fashion platforms suffer thousands of crores in annual losses due to "wardrobing":
Customers purchase high-value ethnic garments or party wear, wear them for one evening (weddings, Diwali parties), and then initiate returns claiming "defective" or "size issue".
Standard systems detect abuse reactively after 3–5 fraudulent returns.

## Solution Architecture: Real-time Behavioral Scoring & Dynamic Policy Gateway

```
Order Placement Event
         ↓
[1. Velocity & Behavioral Stage]  → Analyzes account age, return/keep ratio
         ↓
[2. Context & Calendar Engine]    → Cross-references cart category against regional event dates
         ↓
[3. Proactive Policy Gate]
    ├── Low Risk    → STANDARD_RETURN (no friction)
    ├── Medium Risk → INSPECTION_TAG_REQUIRED (tamper seal must remain unbroken)
    └── High Risk   → EXCHANGE_ONLY (disables cash refunds)
```


---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 22.0.0
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/systemflow-e2-return-fraud.git
cd systemflow-e2-return-fraud

# Install dependencies
npm install
```

### Running Tests & Typechecks

```bash
# Run the complete test suite (includes race condition & concurrency tests)
npm test

# Build production TypeScript output
npm run build

# Run typechecker
npm run typecheck
```

---

## 🏛️ Pipeline DAG Architecture

All pipeline stages are type-safe and execute in ordered succession. If any stage throws a transient error, compensating saga rollbacks run in reverse order to ensure 100% data consistency.

```
src/
├── core/                  # Embedded zero-dependency Pipeline Engine & Saga Rollback
│   ├── pipeline.ts
│   ├── types.ts
│   ├── logger.ts
│   └── errors.ts
├── stages/                # Modular pipeline stages
├── pipeline.ts            # Stage assembly & DAG orchestrator
├── types.ts               # Domain interfaces & state contracts
└── index.ts               # Public library API export
```

---

## 🚀 GitHub Actions CI

Every commit and pull request runs automated build, typecheck, and vitest race condition tests via `.github/workflows/ci.yml`.

## 📄 License
MIT
