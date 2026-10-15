import { AssessmentCalculationResult, Domain } from '../types/index.ts';

export interface AIAdviceOutput {
  mode: 'rule_based_pedagogical' | 'gemini_generative';
  modeLabel: string;
  summary: string;
  strengths: string[];
  areasToGrow: string[];
  actionSteps: {
    title: string;
    description: string;
    domainCode: string;
    practicalExercise: string;
  }[];
  aiLiteracyTip: {
    topic: string;
    recommendedPrompt: string;
    verificationChecklist: string[];
  };
  disclaimer: string;
}

export function generatePedagogicalAdvice(
  result: AssessmentCalculationResult,
  domains: Domain[],
  studentMajor = 'Sinh viên Đại học'
): AIAdviceOutput {
  const domainScoreEntries = Object.entries(result.domainScores);
  const sortedDomains = [...domainScoreEntries].sort(
    (a, b) => (b[1].meanScore ?? 0) - (a[1].meanScore ?? 0)
  );

  const topDomain = sortedDomains[0] ? sortedDomains[0][1] : null;
  const lowestDomain = sortedDomains[sortedDomains.length - 1] ? sortedDomains[sortedDomains.length - 1][1] : null;
  const aiDomain = result.domainScores['domain-ai-competence'];

  const strengths: string[] = [];
  const areasToGrow: string[] = [];
  const actionSteps: AIAdviceOutput['actionSteps'] = [];

  // Identify strengths
  if (topDomain && topDomain.meanScore && topDomain.meanScore >= 3.5) {
    strengths.push(
      `Điểm sáng ở ${topDomain.domainTitle} (${topDomain.meanScore.toFixed(2)}/5.0): Bạn đã hình thành được phản xạ và thói quen tích cực trong lĩnh vực này.`
    );
  } else {
    strengths.push(
      'Bạn đã chủ động tham gia tự đánh giá và có ý thức tìm hiểu về năng lực tự học của chính mình.'
    );
  }

  // AI Domain specific insight
  if (aiDomain && aiDomain.meanScore !== null) {
    if (aiDomain.meanScore >= 4.0) {
      strengths.push(
        `Năng lực sử dụng AI có trách nhiệm đạt mức cao (${aiDomain.meanScore.toFixed(2)}/5.0): Bạn có thói quen kiểm tra nguồn, không phụ thuộc máy móc và chú ý đến liêm chính học thuật.`
      );
    } else if (aiDomain.meanScore < 3.2) {
      areasToGrow.push(
        `Cần tăng cường kiểm chứng kết quả từ AI (${aiDomain.meanScore.toFixed(2)}/5.0): Tránh thói quen sao chép trực tiếp kết quả của AI mà chưa tra cứu giáo trình chuẩn hoặc làm bài tập đối chiếu.`
      );
    }
  }

  // Lowest domain growth area
  if (lowestDomain && lowestDomain.meanScore !== null) {
    areasToGrow.push(
      `Cần ưu tiên củng cố ${lowestDomain.domainTitle} (${lowestDomain.meanScore.toFixed(2)}/5.0): Đây là chặng đòn bẩy giúp cải thiện đáng kể hiệu quả học tập tổng thể.`
    );
  }

  // Action steps based on lowest domain or general SRL
  if (lowestDomain?.domainId === 'domain-planning') {
    actionSteps.push({
      title: 'Thiết lập mục tiêu nhỏ theo tuần (Sprint Learning)',
      description: 'Trước mỗi tuần học, hãy dành 15 phút Chủ nhật viết ra 3 mục tiêu cụ thể có thể đo lường được.',
      domainCode: 'KH',
      practicalExercise: 'Sử dụng kỹ thuật chia nhỏ: 1 chương lý thuyết = 3 phiên đọc sâu (Deep Work) 45 phút.',
    });
  } else if (lowestDomain?.domainId === 'domain-critical') {
    actionSteps.push({
      title: 'Quy tắc xác minh hai nguồn độc lập',
      description: 'Khi tiếp nhận một định lý hay giải pháp thuật toán từ AI hoặc diễn đàn, hãy tìm ít nhất 1 bài báo khoa học hoặc giáo trình đại học chuẩn để so sánh.',
      domainCode: 'PB',
      practicalExercise: 'Ghi chú bên lề: "Ý kiến AI nói X, sách chuẩn nói Y, điểm khác nhau ở điều kiện biên Z".',
    });
  } else if (lowestDomain?.domainId === 'domain-monitoring') {
    actionSteps.push({
      title: 'Tự kiểm tra siêu nhận thức sau 30 phút học',
      description: 'Gấp sách hoặc đóng cửa sổ chat AI, lấy giấy trắng viết tóm tắt lại bản chất khái niệm bằng lời của mình.',
      domainCode: 'GS',
      practicalExercise: 'Phương pháp Feynman: Giải thích khái niệm kỹ thuật vừa học sao cho một học sinh lớp 10 cũng có thể hiểu.',
    });
  } else {
    actionSteps.push({
      title: 'Đúc rút nhật ký phản tư sau mỗi bài tập lớn',
      description: 'Trả lời 3 câu hỏi nhanh: Điều gì làm tốt? Trở ngại lớn nhất là gì? Bài học cho nhiệm vụ sau?',
      domainCode: 'PT',
      practicalExercise: 'Dành 5 phút ghi chú lại nguyên nhân thành công hoặc sai sót trước khi đóng dự án.',
    });
  }

  actionSteps.push({
    title: 'Chiến lược tương tác đối thoại Socratic với AI',
    description: 'Chuyển đổi từ việc yêu cầu AI "làm hộ bài" sang yêu cầu AI "đặt câu hỏi gợi mở kiểm tra kiến thức của tôi".',
    domainCode: 'AI',
    practicalExercise: 'Thử lệnh: "Tôi đang học về [chủ đề]. Đừng giải ngay, hãy hỏi tôi 3 câu hỏi trắc nghiệm tình huống để kiểm tra mức độ hiểu của tôi."',
  });

  return {
    mode: 'rule_based_pedagogical',
    modeLabel: 'Chế độ gợi ý thuật toán sư phạm theo quy tắc — Chưa kết nối Gemini API',
    summary: `Dựa trên kết quả tự đánh giá của sinh viên ngành ${studentMajor}, điểm trung bình tổng hợp đạt ${
      result.compositeScore?.toFixed(2) ?? 'N/A'
    }/5.0 (quy đổi tuyến tính: ${result.compositeLinearScore100?.toFixed(1) ?? 'N/A'}/100). Kết quả cho thấy bạn có những nền tảng đáng khích lệ nhưng cần chú trọng cân bằng giữa tốc độ hỗ trợ của công nghệ và chiều sâu tư duy phản biện độc lập.`,
    strengths,
    areasToGrow,
    actionSteps,
    aiLiteracyTip: {
      topic: 'Khai thác AI như Người hướng dẫn (Tutor) thay vì Người làm thay (Ghostwriter)',
      recommendedPrompt: `"Bạn là giảng viên môn [Tên môn học]. Tôi đang xây dựng luận điểm cho vấn đề [X]. Hãy phản biện 3 điểm yếu hoặc giả định chưa được chứng minh trong lập luận sau đây của tôi: [Dán dàn ý của bạn]. Đừng viết lại bài, chỉ đặt câu hỏi phản biện."`,
      verificationChecklist: [
        'Luôn kiểm tra tác giả và năm xuất bản của các nguồn trích dẫn mà AI đưa ra.',
        'Tự gõ lại mã nguồn hoặc tự giải lại bài toán trên giấy trước khi nộp.',
        'Khai báo trung thực việc có tham khảo AI theo quy chế liêm chính học thuật.',
      ],
    },
    disclaimer: 'Khuyến nghị này mang tính chất gợi ý phương pháp học tập dựa trên dữ liệu tự báo cáo, không cấu thành đánh giá học lực chính thức hoặc chẩn đoán tâm lý.',
  };
}
