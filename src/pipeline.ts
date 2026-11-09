import { Pipeline } from './core/index.js';
import type { OrderFraudCheckRequest, ReturnRiskAssessment } from './types.js';
import { velocityStage } from './stages/velocity.js';
import { policyEngineStage } from './stages/policy-engine.js';
import type { Stage, PipelineResult } from './core/index.js';

export function createReturnFraudPipeline() {
  const pipeline = new Pipeline<OrderFraudCheckRequest, ReturnRiskAssessment>('return-fraud-detection');

  const stages: Stage<unknown, unknown>[] = [
    velocityStage as Stage<unknown, unknown>,
    policyEngineStage as Stage<unknown, unknown>,
  ];

  return {
    async evaluateOrder(request: OrderFraudCheckRequest): Promise<PipelineResult<ReturnRiskAssessment>> {
      return pipeline.run(stages, request);
    },
  };
}
