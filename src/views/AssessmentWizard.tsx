import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle,
  HelpCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  Criterion,
  Domain,
  LikertValue,
  AssessmentSession,
  User,
} from '../types/index.ts';
import { calculateAssessmentResult } from '../utils/scoring.ts';
import { storage } from '../services/storage.ts';

interface AssessmentWizardProps {
  currentUser: User;
  domains: Domain[];
  criteria: Criterion[];
  existingSession?: AssessmentSession | null;
  onComplete: (completedSession: AssessmentSession) => void;
  onCancel: () => void;
}

const LIKERT_OPTIONS: { value: LikertValue; label: string; short: string; color: string }[] = [
  { value: 1, label: 'Hoàn toàn không đúng với tôi', short: 'Rất không đúng', color: 'hover:border-rose-400 peer-checked:bg-rose-50 peer-checked:border-rose-600 peer-checked:text-rose-900' },
  { value: 2, label: 'Phần lớn không đúng với tôi', short: 'Không đúng', color: 'hover:border-amber-400 peer-checked:bg-amber-50 peer-checked:border-amber-600 peer-checked:text-amber-900' },
  { value: 3, label: 'Đúng một phần / chưa ổn định', short: 'Trung lập / Một phần', color: 'hover:border-blue-300 peer-checked:bg-blue-50 peer-checked:border-blue-600 peer-checked:text-blue-900' },
  { value: 4, label: 'Phần lớn đúng với tôi', short: 'Khá đúng', color: 'hover:border-indigo-400 peer-checked:bg-indigo-50 peer-checked:border-indigo-600 peer-checked:text-indigo-900' },
  { value: 5, label: 'Hoàn toàn đúng với tôi', short: 'Rất đúng', color: 'hover:border-emerald-400 peer-checked:bg-emerald-50 peer-checked:border-emerald-600 peer-checked:text-emerald-900' },
  { value: 'N/A', label: 'Chưa đủ thông tin để trả lời', short: 'Chưa rõ (N/A)', color: 'hover:border-slate-400 peer-checked:bg-slate-100 peer-checked:border-slate-600 peer-checked:text-slate-800' },
];

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  currentUser,
  domains,
  criteria,
  existingSession,
  onComplete,
  onCancel,
}) => {
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, LikertValue>>(
    existingSession?.answers || {}
  );
  const [sessionId, setSessionId] = useState<string>(
    existingSession?.id || `session-${Date.now()}`
  );
  const [lastSavedMessage, setLastSavedMessage] = useState<string>('');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const activeCriteria = criteria.filter((c) => c.isActive);
  const currentDomain = domains[currentDomainIndex];
  const domainCriteria = activeCriteria.filter((c) => c.domainId === currentDomain.id);

  // Overall statistics
  const totalQuestions = activeCriteria.length;
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== null
  ).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Auto-save draft on answers change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [answers]);

  const handleAnswerSelect = (criterionId: string, val: LikertValue) => {
    setAnswers((prev) => ({
      ...prev,
      [criterionId]: val,
    }));
  };

  const saveDraft = (showMessage = true) => {
    const calcResult = calculateAssessmentResult(answers, activeCriteria, domains);
    const draft = storage.saveSessionDraft({
      id: sessionId,
      userId: currentUser.id,
      userName: currentUser.name,
      userStudentCode: currentUser.studentCode,
      studyBatchId: 'batch-01',
      criteriaVersion: 'v1.0-research',
      answers,
      result: calcResult,
      status: 'draft',
      consentAccepted: true,
      startedAt: existingSession?.startedAt || new Date().toISOString(),
    });
    setSessionId(draft.id);
    if (showMessage) {
      setLastSavedMessage(`Đã lưu bản nháp lúc ${new Date().toLocaleTimeString('vi-VN')}`);
      setTimeout(() => setLastSavedMessage(''), 3000);
    }
  };

  const handleNextDomain = () => {
    if (currentDomainIndex < domains.length - 1) {
      setCurrentDomainIndex(currentDomainIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevDomain = () => {
    if (currentDomainIndex > 0) {
      setCurrentDomainIndex(currentDomainIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    saveDraft(false);
    const completed = storage.completeSession(sessionId);
    onComplete(completed);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Header & Sticky Progress */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs sticky top-20 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Tự đánh giá năng lực • Phiên bản v1.0
              </span>
              {lastSavedMessage && (
                <span className="text-[11px] text-emerald-600 font-medium animate-fade-in flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {lastSavedMessage}
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              {currentDomain.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => saveDraft(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu nháp</span>
            </button>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={answeredCount === 0}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                answeredCount >= Math.ceil(totalQuestions * 0.7)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              Nộp bài đánh giá
            </button>
          </div>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="grid grid-cols-6 gap-1.5 mb-3">
          {domains.map((dom, idx) => {
            const domCrit = activeCriteria.filter((c) => c.domainId === dom.id);
            const domAnswered = domCrit.filter((c) => answers[c.id] !== undefined && answers[c.id] !== null).length;
            const isCurrent = idx === currentDomainIndex;
            const isDone = domAnswered === domCrit.length;

            return (
              <button
                key={dom.id}
                onClick={() => setCurrentDomainIndex(idx)}
                className={`p-2 rounded-xl text-center border transition-all text-xs flex flex-col items-center justify-between min-h-[56px] ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20 font-bold'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-700'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                  {dom.code}
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </span>
                <span className="text-[11px] truncate w-full text-slate-500 font-normal">
                  {domAnswered}/{domCrit.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Tiến độ tổng thể: {answeredCount}/{totalQuestions} câu đã trả lời</span>
            <span className="font-bold text-slate-800">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Domain Description Banner */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-semibold">{currentDomain.shortTitle}:</strong>{' '}
          {currentDomain.description} Hãy chọn mức độ phản ánh đúng nhất hành vi học tập thực tế của bạn.
        </div>
      </div>

      {/* Questions List for Current Domain */}
      <div className="space-y-5">
        {domainCriteria.map((c, idx) => {
          const selectedVal = answers[c.id];

          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                selectedVal !== undefined && selectedVal !== null
                  ? 'border-slate-200/90 shadow-2xs'
                  : 'border-slate-300/80 shadow-xs ring-1 ring-slate-100'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-100 text-slate-800">
                      {c.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                    {c.isEvidenceRequired && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                        Nên có minh chứng
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">
                    {c.question}
                  </p>
                </div>
              </div>

              {/* Answering Guidance */}
              <div className="text-[11px] text-slate-500 bg-slate-50/70 p-2.5 rounded-xl mb-4 border border-slate-100">
                <span className="font-semibold text-slate-700">Mô tả & Hướng dẫn:</span> {c.description} {c.instruction}
              </div>

              {/* 5 Likert Buttons + N/A */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {LIKERT_OPTIONS.map((opt) => {
                  const isChecked = selectedVal === opt.value;
                  return (
                    <label
                      key={`${c.id}-${opt.value}`}
                      className={`relative flex flex-col justify-between p-3 rounded-xl border text-center cursor-pointer transition-all select-none ${
                        isChecked
                          ? opt.value === 'N/A'
                            ? 'bg-slate-200 border-slate-600 text-slate-900 ring-2 ring-slate-400/30 font-bold'
                            : 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${c.id}`}
                        value={opt.value}
                        checked={isChecked}
                        onChange={() => handleAnswerSelect(c.id, opt.value)}
                        className="sr-only"
                      />
                      <div className="text-sm font-black mb-1">
                        {typeof opt.value === 'number' ? opt.value : '—'}
                      </div>
                      <div className="text-[11px] leading-tight font-medium">
                        {opt.short}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 line-clamp-1 hidden sm:block">
                        {opt.label}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handlePrevDomain}
          disabled={currentDomainIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
            currentDomainIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lĩnh vực trước</span>
        </button>

        <div className="text-xs text-slate-500">
          Lĩnh vực {currentDomainIndex + 1} / {domains.length}
        </div>

        {currentDomainIndex < domains.length - 1 ? (
          <button
            onClick={handleNextDomain}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
          >
            <span>Tiếp tục: {domains[currentDomainIndex + 1]?.code}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Xem lại và nộp bài</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Xác nhận nộp bài tự đánh giá
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Số câu hỏi đã trả lời:</span>
                <span className="font-bold text-slate-800">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Tỷ lệ hoàn thành:</span>
                <span className="font-bold text-blue-600">{progressPercent}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Ngưỡng tối thiểu để tính điểm tổng hợp:</span>
                <span className="font-medium text-slate-700">70% (tối thiểu 19 câu)</span>
              </div>
            </div>

            {progressPercent < 70 ? (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Bạn mới trả lời {progressPercent}% câu hỏi (dưới ngưỡng 70%). Nếu nộp ngay, hệ thống sẽ ghi nhận trạng thái <strong>"Chưa đủ dữ liệu để kết luận"</strong> và chưa thể tạo điểm tổng hợp chính thức.
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Dữ liệu đã đủ điều kiện ({progressPercent}%) để xuất hồ sơ năng lực và gợi ý sư phạm AI.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tiếp tục chỉnh sửa
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Xác nhận nộp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
