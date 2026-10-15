import React, { useState } from 'react';
import {
  FlaskConical,
  Download,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Printer,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  User,
  AssessmentSession,
  Domain,
  Criterion,
  Evidence,
  TrialFeedback,
  ResearchStudyBatch,
} from '../types/index.ts';
import {
  calculateMean,
  calculateStandardDeviation,
  calculateScoreDistribution,
} from '../utils/scoring.ts';
import { storage } from '../services/storage.ts';
import { DistributionHistogram } from '../components/charts/DistributionHistogram.tsx';

interface ResearcherDashboardProps {
  currentUser: User;
  sessions: AssessmentSession[];
  domains: Domain[];
  criteria: Criterion[];
  evidenceList: Evidence[];
  studyBatches: ResearchStudyBatch[];
}

export const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({
  currentUser,
  sessions,
  domains,
  criteria,
  evidenceList,
  studyBatches,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [pseudonymizeExport, setPseudonymizeExport] = useState(true);
  const [showTrialReportModal, setShowTrialReportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Feedback form state
  const [clarityRating, setClarityRating] = useState(5);
  const [relevanceRating, setRelevanceRating] = useState(5);
  const [usabilityRating, setUsabilityRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Filter sessions by batch
  const filteredSessions = sessions.filter(
    (s) => selectedBatchId === 'all' || s.studyBatchId === selectedBatchId
  );
  const completedSessions = filteredSessions.filter((s) => s.status === 'completed');
  const draftSessions = filteredSessions.filter((s) => s.status === 'draft');

  // Statistics
  const totalParticipants = filteredSessions.length;
  const totalCompleted = completedSessions.length;
  const completionRate = totalParticipants > 0 ? Math.round((totalCompleted / totalParticipants) * 100) : 0;

  // Composite scores array
  const compositeScores = completedSessions
    .map((s) => s.result.compositeScore)
    .filter((s): s is number => s !== null && s !== undefined);

  const meanComposite = calculateMean(compositeScores);
  const sdComposite = calculateStandardDeviation(compositeScores);
  const scoreDistribution = calculateScoreDistribution(compositeScores);

  // Domain level means & SDs
  const domainStats = domains.map((dom) => {
    const scores = completedSessions
      .map((s) => s.result.domainScores[dom.id]?.meanScore)
      .filter((s): s is number => s !== null && s !== undefined);
    const mean = calculateMean(scores);
    const sd = calculateStandardDeviation(scores);

    // Missing or N/A answers in this domain across all sessions
    const totalNaInDomain = completedSessions.reduce(
      (sum, s) => sum + (s.result.domainScores[dom.id]?.naCount || 0),
      0
    );

    return {
      domain: dom,
      mean,
      sd,
      sampleSize: scores.length,
      totalNA: totalNaInDomain,
    };
  });

  // Shared evidence only (respecting student privacy)
  const sharedEvidence = evidenceList.filter((e) => e.visibility === 'shared_researcher');

  // Trial Feedbacks
  const trialFeedbacks = storage.getTrialFeedbacks();

  const handleDownloadCSV = () => {
    const csvContent = storage.exportResearchDataCSV(pseudonymizeExport);
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `SelfLearn_Research_Data_${new Date().toISOString().split('T')[0]}_${
        pseudonymizeExport ? 'Pseudonymized' : 'Raw'
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    storage.submitTrialFeedback({
      userId: currentUser.id,
      userRole: currentUser.role,
      studyBatchId: selectedBatchId === 'all' ? 'batch-01' : selectedBatchId,
      clarityRating,
      relevanceRating,
      usabilityRating,
      feedbackNotes,
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowFeedbackModal(false);
      setFeedbackNotes('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" />
              Bảng Điều khiển Nghiên cứu & Khảo sát Thử nghiệm
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              DỮ LIỆU MINH HỌA
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Phân tích Dữ liệu Năng lực Tự học & Ứng dụng AI
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Tổng hợp dữ liệu thực nghiệm, tính toán trung bình (Mean), độ lệch chuẩn (SD), phân tích dữ liệu thiếu và xuất dữ liệu nghiên cứu chuẩn mực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowTrialReportModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất Báo cáo Thử nghiệm</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất CSV (SPSS/R)</span>
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ghi chú chuyên gia</span>
          </button>
        </div>
      </div>

      {/* Cohort Filter & Pseudonymization Toggle */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Lọc theo đợt khảo sát:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none"
          >
            <option value="all">Tất cả các đợt nghiên cứu ({sessions.length} mẫu)</option>
            {studyBatches.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.code}] {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={pseudonymizeExport}
              onChange={(e) => setPseudonymizeExport(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-semibold text-slate-700">
              Giả danh hóa khi xuất dữ liệu (Mã hóa P-001, P-002...)
            </span>
          </label>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tổng người tham gia (N)</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalParticipants}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalCompleted} hoàn thành • {draftSessions.length} bản nháp
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Tỷ lệ hoàn thành</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đạt ngưỡng hoàn thành (&ge; 70%)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Điểm trung bình gộp (Mean)</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {meanComposite.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Độ lệch chuẩn (SD): <strong>&plusmn;{sdComposite.toFixed(2)}</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Minh chứng có thể tiếp cận</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{sharedEvidence.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Người học đồng ý chia sẻ phục vụ đề tài
          </div>
        </div>
      </div>

      {/* Analytics Rows: Domain Table + Distribution Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Stats Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Chỉ số Thống kê Mô tả theo 6 Lĩnh vực
              </h3>
              <p className="text-xs text-slate-500">
                Thang đo Likert 1–5, tính trên mẫu hoàn thành hợp lệ
              </p>
            </div>
            <span className="text-xs text-slate-400">N = {totalCompleted}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5">Lĩnh vực</th>
                  <th className="py-2.5 text-center">Mean (M)</th>
                  <th className="py-2.5 text-center">SD (s)</th>
                  <th className="py-2.5 text-center">Quy đổi (~/100)</th>
                  <th className="py-2.5 text-right">Câu N/A</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {domainStats.map((stat) => (
                  <tr key={stat.domain.id} className="hover:bg-slate-50/70">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: stat.domain.color }}
                        />
                        <span className="font-bold text-slate-800">
                          [{stat.domain.code}] {stat.domain.shortTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center font-bold text-slate-900">
                      {stat.mean.toFixed(2)}
                    </td>
                    <td className="py-3 text-center text-slate-600">
                      &plusmn;{stat.sd.toFixed(2)}
                    </td>
                    <td className="py-3 text-center text-blue-600 font-semibold">
                      ~{Math.round(((stat.mean - 1) / 4) * 100)}
                    </td>
                    <td className="py-3 text-right text-slate-500">
                      {stat.totalNA > 0 ? (
                        <span className="text-amber-600 font-semibold">{stat.totalNA}</span>
                      ) : (
                        0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
            * <em>Mean (M)</em>: Điểm trung bình cộng; <em>SD (s)</em>: Độ lệch chuẩn mẫu. Câu trả lời "N/A" được loại bỏ hoàn toàn khỏi mẫu số khi tính trung bình của từng người học.
          </div>
        </div>

        {/* Score Distribution Histogram (1 col) */}
        <div>
          <DistributionHistogram
            distribution={scoreDistribution}
            totalCount={totalCompleted}
            title="Phân bố Điểm Tự học Tổng hợp"
          />
        </div>
      </div>

      {/* Pseudonymized Participant Submissions Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Danh sách Phiên Đánh giá (Mã hóa Danh tính)
            </h3>
            <p className="text-xs text-slate-500">
              Bảo vệ danh tính người học theo chuẩn đạo đức nghiên cứu giáo dục
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {completedSessions.length} bài nộp hợp lệ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5">Mã người học</th>
                <th className="py-2.5">Đợt khảo sát</th>
                <th className="py-2.5">Ngày nộp</th>
                <th className="py-2.5 text-center">Tỷ lệ hợp lệ</th>
                <th className="py-2.5 text-center">Điểm (1-5)</th>
                <th className="py-2.5 text-center">Quy đổi (0-100)</th>
                <th className="py-2.5 text-right">Phân nhóm tham chiếu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedSessions.map((sess, idx) => {
                const code = `P-${String(idx + 1).padStart(3, '0')}`;
                return (
                  <tr key={sess.id} className="hover:bg-slate-50/60 font-medium">
                    <td className="py-2.5 font-mono font-bold text-purple-700">
                      {code}
                    </td>
                    <td className="py-2.5 text-slate-600">{sess.studyBatchId}</td>
                    <td className="py-2.5 text-slate-500">
                      {sess.completedAt ? new Date(sess.completedAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="py-2.5 text-center text-slate-700">
                      {sess.result.validPercentage}%
                    </td>
                    <td className="py-2.5 text-center font-bold text-slate-900">
                      {sess.result.compositeScore?.toFixed(2) ?? 'N/A'}
                    </td>
                    <td className="py-2.5 text-center text-blue-600 font-semibold">
                      ~{sess.result.compositeLinearScore100?.toFixed(1) ?? 'N/A'}
                    </td>
                    <td className="py-2.5 text-right text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">
                        {sess.result.referenceTier?.label ? sess.result.referenceTier.label.split('&')[0] : 'Chưa phân nhóm'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared Evidence Inspection Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Minh chứng Học tập được Người học Cho phép Truy cập ({sharedEvidence.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ hiển thị các minh chứng đã được sinh viên tích chọn "Chia sẻ với nhóm nghiên cứu"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedEvidence.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-900">{ev.title}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Đã đồng ý chia sẻ
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{ev.description}</p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1">
                <div>
                  <strong className="text-slate-800">Mục đích dùng AI:</strong> {ev.aiPurpose}
                </div>
                <div>
                  <strong className="text-blue-800">Phương pháp kiểm chứng:</strong>{' '}
                  {ev.aiVerificationMethod}
                </div>
                <div>
                  <strong className="text-emerald-800">Phần việc tự làm:</strong>{' '}
                  {ev.studentOwnWork}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trial Feedback from Users & Experts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Phản hồi Thử nghiệm về Bộ Tiêu chí ({trialFeedbacks.length})</span>
          </h3>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            + Thêm ghi chú phản hồi
          </button>
        </div>

        <div className="space-y-3">
          {trialFeedbacks.map((fb) => (
            <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {fb.userRole === 'researcher' ? 'Nhà nghiên cứu / Giảng viên' : 'Sinh viên'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(fb.submittedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex gap-4 text-[11px] text-slate-600">
                <span>Độ rõ ràng: <strong>{fb.clarityRating}/5</strong></span>
                <span>Tính phù hợp: <strong>{fb.relevanceRating}/5</strong></span>
                <span>Tính dễ dùng: <strong>{fb.usabilityRating}/5</strong></span>
              </div>
              <p className="text-slate-700 italic">"{fb.feedbackNotes}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trial Report Modal (Required by Section XI.3) */}
      {showTrialReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Báo cáo Kết quả Thử nghiệm Nghiên cứu
                </h3>
                <p className="text-xs text-slate-500">
                  Mẫu báo cáo khoa học theo chuẩn định dạng quy định của đề tài
                </p>
              </div>
              <button
                onClick={() => setShowTrialReportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 font-medium">
                LƯU Ý: Đây là báo cáo được tổng hợp từ DỮ LIỆU MINH HỌA của hệ thống thử nghiệm nhằm chứng minh năng lực xuất báo cáo tự động của nền tảng; không tuyên bố là kết quả khảo sát thực tế diện rộng đã kiểm định.
              </div>

              {/* 1. Mục tiêu thử nghiệm */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">1. Mục tiêu thử nghiệm:</h4>
                <p>
                  Đánh giá tính khả thi kỹ thuật, mức độ dễ hiểu của 26 tiêu chí tự học trong môi trường có AI và sự vận hành trơn tru của quy trình tự đánh giá - nộp minh chứng - nhận khuyến nghị.
                </p>
              </div>

              {/* 2. Mô tả người tham gia */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">2. Mô tả người tham gia (Dữ liệu tổng hợp, giả danh):</h4>
                <p>
                  Tổng số người tham gia: <strong>N = {totalParticipants}</strong> sinh viên đại học (chủ yếu khối ngành CNTT, Khoa học dữ liệu, Sư phạm). Dữ liệu được mã hóa ngẫu nhiên theo mã định danh P-001 đến P-{String(totalParticipants).padStart(3, '0')}.
                </p>
              </div>

              {/* 3. Quy trình thử nghiệm */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">3. Quy trình thử nghiệm:</h4>
                <p>
                  Sinh viên tiếp cận thông tin nghiên cứu, ký cam kết đồng ý tham gia tự nguyện, lần lượt trả lời 26 câu hỏi trên thang Likert 5 mức (kèm tùy chọn N/A), đính kèm minh chứng số và nhận kết quả biểu đồ radar tức thì.
                </p>
              </div>

              {/* 4. Tỷ lệ hoàn thành */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">4. Tỷ lệ hoàn thành:</h4>
                <p>
                  Tỷ lệ hoàn thành đạt <strong>{completionRate}%</strong> ({totalCompleted}/{totalParticipants} sinh viên hoàn tất &ge; 70% câu hỏi). Tỷ lệ lưu nháp đạt {draftSessions.length > 0 ? `${Math.round((draftSessions.length / totalParticipants) * 100)}%` : '0%'}.
                </p>
              </div>

              {/* 5. Phân bố điểm theo lĩnh vực */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">5. Phân bố điểm theo lĩnh vực (M & SD):</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {domainStats.map((st) => (
                    <div key={st.domain.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-800">[{st.domain.code}] {st.domain.shortTitle}</div>
                      <div className="text-slate-600 mt-1">Mean = {st.mean.toFixed(2)} • SD = &plusmn;{st.sd.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Dữ liệu thiếu & các vấn đề phát hiện */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">6. Dữ liệu thiếu và các vấn đề phát hiện:</h4>
                <p>
                  Số lượng lựa chọn "Chưa đủ thông tin (N/A)" tập trung chủ yếu ở tiêu chí <strong>AI-04</strong> (Nhận thức thiên lệch của AI) và <strong>PB-03</strong> (Phát hiện ngụy biện thông tin). Điều này chỉ ra rằng sinh viên năm đầu còn ít cơ hội tiếp cận với các tình huống kiểm chứng thiên lệch sâu sắc.
                </p>
              </div>

              {/* 7. Hạn chế nghiên cứu */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">7. Hạn chế nghiên cứu:</h4>
                <p>
                  Dữ liệu hiện dựa trên phương pháp tự báo cáo (self-report survey), tiềm ẩn nguy cơ thiên lệch xã hội (social desirability bias) khi sinh viên có xu hướng đánh giá cao năng lực sử dụng AI của mình.
                </p>
              </div>

              {/* 8. Đề xuất cải tiến */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">8. Đề xuất cải tiến:</h4>
                <p>
                  - Bổ sung rubric đánh giá minh chứng độc lập từ giảng viên để đối chiếu chéo (triangulation).<br />
                  - Tách biệt rõ hơn giữa câu hỏi đo lường tần suất sử dụng AI và câu hỏi đo lường năng lực phản biện đối với AI.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">SelfLearn AI Scientific Research Engine v1.0</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In bản in báo cáo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Ghi nhận Phản hồi về Bộ Tiêu chí
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="font-bold text-sm">Đã lưu phản hồi nghiên cứu thành công!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Độ rõ ràng của câu hỏi (1 - 5): {clarityRating}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={clarityRating}
                    onChange={(e) => setClarityRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mức độ phù hợp với sinh viên đại học (1 - 5): {relevanceRating}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={relevanceRating}
                    onChange={(e) => setRelevanceRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tính dễ sử dụng của nền tảng (1 - 5): {usabilityRating}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={usabilityRating}
                    onChange={(e) => setUsabilityRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nhận xét, góp ý chỉnh sửa câu chữ hoặc bổ sung tiêu chí:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Góp ý về từ ngữ, hiện tượng ảo giác AI, hay cách đo lường tính tự giác..."
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    Gửi phản hồi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
