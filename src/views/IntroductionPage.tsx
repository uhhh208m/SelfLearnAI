import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Brain,
  Compass,
  CheckCircle2,
  FileCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Scale,
  Users,
} from 'lucide-react';
import { Domain, User } from '../types/index.ts';

interface IntroductionPageProps {
  domains: Domain[];
  onStartAssessment: () => void;
  onNavigateTab: (tab: string) => void;
  currentUser: User;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({
  domains,
  onStartAssessment,
  onNavigateTab,
  currentUser,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Đề tài Nghiên cứu Khoa học Giáo dục Đại học
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Xây dựng Hệ thống Hỗ trợ Đánh giá Năng lực Tự học của Sinh viên trong Môi trường có AI Hỗ trợ
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
            Nền tảng <strong>SelfLearn AI</strong> giúp người học định vị chính xác mức độ tự chủ học tập, rèn luyện kỹ năng siêu nhận thức và hình thành thói quen sử dụng trí tuệ nhân tạo có trách nhiệm, liêm chính và hiệu quả.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartAssessment}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
            >
              <span>Bắt đầu tự đánh giá năng lực</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('criteria')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              Xem 6 lĩnh vực & 26 tiêu chí
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật danh tính & Giả danh hóa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Thang đo chuẩn hóa Likert 5 mức</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Gợi ý sư phạm cá nhân hóa</span>
            </div>
          </div>
        </div>

        {/* Decorative background grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="100,0 100,100 0,100" fill="white" />
          </svg>
        </div>
      </section>

      {/* 5 Research Objectives */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Mục tiêu Nghiên cứu Trọng tâm</h2>
          <p className="text-xs text-slate-500 mt-1">
            Đề tài giải quyết bài toán cấp thiết: làm thế nào để sinh viên tận dụng AI mà không bị suy giảm năng lực tự học và tư duy độc lập.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'Xây dựng Bộ tiêu chí',
              desc: 'Định hình 6 lĩnh vực với 26 chỉ số đo lường năng lực tự điều chỉnh học tập (SRL) trong kỷ nguyên số.',
            },
            {
              num: '02',
              title: 'Tự đánh giá & Minh chứng',
              desc: 'Tạo công cụ để sinh viên tự soi chiếu hành vi, ghi nhận nhật ký prompt AI và bằng chứng học tập thực tế.',
            },
            {
              num: '03',
              title: 'Phân tích & Khuyến nghị',
              desc: 'Nhận diện điểm mạnh, lỗ hổng phương pháp và cung cấp kế hoạch hành động 3 bước có thể thực thi ngay.',
            },
            {
              num: '04',
              title: 'Hỗ trợ Nhóm nghiên cứu',
              desc: 'Cung cấp bảng phân tích dữ liệu gộp, kiểm định phân bố, độ lệch chuẩn và xuất dữ liệu SPSS/R sạch sẽ.',
            },
            {
              num: '05',
              title: 'Thẩm định Thực nghiệm',
              desc: 'Thu thập phản hồi về độ rõ nghĩa, tính khả thi và độ tin cậy để hiệu chuẩn bộ tiêu chí cho nghiên cứu tiếp theo.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-blue-600/30">{item.num}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-1 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Core Domains Overview */}
      <section className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/70">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Cơ sở lý thuyết</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Khung 6 Lĩnh vực Năng lực Tự học (SelfLearn Framework)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp có chọn lọc từ Mô hình Học tập Tự điều chỉnh (Zimmerman & Pintrich), Học tập Tự định hướng (Knowles) và Khung Năng lực AI trong Giáo dục.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domains.map((dom, index) => (
            <div
              key={dom.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: dom.color }}
                  >
                    {dom.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Trọng số: {dom.weight}%
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{dom.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{dom.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Mã lĩnh vực: {dom.code}</span>
                <span className="font-medium text-blue-600">4 - 6 tiêu chí</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Participation Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Quy trình Tham gia Tự đánh giá</h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉ mất khoảng 10 - 15 phút để hoàn thành và nhận báo cáo phản tư toàn diện.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 'Bước 1',
              title: 'Xác nhận Đồng ý',
              desc: 'Đọc kỹ thông tin nghiên cứu và đồng ý tham gia tự nguyện với sự bảo vệ quyền riêng tư tuyệt đối.',
            },
            {
              step: 'Bước 2',
              title: 'Trả lời 26 Câu hỏi',
              desc: 'Đánh giá mức độ phù hợp trên thang Likert 5 mức. Bạn có thể lưu bản nháp và làm tiếp bất kỳ lúc nào.',
            },
            {
              step: 'Bước 3',
              title: 'Cung cấp Minh chứng',
              desc: 'Đính kèm nhật ký câu lệnh AI, kế hoạch tuần hoặc ghi chú phản tư để tăng độ tin cậy của bài học.',
            },
            {
              step: 'Bước 4',
              title: 'Nhận Báo cáo & Lập Kế hoạch',
              desc: 'Xem biểu đồ Radar 6 chiều, nhận khuyến nghị sư phạm và tạo mục tiêu cải thiện có đo lường.',
            },
          ].map((s, idx) => (
            <div key={s.step} className="bg-white p-5 rounded-2xl border border-slate-200 relative">
              <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase mb-2">
                {s.step}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ethics & Privacy Notice */}
      <section className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <h3 className="text-sm font-bold text-emerald-900">Cam kết Đạo đức Nghiên cứu & Quyền Riêng tư</h3>
        </div>
        <p className="text-emerald-800 leading-relaxed">
          Nghiên cứu này tuân thủ các chuẩn mực đạo đức khoa học giáo dục: Dữ liệu được mã hóa và tách biệt khỏi định danh học tập chính thức. Người tham gia có quyền rút khỏi khảo sát và yêu cầu xóa dữ liệu bất kỳ lúc nào tại mục Cài đặt hoặc Hướng dẫn. Nhóm nghiên cứu cam kết không chia sẻ dữ liệu cá nhân cho bên thứ ba.
        </p>
      </section>
    </div>
  );
};
