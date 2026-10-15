import React, { useState } from 'react';
import {
  History,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';
import { AssessmentSession, Domain, User } from '../types/index.ts';
import { RadarChart } from '../components/charts/RadarChart.tsx';

interface HistoryViewProps {
  currentUser: User;
  sessions: AssessmentSession[];
  domains: Domain[];
  onViewSessionResult: (session: AssessmentSession) => void;
  onNewAssessment: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentUser,
  sessions,
  domains,
  onViewSessionResult,
  onNewAssessment,
}) => {
  const userSessions = sessions.filter((s) => s.userId === currentUser.id);
  const completed = userSessions.filter((s) => s.status === 'completed');

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    completed[0]?.id || ''
  );

  const activeSession = completed.find((s) => s.id === selectedSessionId) || completed[0];
  const previousSession = completed.length > 1 ? completed[1] : undefined;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Lịch sử phát triển năng lực
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Lịch sử Đánh giá & Tiến trình Tự điều chỉnh
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Theo dõi sự chuyển biến của 6 lĩnh vực qua các đợt khảo sát để nhận diện quỹ đạo học tập của bản thân.
          </p>
        </div>

        <button
          onClick={onNewAssessment}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Thực hiện đánh giá mới</span>
        </button>
      </div>

      {/* Methodological Caveat Notice (Required by Section VI.8) */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Lưu ý phương pháp luận nghiên cứu:</strong>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Sự thay đổi điểm số giữa các lần tự đánh giá phản ánh sự biến chuyển trong nhận thức và thói quen tự báo cáo của người học theo thời gian; đây không tự động chứng minh sự thay đổi khách quan về năng lực nếu chưa được đối chiếu thực nghiệm với các sản phẩm học tập hoặc kiểm định chuẩn hóa từ giảng viên.
          </p>
        </div>
      </div>

      {completed.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Sessions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Các mốc đánh giá ({completed.length})
            </span>

            {completed.map((sess, idx) => {
              const isSelected = sess.id === activeSession?.id;
              const dateStr = sess.completedAt
                ? new Date(sess.completedAt).toLocaleDateString('vi-VN')
                : 'Chưa hoàn thành';

              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">
                      Đợt đánh giá #{completed.length - idx}
                    </span>
                    <span className="text-[10px] text-slate-500">{dateStr}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-slate-500">Điểm tổng hợp:</span>
                    <span className="font-black text-slate-900 text-sm">
                      {sess.result.compositeScore?.toFixed(2)} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Quy đổi: ~{sess.result.compositeLinearScore100?.toFixed(0)}/100</span>
                    <span className="text-blue-600 font-medium">
                      Hợp lệ {sess.result.validPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Session Detailed Comparison */}
          {activeSession && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Đối chiếu Kết quả Chi tiết
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã đợt: {activeSession.studyBatchId} • Phiên bản: {activeSession.criteriaVersion}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSessionResult(activeSession)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Mở báo cáo kết quả và tải PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Báo Cáo (PDF)</span>
                  </button>
                  <button
                    onClick={() => onViewSessionResult(activeSession)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1 shadow-xs hover:bg-blue-700 cursor-pointer"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Radar Chart Overlay */}
              <div className="flex flex-col items-center">
                <RadarChart
                  domainScores={activeSession.result.domainScores}
                  previousScores={previousSession?.result.domainScores}
                  size={320}
                />
                <span className="text-[11px] text-slate-400 mt-2">
                  (Đường liền nét xanh: Đợt đang chọn • Đường nét đứt xám: Đợt đánh giá liền trước)
                </span>
              </div>

              {/* Domain comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                      <th className="py-2">Mã & Lĩnh vực</th>
                      <th className="py-2 text-center">Đợt này (1-5)</th>
                      <th className="py-2 text-center">Đợt trước (1-5)</th>
                      <th className="py-2 text-right">Chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {domains.map((dom) => {
                      const cur = activeSession.result.domainScores[dom.id]?.meanScore;
                      const prev = previousSession?.result.domainScores[dom.id]?.meanScore;
                      const diff = cur !== null && cur !== undefined && prev !== null && prev !== undefined
                        ? Math.round((cur - prev) * 100) / 100
                        : null;

                      return (
                        <tr key={dom.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-semibold text-slate-800">
                            [{dom.code}] {dom.shortTitle}
                          </td>
                          <td className="py-2.5 text-center font-bold text-slate-900">
                            {cur?.toFixed(2) ?? 'N/A'}
                          </td>
                          <td className="py-2.5 text-center text-slate-500">
                            {prev?.toFixed(2) ?? '—'}
                          </td>
                          <td className="py-2.5 text-right font-semibold">
                            {diff !== null ? (
                              diff > 0 ? (
                                <span className="text-emerald-600">+{diff.toFixed(2)}</span>
                              ) : diff < 0 ? (
                                <span className="text-rose-600">{diff.toFixed(2)}</span>
                              ) : (
                                <span className="text-slate-400">0.00</span>
                              )
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Chưa có lịch sử đánh giá</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Khi bạn hoàn thành các bài tự đánh giá, lịch sử và biểu đồ tiến trình đối chiếu sẽ tự động xuất hiện tại đây.
          </p>
        </div>
      )}
    </div>
  );
};
