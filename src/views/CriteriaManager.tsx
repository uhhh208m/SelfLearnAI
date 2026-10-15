import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  EyeOff,
  CheckCircle,
  Sliders,
  Scale,
  X,
  History,
  AlertCircle,
} from 'lucide-react';
import { Criterion, Domain, User } from '../types/index.ts';
import { storage } from '../services/storage.ts';

interface CriteriaManagerProps {
  currentUser: User;
  domains: Domain[];
  criteria: Criterion[];
  onCriteriaUpdated: () => void;
  onDomainsUpdated: () => void;
}

export const CriteriaManager: React.FC<CriteriaManagerProps> = ({
  currentUser,
  domains,
  criteria,
  onCriteriaUpdated,
  onDomainsUpdated,
}) => {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);

  // Edit form state
  const [formData, setFormData] = useState({
    code: '',
    domainId: domains[0]?.id || '',
    title: '',
    question: '',
    description: '',
    instruction: '',
    isEvidenceRequired: false,
    version: 'v1.0-research',
    isActive: true,
  });

  // Weights configuration state
  const [domainWeights, setDomainWeights] = useState<Record<string, number>>(
    domains.reduce((acc, d) => ({ ...acc, [d.id]: d.weight }), {})
  );

  const totalWeight = Object.values(domainWeights).reduce((sum, w) => sum + (Number(w) || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.2; // roughly 100%

  const handleOpenAdd = () => {
    setEditingCriterion(null);
    setFormData({
      code: `TU-${criteria.length + 1}`,
      domainId: domains[0]?.id || '',
      title: '',
      question: '',
      description: '',
      instruction: 'Chọn mức phản ánh đúng nhất thực tế học tập.',
      isEvidenceRequired: false,
      version: 'v1.0-research',
      isActive: true,
    });
    setShowEditModal(true);
  };

  const handleOpenEdit = (crit: Criterion) => {
    setEditingCriterion(crit);
    setFormData({
      code: crit.code,
      domainId: crit.domainId,
      title: crit.title,
      question: crit.question,
      description: crit.description,
      instruction: crit.instruction,
      isEvidenceRequired: !!crit.isEvidenceRequired,
      version: crit.version,
      isActive: crit.isActive,
    });
    setShowEditModal(true);
  };

  const handleToggleActive = (crit: Criterion) => {
    storage.updateCriterion(crit.id, { isActive: !crit.isActive });
    onCriteriaUpdated();
  };

  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCriterion) {
      storage.updateCriterion(editingCriterion.id, formData);
    } else {
      storage.addCriterion(formData);
    }
    setShowEditModal(false);
    onCriteriaUpdated();
  };

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) {
      alert('Tổng trọng số các lĩnh vực phải bằng đúng 100%!');
      return;
    }
    const updated = domains.map((d) => ({
      ...d,
      weight: Number(domainWeights[d.id]) || 0,
    }));
    storage.saveDomains(updated);
    onDomainsUpdated();
    setShowWeightModal(false);
  };

  const filteredCriteria = criteria.filter((c) => {
    const matchesDomain = selectedDomainFilter === 'all' || c.domainId === selectedDomainFilter;
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Ngân hàng Tiêu chí Đánh giá
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
              Phiên bản: <span className="font-mono">v1.0-research</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản lý Danh mục 6 Lĩnh vực & 26 Tiêu chí Tự học
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Bộ tiêu chí đo lường năng lực tự điều chỉnh học tập (SRL) và kỹ năng sử dụng AI có trách nhiệm. Được phân quyền chỉnh sửa bởi Quản trị viên và Hội đồng nghiên cứu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowWeightModal(true)}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Cấu hình Trọng số (100%)</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tiêu chí mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo mã (VD: AI-03), tiêu đề, câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
          >
            <option value="all">Tất cả 6 lĩnh vực ({criteria.length} tiêu chí)</option>
            {domains.map((dom) => (
              <option key={dom.id} value={dom.id}>
                [{dom.code}] {dom.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Criteria Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã</th>
                <th className="py-3 px-4">Lĩnh vực</th>
                <th className="py-3 px-4">Tiêu đề & Nội dung câu hỏi</th>
                <th className="py-3 px-4 text-center">Yêu cầu minh chứng</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCriteria.map((c) => {
                const dom = domains.find((d) => d.id === c.domainId);
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      !c.isActive ? 'opacity-50 bg-slate-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {dom && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white inline-block"
                          style={{ backgroundColor: dom.color }}
                        >
                          {dom.code}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-slate-900 mb-0.5">{c.title}</div>
                      <div className="text-slate-600 line-clamp-2 leading-relaxed">{c.question}</div>
                      <div className="text-[10px] text-slate-400 mt-1 italic">
                        Ý nghĩa: {c.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {c.isEvidenceRequired ? (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                          Khuyến nghị
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Tùy chọn</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {c.isActive ? (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                          title={c.isActive ? 'Ẩn tiêu chí này' : 'Hiện lại tiêu chí'}
                        >
                          {c.isActive ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Chỉnh sửa nội dung"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCriterion ? `Chỉnh sửa Tiêu chí ${editingCriterion.code}` : 'Thêm Tiêu chí Mới'}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCriterion} className="space-y-3 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã tiêu chí *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thuộc Lĩnh vực *</label>
                  <select
                    value={formData.domainId}
                    onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        [{d.code}] {d.shortTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên ngắn gọn *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung câu hỏi tự đánh giá *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ý nghĩa sư phạm</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEvidenceRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, isEvidenceRequired: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-700">Khuyến nghị đính kèm minh chứng</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-700">Kích hoạt sử dụng</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold"
                >
                  Lưu tiêu chí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weights Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>Cấu hình Trọng số 6 Lĩnh vực</span>
              </h3>
              <button onClick={() => setShowWeightModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-4 pt-4 text-xs">
              <p className="text-slate-600">
                Mặc định hệ thống áp dụng phương pháp trọng số bằng nhau (~16.67% mỗi lĩnh vực). Bạn có thể hiệu chỉnh theo trọng tâm nghiên cứu, nhưng tổng các trọng số bắt buộc phải bằng <strong>100%</strong>.
              </p>

              <div className="space-y-2.5">
                {domains.map((dom) => (
                  <div
                    key={dom.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <span className="font-bold text-slate-800">
                      [{dom.code}] {dom.shortTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={domainWeights[dom.id] ?? dom.weight}
                        onChange={(e) =>
                          setDomainWeights({
                            ...domainWeights,
                            [dom.id]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right font-bold text-slate-900"
                      />
                      <span className="font-semibold text-slate-500">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${
                  isWeightValid
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <span>Tổng trọng số hiện tại:</span>
                <span>{totalWeight.toFixed(2)}% / 100%</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!isWeightValid}
                  className={`px-5 py-2 rounded-xl font-bold text-white ${
                    isWeightValid ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Lưu cấu hình trọng số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
