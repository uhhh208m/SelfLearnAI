import React, { useState, useRef } from 'react';
import {
  Award,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  Info,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Eye,
  Loader2,
  Check,
} from 'lucide-react';
import { AssessmentSession, Domain, User } from '../types/index.ts';
import { RadarChart } from '../components/charts/RadarChart.tsx';
import { BarComparisonChart } from '../components/charts/BarComparisonChart.tsx';
import { generatePedagogicalAdvice } from '../services/aiAdvisor.ts';
import { ExportReportModal } from '../components/modals/ExportReportModal.tsx';
import { AcademicReportTemplate } from '../components/reports/AcademicReportTemplate.tsx';
import { exportElementToPDF } from '../utils/pdfExport.ts';

interface ResultsViewProps {
  session: AssessmentSession;
  previousSession?: AssessmentSession | null;
  domains: Domain[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onNewAssessment: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  session,
  previousSession,
  domains,
  currentUser,
  onNavigateTab,
  onNewAssessment,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDirectExporting, setIsDirectExporting] = useState(false);
  const [directExportSuccess, setDirectExportSuccess] = useState(false);
  const hiddenReportRef = useRef<HTMLDivElement>(null);

  const result = session.result;
  const isSufficient = result.status === 'sufficient';

  // Generate pedagogical advice
  const advice = generatePedagogicalAdvice(result, domains, currentUser.major);

