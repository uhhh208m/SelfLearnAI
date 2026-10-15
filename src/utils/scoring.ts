/**
 * Core Scoring & Statistical Engine for SelfLearn AI
 * Implements strict, verifiable pedagogical calculation rules.
 */

import type { Criterion, Domain, LikertValue, AssessmentCalculationResult, DomainScoreResult } from '../types/index.ts';

export const MIN_COMPLETION_THRESHOLD_PERCENT = 70; // At least 70% valid answers required

/**
 * Linear transformation from 1.0-5.0 Likert scale to 0-100 presentation scale.
 * Formula: ((mean - 1) / 4) * 100
 * Note: Purely linear scaling for visual representation; does not denote probabilistic competence.
 */
export function convertLikertToLinear100(score: number | null): number | null {
  if (score === null || isNaN(score)) return null;
  const clamped = Math.max(1, Math.min(5, score));
  return Math.round(((clamped - 1) / 4) * 1000) / 10; // 1 decimal place
}

/**
 * Reference descriptive tier labels for experimental trials.
 * Strictly labeled as tentative research benchmarks requiring empirical validation.
 */
export function getReferenceTier(compositeScore: number | null) {
  if (compositeScore === null) return null;

  if (compositeScore >= 4.2) {
    return {
      label: 'Tự chủ cao & Sử dụng AI chiến lược',
      description: 'Thể hiện tính độc lập cao, kiểm chứng AI chủ động và có khả năng tự điều chỉnh việc học vững chắc. (Ngưỡng tham khảo nghiên cứu)',
      badgeColor: 'emerald'
    };
  }
  if (compositeScore >= 3.4) {
    return {
      label: 'Khá vững vàng & Đang hoàn thiện',
      description: 'Có phương pháp tự học và nhận thức về AI tốt, cần duy trì tính nhất quán trong phản tư và giám sát. (Ngưỡng tham khảo nghiên cứu)',
      badgeColor: 'blue'
    };
  }
  if (compositeScore >= 2.6) {
    return {
      label: 'Đang phát triển / Cần hỗ trợ định hướng',
      description: 'Đã có nhận thức ban đầu về tự học nhưng còn phụ thuộc vào AI hoặc thiếu thói quen kiểm chứng thông tin. (Ngưỡng tham khảo nghiên cứu)',
      badgeColor: 'amber'
    };
  }
  return {
    label: 'Cần hỗ trợ và can thiệp phương pháp',
    description: 'Cần được trang bị khung phương pháp tự điều chỉnh học tập và hướng dẫn kỹ năng sử dụng AI có trách nhiệm. (Ngưỡng tham khảo nghiên cứu)',
    badgeColor: 'rose'
  };
}

/**
 * Calculates domain scores and overall composite score.
 * Does NOT treat missing answers or 'N/A' as 0 or 1.
 */
