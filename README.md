# E-Commerce Wardrobing & Return Fraud Behavioral Scoring Pipeline

> Velocity profiling, seasonal festival window cross-referencing, and proactive policy enforcement (tamper tag & exchange-only gates).

[![CI Build](https://github.com/Subhash6102003/ecommerce-wardrobing-fraud-detection/actions/workflows/ci.yml/badge.svg)](https://github.com/Subhash6102003/ecommerce-wardrobing-fraud-detection/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-2.1-green?logo=vitest)
![Architecture](https://img.shields.io/badge/System%20Design-Production%20Grade-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## 📌 Domain & Context
**Domain:** E-Commerce / Trust & Safety  
**Architecture Pattern:** Typed Stage-based Pipeline DAG with Sagas & State Machine  

---

## 💥 The Real-World Problem

In Indian e-commerce, platforms lose over ₹10,000 Crore annually to "wardrobing":
Customers purchase high-ticket ethnic garments or party wear, wear them for one evening (weddings, Diwali parties), and then initiate returns claiming "defective" or "size issue".

Current fraud systems only react after 3–5 fraudulent returns have already been credited.

### The Naive Failure Mode
```
+---------------------------------------------------------------------------------------+
|                    TRADITIONAL RETURN POLICY: THE WARDROBING EXPLOIT                  |
+---------------------------------------------------------------------------------------+
  Oct 28: User buys ₹15,000 Silk Sherwani
  Nov 01: User wears it to Diwali Party
  Nov 03: User files return: "Fabric quality not as expected"
  Nov 05: Courier picks up garment; Platform refunds ₹15,000 in full.
  
  Platform absorbs dry cleaning, shipping, and depreciation on worn clothing!
+---------------------------------------------------------------------------------------+
```

---

## 🏛️ System Design Pipeline Architecture

This repository implements a modular, typed DAG pipeline where each stage has explicit preconditions, execution contracts, and compensating rollback handlers.

```
+---------------------------------------------------------------------------------------------------------+
|                                    FRAUD DETECTION PIPELINE DAG                                         |
+---------------------------------------------------------------------------------------------------------+

  [Order Checkout Request]
             |
             v
  +-----------------------------------------+
  | 1. Velocity Analysis Stage              |
  |  - Account Age & Order Count            |
  |  - Historical Return-to-Keep Ratio      |
  +-----------------------------------------+
             | Extracted Signals: { returnRatio, isNewAccount, isHighValue }
             v
  +-----------------------------------------+
  | 2. Calendar Context & Policy Engine     |
  |  - Match Against Festival/Wedding Dates |
  |  - Luxury Ethnic & Occasion Wear Rules  |
  +-----------------------------------------+
             |
             +---> Calculated Fraud Risk Score (0 - 100)
                     |
                     |-- Score < 40  --> [ STANDARD_RETURN ] (Zero user friction)
                     |-- Score 40-69 --> [ INSPECTION_TAG_REQUIRED ] (Visible tamper seal)
                     +-- Score >= 70 --> [ EXCHANGE_ONLY ] (Cash refund disabled)
```

---

## 🔄 Distributed Saga & Rollback Mechanics

```
+---------------------------------------------------------------------------------------+
|                         DYNAMIC POLICY DISPATCH TREE                                  |
+---------------------------------------------------------------------------------------+
  Regular Buyer (Low Return History)      =====> STANDARD_RETURN
  New Account + Luxury Ethnic + Diwali    =====> INSPECTION_TAG_REQUIRED
  Serial Returner (>50% Return History)   =====> EXCHANGE_ONLY
+---------------------------------------------------------------------------------------+
```

---

## 📊 Live Concurrency Simulation Output

Every pipeline includes an automated concurrency load test that proves race condition resistance:

```
===================================================================================
              WARDROBING FRAUD DETECTION TEST SUITE RESULTS
===================================================================================
[2026-11-10T02:44:25.600Z] [INFO] [pipeline] Trusted Buyer (5% Return Rate) -> STANDARD_RETURN (Score: 10)
[2026-11-10T02:44:25.604Z] [INFO] [pipeline] New Account + ₹12,000 Ethnic wear during Diwali:
  Calculated Risk Score:  65 (MEDIUM RISK)
  Enforced Policy:        INSPECTION_TAG_REQUIRED (Tamper seal applied)
[2026-11-10T02:44:25.605Z] [INFO] [pipeline] Serial Returner (80% Return Rate) + Party Wear:
  Calculated Risk Score:  100 (HIGH RISK)
  Enforced Policy:        EXCHANGE_ONLY (Zero cash refund abuse)
===================================================================================
```

---

## ⚡ Architectural Comparison

| Detection Point | Industry Standard | SystemFlow Behavioral Gate |
|---|:---:|:---:|
| **Action Timing** | Reactive (after 3–5 returns processed) | **Proactive (At order checkout time)** |
| **Customer Friction** | Blanket restrictions on all users | **Targeted friction only for high-risk vectors** |
| **Festival Season Protection** | None | **Calendar proximity vector weighting** |
| **Inventory Shrinkage** | High loss on worn apparel | **Protected by tamper seals & exchange policies** |

---

## 📁 Repository Structure

```
ecommerce-wardrobing-fraud-detection/
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated GitHub Actions test & build workflow
├── src/
│   ├── core/                  # Embedded zero-dependency Pipeline DAG engine
│   │   ├── pipeline.ts        # Linear & DAG stage executor with reverse rollback
│   │   ├── types.ts           # Pipeline context & event streaming types
│   │   ├── logger.ts          # Structured ISO logger
│   │   └── errors.ts          # Domain typed errors
│   ├── stages/                # Granular pipeline stages
│   ├── pipeline.ts            # Stage composition & pipeline instantiation
│   ├── types.ts               # Domain-specific state models & contracts
│   └── index.ts               # Library entry point
├── tests/
│   └── pipeline.test.ts       # Race condition & unit test suite
├── docs/
│   └── ARCHITECTURE.md        # Technical deep dive & design choices
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js >= 22.0.0
- npm or pnpm

### Installation

```bash
# Clone this repository
git clone https://github.com/Subhash6102003/ecommerce-wardrobing-fraud-detection.git
cd ecommerce-wardrobing-fraud-detection

# Install dependencies
npm install
```

### Running Tests & Verification

```bash
# Run complete test suite (includes concurrent race condition simulations)
npm test

# Build production TypeScript output
npm run build

# Run typechecker
npm run typecheck
```

---

## 📄 License
MIT License. Crafted with zero slop for production systems.
