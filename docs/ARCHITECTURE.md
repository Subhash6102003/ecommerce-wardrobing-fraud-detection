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
