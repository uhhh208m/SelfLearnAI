import React from 'react';
import {
  Award,
  Target,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Download,
} from 'lucide-react';
import { User, AssessmentSession, Evidence, ImprovementPlan, Domain } from '../types/index.ts';
import { RadarChart } from '../components/charts/RadarChart.tsx';

interface StudentDashboardProps {
  currentUser: User;
  sessions: AssessmentSession[];
  evidenceList: Evidence[];
  plans: ImprovementPlan[];
  domains: Domain[];
  onStartAssessment: () => void;
  onResumeDraft: (sessionId: string) => void;
  onNavigateTab: (tab: string) => void;
  onViewResults: (session: AssessmentSession) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  sessions,
  evidenceList,
  plans,
  domains,
  onStartAssessment,
  onResumeDraft,
  onNavigateTab,
  onViewResults,
}) => {
  // Latest completed session
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const latestCompleted = completedSessions[0]; // ordered latest first
  // Active draft session if any
  const draftSession = sessions.find((s) => s.status === 'draft');

  // Active goals
  const activePlans = plans.filter((p) => p.status !== 'completed');

  return (
    <div className="space-y-6 py-2">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium mb-3 backdrop-blur-xs">
            <span>Mã sinh viên: {currentUser.studentCode || 'SV-2026-CHUA-CAP'}</span>
            <span>•</span>
            <span>{currentUser.cohort || 'Đại học chính quy'}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Xin chào, {currentUser.name}!
          </h1>

          <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed mb-6">
            Chào mừng bạn trở lại với hệ thống tự đánh giá năng lực học tập <strong>SelfLearn AI</strong>. Hãy tiếp tục theo dõi tiến độ rèn luyện và xây dựng phương pháp học tập độc lập, hiệu quả.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {draftSession ? (
              <button
                onClick={() => onResumeDraft(draftSession.id)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Tiếp tục bản nháp đánh giá đang dở</span>
              </button>
            ) : (
              <button
                onClick={onStartAssessment}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Thực hiện bài tự đánh giá mới</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('evidence')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-blue-300" />
              <span>Ghi nhận minh chứng học tập</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Đợt đánh giá</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {completedSessions.length} <span className="text-xs font-normal text-slate-400">lần hoàn thành</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {draftSession ? 'Đang có 1 bản nháp' : 'Đã lưu trữ lịch sử'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Điểm tổng hợp gần nhất</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {latestCompleted?.result.compositeScore?.toFixed(2) ?? 'N/A'}{' '}
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {latestCompleted?.result.referenceTier?.label ? (
              <span className="truncate block max-w-full">
                {latestCompleted.result.referenceTier.label.split('&')[0]}
              </span>
            ) : (
              'Chưa có dữ liệu'
            )}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Mục tiêu đang theo dõi</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {activePlans.length} <span className="text-xs font-normal text-slate-400">kế hoạch</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {plans.filter((p) => p.status === 'completed').length} đã hoàn thành
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Minh chứng đã lưu</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {evidenceList.length} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {evidenceList.filter((e) => e.visibility === 'shared_researcher').length} chia sẻ nghiên cứu
          </p>
        </div>
      </div>

      {/* Main Content Grid: Radar + Action items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Assessment Profile */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hồ sơ Năng lực Tự học Gần nhất
              </h2>
              <p className="text-xs text-slate-500">
                {latestCompleted?.completedAt
                  ? `Đánh giá ngày ${new Date(latestCompleted.completedAt).toLocaleDateString('vi-VN')}`
                  : 'Chưa có kết quả đánh giá nào hoàn tất'}
              </p>
            </div>
            {latestCompleted && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewResults(latestCompleted)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Xem và tải báo cáo năng lực dạng PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Báo Cáo (PDF)</span>
                </button>
                <button
                  onClick={() => onViewResults(latestCompleted)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Chi tiết & Gợi ý AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {latestCompleted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center">
                <RadarChart
                  domainScores={latestCompleted.result.domainScores}
                  size={320}
                />
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Điểm quy đổi tuyến tính:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {latestCompleted.result.compositeLinearScore100?.toFixed(1) ?? 'N/A'} / 100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">Tỷ lệ câu trả lời hợp lệ:</span>
                    <span className="font-bold text-blue-600">
                      {latestCompleted.result.validPercentage}% (26 câu)
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">Mức tham khảo: </span>
                    {latestCompleted.result.referenceTier?.label}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    Điểm nổi bật 6 lĩnh vực:
                  </span>
                  {Object.values(latestCompleted.result.domainScores).map((d) => (
                    <div key={d.domainId} className="flex justify-between items-center py-0.5">
                      <span className="text-slate-700 truncate max-w-[180px]">{d.domainTitle}</span>
                      <span className="font-bold text-slate-900">{d.meanScore?.toFixed(2) ?? 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Bạn chưa hoàn thành bài tự đánh giá năng lực nào
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy dành 10 phút để tự soi chiếu và nhận bảng phân tích radar 6 lĩnh vực cùng khuyến nghị cải thiện.
              </p>
              <button
                onClick={onStartAssessment}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
              >
                Bắt đầu đánh giá ngay
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Active Learning Goals & Actions */}
        <div className="space-y-4">
          {/* Active Goals Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Mục tiêu đang thực hiện</span>
              </h3>
              <button
                onClick={() => onNavigateTab('plans')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Quản lý
              </button>
            </div>

            {activePlans.length > 0 ? (
              <div className="space-y-2.5">
                {activePlans.slice(0, 3).map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span className="truncate pr-2">{plan.goalTitle}</span>
                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                        {plan.status === 'in_progress' ? 'Đang làm' : 'Chưa bắt đầu'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>Hạn: {plan.deadline}</span>
                      <span>•</span>
                      <span>{plan.actionSteps.length} bước hành động</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                <p>Chưa có mục tiêu nào đang theo dõi.</p>
                <button
                  onClick={() => onNavigateTab('plans')}
                  className="mt-2 text-blue-600 font-bold hover:underline"
                >
                  + Tạo kế hoạch cải thiện
                </button>
              </div>
            )}
          </div>

          {/* Quick Evidence Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Minh chứng gần đây</span>
              </h3>
              <button
                onClick={() => onNavigateTab('evidence')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Xem tất cả
              </button>
            </div>

            {evidenceList.length > 0 ? (
              <div className="space-y-2.5">
                {evidenceList.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="font-semibold text-xs text-slate-900 truncate mb-1">
                      {ev.title}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">
                      {ev.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{ev.date}</span>
                      <span className="text-blue-600 font-medium">
                        {ev.visibility === 'shared_researcher' ? 'Chia sẻ nghiên cứu' : 'Riêng tư'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                <p>Chưa có minh chứng nào được lưu.</p>
                <button
                  onClick={() => onNavigateTab('evidence')}
                  className="mt-2 text-blue-600 font-bold hover:underline"
                >
                  + Thêm minh chứng học tập
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
