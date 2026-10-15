import {
  User,
  Domain,
  Criterion,
  AssessmentSession,
  Evidence,
  ImprovementPlan,
  ResearchStudyBatch,
  TrialFeedback,
  AuditLog,
  LikertValue,
} from '../types/index.ts';
import { INITIAL_DOMAINS, INITIAL_CRITERIA } from '../data/criteriaData.ts';
import { calculateAssessmentResult } from '../utils/scoring.ts';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'selflearn_current_user_id',
  USERS: 'selflearn_users',
  DOMAINS: 'selflearn_domains',
  CRITERIA: 'selflearn_criteria',
  SESSIONS: 'selflearn_sessions',
  EVIDENCE: 'selflearn_evidence',
  PLANS: 'selflearn_plans',
  STUDY_BATCHES: 'selflearn_study_batches',
  FEEDBACK: 'selflearn_feedback',
  AUDIT_LOGS: 'selflearn_audit_logs',
  VERSION: 'selflearn_data_version_1_0',
};

export const DEMO_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@student.edu.vn',
    role: 'student',
    studentCode: 'SV-2026-081',
    major: 'Công nghệ thông tin',
    university: 'Đại học Quốc gia',
    cohort: 'Khóa 2023 - 2027',
    createdAt: '2026-08-15T08:00:00Z',
    dataSharingConsent: true,
  },
  {
    id: 'user-researcher-1',
    name: 'TS. Lê Hoàng Nam',
    email: 'nam.le@research.edu.vn',
    role: 'researcher',
    university: 'Viện Nghiên cứu Sư phạm & Công nghệ Giáo dục',
    createdAt: '2026-07-01T08:00:00Z',
    dataSharingConsent: true,
  },
  {
    id: 'user-admin-1',
    name: 'Quản trị viên Hệ thống',
    email: 'admin@selflearn.ai',
    role: 'admin',
    createdAt: '2026-06-01T08:00:00Z',
    dataSharingConsent: true,
  },
  // Additional students for cohort analysis
  {
    id: 'user-student-2',
    name: 'Trần Thị Mai',
    email: 'mai.tran@student.edu.vn',
    role: 'student',
    studentCode: 'SV-2026-092',
    major: 'Khoa học Dữ liệu',
    university: 'Đại học Bách Khoa',
    cohort: 'Khóa 2024 - 2028',
    createdAt: '2026-09-01T09:00:00Z',
    dataSharingConsent: true,
  },
  {
    id: 'user-student-3',
    name: 'Lê Quốc Bảo',
    email: 'bao.le@student.edu.vn',
    role: 'student',
    studentCode: 'SV-2026-103',
    major: 'Hệ thống Thông tin',
    university: 'Đại học Quốc gia',
    cohort: 'Khóa 2023 - 2027',
    createdAt: '2026-09-02T10:00:00Z',
    dataSharingConsent: true,
  },
  {
    id: 'user-student-4',
    name: 'Phạm Thu Hà',
    email: 'ha.pham@student.edu.vn',
    role: 'student',
    studentCode: 'SV-2026-114',
    major: 'Sư phạm Toán - Tin',
    university: 'Đại học Sư phạm',
    cohort: 'Khóa 2022 - 2026',
    createdAt: '2026-09-05T11:00:00Z',
    dataSharingConsent: true,
  },
  {
    id: 'user-student-5',
    name: 'Hoàng Đức Anh',
    email: 'anh.hoang@student.edu.vn',
    role: 'student',
    studentCode: 'SV-2026-125',
    major: 'Kỹ thuật Phần mềm',
    university: 'Đại học Công nghệ',
    cohort: 'Khóa 2023 - 2027',
    createdAt: '2026-09-10T14:00:00Z',
    dataSharingConsent: true,
  },
];

export const DEMO_BATCHES: ResearchStudyBatch[] = [
  {
    id: 'batch-01',
    code: 'DOT-2026-01',
    title: 'Thử nghiệm Đợt 1: Đánh giá thí điểm sinh viên nhóm ngành Kỹ thuật & CNTT',
    description: 'Nghiên cứu thăm dò tính khả thi và độ rõ ràng của bộ tiêu chí tự học trong môi trường có Generative AI.',
    targetAudience: 'Sinh viên năm 2 - năm 4 khối ngành Công nghệ & Kỹ thuật',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    status: 'active',
    criteriaVersion: 'v1.0-research',
    minCompletionThreshold: 70,
  },
  {
    id: 'batch-02',
    code: 'DOT-2026-02',
    title: 'Thử nghiệm Đợt 2: Khảo sát mở rộng đa ngành (Kinh tế & Sư phạm)',
    description: 'Đợt nghiên cứu tiếp theo nhằm so sánh hành vi ứng dụng AI tự học giữa các nhóm ngành khoa học xã hội và tự nhiên.',
    targetAudience: 'Sinh viên đại trà các trường thành viên',
    startDate: '2026-12-01',
    endDate: '2027-03-31',
    status: 'draft',
    criteriaVersion: 'v1.0-research',
    minCompletionThreshold: 70,
  },
];

