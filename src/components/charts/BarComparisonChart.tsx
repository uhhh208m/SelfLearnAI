import React from 'react';
import { DomainScoreResult } from '../../types/index.ts';

interface BarComparisonChartProps {
  domainScores: Record<string, DomainScoreResult>;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({ domainScores }) => {
  const domains = Object.values(domainScores);

  return (
    <div className="space-y-4">
      {domains.map((d) => {
        const score = d.meanScore;
        const linearScore = d.linearScore100;
        const percentage = score !== null ? ((score - 1) / 4) * 100 : 0;

        return (
          <div key={d.domainId} className="group">
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="text-slate-800 font-semibold truncate pr-2">
                [{d.domainCode}] {d.domainTitle}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-900 font-bold">
                  {score !== null ? `${score.toFixed(2)} / 5.0` : 'Chưa đủ dữ liệu'}
                </span>
                {linearScore !== null && (
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    ~{linearScore.toFixed(0)}/100
                  </span>
                )}
              </div>
            </div>

            {/* Bar Track */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
              {/* Reference Grid lines at 2.0 (25%), 3.0 (50%), 4.0 (75%) */}
              <div className="absolute top-0 bottom-0 left-[25%] border-r border-slate-300 z-10 opacity-40"></div>
              <div className="absolute top-0 bottom-0 left-[50%] border-r border-slate-300 z-10 opacity-40"></div>
              <div className="absolute top-0 bottom-0 left-[75%] border-r border-slate-300 z-10 opacity-40"></div>

              {score !== null ? (
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(4, percentage)}%`,
                    backgroundColor: d.color,
                  }}
                />
              ) : (
                <div className="h-full bg-slate-300 opacity-50 w-full flex items-center justify-center text-[10px] text-slate-600">
                  Thiếu dữ liệu
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Hợp lệ: {d.validAnswerCount}/{d.totalQuestionCount} câu</span>
              {d.naCount > 0 && <span>Không rõ (N/A): {d.naCount} câu</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
