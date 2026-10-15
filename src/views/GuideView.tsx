import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  FlaskConical,
  Shield,
  HelpCircle,
  FileText,
  Calculator,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Cẩm nang Hướng dẫn & Tài liệu Phương pháp
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Hướng Dẫn Sử Dụng Nền Tảng SelfLearn AI
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tài liệu chuẩn mực hướng dẫn từng vai trò, giải thích công thức tính điểm khoa học và quy tắc bảo vệ đạo đức nghiên cứu.
        </p>
      </div>

      {/* 3 Role Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Student Guide */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dành cho Sinh viên</h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li>
              <strong>1. Tham gia khảo sát:</strong> Trả lời trung thực 26 câu hỏi. Bạn có thể nhấn "Lưu nháp" để hoàn thành từng phần bất cứ lúc nào.
            </li>
            <li>
              <strong>2. Đính kèm minh chứng:</strong> Lưu lại nhật ký câu lệnh AI và các giải pháp tự thân kiểm chứng để có bằng chứng học tập vững chắc.
            </li>
            <li>
              <strong>3. Thiết lập mục tiêu:</strong> Dựa vào gợi ý sư phạm để tạo kế hoạch hành động 3 bước và theo dõi tiến độ hoàn thành.
            </li>
          </ul>
        </div>

        {/* Researcher Guide */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dành cho Giảng viên / Nghiên cứu</h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li>
              <strong>1. Giám sát đợt khảo sát:</strong> Theo dõi tỷ lệ hoàn thành, phân tích độ lệch chuẩn (SD) và dữ liệu thiếu (N/A) theo từng đợt.
            </li>
            <li>
              <strong>2. Xuất dữ liệu nghiên cứu:</strong> Tải tệp CSV mã hóa danh tính (P-001...) để phân tích chuyên sâu trên SPSS, R hoặc Python.
            </li>
            <li>
              <strong>3. Xuất Báo cáo Thử nghiệm:</strong> Tự động xuất báo cáo tổng hợp theo 9 đề mục khoa học quy chuẩn của đề tài.
            </li>
          </ul>
        </div>

        {/* Admin Guide */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dành cho Quản trị viên</h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li>
              <strong>1. Quản lý phân quyền:</strong> Cấp quyền theo nguyên tắc tối thiểu (Least Privilege), đảm bảo an toàn truy cập backend.
            </li>
            <li>
              <strong>2. Quản trị tiêu chí:</strong> Cập nhật câu hỏi, thiết lập trọng số (đảm bảo tổng = 100%) và quản lý phiên bản.
            </li>
            <li>
              <strong>3. Thực thi quyền riêng tư:</strong> Giám sát Audit Logs và thực hiện xóa dữ liệu khi có yêu cầu rút lui từ sinh viên.
            </li>
          </ul>
        </div>
      </div>

      {/* Scoring Formulas & Missing Data Rules (Section IV) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Quy tắc Tính Điểm & Xử Lý Dữ Liệu Thiếu (Methodology)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">1. Điểm Lĩnh vực & Điểm Tổng hợp</h4>
            <p>
              - <strong>Điểm từng lĩnh vực</strong> = Trung bình cộng các câu trả lời hợp lệ (1–5) trong lĩnh vực đó.<br />
              - <strong>Điểm tổng hợp</strong> = Trung bình cộng của các lĩnh vực đủ điều kiện theo trọng số bằng nhau mặc định (hoặc trọng số cấu hình có tổng = 100%).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">2. Xử lý "Chưa đủ thông tin (N/A)"</h4>
            <p>
              Tùy chọn <strong>"Chưa đủ thông tin để trả lời"</strong> hoàn toàn không bị coi là điểm 0 hoặc điểm 1. Nó được loại bỏ khỏi cả tử số và mẫu số khi tính điểm trung bình để tránh làm méo mó kết quả của người học.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">3. Ngưỡng Hoàn thành Tối thiểu (70%)</h4>
            <p>
              Nếu tỷ lệ câu hỏi hợp lệ dưới 70%, hệ thống tự động gắn trạng thái <strong>"Chưa đủ dữ liệu để kết luận"</strong> thay vì đưa ra một điểm số tổng hợp thiếu căn cứ khoa học.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">4. Quy đổi Tuyến tính 0–100</h4>
            <p>
              Áp dụng công thức chuẩn: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">((Điểm TB - 1) / 4) * 100</code>. Đây thuần túy là phép biến đổi hình thức phục vụ trình bày trực quan, không đại diện cho xác suất năng lực thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* Ethics and Data Protection */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Scale className="w-5 h-5 text-emerald-700" />
          <span>Cam kết Đạo đức Nghiên cứu & Quyền Riêng tư của Người học</span>
        </div>
        <p className="leading-relaxed text-emerald-900">
          Hệ thống được thiết kế theo các nguyên tắc chuẩn mực về bảo vệ dữ liệu giáo dục đại học:
        </p>
        <ul className="space-y-1.5 list-disc list-inside text-emerald-800">
          <li><strong>Quyền được bảo vệ danh tính:</strong> Dữ liệu công bố tới nhóm nghiên cứu bắt buộc phải qua bước ẩn danh hóa (Anonymization) hoặc giả danh hóa (Pseudonymization).</li>
          <li><strong>Quyền rút lui và xóa dữ liệu:</strong> Người học có quyền ngừng tham gia bất kỳ lúc nào và yêu cầu xóa toàn bộ lịch sử khảo sát thông qua công cụ chuyên dụng của quản trị viên.</li>
          <li><strong>Phân định quyền riêng tư minh chứng:</strong> Sinh viên toàn quyền lựa chọn chế độ "Riêng tư" (chỉ mình xem) hoặc "Chia sẻ với nhóm nghiên cứu" cho từng tài liệu học tập.</li>
        </ul>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Câu Hỏi Thường Gặp (FAQs)
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              id: 'faq-1',
              q: 'Điểm tự đánh giá này có ảnh hưởng đến điểm học phần tại trường đại học của tôi không?',
              a: 'Hoàn toàn KHÔNG. Đây là công cụ phục vụ nghiên cứu khoa học và hỗ trợ tự phản tư cá nhân. Kết quả hoàn toàn độc lập và không bao giờ được sử dụng để xếp loại học vụ hay đánh giá thi đua.',
            },
            {
              id: 'faq-2',
              q: 'Tại sao có câu hỏi tôi nên chọn "Chưa đủ thông tin để trả lời"?',
              a: 'Nếu bạn chưa từng trải qua tình huống đó (ví dụ: chưa từng làm bài tập lớn cần kiểm chứng lỗi ảo giác AI), việc chọn "Chưa đủ thông tin" giúp hệ thống không tính sai lệch điểm trung bình của bạn.',
            },
            {
              id: 'faq-3',
              q: 'Khuyến nghị sư phạm AI được tạo ra như thế nào?',
              a: 'Khuyến nghị được xây dựng dựa trên ma trận thuật toán giáo dục phân tích từ các điểm yếu và điểm mạnh của 6 lĩnh vực (dựa trên mô hình Zimmerman và khung năng lực AI). Nếu chưa kết nối API Gemini, hệ thống chạy ở Chế độ thuật toán quy tắc chuẩn mực.',
            },
            {
              id: 'faq-4',
              q: 'Tôi có thể tải báo cáo năng lực của mình về máy để lưu trữ không?',
              a: 'Có. Tại trang kết quả, bạn có thể nhấn nút "In / Xuất PDF" để lưu toàn bộ biểu đồ radar, điểm quy đổi và danh sách bài tập thực hành vào hồ sơ cá nhân.',
            },
          ].map((item) => {
            const isOpen = activeAccordion === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
