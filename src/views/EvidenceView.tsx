import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  Shield,
  CheckCircle,
  Calendar,
  Lock,
  Globe,
  X,
  AlertCircle,
} from 'lucide-react';
import { Evidence, EvidenceType, Criterion, Domain, User } from '../types/index.ts';
import { storage } from '../services/storage.ts';

interface EvidenceViewProps {
  currentUser: User;
  criteria: Criterion[];
  domains: Domain[];
}

const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  assignment: 'Bài tập môn học',
  project: 'Đồ án / Dự án nghiên cứu',
  reflection_log: 'Ghi chú phản tư sau bài học',
  study_plan: 'Kế hoạch học tập / Kanban',
  ai_prompt_log: 'Nhật ký chuỗi câu lệnh AI',
  test_review: 'Bản phân tích bài thi / kiểm tra',
  other: 'Minh chứng khác',
};

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  currentUser,
  criteria,
  domains,
}) => {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>(
    storage.getEvidenceForUser(currentUser.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'ai_prompt_log' as EvidenceType,
    description: '',
    linkedDomainIds: [] as string[],
    linkedCriteriaCodes: [] as string[],
    date: new Date().toISOString().split('T')[0],
    resourceLink: '',
    attachmentName: '',
    aiPurpose: '',
    aiVerificationMethod: '',
    studentOwnWork: '',
    keyTakeaway: '',
    visibility: 'shared_researcher' as 'private' | 'shared_researcher',
  });

  const refreshList = () => {
    setEvidenceList(storage.getEvidenceForUser(currentUser.id));
  };

  const handleOpenAdd = () => {
    setEditingEvidence(null);
    setFormData({
      title: '',
      type: 'ai_prompt_log',
      description: '',
      linkedDomainIds: [domains[4]?.id || 'domain-ai-competence'],
      linkedCriteriaCodes: ['AI-02', 'AI-03'],
      date: new Date().toISOString().split('T')[0],
      resourceLink: '',
      attachmentName: '',
      aiPurpose: '',
      aiVerificationMethod: '',
      studentOwnWork: '',
      keyTakeaway: '',
      visibility: 'shared_researcher',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: Evidence) => {
    setEditingEvidence(ev);
    setFormData({
      title: ev.title,
      type: ev.type,
      description: ev.description,
      linkedDomainIds: ev.linkedDomainIds || [],
      linkedCriteriaCodes: ev.linkedCriteriaCodes || [],
      date: ev.date,
      resourceLink: ev.resourceLink || '',
      attachmentName: ev.attachmentName || '',
      aiPurpose: ev.aiPurpose || '',
      aiVerificationMethod: ev.aiVerificationMethod || '',
      studentOwnWork: ev.studentOwnWork || '',
      keyTakeaway: ev.keyTakeaway || '',
      visibility: ev.visibility,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ minh chứng này?')) {
      storage.deleteEvidence(id);
      refreshList();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên minh chứng');
      return;
    }

    storage.saveEvidence({
      id: editingEvidence?.id,
      userId: currentUser.id,
      ...formData,
    });

    setIsModalOpen(false);
    refreshList();
  };

  const filteredList = evidenceList.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.aiPurpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || ev.type === selectedType;
    const matchesVis =
      selectedVisibility === 'all' || ev.visibility === selectedVisibility;

    return matchesSearch && matchesType && matchesVis;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Hồ sơ học tập & Bằng chứng thực tế
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản lý Minh chứng Học tập & Sử dụng AI
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Lưu giữ nhật ký câu lệnh AI, kế hoạch tuần và sản phẩm tự thân thực hiện. Đây là căn cứ khoa học đối chiếu với điểm số tự đánh giá.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm minh chứng mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, mô tả, nội dung prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả loại minh chứng</option>
            {Object.entries(EVIDENCE_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái riêng tư</option>
            <option value="shared_researcher">Chia sẻ với nhóm nghiên cứu</option>
            <option value="private">Riêng tư (Chỉ mình tôi)</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {EVIDENCE_TYPE_LABELS[ev.type] || ev.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {ev.visibility === 'shared_researcher' ? (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                        <Globe className="w-3 h-3" />
                        Chia sẻ nghiên cứu
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                        <Lock className="w-3 h-3" />
                        Riêng tư
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{ev.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {ev.description}
                </p>

                {/* Specific AI Reflection Highlights */}
                <div className="space-y-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {ev.aiPurpose && (
                    <div>
                      <span className="font-bold text-slate-800">Mục đích dùng AI: </span>
                      <span className="text-slate-600">{ev.aiPurpose}</span>
                    </div>
                  )}
                  {ev.aiVerificationMethod && (
                    <div>
                      <span className="font-bold text-blue-800">Cách kiểm chứng kết quả: </span>
                      <span className="text-slate-700">{ev.aiVerificationMethod}</span>
                    </div>
                  )}
                  {ev.studentOwnWork && (
                    <div>
                      <span className="font-bold text-emerald-800">Phần việc tự làm: </span>
                      <span className="text-slate-700">{ev.studentOwnWork}</span>
                    </div>
                  )}
                </div>

                {/* Linked Criteria tags */}
                {ev.linkedCriteriaCodes && ev.linkedCriteriaCodes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Tiêu chí:</span>
                    {ev.linkedCriteriaCodes.map((code) => (
                      <span
                        key={code}
                        className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Date, Link, and Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>{ev.date}</span>
                  {ev.resourceLink && (
                    <a
                      href={ev.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5 ml-2"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Xem liên kết</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy minh chứng phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy bắt đầu bằng việc lưu lại một đoạn chat hỏi bài với AI hoặc kế hoạch tuần của bạn.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Thêm minh chứng đầu tiên
          </button>
        </div>
      )}

      {/* Add / Edit Evidence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingEvidence ? 'Cập nhật Minh chứng Học tập' : 'Thêm Minh chứng Học tập Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tên minh chứng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nhật ký prompt bài tập lớn Lập trình Web"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loại minh chứng
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as EvidenceType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    {Object.entries(EVIDENCE_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả ngắn gọn về nhiệm vụ
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả bối cảnh bài tập, môn học và kết quả đạt được..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* AI Specific Reflection fields */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Phản tư về quá trình tương tác với AI:</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mục đích sử dụng AI trong bài học này là gì?
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nhờ AI giải thích nguyên lý thuật toán, gợi ý dàn ý, hay kiểm tra lỗi mã nguồn..."
                    value={formData.aiPurpose}
                    onChange={(e) => setFormData({ ...formData, aiPurpose: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bạn đã kiểm chứng kết quả từ AI bằng cách nào?
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đối chiếu tài liệu giáo trình chương 4, chạy thử nghiệm test case, tra cứu bài báo khoa học..."
                    value={formData.aiVerificationMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, aiVerificationMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phần việc thực chất do chính bạn tự thực hiện:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Tự viết lại toàn bộ mã, tự phân tích và phản biện ý kiến, tự kiểm tra..."
                    value={formData.studentOwnWork}
                    onChange={(e) =>
                      setFormData({ ...formData, studentOwnWork: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bài học kinh nghiệm rút ra:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nhận ra AI thường đưa trích dẫn không có thật nếu không kiểm tra chéo..."
                    value={formData.keyTakeaway}
                    onChange={(e) =>
                      setFormData({ ...formData, keyTakeaway: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Liên kết tài liệu (URL Github, Notion, Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.resourceLink}
                    onChange={(e) =>
                      setFormData({ ...formData, resourceLink: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Quyền riêng tư minh chứng
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: e.target.value as 'private' | 'shared_researcher',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="shared_researcher">Chia sẻ với nhóm nghiên cứu (Khuyến khích)</option>
                    <option value="private">Riêng tư (Chỉ mình tôi xem)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Lưu hồ sơ minh chứng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