export function calculateAssessmentResult(
  answers: Record<string, LikertValue>,
  criteria: Criterion[],
  domains: Domain[],
  minThresholdPercent: number = MIN_COMPLETION_THRESHOLD_PERCENT
): AssessmentCalculationResult {
  const activeCriteria = criteria.filter((c) => c.isActive);
  const totalQuestions = activeCriteria.length;

  let totalAnswered = 0;
  let totalValid = 0;
  let totalNA = 0;
  let totalUnanswered = 0;

  const domainScores: Record<string, DomainScoreResult> = {};

  for (const domain of domains) {
    const domainCriteria = activeCriteria.filter((c) => c.domainId === domain.id);
    const domainTotalQuestions = domainCriteria.length;
    let domainValidCount = 0;
    let domainValidSum = 0;
    let domainNaCount = 0;
    let domainUnansweredCount = 0;

    for (const c of domainCriteria) {
      const val = answers[c.id];
      if (val === undefined || val === null) {
        domainUnansweredCount++;
        totalUnanswered++;
      } else if (val === 'N/A') {
        domainNaCount++;
        totalNA++;
        totalAnswered++;
      } else if (typeof val === 'number' && val >= 1 && val <= 5) {
        domainValidCount++;
        domainValidSum += val;
        totalValid++;
        totalAnswered++;
      } else {
        domainUnansweredCount++;
        totalUnanswered++;
      }
    }

    const domainValidRate = domainTotalQuestions > 0 ? (domainValidCount / domainTotalQuestions) * 100 : 0;
    // A domain is sufficient if at least 50% of questions in this domain have valid Likert responses
    const isDomainSufficient = domainValidCount > 0 && domainValidRate >= 50;
    const domainMean = isDomainSufficient ? Math.round((domainValidSum / domainValidCount) * 100) / 100 : null;

    domainScores[domain.id] = {
      domainId: domain.id,
      domainCode: domain.code,
      domainTitle: domain.title,
      validAnswerCount: domainValidCount,
      totalQuestionCount: domainTotalQuestions,
      naCount: domainNaCount,
      unansweredCount: domainUnansweredCount,
      meanScore: domainMean,
      linearScore100: convertLikertToLinear100(domainMean),
      isSufficient: isDomainSufficient,
      color: domain.color,
    };
  }

  const validPercentage = totalQuestions > 0 ? Math.round((totalValid / totalQuestions) * 1000) / 10 : 0;
  const isOverallSufficient = validPercentage >= minThresholdPercent;

  let compositeScore: number | null = null;
  let compositeLinearScore100: number | null = null;
  let insufficientReason: string | undefined;

  if (!isOverallSufficient) {
    insufficientReason = `Tỷ lệ câu trả lời hợp lệ (${validPercentage}%) chưa đạt ngưỡng tối thiểu (${minThresholdPercent}%) để xuất điểm tổng hợp tin cậy.`;
  } else {
    // Check domains with sufficient data
    const sufficientDomainMeans = Object.values(domainScores)
      .map((d) => d.meanScore)
      .filter((s): s is number => s !== null);

    if (sufficientDomainMeans.length < Math.ceil(domains.length * 0.7)) {
      insufficientReason = 'Số lượng lĩnh vực có dữ liệu hợp lệ chưa đạt yêu cầu tối thiểu.';
    } else {
      const sum = sufficientDomainMeans.reduce((acc, curr) => acc + curr, 0);
      compositeScore = Math.round((sum / sufficientDomainMeans.length) * 100) / 100;
      compositeLinearScore100 = convertLikertToLinear100(compositeScore);
    }
  }

  const status = compositeScore !== null ? 'sufficient' : 'insufficient_data';
  const referenceTier = getReferenceTier(compositeScore);

  return {
    domainScores,
    compositeScore,
    compositeLinearScore100,
    totalQuestions,
    totalAnswered,
    totalValid,
    totalNA,
    totalUnanswered,
    validPercentage,
    status,
    scoringMethod: 'equal_weights',
    referenceTier,
    insufficientReason,
  };
}

/**
 * Calculates arithmetic mean of a numbers array.
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

/**
 * Calculates standard deviation (sample standard deviation).
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = calculateMean(values);
  const sumSquaredDiff = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.round(Math.sqrt(sumSquaredDiff / (values.length - 1)) * 100) / 100;
}

/**
 * Generates distribution bins for Likert averages (1.0-1.99, 2.0-2.99, 3.0-3.99, 4.0-5.0).
 */
export function calculateScoreDistribution(values: number[]): { bin: string; count: number; percentage: number }[] {
  const bins = [
    { bin: '1.0 - 1.99', min: 1.0, max: 1.99, count: 0, percentage: 0 },
    { bin: '2.0 - 2.99', min: 2.0, max: 2.99, count: 0, percentage: 0 },
    { bin: '3.0 - 3.99', min: 3.0, max: 3.99, count: 0, percentage: 0 },
    { bin: '4.0 - 5.00', min: 4.0, max: 5.01, count: 0, percentage: 0 },
  ];

  if (values.length === 0) return bins;

  for (const v of values) {
    for (const b of bins) {
      if (v >= b.min && v < b.max) {
        b.count++;
        break;
      }
    }
  }

  for (const b of bins) {
    b.percentage = Math.round((b.count / values.length) * 1000) / 10;
  }

  return bins;
}
