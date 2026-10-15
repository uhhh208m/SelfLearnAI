import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  ListTodo,
} from 'lucide-react';
import { ImprovementPlan, Domain, User, PlanStatus } from '../types/index.ts';
import { storage } from '../services/storage.ts';

interface ImprovementPlanViewProps {
  currentUser: User;
  domains: Domain[];
}

export const ImprovementPlanView: React.FC<ImprovementPlanViewProps> = ({
  currentUser,
  domains,
}) => {
  const [plans, setPlans] = useState<ImprovementPlan[]>(
    storage.getPlansForUser(currentUser.id)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ImprovementPlan | null>(null);

  // Form State
  const [targetDomainId, setTargetDomainId] = useState(domains[0]?.id || 'domain-planning');
  const [goalTitle, setGoalTitle] = useState('');
  const [actionStepsStr, setActionStepsStr] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<PlanStatus>('in_progress');
  const [reflectionNote, setReflectionNote] = useState('');

  const refreshList = () => {
    setPlans(storage.getPlansForUser(currentUser.id));
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setTargetDomainId(domains[4]?.id || 'domain-ai-competence');
    setGoalTitle('');
    setActionStepsStr('1. Thiết lập quy tắc kiểm chứng chéo trước khi nộp bài\n2. Tự tóm tắt kiến thức bằng lời của mình\n3. Giảm bớt số lần hỏi bài máy móc');
    setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setStatus('in_progress');
    setReflectionNote('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: ImprovementPlan) => {
    setEditingPlan(plan);
    setTargetDomainId(plan.targetDomainId);
    setGoalTitle(plan.goalTitle);
    setActionStepsStr(plan.actionSteps.join('\n'));
    setDeadline(plan.deadline);
    setStatus(plan.status);
    setReflectionNote(plan.reflectionNote || '');
    setIsModalOpen(true);
  };

  const handleToggleComplete = (plan: ImprovementPlan) => {
    const newStatus: PlanStatus = plan.status === 'completed' ? 'in_progress' : 'completed';
    storage.savePlan({
      ...plan,
      status: newStatus,
    });
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch cải thiện này?')) {
      storage.deletePlan(id);
      refreshList();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) {
      alert('Vui lòng nhập tiêu đề mục tiêu');
      return;
    }

    const steps = actionStepsStr
      .split('\n')
      .map((s) => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((s) => s.length > 0);

    storage.savePlan({
      id: editingPlan?.id,
      userId: currentUser.id,
      targetDomainId,
      goalTitle,
      actionSteps: steps.length > 0 ? steps : ['Thực hiện bài tập kiểm chứng', 'Theo dõi tiến độ'],
      deadline: deadline || '2026-12-31',
      status,
      reflectionNote,
    });

    setIsModalOpen(false);
    refreshList();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Chu trình Tự điều chỉnh Học tập (SRL Cycle)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Kế hoạch Hành động & Cải thiện Năng lực
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Biến nhận thức từ kết quả đánh giá thành hành vi cụ thể. Thiết lập mục tiêu SMART, theo dõi các bước thực thi và ghi nhận phản tư.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mục tiêu mới</span>
        </button>
      </div>

      {/* Plan list */}
      <div className="space-y-4">
        {plans.map((plan) => {
          const dom = domains.find((d) => d.id === plan.targetDomainId) || domains[0];
          const isDone = plan.status === 'completed';

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: dom.color }}
                    >
                      {dom.code} • {dom.shortTitle}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : plan.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isDone
                        ? 'Đã hoàn thành'
                        : plan.status === 'in_progress'
                        ? 'Đang thực hiện'
                        : 'Chưa bắt đầu'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {plan.goalTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleToggleComplete(plan)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Mở lại' : 'Đánh dấu hoàn thành'}</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Steps Checklist */}
              <div className="space-y-2 mb-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-purple-600" />
                  <span>Các bước thực hiện cụ thể:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 mt-2">
                  {plan.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reflection note if any */}
              {plan.reflectionNote && (
                <div className="text-xs text-slate-600 bg-purple-50/60 p-3 rounded-xl border border-purple-100/70 mb-3">
                  <strong className="text-purple-900 font-semibold">Ghi chú tự phản tư: </strong>
                  {plan.reflectionNote}
                </div>
              )}

              {/* Footer info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Thời hạn mục tiêu: {plan.deadline}</span>
                </div>
                <span>Cập nhật: {new Date(plan.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? 'Chỉnh sửa Mục tiêu Cải thiện' : 'Thiết lập Mục tiêu Hành động Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lĩnh vực tập trung rèn luyện
                </label>
                <select
                  value={targetDomainId}
                  onChange={(e) => setTargetDomainId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  {domains.map((dom) => (
                    <option key={dom.id} value={dom.id}>
                      {dom.code} - {dom.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mục tiêu cụ thể (Goal Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kiểm chứng chéo ít nhất 2 nguồn trước khi dùng câu trả lời AI"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Các bước hành động (Mỗi bước một dòng)
                </label>
                <textarea
                  rows={4}
                  placeholder="1. Bước 1&#10;2. Bước 2&#10;3. Bước 3"
                  value={actionStepsStr}
                  onChange={(e) => setActionStepsStr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời hạn</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PlanStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="not_started">Chưa bắt đầu</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi chú phản tư cá nhân
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi lại tiến bộ hoặc khó khăn khi thực hiện..."
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Lưu mục tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
