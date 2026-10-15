import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertLikertToLinear100,
  calculateAssessmentResult,
  calculateMean,
  calculateStandardDeviation,
  calculateScoreDistribution,
  getReferenceTier
} from './scoring.ts';
import type { Criterion, Domain, LikertValue } from '../types/index.ts';

const mockDomains: Domain[] = [
  { id: 'd1', code: 'KH', title: 'Lập kế hoạch', shortTitle: 'Kế hoạch', description: '', weight: 1/3, color: '#2563eb' },
  { id: 'd2', code: 'CD', title: 'Chủ động', shortTitle: 'Chủ động', description: '', weight: 1/3, color: '#059669' },
  { id: 'd3', code: 'AI', title: 'Năng lực AI', shortTitle: 'AI', description: '', weight: 1/3, color: '#7c3aed' },
];

const mockCriteria: Criterion[] = [
  { id: 'c1', code: 'KH-01', domainId: 'd1', title: 'Mục tiêu', question: 'Q1', description: '', instruction: '', version: '1.0', isActive: true, order: 1 },
  { id: 'c2', code: 'KH-02', domainId: 'd1', title: 'Thời gian', question: 'Q2', description: '', instruction: '', version: '1.0', isActive: true, order: 2 },
  { id: 'c3', code: 'CD-01', domainId: 'd2', title: 'Tìm tòi', question: 'Q3', description: '', instruction: '', version: '1.0', isActive: true, order: 3 },
  { id: 'c4', code: 'CD-02', domainId: 'd2', title: 'Kiên trì', question: 'Q4', description: '', instruction: '', version: '1.0', isActive: true, order: 4 },
  { id: 'c5', code: 'AI-01', domainId: 'd3', title: 'Kiểm chứng', question: 'Q5', description: '', instruction: '', version: '1.0', isActive: true, order: 5 },
  { id: 'c6', code: 'AI-02', domainId: 'd3', title: 'Đạo đức', question: 'Q6', description: '', instruction: '', version: '1.0', isActive: true, order: 6 },
];

test('convertLikertToLinear100 transforms 1-5 scale to 0-100 properly', () => {
  assert.equal(convertLikertToLinear100(1.0), 0);
  assert.equal(convertLikertToLinear100(3.0), 50);
  assert.equal(convertLikertToLinear100(5.0), 100);
  assert.equal(convertLikertToLinear100(4.0), 75);
  assert.equal(convertLikertToLinear100(null), null);
});

test('calculateAssessmentResult calculates valid means correctly', () => {
  const answers: Record<string, LikertValue> = {
    c1: 4,
    c2: 4, // domain d1 mean = 4.0
    c3: 3,
    c4: 5, // domain d2 mean = 4.0
    c5: 5,
    c6: 5, // domain d3 mean = 5.0
  };

  const res = calculateAssessmentResult(answers, mockCriteria, mockDomains, 70);
  assert.equal(res.status, 'sufficient');
  assert.equal(res.totalQuestions, 6);
  assert.equal(res.totalValid, 6);
  assert.equal(res.validPercentage, 100);
  assert.equal(res.domainScores['d1'].meanScore, 4.0);
  assert.equal(res.domainScores['d2'].meanScore, 4.0);
  assert.equal(res.domainScores['d3'].meanScore, 5.0);
  // (4 + 4 + 5) / 3 = 4.33
  assert.equal(res.compositeScore, 4.33);
  assert.equal(res.compositeLinearScore100, 83.3);
});

test('calculateAssessmentResult excludes N/A from arithmetic mean without counting as 0 or 1', () => {
  const answers: Record<string, LikertValue> = {
    c1: 4,
    c2: 'N/A', // 1 valid answer of 4 -> domain d1 mean should be 4.0, not (4+0)/2=2 or (4+1)/2=2.5
    c3: 4,
    c4: 4,
    c5: 4,
    c6: 4,
  };

  const res = calculateAssessmentResult(answers, mockCriteria, mockDomains, 70);
  assert.equal(res.domainScores['d1'].validAnswerCount, 1);
  assert.equal(res.domainScores['d1'].naCount, 1);
  assert.equal(res.domainScores['d1'].meanScore, 4.0);
  assert.equal(res.totalNA, 1);
  assert.equal(res.totalValid, 5);
  // validPercentage = 5/6 = 83.3% >= 70%
  assert.equal(res.status, 'sufficient');
});

test('calculateAssessmentResult marks status as insufficient_data when below threshold', () => {
  const answers: Record<string, LikertValue> = {
    c1: 5,
    c2: 4,
    // c3, c4, c5, c6 missing -> only 2 out of 6 valid = 33.3% < 70%
  };

  const res = calculateAssessmentResult(answers, mockCriteria, mockDomains, 70);
  assert.equal(res.status, 'insufficient_data');
  assert.equal(res.compositeScore, null);
  assert.equal(res.compositeLinearScore100, null);
  assert.ok(res.insufficientReason?.includes('chưa đạt ngưỡng'));
});

test('calculateMean and calculateStandardDeviation produce accurate statistics', () => {
  const values = [2, 4, 4, 4, 5, 5, 7, 9];
  assert.equal(calculateMean(values), 5.0);
  assert.equal(calculateStandardDeviation(values), 2.14);
});

test('calculateScoreDistribution categorizes values into bins', () => {
  const values = [1.5, 2.5, 3.2, 3.8, 4.5, 4.8];
  const dist = calculateScoreDistribution(values);
  assert.equal(dist[0].count, 1); // 1.0-1.99
  assert.equal(dist[1].count, 1); // 2.0-2.99
  assert.equal(dist[2].count, 2); // 3.0-3.99
  assert.equal(dist[3].count, 2); // 4.0-5.0
});

test('getReferenceTier returns appropriate tentative research tier', () => {
  const tierHigh = getReferenceTier(4.5);
  assert.equal(tierHigh?.badgeColor, 'emerald');

  const tierMid = getReferenceTier(3.0);
  assert.equal(tierMid?.badgeColor, 'amber');

  const tierNull = getReferenceTier(null);
  assert.equal(tierNull, null);
});