  const handleDirectExportPDF = async () => {
    if (!hiddenReportRef.current || isDirectExporting) return;
    setIsDirectExporting(true);
    setDirectExportSuccess(false);

    try {
      const fileName = `SelfLearn_BaoCao_${currentUser.studentCode || 'SV'}_${
        new Date().toISOString().split('T')[0]
      }.pdf`;

      await exportElementToPDF(hiddenReportRef.current, {
        filename: fileName,
        scale: 2,
      });

      setDirectExportSuccess(true);
      setTimeout(() => setDirectExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export PDF directly:', err);
      // Fallback: open modal for print
      setIsExportModalOpen(true);
    } finally {
      setIsDirectExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Báo cáo Kết quả Tự đánh giá Năng lực
            </span>
            <span className="text-xs text-slate-400">
              Mã đợt: {session.studyBatchId} • Phiên bản: {session.criteriaVersion}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Hồ sơ Tự điều chỉnh Học tập trong Môi trường AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Họ tên: <strong className="text-slate-800">{currentUser.name}</strong> • Mã SV: {currentUser.studentCode || 'N/A'} • Ngành: {currentUser.major || 'Đại học'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto no-print">
          {/* Main Direct PDF Export Button */}
          <button
            onClick={handleDirectExportPDF}
            disabled={isDirectExporting}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              directExportSuccess
                ? 'bg-emerald-600 text-white'
                : isDirectExporting
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102'
            }`}
            title="Tải về trực tiếp tệp PDF báo cáo năng lực"
          >
            {isDirectExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xuất PDF...</span>
              </>
            ) : directExportSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã tải về PDF!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải Báo Cáo (PDF)</span>
              </>
            )}
          </button>

          {/* Preview & Print Modal Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Xem trước định dạng in và tải PDF"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem trước bản in</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="Làm lại một bài đánh giá mới"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đánh giá lại</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Composite Score Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-200 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Điểm tổng hợp năng lực</span>
              <Award className="w-5 h-5 text-blue-300" />
            </div>

            {isSufficient ? (
              <div className="my-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {result.compositeScore?.toFixed(2)}
                  <span className="text-lg font-normal text-blue-300"> / 5.0</span>
                </div>
                <div className="mt-2 text-xs text-blue-200">
                  Quy đổi tuyến tính: <strong>~{result.compositeLinearScore100?.toFixed(1)} / 100</strong>
                </div>
              </div>
            ) : (
              <div className="my-4 p-3 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-200 text-xs">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  Chưa đủ dữ liệu để kết luận
                </div>
                {result.insufficientReason}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-blue-200/80 space-y-1">
            <p>
              * Điểm 0–100 là phép quy đổi tuyến tính `(điểm - 1)/4 × 100` phục vụ trình bày trực quan, không cấu thành phần trăm năng lực tuyệt đối.
            </p>
          </div>
        </div>

        {/* Data Quality & Completion Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Độ tin cậy & Tỷ lệ hoàn thành
            </span>
            <div className="flex items-baseline gap-2 mt-2 mb-3">
              <span className="text-3xl font-black text-slate-900">
                {result.validPercentage}%
              </span>
              <span className="text-xs text-slate-500">
                ({result.totalValid}/{result.totalQuestions} câu hợp lệ)
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Câu trả lời Likert (1 - 5):</span>
                <span className="font-bold text-slate-900">{result.totalValid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Chưa đủ thông tin (N/A):</span>
                <span className="font-bold text-amber-600">{result.totalNA}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Bỏ trống / Chưa làm:</span>
                <span className="font-bold text-slate-400">{result.totalUnanswered}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            * Các câu trả lời "N/A" được loại trừ khỏi phép tính trung bình, không bị gán thành điểm 0 hoặc 1.
          </div>
        </div>

        {/* Reference Benchmark Level */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Phân nhóm tham khảo nghiên cứu
            </span>

            {result.referenceTier ? (
              <div className="mt-3 space-y-2">
                <div className="inline-block px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-extrabold border border-blue-200">
                  {result.referenceTier.label}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.referenceTier.description}
                </p>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-500">
                Cần tối thiểu 70% câu trả lời hợp lệ để xác định nhóm tham chiếu.
              </div>
            )}
          </div>

          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-4">
            <strong>Ghi chú phương pháp:</strong> Đây là ngưỡng thử nghiệm ban đầu, cần được rà soát và kiểm định độ tin cậy qua dữ liệu mẫu lớn.
          </div>
        </div>
      </div>

      {/* Visual Analytics: Radar + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Biểu đồ Radar Năng lực 6 Chiều
              </h3>
              <p className="text-xs text-slate-500">
                Soi chiếu đồng thời 6 trụ cột tự điều chỉnh học tập
              </p>
            </div>
          </div>

          <div className="py-2">
            <RadarChart
              domainScores={result.domainScores}
              previousScores={previousSession?.result.domainScores}
              size={340}
            />
          </div>

          <div className="w-full text-center text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Tâm biểu đồ = 1.0 (Rất thấp), Vòng ngoài cùng = 5.0 (Tối ưu)
          </div>
        </div>

        {/* Detailed Domain Bar Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Chi tiết Điểm số từng Lĩnh vực
            </h3>
            <p className="text-xs text-slate-500">
              Điểm trung bình cộng các câu trả lời hợp lệ trong mỗi lĩnh vực
            </p>
          </div>

          <BarComparisonChart domainScores={result.domainScores} />
        </div>
      </div>

      {/* Pedagogical Guidance & AI Advice Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Khuyến nghị Cải thiện Năng lực Sư phạm
              </h2>
              <p className="text-xs text-purple-700 font-medium">
                {advice.modeLabel}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('plans')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tạo mục tiêu rèn luyện từ gợi ý này</span>
          </button>
        </div>

        {/* Summary text */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
          {advice.summary}
        </p>

        {/* Strengths & Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <h4 className="font-bold text-emerald-900 text-xs mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Điểm sáng tiềm năng được ghi nhận:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-800">
              {advice.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="font-bold text-amber-900 text-xs mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Lĩnh vực ưu tiên cần phát triển tiếp:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-800">
              {advice.areasToGrow.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2-3 Concrete Action Steps */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Kế hoạch hành động 3 bước khuyến nghị:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advice.actionSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {idx + 1}. {step.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                    {step.domainCode}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{step.description}</p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  <span className="font-semibold text-blue-700">Bài tập thực hành: </span>
                  {step.practicalExercise}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Literacy Best Practice Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Mẹo tương tác AI có trách nhiệm (AI Literacy Tip): {advice.aiLiteracyTip.topic}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-200/80 font-mono text-[11px] text-slate-800">
            {advice.aiLiteracyTip.recommendedPrompt}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-900 uppercase">
              Checklist kiểm chứng bắt buộc:
            </span>
            <ul className="space-y-1 text-xs text-slate-600">
              {advice.aiLiteracyTip.verificationChecklist.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Disclaimer */}
        <p className="text-[11px] text-slate-400 italic">
          * {advice.disclaimer}
        </p>
      </div>

      {/* Next steps CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs no-print">
        <div className="text-slate-600">
          Lưu trữ kết quả hoặc bổ sung bằng chứng và kế hoạch cải thiện:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDirectExportPDF}
            disabled={isDirectExporting}
            className={`px-4 py-2 rounded-xl text-white font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              directExportSuccess
                ? 'bg-emerald-600'
                : isDirectExporting
                ? 'bg-blue-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isDirectExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xuất PDF...</span>
              </>
            ) : directExportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã tải về PDF!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Tải Báo Cáo (PDF)</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem trước bản in</span>
          </button>
          <button
            onClick={() => onNavigateTab('evidence')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thêm minh chứng</span>
          </button>
          <button
            onClick={() => onNavigateTab('plans')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tạo mục tiêu hành động</span>
          </button>
        </div>
      </div>

      {/* Hidden Academic Report DOM for direct high-res PDF rendering */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none overflow-hidden z-[-99]">
        <div ref={hiddenReportRef} style={{ width: '800px', backgroundColor: '#ffffff' }}>
          <AcademicReportTemplate
            session={session}
            domains={domains}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        session={session}
        domains={domains}
        currentUser={currentUser}
      />
    </div>
  );
};
