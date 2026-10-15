import React from 'react';
import { DomainScoreResult } from '../../types/index.ts';

interface RadarChartProps {
  domainScores: Record<string, DomainScoreResult>;
  previousScores?: Record<string, DomainScoreResult>;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  domainScores,
  previousScores,
  size = 360,
}) => {
  const domains = Object.values(domainScores);
  const count = domains.length;

  if (count === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Chưa có dữ liệu để vẽ biểu đồ
      </div>
    );
  }

  const center = size / 2;
  const radius = (size / 2) - 50;
  const angleStep = (Math.PI * 2) / count;

  // Levels 1 to 5
  const levels = [1, 2, 3, 4, 5];

  // Helper to convert polar to cartesian
  const getCoordinates = (value: number, index: number) => {
    // scale 1-5 to 0-1 radius
    const normalized = Math.max(0, Math.min(1, (value - 1) / 4));
    const r = normalized * radius;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Current polygon points
  const currentPoints = domains.map((d, i) => {
    const val = d.meanScore ?? 1;
    return getCoordinates(val, i);
  });
  const currentPolygonStr = currentPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Previous polygon points if any
  let prevPolygonStr = '';
  if (previousScores) {
    const prevPoints = domains.map((d, i) => {
      const prevD = previousScores[d.domainId];
      const val = prevD?.meanScore ?? 1;
      return getCoordinates(val, i);
    });
    prevPolygonStr = prevPoints.map((p) => `${p.x},${p.y}`).join(' ');
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        {/* Background Grid Rings */}
        {levels.map((lvl) => {
          const r = ((lvl - 1) / 4) * radius;
          return (
            <g key={`ring-${lvl}`}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={lvl < 5 ? '3 3' : 'none'}
              />
              <text
                x={center + 4}
                y={center - r - 3}
                fill="#94a3b8"
                fontSize="10"
                fontWeight="500"
              >
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Spokes */}
        {domains.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={`spoke-${d.domainId}`}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Previous Polygon if provided */}
        {prevPolygonStr && (
          <polygon
            points={prevPolygonStr}
            fill="#94a3b8"
            fillOpacity="0.15"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Current Polygon */}
        <polygon
          points={currentPolygonStr}
          fill="#3b82f6"
          fillOpacity="0.25"
          stroke="#2563eb"
          strokeWidth="2.5"
        />

        {/* Data points & tooltips */}
        {currentPoints.map((p, i) => {
          const d = domains[i];
          return (
            <g key={`dot-${d.domainId}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
            </g>
          );
        })}

        {/* Labels */}
        {domains.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 26;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          const textAnchor =
            Math.abs(Math.cos(angle)) < 0.2
              ? 'middle'
              : Math.cos(angle) > 0
              ? 'start'
              : 'end';

          return (
            <g key={`label-${d.domainId}`}>
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                className="text-[11px] font-semibold fill-slate-700"
                dominantBaseline="central"
              >
                {d.domainCode} ({d.meanScore?.toFixed(1) ?? 'N/A'})
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          <span>Điểm đợt này</span>
        </div>
        {previousScores && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-dashed border-slate-500 bg-slate-300 inline-block"></span>
            <span>Đợt trước</span>
          </div>
        )}
      </div>
    </div>
  );
};
