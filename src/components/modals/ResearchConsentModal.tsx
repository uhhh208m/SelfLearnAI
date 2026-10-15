import React, { useState } from 'react';
import { Shield, CheckCircle, FileText, X, AlertTriangle } from 'lucide-react';

interface ResearchConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ResearchConsentModal: React.FC<ResearchConsentModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Thỏa thuận Đồng ý Tham gia Nghiên cứu
              </h3>
              <p className="text-xs text-slate-500">
                Đề tài: Hệ thống hỗ trợ đánh giá năng lực tự học trong môi trường có AI
              </p>
            </div>
          </div>
          <button
            onClick={onDecline}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-blue-900">
            <p className="font-semibold mb-1">Mục đích nghiên cứu khoa học:</p>
            <p>
              Khảo sát và đánh giá năng lực tự học, tự điều chỉnh (Self-Regulated Learning) của sinh viên đại học trong bối cảnh các công cụ trí tuệ nhân tạo (Generative AI) ngày càng phổ biến. Dữ liệu này chỉ được sử dụng cho mục đích phân tích học thuật và cải tiến công cụ sư phạm.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Các nguyên tắc bảo mật và quyền của người học:</h4>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">1. Tính tự nguyện & Rút lui:</strong> Việc tham gia là hoàn toàn tự nguyện. Bạn có quyền dừng lại bất kỳ lúc nào hoặc yêu cầu xóa dữ liệu của mình khỏi cơ sở dữ liệu mà không chịu bất kỳ chế tài hay ảnh hưởng nào tới kết quả học tập tại trường.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">2. Bảo vệ danh tính & Giả danh hóa:</strong> Trong các báo cáo phân tích gửi tới giảng viên hoặc công bố nghiên cứu, danh tính của bạn sẽ được mã hóa bằng mã số ngẫu nhiên (ví dụ: P-042). Không ai được phép công khai điểm số cá nhân kèm tên thật của bạn.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">3. Quyền riêng tư về minh chứng học tập:</strong> Bạn có quyền quyết định minh chứng học tập, nhật ký trao đổi với AI là "Riêng tư" (chỉ mình bạn xem) hoặc "Chia sẻ với nhóm nghiên cứu" để phục vụ phân tích chuyên sâu.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">4. Không tự động ra quyết định học vụ:</strong> Điểm tự đánh giá và khuyến nghị từ hệ thống là công cụ phản tư cá nhân, không thay thế cho bảng điểm học phần hay đánh giá học lực chính thức từ trường đại học.
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Để kết quả mang tính khoa học và có ích nhất cho chính bạn, xin hãy trả lời một cách trung thực nhất với thực tế học tập của bản thân, không vì tâm lý "chọn điểm cao để có báo cáo đẹp".
            </span>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-800">
                Tôi đã đọc kỹ các điều khoản trên, hiểu rõ mục đích nghiên cứu và đồng ý tự nguyện tham gia đánh giá năng lực tự học.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onDecline}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Từ chối / Quay lại
          </button>
          <button
            onClick={onAccept}
            disabled={!agreed}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              agreed
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Đồng ý và Bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
};
