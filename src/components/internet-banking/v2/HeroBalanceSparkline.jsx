import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * Mini sparkline 30d para o Hero Card.
 * Inline SVG leve, sem dependência adicional.
 */
export default function HeroBalanceSparkline({ data, change = 8.4 }) {
  // Mock data se não vier nada — 30 pontos de balance ao longo do mês
  const points = data || [
    98, 102, 105, 110, 108, 112, 118, 120, 119, 124,
    126, 130, 128, 134, 136, 138, 135, 140, 142, 145,
    143, 148, 150, 149, 152, 155, 153, 156, 154, 158
  ];

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 200;
  const height = 40;

  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const area = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="flex items-center gap-3 mt-3">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2bc196" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2bc196" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sparklineGrad)" />
        <path d={path} fill="none" stroke="#2bc196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex items-center gap-1 text-xs">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-400 font-bold">+{change}%</span>
        <span className="text-slate-400">30d</span>
      </div>
    </div>
  );
}