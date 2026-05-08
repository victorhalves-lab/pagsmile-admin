import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Mini sparkline de 7 dias para tendência inline.
 * Gera dados pseudo-aleatórios determinísticos a partir do link.id.
 */
export default function PaymentLinkSparkline({ link, width = 60, height = 20 }) {
  if (!link) return null;

  const seed = (link.id || 'x').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const points = Array.from({ length: 7 }, (_, i) => {
    const v = Math.sin((seed + i * 13) * 0.7) * 0.5 + 0.5;
    return Math.max(0.1, Math.min(0.95, v + (link.usage_count > 5 ? 0.1 : -0.1)));
  });

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // Tendência: comparar último vs primeiro
  const trend = points[points.length - 1] - points[0];
  const color = trend > 0.05 ? '#10b981' : trend < -0.05 ? '#ef4444' : '#94a3b8';

  return (
    <svg width={width} height={height} className="inline-block">
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}