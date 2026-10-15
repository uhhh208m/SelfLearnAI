import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  X,
  FileText,
  Loader2,
  Check,
} from 'lucide-react';
import { AssessmentSession, Domain, User } from '../../types/index.ts';
import { AcademicReportTemplate } from '../reports/AcademicReportTemplate.tsx';
import { exportElementToPDF } from '../../utils/pdfExport.ts';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AssessmentSession;
  domains: Domain[];
  currentUser: User;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  session,
  domains,
  currentUser,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    setDownloadSuccess(false);

    try {
      const fileName = `SelfLearn_BaoCao_${currentUser.studentCode || 'SV'}_${
        new Date().toISOString().split('T')[0]
      }.pdf`;

      await exportElementToPDF(reportRef.current, {
        filename: fileName,
        scale: 2,
        onProgress: (status) => setStatusMessage(status),
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      // Fallback: window.print() if html2canvas/jsPDF encounters issues
      window.print();
    } finally {
      setIsGeneratingPDF(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Floating Toolbar (Hidden when printing) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/95 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Xuất Báo Cáo Năng Lực Tự Học & Sử Dụng AI (PDF)
              </h3>
              <p className="text-[11px] text-slate-500">
                Tài liệu chính thức tổng hợp kết quả, biểu đồ radar 6 lĩnh vực và khuyến nghị cá nhân hóa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : isGeneratingPDF
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102'
              }`}
              title="Tải trực tiếp tệp PDF về máy tính"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{statusMessage || 'Đang tạo tệp PDF...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã tải về PDF!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải về PDF ngay</span>
                </>
              )}
            </button>

            {/* Print Dialog Option */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="In trực tiếp qua hộp thoại trình duyệt"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Hộp thoại In</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={reportRef}
          className="p-4 sm:p-8 overflow-y-auto printable-report-container text-slate-800 bg-white"
        >
          <AcademicReportTemplate
            session={session}
            domains={domains}
            currentUser={currentUser}
          />
        </div>

        {/* Modal Footer (Hidden when printing) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs no-print">
          <span className="text-slate-500 text-[11px]">
            Hệ thống tự động kết xuất định dạng PDF chuẩn A4, bảo toàn đầy đủ các tiêu chuẩn học thuật.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/80 font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : isGeneratingPDF
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang kết xuất PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã tải về PDF!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải về PDF ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
