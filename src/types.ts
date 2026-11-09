export type ProductCategory = 'HIGH_END_ETHNIC' | 'PARTY_WEAR' | 'ELECTRONICS' | 'STANDARD_APPAREL';

export interface OrderFraudCheckRequest {
  orderId: string;
  userId: string;
  accountAgeDays: number;
  totalOrdersCount: number;
  pastReturnsCount: number;
  cartCategory: ProductCategory;
  itemPriceInr: number;
  isFestivalWindow: boolean;
}

export interface ReturnRiskAssessment {
  orderId: string;
  userId: string;
  returnRatio: number; // pastReturns / totalOrders
  riskScore: number;   // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  appliedPolicy: 'STANDARD_RETURN' | 'INSPECTION_TAG_REQUIRED' | 'EXCHANGE_ONLY';
  reasons: string[];
}
