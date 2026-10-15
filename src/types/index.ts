/**
 * Types and Data Contracts for SelfLearn AI
 * System Supporting Student Self-Regulated Learning Assessment in AI Environments
 */

export type Role = 'student' | 'researcher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentCode?: string; // e.g., 'SV202401'
  major?: string;
  university?: string;
  cohort?: string; // Course/Year
  createdAt: string;
  dataSharingConsent?: boolean;
}

export type LikertValue = 1 | 2 | 3 | 4 | 5 | 'N/A';

export interface Criterion {
  id: string;
  code: string; // e.g., 'KH-01'
  domainId: string;
  title: string;
  question: string;
  description: string;
  instruction: string;
  version: string;
  isActive: boolean;
  isEvidenceRequired?: boolean;
  order: number;
}

export interface Domain {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  weight: number; // e.g. 16.66% or 1/6
  color: string;
}

export interface DomainScoreResult {
  domainId: string;
  domainCode: string;
  domainTitle: string;
  validAnswerCount: number;
  totalQuestionCount: number;
  naCount: number;
  unansweredCount: number;
  meanScore: number | null; // 1.0 - 5.0 scale, null if insufficient
  linearScore100: number | null; // 0 - 100 scale
  isSufficient: boolean;
  color: string;
}

export interface AssessmentCalculationResult {
  domainScores: Record<string, DomainScoreResult>;
  compositeScore: number | null; // 1.0 - 5.0
  compositeLinearScore100: number | null; // 0 - 100
  totalQuestions: number;
  totalAnswered: number;
  totalValid: number;
  totalNA: number;
  totalUnanswered: number;
  validPercentage: number;
  status: 'sufficient' | 'insufficient_data';
  scoringMethod: 'equal_weights' | 'custom_weights';
  referenceTier: {
    label: string;
    description: string;
    badgeColor: string;
  } | null;
  insufficientReason?: string;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  userName?: string;
  userStudentCode?: string;
  studyBatchId: string;
  criteriaVersion: string;
  answers: Record<string, LikertValue>; // criterionId -> LikertValue
  result: AssessmentCalculationResult;
  status: 'draft' | 'completed' | 'insufficient_data';
  consentAccepted: boolean;
  startedAt: string;
  lastSavedAt: string;
  completedAt?: string;
}

export type EvidenceType = 
  | 'assignment'
  | 'project'
  | 'reflection_log'
  | 'study_plan'
  | 'ai_prompt_log'
  | 'test_review'
  | 'other';

export interface Evidence {
  id: string;
  userId: string;
  title: string;
  type: EvidenceType;
  description: string;
  linkedDomainIds: string[];
  linkedCriteriaCodes: string[];
  date: string;
  resourceLink?: string;
  attachmentName?: string;
  // Specific AI reflection fields
  aiPurpose: string;
  aiVerificationMethod: string;
  studentOwnWork: string;
  keyTakeaway: string;
  visibility: 'private' | 'shared_researcher';
  createdAt: string;
  updatedAt: string;
}

export type PlanStatus = 'not_started' | 'in_progress' | 'completed';

export interface ImprovementPlan {
  id: string;
  userId: string;
  targetDomainId: string;
  goalTitle: string;
  actionSteps: string[];
  deadline: string;
  status: PlanStatus;
  reflectionNote: string;
  baselineScore?: number;
  postPlanScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchStudyBatch {
  id: string;
  code: string;
  title: string;
  description: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'draft';
  criteriaVersion: string;
  minCompletionThreshold: number; // percentage, e.g., 70
}

export interface TrialFeedback {
  id: string;
  userId: string;
  userRole: Role;
  studyBatchId: string;
  clarityRating: number; // 1-5
  relevanceRating: number; // 1-5
  usabilityRating: number; // 1-5
  feedbackNotes: string;
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: 'assessment' | 'evidence' | 'criteria' | 'plan' | 'user' | 'study_batch' | 'system';
  entityId: string;
  details: string;
}

export interface CriteriaVersionHistory {
  version: string;
  releasedDate: string;
  author: string;
  changeSummary: string;
  totalCriteriaCount: number;
}