function generateSeedSessions(): AssessmentSession[] {
  // Baseline assessment for Student 1 (done 3 months ago)
  const baselineAnswers: Record<string, LikertValue> = {
    'crit-kh-01': 3, 'crit-kh-02': 3, 'crit-kh-03': 2, 'crit-kh-04': 3,
    'crit-cd-01': 4, 'crit-cd-02': 3, 'crit-cd-03': 3, 'crit-cd-04': 3,
    'crit-gs-01': 3, 'crit-gs-02': 2, 'crit-gs-03': 3, 'crit-gs-04': 3,
    'crit-pb-01': 2, 'crit-pb-02': 3, 'crit-pb-03': 2, 'crit-pb-04': 3,
    'crit-ai-01': 3, 'crit-ai-02': 3, 'crit-ai-03': 2, 'crit-ai-04': 2, 'crit-ai-05': 3, 'crit-ai-06': 3,
    'crit-pt-01': 2, 'crit-pt-02': 3, 'crit-pt-03': 2, 'crit-pt-04': 3,
  };
  const baselineResult = calculateAssessmentResult(baselineAnswers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  // Latest assessment for Student 1 (improved)
  const latestAnswers: Record<string, LikertValue> = {
    'crit-kh-01': 4, 'crit-kh-02': 4, 'crit-kh-03': 4, 'crit-kh-04': 4,
    'crit-cd-01': 5, 'crit-cd-02': 4, 'crit-cd-03': 4, 'crit-cd-04': 4,
    'crit-gs-01': 4, 'crit-gs-02': 3, 'crit-gs-03': 4, 'crit-gs-04': 4,
    'crit-pb-01': 4, 'crit-pb-02': 4, 'crit-pb-03': 3, 'crit-pb-04': 4,
    'crit-ai-01': 4, 'crit-ai-02': 5, 'crit-ai-03': 4, 'crit-ai-04': 4, 'crit-ai-05': 5, 'crit-ai-06': 4,
    'crit-pt-01': 4, 'crit-pt-02': 4, 'crit-pt-03': 3, 'crit-pt-04': 4,
  };
  const latestResult = calculateAssessmentResult(latestAnswers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  // Student 2 session
  const s2Answers: Record<string, LikertValue> = {
    'crit-kh-01': 5, 'crit-kh-02': 4, 'crit-kh-03': 5, 'crit-kh-04': 5,
    'crit-cd-01': 5, 'crit-cd-02': 5, 'crit-cd-03': 5, 'crit-cd-04': 4,
    'crit-gs-01': 4, 'crit-gs-02': 4, 'crit-gs-03': 5, 'crit-gs-04': 4,
    'crit-pb-01': 5, 'crit-pb-02': 5, 'crit-pb-03': 4, 'crit-pb-04': 5,
    'crit-ai-01': 5, 'crit-ai-02': 5, 'crit-ai-03': 5, 'crit-ai-04': 4, 'crit-ai-05': 5, 'crit-ai-06': 5,
    'crit-pt-01': 4, 'crit-pt-02': 5, 'crit-pt-03': 4, 'crit-pt-04': 5,
  };
  const s2Result = calculateAssessmentResult(s2Answers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  // Student 3 session
  const s3Answers: Record<string, LikertValue> = {
    'crit-kh-01': 3, 'crit-kh-02': 2, 'crit-kh-03': 2, 'crit-kh-04': 3,
    'crit-cd-01': 3, 'crit-cd-02': 2, 'crit-cd-03': 3, 'crit-cd-04': 2,
    'crit-gs-01': 2, 'crit-gs-02': 2, 'crit-gs-03': 3, 'crit-gs-04': 2,
    'crit-pb-01': 2, 'crit-pb-02': 2, 'crit-pb-03': 2, 'crit-pb-04': 3,
    'crit-ai-01': 4, 'crit-ai-02': 3, 'crit-ai-03': 2, 'crit-ai-04': 2, 'crit-ai-05': 3, 'crit-ai-06': 2,
    'crit-pt-01': 2, 'crit-pt-02': 2, 'crit-pt-03': 2, 'crit-pt-04': 2,
  };
  const s3Result = calculateAssessmentResult(s3Answers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  // Student 4 session
  const s4Answers: Record<string, LikertValue> = {
    'crit-kh-01': 4, 'crit-kh-02': 4, 'crit-kh-03': 3, 'crit-kh-04': 4,
    'crit-cd-01': 4, 'crit-cd-02': 4, 'crit-cd-03': 4, 'crit-cd-04': 4,
    'crit-gs-01': 4, 'crit-gs-02': 3, 'crit-gs-03': 4, 'crit-gs-04': 3,
    'crit-pb-01': 4, 'crit-pb-02': 4, 'crit-pb-03': 3, 'crit-pb-04': 4,
    'crit-ai-01': 4, 'crit-ai-02': 4, 'crit-ai-03': 4, 'crit-ai-04': 3, 'crit-ai-05': 4, 'crit-ai-06': 4,
    'crit-pt-01': 3, 'crit-pt-02': 4, 'crit-pt-03': 3, 'crit-pt-04': 4,
  };
  const s4Result = calculateAssessmentResult(s4Answers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  // Student 5 incomplete session
  const s5Answers: Record<string, LikertValue> = {
    'crit-kh-01': 3, 'crit-kh-02': 3, 'crit-kh-03': 2,
  };
  const s5Result = calculateAssessmentResult(s5Answers, INITIAL_CRITERIA, INITIAL_DOMAINS);

  return [
    {
      id: 'session-an-baseline',
      userId: 'user-student-1',
      userName: 'Nguyễn Văn An',
      userStudentCode: 'SV-2026-081',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: baselineAnswers,
      result: baselineResult,
      status: 'completed',
      consentAccepted: true,
      startedAt: '2026-07-10T09:00:00Z',
      lastSavedAt: '2026-07-10T09:25:00Z',
      completedAt: '2026-07-10T09:25:00Z',
    },
    {
      id: 'session-an-latest',
      userId: 'user-student-1',
      userName: 'Nguyễn Văn An',
      userStudentCode: 'SV-2026-081',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: latestAnswers,
      result: latestResult,
      status: 'completed',
      consentAccepted: true,
      startedAt: '2026-10-12T14:00:00Z',
      lastSavedAt: '2026-10-12T14:30:00Z',
      completedAt: '2026-10-12T14:30:00Z',
    },
    {
      id: 'session-mai',
      userId: 'user-student-2',
      userName: 'Trần Thị Mai',
      userStudentCode: 'SV-2026-092',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: s2Answers,
      result: s2Result,
      status: 'completed',
      consentAccepted: true,
      startedAt: '2026-10-05T08:00:00Z',
      lastSavedAt: '2026-10-05T08:22:00Z',
      completedAt: '2026-10-05T08:22:00Z',
    },
    {
      id: 'session-bao',
      userId: 'user-student-3',
      userName: 'Lê Quốc Bảo',
      userStudentCode: 'SV-2026-103',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: s3Answers,
      result: s3Result,
      status: 'completed',
      consentAccepted: true,
      startedAt: '2026-10-08T10:15:00Z',
      lastSavedAt: '2026-10-08T10:35:00Z',
      completedAt: '2026-10-08T10:35:00Z',
    },
    {
      id: 'session-ha',
      userId: 'user-student-4',
      userName: 'Phạm Thu Hà',
      userStudentCode: 'SV-2026-114',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: s4Answers,
      result: s4Result,
      status: 'completed',
      consentAccepted: true,
      startedAt: '2026-10-11T16:00:00Z',
      lastSavedAt: '2026-10-11T16:20:00Z',
      completedAt: '2026-10-11T16:20:00Z',
    },
    {
      id: 'session-anh-draft',
      userId: 'user-student-5',
      userName: 'Hoàng Đức Anh',
      userStudentCode: 'SV-2026-125',
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers: s5Answers,
      result: s5Result,
      status: 'draft',
      consentAccepted: true,
      startedAt: '2026-10-14T11:00:00Z',
      lastSavedAt: '2026-10-14T11:10:00Z',
    },
  ];
}

export const DEMO_EVIDENCE: Evidence[] = [
  {
    id: 'ev-01',
    userId: 'user-student-1',
    title: 'Nhật ký Prompting và Kiểm chứng chéo mã nguồn Python',
    type: 'ai_prompt_log',
    description: 'Tài liệu ghi lại toàn bộ chuỗi câu lệnh hỏi trợ lý AI giải thích thuật toán Dijkstra và nhật ký đối chiếu mã nguồn do AI sinh ra với sách giáo trình của Cormen.',
    linkedDomainIds: ['domain-ai-competence', 'domain-critical'],
    linkedCriteriaCodes: ['AI-02', 'AI-03', 'PB-01'],
    date: '2026-10-02',
    resourceLink: 'https://github.com/example/student-dijkstra-study',
    attachmentName: 'BaoCao_KiemChung_Dijkstra_v1.pdf',
    aiPurpose: 'Nhờ AI giải thích từng bước lan truyền khoảng cách và gợi ý cấu trúc dữ liệu PriorityQueue phù hợp.',
    aiVerificationMethod: 'Chạy thử nghiệm trên 5 bộ test case độc lập và đối chiếu giả mã trong sách giáo trình môn Cấu trúc dữ liệu.',
    studentOwnWork: 'Tự viết lại mã nguồn hoàn chỉnh bằng tay, tự vẽ biểu đồ luồng dữ liệu và viết báo cáo phân tích độ phức tạp O(E log V).',
    keyTakeaway: 'AI rất mạnh trong việc gợi mở ý tưởng, nhưng ban đầu đã đề xuất thư viện không tối ưu. Nhờ đối chiếu tài liệu chuẩn, em đã phát hiện và tự điều chỉnh.',
    visibility: 'shared_researcher',
    createdAt: '2026-10-02T15:30:00Z',
    updatedAt: '2026-10-02T15:30:00Z',
  },
  {
    id: 'ev-02',
    userId: 'user-student-1',
    title: 'Bảng phân rã mục tiêu và Kế hoạch tuần môn Lập trình Web',
    type: 'study_plan',
    description: 'Bảng theo dõi tiến độ Kanban cá nhân chia đồ án lớn thành 4 sprint, quy định thời gian biểu học lý thuyết và thực hành cụ thể.',
    linkedDomainIds: ['domain-planning', 'domain-monitoring'],
    linkedCriteriaCodes: ['KH-01', 'KH-02', 'KH-03', 'GS-01'],
    date: '2026-09-20',
    resourceLink: 'https://notion.so/example-study-plan-srl',
    attachmentName: 'KeHoach_HocTap_WebDev.xlsx',
    aiPurpose: 'Dùng AI để brainstorm danh sách các tiêu chí kỹ thuật cần có của một ứng dụng React chuẩn RESTful.',
    aiVerificationMethod: 'Đối chiếu với đề cương học phần do thầy phụ trách bộ môn công bố.',
    studentOwnWork: 'Tự lượng hóa quỹ thời gian cá nhân mỗi tuần (12 giờ), thiết lập mốc kiểm tra và tự đánh giá tỷ lệ đạt mục tiêu.',
    keyTakeaway: 'Chia nhỏ nhiệm vụ giúp giảm cảm giác trì hoãn khi đối diện đề tài quy mô lớn.',
    visibility: 'shared_researcher',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ev-03',
    userId: 'user-student-1',
    title: 'Ghi chú phản tư sau buổi bảo vệ đồ án giữa kỳ',
    type: 'reflection_log',
    description: 'Nhật ký tự đánh giá sau khi nhận phản hồi từ hội đồng: phân tích nguyên nhân thiếu sót trong việc tối ưu cơ sở dữ liệu và kế hoạch khắc phục.',
    linkedDomainIds: ['domain-reflection', 'domain-initiative'],
    linkedCriteriaCodes: ['PT-01', 'PT-02', 'PT-03', 'CD-04'],
    date: '2026-10-10',
    attachmentName: 'NhatKy_PhanTu_GiuaKy.docx',
    aiPurpose: 'Nhờ AI phân tích nguyên lý đánh chỉ mục B-Tree và đề xuất 3 bài tập tình huống để tự luyện tập.',
    aiVerificationMethod: 'Thực hành giải quyết và kiểm tra chỉ số Query Execution Plan trong pgAdmin.',
    studentOwnWork: 'Toàn bộ nội dung tự kiểm điểm nhận thức, xác định lỗi tư duy chủ quan và cam kết lịch học bù đắp kiến thức.',
    keyTakeaway: 'Phản hồi từ giảng viên là cơ hội vàng để nhận ra điểm mù mà trước đó cả em lẫn trợ lý AI đều bỏ sót.',
    visibility: 'private',
    createdAt: '2026-10-10T19:00:00Z',
    updatedAt: '2026-10-10T19:00:00Z',
  },
];

export const DEMO_PLANS: ImprovementPlan[] = [
  {
    id: 'plan-01',
    userId: 'user-student-1',
    targetDomainId: 'domain-critical',
    goalTitle: 'Nâng cao thói quen kiểm chứng chéo thông tin (Cross-verification)',
    actionSteps: [
      'Với mỗi kết quả hoặc giải pháp kỹ thuật do AI đề xuất, luôn mở ít nhất 1 bài báo khoa học hoặc tài liệu chính thức (Official Docs) để đối chiếu.',
      'Lập bảng theo dõi: Luận điểm AI đưa ra vs Dữ liệu từ tài liệu chuẩn.',
      'Tự đặt câu hỏi phản biện: "Giải pháp này có lỗ hổng hoặc giả định ngầm nào không?".'
    ],
    deadline: '2026-11-15',
    status: 'in_progress',
    reflectionNote: 'Đã áp dụng được 3 tuần, thấy tự tin hơn nhiều khi trả lời vấn đáp với giảng viên.',
    baselineScore: 3.25,
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'plan-02',
    userId: 'user-student-1',
    targetDomainId: 'domain-ai-competence',
    goalTitle: 'Hoàn thiện kỹ năng viết Prompt học thuật chuẩn cấu trúc',
    actionSteps: [
      'Áp dụng công thức Prompt 4 thành phần: Vai trò - Bối cảnh - Yêu cầu cụ thể - Tiêu chí kiểm định.',
      'Yêu cầu AI chỉ đóng vai trò người phản biện (Socratic Coach) thay vì viết hộ toàn bộ bài làm.',
      'Lưu trữ kho Prompt học tập cá nhân trên Notion.'
    ],
    deadline: '2026-11-30',
    status: 'in_progress',
    reflectionNote: 'Kỹ năng hỏi cải thiện rõ rệt, AI không còn đưa ra các câu trả lời chung chung.',
    baselineScore: 3.5,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-05T09:00:00Z',
  },
];

export const DEMO_FEEDBACKS: TrialFeedback[] = [
  {
    id: 'fb-01',
    userId: 'user-student-1',
    userRole: 'student',
    studyBatchId: 'batch-01',
    clarityRating: 5,
    relevanceRating: 5,
    usabilityRating: 4,
    feedbackNotes: 'Các câu hỏi về năng lực sử dụng AI rất thực tế, đúng với những cám dỗ và tình huống tụi em gặp khi dùng ChatGPT trong học tập. Giao diện trực quan.',
    submittedAt: '2026-10-12T14:35:00Z',
  },
  {
    id: 'fb-02',
    userId: 'user-researcher-1',
    userRole: 'researcher',
    studyBatchId: 'batch-01',
    clarityRating: 4,
    relevanceRating: 5,
    usabilityRating: 5,
    feedbackNotes: 'Bộ tiêu chí 6 lĩnh vực phân định rõ giữa tự điều chỉnh chung (Zimmerman) và năng lực AI đặc thù. Cần thu thập thêm dữ liệu định tính ở câu hỏi AI-03 và PB-01 để hiệu chuẩn độ tin cậy Cronbach Alpha.',
    submittedAt: '2026-10-13T10:00:00Z',
  },
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-01T08:00:00Z',
    actorId: 'user-admin-1',
    actorName: 'Quản trị viên Hệ thống',
    actorRole: 'admin',
    action: 'CREATE_STUDY_BATCH',
    entityType: 'study_batch',
    entityId: 'batch-01',
    details: 'Khởi tạo đợt khảo sát thử nghiệm DOT-2026-01 với ngưỡng hoàn thành 70%.',
  },
  {
    id: 'log-02',
    timestamp: '2026-09-01T08:30:00Z',
    actorId: 'user-admin-1',
    actorName: 'Quản trị viên Hệ thống',
    actorRole: 'admin',
    action: 'PUBLISH_CRITERIA_VERSION',
    entityType: 'criteria',
    entityId: 'v1.0-research',
    details: 'Ban hành phiên bản bộ tiêu chí v1.0-research gồm 6 lĩnh vực và 26 tiêu chí thử nghiệm.',
  },
  {
    id: 'log-03',
    timestamp: '2026-10-12T14:30:00Z',
    actorId: 'user-student-1',
    actorName: 'Nguyễn Văn An',
    actorRole: 'student',
    action: 'SUBMIT_ASSESSMENT',
    entityType: 'assessment',
    entityId: 'session-an-latest',
    details: 'Hoàn thành tự đánh giá năng lực tự học lần 2 với 26/26 câu trả lời hợp lệ.',
  },
];

/**
 * Storage Service with LocalStorage persistence and initial demo seeding.
 */
class StorageService {
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;
    try {
      const initialized = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (!initialized) {
        this.resetToDefaults();
      }
    } catch {
      // In case of local storage disabled or memory fallback
    }
    this.isInitialized = true;
  }

  public resetToDefaults() {
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, '1.0');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USERS[0].id);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(INITIAL_DOMAINS));
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(INITIAL_CRITERIA));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(generateSeedSessions()));
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(DEMO_EVIDENCE));
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(DEMO_PLANS));
      localStorage.setItem(STORAGE_KEYS.STUDY_BATCHES, JSON.stringify(DEMO_BATCHES));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(DEMO_FEEDBACKS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEMO_AUDIT_LOGS));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // --- User & Auth ---
  public getUsers(): User[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  }

  public getCurrentUser(): User {
    this.init();
    const users = this.getUsers();
    try {
      const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
    } catch {}
    return users[0] || DEMO_USERS[0];
  }

  public setCurrentUser(userId: string): User {
    this.init();
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } catch {}
    return user;
  }

  public registerStudent(userData: Omit<User, 'id' | 'role' | 'createdAt'>): User {
    this.init();
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Email này đã được đăng ký trong hệ thống.');
    }

    const newUser: User = {
      ...userData,
      id: `user-student-${Date.now()}`,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    } catch {}

    this.logAction(newUser.id, newUser.name, 'student', 'REGISTER', 'user', newUser.id, 'Đăng ký tài khoản sinh viên mới.');
    return newUser;
  }

  public updateUserProfile(userId: string, updates: Partial<User>): User {
    this.init();
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {}
    return users[index];
  }

  // --- Domains & Criteria ---
  public getDomains(): Domain[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOMAINS);
      return data ? JSON.parse(data) : INITIAL_DOMAINS;
    } catch {
      return INITIAL_DOMAINS;
    }
  }

  public saveDomains(domains: Domain[]) {
    this.init();
    try {
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
    } catch {}
  }

  public getCriteria(): Criterion[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CRITERIA);
      return data ? JSON.parse(data) : INITIAL_CRITERIA;
    } catch {
      return INITIAL_CRITERIA;
    }
  }

  public saveCriteria(criteria: Criterion[]) {
    this.init();
    try {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
    } catch {}
  }

  public addCriterion(criterion: Omit<Criterion, 'id' | 'order'>): Criterion {
    this.init();
    const list = this.getCriteria();
    const newCrit: Criterion = {
      ...criterion,
      id: `crit-custom-${Date.now()}`,
      order: list.length + 1,
    };
    list.push(newCrit);
    this.saveCriteria(list);
    const currentUser = this.getCurrentUser();
    this.logAction(currentUser.id, currentUser.name, currentUser.role, 'ADD_CRITERION', 'criteria', newCrit.id, `Thêm tiêu chí mới: ${newCrit.code} - ${newCrit.title}`);
    return newCrit;
  }

  public updateCriterion(id: string, updates: Partial<Criterion>): Criterion {
    this.init();
    const list = this.getCriteria();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Criterion not found');
    list[idx] = { ...list[idx], ...updates };
    this.saveCriteria(list);
    const currentUser = this.getCurrentUser();
    this.logAction(currentUser.id, currentUser.name, currentUser.role, 'UPDATE_CRITERION', 'criteria', id, `Cập nhật tiêu chí: ${list[idx].code}`);
    return list[idx];
  }

  // --- Assessment Sessions ---
  public getSessions(): AssessmentSession[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getSessionsForUser(userId: string): AssessmentSession[] {
    return this.getSessions().filter((s) => s.userId === userId);
  }

  public getSessionById(sessionId: string): AssessmentSession | undefined {
    return this.getSessions().find((s) => s.id === sessionId);
  }

  public saveSessionDraft(session: Omit<AssessmentSession, 'id' | 'lastSavedAt'> & { id?: string }): AssessmentSession {
    this.init();
    const sessions = this.getSessions();
    const now = new Date().toISOString();
    const id = session.id || `session-${Date.now()}`;

    const updated: AssessmentSession = {
      ...session,
      id,
      lastSavedAt: now,
    };

    const idx = sessions.findIndex((s) => s.id === id);
    if (idx >= 0) {
      sessions[idx] = updated;
    } else {
      sessions.unshift(updated);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {}

    return updated;
  }

  public completeSession(sessionId: string): AssessmentSession {
    this.init();
    const sessions = this.getSessions();
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) throw new Error('Session not found');

    const session = sessions[idx];
    const criteria = this.getCriteria();
    const domains = this.getDomains();
    const calcResult = calculateAssessmentResult(session.answers, criteria, domains);

    session.result = calcResult;
    session.completedAt = new Date().toISOString();
    session.lastSavedAt = session.completedAt;
    session.status = calcResult.status === 'sufficient' ? 'completed' : 'insufficient_data';

    sessions[idx] = session;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {}

    const currentUser = this.getCurrentUser();
    this.logAction(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'SUBMIT_ASSESSMENT',
      'assessment',
      sessionId,
      `Nộp bài tự đánh giá. Điểm tổng hợp: ${calcResult.compositeScore ?? 'Chưa đủ dữ liệu'}`
    );

    return session;
  }

  // --- Learning Evidence ---
  public getEvidence(): Evidence[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
      return data ? JSON.parse(data) : DEMO_EVIDENCE;
    } catch {
      return DEMO_EVIDENCE;
    }
  }

  public getEvidenceForUser(userId: string): Evidence[] {
    return this.getEvidence().filter((e) => e.userId === userId);
  }

  public saveEvidence(evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Evidence {
    this.init();
    const list = this.getEvidence();
    const now = new Date().toISOString();
    const id = evidenceData.id || `ev-${Date.now()}`;

    const newOrUpdated: Evidence = {
      ...evidenceData,
      id,
      createdAt: evidenceData.id ? (list.find((e) => e.id === evidenceData.id)?.createdAt || now) : now,
      updatedAt: now,
    };

    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx] = newOrUpdated;
    } else {
      list.unshift(newOrUpdated);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));
    } catch {}

    const user = this.getCurrentUser();
    this.logAction(user.id, user.name, user.role, evidenceData.id ? 'UPDATE_EVIDENCE' : 'ADD_EVIDENCE', 'evidence', id, `Lưu minh chứng: ${newOrUpdated.title}`);
    return newOrUpdated;
  }

  public deleteEvidence(id: string): boolean {
    this.init();
    const list = this.getEvidence();
    const item = list.find((e) => e.id === id);
    if (!item) return false;

    const filtered = list.filter((e) => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(filtered));
    } catch {}

    const user = this.getCurrentUser();
    this.logAction(user.id, user.name, user.role, 'DELETE_EVIDENCE', 'evidence', id, `Xóa minh chứng: ${item.title}`);
    return true;
  }

  // --- Improvement Plans ---
  public getPlans(): ImprovementPlan[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      return data ? JSON.parse(data) : DEMO_PLANS;
    } catch {
      return DEMO_PLANS;
    }
  }

  public getPlansForUser(userId: string): ImprovementPlan[] {
    return this.getPlans().filter((p) => p.userId === userId);
  }

  public savePlan(planData: Omit<ImprovementPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): ImprovementPlan {
    this.init();
    const list = this.getPlans();
    const now = new Date().toISOString();
    const id = planData.id || `plan-${Date.now()}`;

    const newOrUpdated: ImprovementPlan = {
      ...planData,
      id,
      createdAt: planData.id ? (list.find((p) => p.id === planData.id)?.createdAt || now) : now,
      updatedAt: now,
    };

    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx] = newOrUpdated;
    } else {
      list.unshift(newOrUpdated);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(list));
    } catch {}

    const user = this.getCurrentUser();
    this.logAction(user.id, user.name, user.role, planData.id ? 'UPDATE_PLAN' : 'CREATE_PLAN', 'plan', id, `Kế hoạch cải thiện: ${newOrUpdated.goalTitle}`);
    return newOrUpdated;
  }

  public deletePlan(id: string): boolean {
    this.init();
    const list = this.getPlans();
    const filtered = list.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(filtered));
    } catch {}
    return true;
  }

  // --- Study Batches ---
  public getStudyBatches(): ResearchStudyBatch[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_BATCHES);
      return data ? JSON.parse(data) : DEMO_BATCHES;
    } catch {
      return DEMO_BATCHES;
    }
  }

  public saveStudyBatch(batch: ResearchStudyBatch): ResearchStudyBatch {
    this.init();
    const batches = this.getStudyBatches();
    const idx = batches.findIndex((b) => b.id === batch.id);
    if (idx >= 0) {
      batches[idx] = batch;
    } else {
      batches.unshift(batch);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_BATCHES, JSON.stringify(batches));
    } catch {}
    const user = this.getCurrentUser();
    this.logAction(user.id, user.name, user.role, 'SAVE_STUDY_BATCH', 'study_batch', batch.id, `Đợt nghiên cứu: ${batch.code} - ${batch.title}`);
    return batch;
  }

  // --- Feedback ---
  public getTrialFeedbacks(): TrialFeedback[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return data ? JSON.parse(data) : DEMO_FEEDBACKS;
    } catch {
      return DEMO_FEEDBACKS;
    }
  }

  public submitTrialFeedback(feedback: Omit<TrialFeedback, 'id' | 'submittedAt'>): TrialFeedback {
    this.init();
    const feedbacks = this.getTrialFeedbacks();
    const newFb: TrialFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    feedbacks.unshift(newFb);
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
    } catch {}
    return newFb;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : DEMO_AUDIT_LOGS;
    } catch {
      return DEMO_AUDIT_LOGS;
    }
  }

  public logAction(
    actorId: string,
    actorName: string,
    actorRole: User['role'],
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) {
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        actorId,
        actorName,
        actorRole,
        action,
        entityType,
        entityId,
        details,
      };
      logs.unshift(newLog);
      // Keep last 150 logs
      if (logs.length > 150) logs.pop();
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    } catch {}
  }

  // --- Right to erasure / Withdraw from study (Ethical research) ---
  public withdrawAndEraseUserData(userId: string): boolean {
    this.init();
    try {
      // 1. Remove user sessions
      const sessions = this.getSessions().filter((s) => s.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      // 2. Remove user evidence
      const evidence = this.getEvidence().filter((e) => e.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence));

      // 3. Remove user plans
      const plans = this.getPlans().filter((p) => p.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));

      // 4. Update user status or delete user
      const users = this.getUsers().filter((u) => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Reset current user to demo student 1 if erased current
      if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) === userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USERS[0].id);
      }

      this.logAction(userId, 'Ẩn danh', 'student', 'WITHDRAW_ERASE_DATA', 'user', userId, 'Thực hiện quyền rút khỏi nghiên cứu và xóa toàn bộ dữ liệu cá nhân theo chính sách đạo đức nghiên cứu.');
      return true;
    } catch {
      return false;
    }
  }

  // --- CSV Export for Researchers ---
  public exportResearchDataCSV(pseudonymize = true): string {
    this.init();
    const sessions = this.getSessions().filter((s) => s.status === 'completed');
    const domains = this.getDomains();
    const criteria = this.getCriteria();

    // Headers
    const headers = [
      'Session_ID',
      pseudonymize ? 'Participant_Code' : 'Student_Name',
      'Batch_Code',
      'Completion_Date',
      'Total_Valid_Rate',
      'Composite_Score_1_5',
      'Linear_Score_0_100',
      'Reference_Tier',
      // Domain scores
      ...domains.map((d) => `Domain_${d.code}_Score`),
      // Criteria responses
      ...criteria.map((c) => `Q_${c.code}`),
    ];

    const rows = sessions.map((s, index) => {
      const pseudoCode = `P-${String(index + 1).padStart(3, '0')}`;
      const participantLabel = pseudonymize ? pseudoCode : (s.userName || 'Ẩn danh');
      const compScore = s.result.compositeScore?.toFixed(2) || 'N/A';
      const linearScore = s.result.compositeLinearScore100?.toFixed(1) || 'N/A';
      const tier = s.result.referenceTier?.label || 'Chưa phân loại';

      const domainCols = domains.map((d) => {
        const dScore = s.result.domainScores[d.id]?.meanScore;
        return dScore !== null && dScore !== undefined ? dScore.toFixed(2) : 'N/A';
      });

      const criteriaCols = criteria.map((c) => {
        const ans = s.answers[c.id];
        return ans !== undefined && ans !== null ? String(ans) : 'MISSING';
      });

      return [
        s.id,
        `"${participantLabel}"`,
        s.studyBatchId,
        s.completedAt ? s.completedAt.split('T')[0] : 'N/A',
        `${s.result.validPercentage}%`,
        compScore,
        linearScore,
        `"${tier}"`,
        ...domainCols,
        ...criteriaCols,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}

export const storage = new StorageService();
