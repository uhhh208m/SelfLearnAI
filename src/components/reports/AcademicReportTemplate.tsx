import React from 'react';
import {
  GraduationCap,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { AssessmentSession, Domain, User } from '../../types/index.ts';
import { RadarChart } from '../charts/RadarChart.tsx';
import { generatePedagogicalAdvice } from '../../services/aiAdvisor.ts';

interface AcademicReportTemplateProps {
  session: AssessmentSession;
  domains: Domain[];
  currentUser: User;
}

export const AcademicReportTemplate: React.FC<AcademicReportTemplateProps> = ({
  session,
  domains,
  currentUser,
}) => {
  const result = session.result;
  const advice = generatePedagogicalAdvice(result, domains, currentUser.major);

  return (
    <div className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white max-w-[800px] mx-auto">
      {/* Formal Header */}
      <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
        <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-blue-900">
          ĐỀ TÀI NGHIÊN CỨU KHOA HỌC GIÁO DỤC ĐẠI HỌC
        </div>
        <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight leading-snug">
          BÁO CÁO ĐÁNH GIÁ NĂNG LỰC TỰ HỌC CỦA SINH VIÊN
          <br />
          TRONG MÔI TRƯỜNG CÓ AI HỖ TRỢ
        </h1>
        <p className="text-[11px] text-slate-600 italic">
          (Nền tảng SelfLearn AI - Khung đánh giá Năng lực Tự điều chỉnh Học tập SRL & AI Literacy)
        </p>
      </div>

      {/* 1. Student Information Table */}
      <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-200 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-blue-700" />
          <span>1. Thông Tin Người Học & Đợt Tự Đánh Giá</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
          <div>
            <span className="text-slate-500">Họ và tên:</span>{' '}
            <strong className="text-slate-900 font-bold">{currentUser.name}</strong>
          </div>
          <div>
            <span className="text-slate-500">Mã sinh viên:</span>{' '}
            <strong className="text-slate-900 font-mono font-bold">
              {currentUser.studentCode || 'SV-2026-CHUA-CAP'}
            </strong>
          </div>
          <div>
            <span className="text-slate-500">Trường/Khoa:</span>{' '}
            <span className="text-slate-800 font-medium">
              {currentUser.university || 'Đại học Quốc gia'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Ngành đào tạo:</span>{' '}
            <span className="text-slate-800 font-medium">
              {currentUser.major || 'Công nghệ thông tin'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Mã đợt khảo sát:</span>{' '}
            <span className="font-mono text-slate-800 font-bold">
              {session.studyBatchId}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Ngày hoàn thành:</span>{' '}
            <span className="text-slate-800 font-medium">
              {session.completedAt
                ? new Date(session.completedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-blue-900 text-white flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Điểm Tổng Hợp Năng Lực
          </span>
          <div className="my-1.5">
            <span className="text-3xl font-black">
              {result.compositeScore?.toFixed(2) ?? 'N/A'}
            </span>
            <span className="text-xs text-blue-200"> / 5.0</span>
          </div>
          <div className="text-[10px] text-blue-100">
            Quy đổi tuyến tính: <strong>~{result.compositeLinearScore100?.toFixed(1) ?? 'N/A'} / 100</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Độ Tin Cậy & Tỷ Lệ Hợp Lệ
          </span>
          <div className="my-1.5">
            <span className="text-3xl font-black text-slate-900">
              {result.validPercentage}%
            </span>
            <span className="text-xs text-slate-500"> (26 câu)</span>
          </div>
          <div className="text-[10px] text-slate-600">
            Hợp lệ: {result.totalValid} • N/A: {result.totalNA} • Thiếu: {result.totalUnanswered}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Phân Nhóm Tham Chiếu
          </span>
          <div className="my-1 text-xs font-bold text-blue-800">
            {result.referenceTier?.label || 'Chưa phân nhóm'}
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            * Phân mức thử nghiệm phục vụ định hướng nghiên cứu
          </div>
        </div>
      </div>

      {/* 3. Radar Chart & 6-Domain Breakdown Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <Award className="w-4 h-4 text-blue-700" />
          <span>2. Biểu Đồ Radar & Điểm Số 6 Lĩnh Vực Tự Điều Chỉnh Học Tập</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-200">
            <RadarChart domainScores={result.domainScores} size={290} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2 px-2.5">Mã</th>
                  <th className="py-2 px-2.5">Lĩnh vực tự học</th>
                  <th className="py-2 px-2 text-center">Likert (1-5)</th>
                  <th className="py-2 px-2 text-center">Quy đổi (~/100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {domains.map((dom) => {
                  const dScore = result.domainScores[dom.id];
                  return (
                    <tr key={dom.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-mono font-bold text-blue-700">
                        {dom.code}
                      </td>
                      <td className="py-2 px-2.5 font-medium text-slate-800">
                        {dom.shortTitle}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-slate-900">
                        {dScore?.meanScore?.toFixed(2) ?? 'N/A'}
                      </td>
                      <td className="py-2 px-2 text-center text-blue-700 font-semibold">
                        ~{dScore?.linearScore100?.toFixed(0) ?? 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              * Điểm 0–100 là công thức quy đổi tuyến tính `((Điểm TB - 1) / 4) * 100` để minh họa trực quan.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Pedagogical Recommendations */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>3. Phân Tích Sư Phạm & Khuyến Nghị Cải Thiện Cá Nhân Hóa</span>
        </h4>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong>Tóm tắt nhận định:</strong> {advice.summary}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Điểm sáng tiềm năng:</span>
            </div>
            <ul className="space-y-1 text-emerald-800 text-[11px]">
              {advice.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Lĩnh vực ưu tiên cải thiện:</span>
            </div>
            <ul className="space-y-1 text-amber-800 text-[11px]">
              {advice.areasToGrow.map((a, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3 Action Steps */}
        <div className="space-y-2 pt-1">
          <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Kế hoạch hành động 3 bước khuyến nghị:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {advice.actionSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{idx + 1}. {step.title}</span>
                  <span className="font-mono text-[10px] text-blue-700">[{step.domainCode}]</span>
                </div>
                <p className="text-[11px] text-slate-600">{step.description}</p>
                <div className="text-[10px] text-blue-800 bg-white p-2 rounded-lg border border-slate-200">
                  <strong>Bài tập thực hành:</strong> {step.practicalExercise}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Literacy Tip */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
          <div className="font-bold text-blue-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Kỹ năng sử dụng AI có trách nhiệm (AI Literacy): {advice.aiLiteracyTip.topic}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-blue-200 font-mono text-[11px] text-slate-800">
            {advice.aiLiteracyTip.recommendedPrompt}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
            {advice.aiLiteracyTip.verificationChecklist.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{c}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Ethical Disclaimer & Confirmation */}
      <div className="pt-4 border-t border-slate-200 text-xs space-y-5">
        <div className="text-[10px] text-slate-500 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <strong>Lưu ý đạo đức & phương pháp luận nghiên cứu:</strong> Báo cáo này là kết quả tự đánh giá dựa trên dữ liệu tự báo cáo (self-report) của sinh viên trong khuôn khổ đề tài nghiên cứu khoa học. Kết quả không cấu thành điểm đánh giá học phần chính thức và không thay thế cho đánh giá của giảng viên.
        </div>

        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-2">
          <div>
            <p className="font-bold text-slate-700">Xác nhận của Hệ thống SelfLearn AI</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Chứng thực dữ liệu nghiên cứu</p>
            <div className="h-14 flex items-center justify-center text-blue-700 font-mono text-[11px] font-bold">
              [ĐÃ CHỨNG THỰC ĐIỆN TỬ]
            </div>
            <p className="font-semibold text-slate-800">Ban Đề tài Nghiên cứu Khoa học</p>
          </div>

          <div>
            <p className="font-bold text-slate-700">Người học tự đánh giá</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Cam kết tự học & liêm chính học thuật</p>
            <div className="h-14 flex items-center justify-center text-slate-400 text-xs italic">
              (Ký và ghi rõ họ tên)
            </div>
            <p className="font-bold text-slate-900">{currentUser.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
