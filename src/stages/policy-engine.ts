import type { Stage, PipelineContext } from '../core/index.js';
import type { VelocitySignals } from './velocity.js';
import type { ReturnRiskAssessment } from '../types.js';

export const policyEngineStage: Stage<VelocitySignals, ReturnRiskAssessment> = {
  id: 'policy-engine',
  name: 'Wardrobing Risk Assessment & Policy Enforcement',
  description: 'Scores risk and applies proactive anti-tamper or exchange policy',
  async run(input: VelocitySignals, ctx: PipelineContext): Promise<ReturnRiskAssessment> {
    let score = 10;
    const reasons: string[] = [];

    // Excessive past return ratio (> 40% returns)
    if (input.returnRatio > 0.4) {
      score += 35;
      reasons.push(`High return history ratio (${Math.round(input.returnRatio * 100)}%)`);
    }

    // New account ordering luxury ethnic / party wear
    if (input.isNewAccount && (input.cartCategory === 'HIGH_END_ETHNIC' || input.cartCategory === 'PARTY_WEAR')) {
      score += 30;
      reasons.push('New account ordering occasion wear');
    }

    // High value item ordered inside Diwali/wedding festival window
    if (input.isHighValue && input.isFestivalWindow) {
      score += 25;
      reasons.push('High value purchase during festival window');
    }

    score = Math.min(100, score);

    let riskLevel: ReturnRiskAssessment['riskLevel'] = 'LOW';
    let appliedPolicy: ReturnRiskAssessment['appliedPolicy'] = 'STANDARD_RETURN';

    if (score >= 70) {
      riskLevel = 'HIGH';
      appliedPolicy = 'EXCHANGE_ONLY';
    } else if (score >= 40) {
      riskLevel = 'MEDIUM';
      appliedPolicy = 'INSPECTION_TAG_REQUIRED';
    }

    ctx.logger.info(`Policy outcome: ${appliedPolicy} (score=${score})`, {
      orderId: input.orderId,
      riskLevel,
    });

    return {
      orderId: input.orderId,
      userId: input.userId,
      returnRatio: input.returnRatio,
      riskScore: score,
      riskLevel,
      appliedPolicy,
      reasons,
    };
  },
};
