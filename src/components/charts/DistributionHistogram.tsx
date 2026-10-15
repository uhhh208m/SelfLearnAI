import React from 'react';

interface DistributionHistogramProps {
  distribution: { bin: string; count: number; percentage: number }[];
  title?: string;
  totalCount: number;
}

export const DistributionHistogram: React.FC<DistributionHistogramProps> = ({
  distribution,
  title = 'Phân bố điểm năng lực tổng thể',
  totalCount,
}) => {
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <span className="text-xs text-slate-500">Mẫu: N = {totalCount}</span>
      </div>

      <div className="space-y-3">
        {distribution.map((b) => {
          const widthPercent = (b.count / maxCount) * 100;
          return (
            <div key={b.bin} className="text-xs">
              <div className="flex justify-between items-center mb-1 text-slate-600 font-medium">
                <span className="font-mono text-slate-700">{b.bin}</span>
                <span className="font-semibold text-slate-900">
                  {b.count} ({b.percentage}%)
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-md overflow-hidden relative">
                <div
                  className="h-full bg-blue-600 rounded-md transition-all duration-300"
                  style={{ width: `${Math.max(b.count > 0 ? 5 : 0, widthPercent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
        <span>Thấp (1.0 - 1.99)</span>
        <span>Trung bình (2.0 - 2.99)</span>
        <span>Khá (3.0 - 3.99)</span>
        <span>Cao (4.0 - 5.0)</span>
      </div>
    </div>
  );
};
