/**
 * PDF Generation Utility for SelfLearn AI
 * Generates crisp, print-ready academic assessment reports using html2canvas & jsPDF.
 */

import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  onProgress?: (status: string) => void;
}

export async function exportElementToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<boolean> {
  const {
    filename = `SelfLearn_BaoCao_DanhGia_${new Date().toISOString().split('T')[0]}.pdf`,
    quality = 0.95,
    scale = 2,
    onProgress,
  } = options;

  try {
    if (onProgress) onProgress('Đang xử lý hình ảnh và cấu trúc biểu đồ...');

    // Wait a brief moment to ensure all SVG charts and fonts are rendered
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Render DOM to canvas with high resolution
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    if (onProgress) onProgress('Đang kết xuất tệp PDF tiêu chuẩn A4...');

    const imgData = canvas.toDataURL('image/jpeg', quality);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = 210; // A4 standard width in mm
    const pageHeight = 297; // A4 standard height in mm
    const margin = 8; // 8mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    const pageUsableHeight = pageHeight - margin * 2;

    let heightLeft = contentHeight;
    let pageIndex = 0;

    // Render first page
    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
    heightLeft -= pageUsableHeight;

    // Render subsequent pages if content exceeds 1 page
    while (heightLeft > 0) {
      pageIndex++;
      pdf.addPage();
      const positionY = margin - pageIndex * pageUsableHeight;
      pdf.addImage(imgData, 'JPEG', margin, positionY, contentWidth, contentHeight);
      heightLeft -= pageUsableHeight;
    }

    if (onProgress) onProgress('Đang tải tệp về thiết bị...');
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
}
