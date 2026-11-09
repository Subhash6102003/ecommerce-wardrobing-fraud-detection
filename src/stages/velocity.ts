import type { Stage, PipelineContext } from '../core/index.js';
import type { OrderFraudCheckRequest } from '../types.js';

export interface VelocitySignals extends OrderFraudCheckRequest {
  returnRatio: number;
  isNewAccount: boolean;
  isHighValue: boolean;
}

export const velocityStage: Stage<OrderFraudCheckRequest, VelocitySignals> = {
  id: 'velocity-analysis',
  name: 'Account & Return Velocity Analysis',
  description: 'Analyzes past return frequency and account maturity',
  async run(input: OrderFraudCheckRequest, ctx: PipelineContext): Promise<VelocitySignals> {
    const returnRatio = input.totalOrdersCount > 0 ? input.pastReturnsCount / input.totalOrdersCount : 0;
    const isNewAccount = input.accountAgeDays < 14;
    const isHighValue = input.itemPriceInr >= 5000;

    ctx.logger.info(`Velocity signals calculated`, {
      orderId: input.orderId,
      returnRatio,
      isNewAccount,
      isHighValue,
    });

    return {
      ...input,
      returnRatio,
      isNewAccount,
      isHighValue,
    };
  },
};
