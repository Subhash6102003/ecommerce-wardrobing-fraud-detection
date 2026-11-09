import { describe, it, expect } from 'vitest';
import { createReturnFraudPipeline } from '../src/pipeline.js';
import type { OrderFraudCheckRequest } from '../src/types.js';

describe('E2 — Return Fraud / Wardrobing Detection Pipeline', () => {
  const pipeline = createReturnFraudPipeline();

  it('approves standard return policy for trusted buyer buying ordinary clothes', async () => {
    const req: OrderFraudCheckRequest = {
      orderId: 'ord-trust-1',
      userId: 'usr-regular',
      accountAgeDays: 365,
      totalOrdersCount: 20,
      pastReturnsCount: 1, // 5% return rate
      cartCategory: 'STANDARD_APPAREL',
      itemPriceInr: 1200,
      isFestivalWindow: false,
    };

    const res = await pipeline.evaluateOrder(req);
    expect(res.status).toBe('success');
    expect(res.output?.riskLevel).toBe('LOW');
    expect(res.output?.appliedPolicy).toBe('STANDARD_RETURN');
  });

  it('mandates INSPECTION_TAG_REQUIRED when new account orders expensive wedding wear during Diwali', async () => {
    const req: OrderFraudCheckRequest = {
      orderId: 'ord-festive-1',
      userId: 'usr-newbie',
      accountAgeDays: 5, // < 14 days
      totalOrdersCount: 1,
      pastReturnsCount: 0,
      cartCategory: 'HIGH_END_ETHNIC',
      itemPriceInr: 12000,
      isFestivalWindow: true,
    };

    const res = await pipeline.evaluateOrder(req);
    expect(res.status).toBe('success');
    expect(res.output?.riskScore).toBeGreaterThanOrEqual(40);
    expect(res.output?.appliedPolicy).toBe('INSPECTION_TAG_REQUIRED');
  });

  it('enforces EXCHANGE_ONLY on accounts with serial return history (>50% return rate) buying festival wear', async () => {
    const req: OrderFraudCheckRequest = {
      orderId: 'ord-serial-1',
      userId: 'usr-serial-returner',
      accountAgeDays: 8,
      totalOrdersCount: 10,
      pastReturnsCount: 8, // 80% return rate
      cartCategory: 'PARTY_WEAR',
      itemPriceInr: 8500,
      isFestivalWindow: true,
    };

    const res = await pipeline.evaluateOrder(req);
    expect(res.status).toBe('success');
    expect(res.output?.riskLevel).toBe('HIGH');
    expect(res.output?.appliedPolicy).toBe('EXCHANGE_ONLY');
  });
});
