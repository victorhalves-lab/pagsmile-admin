import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

/**
 * Sparkline universal — usado em todos os KPIs do dashboard.
 * Padrão Stripe / Adyen.
 *
 * @param data         array de números OU array de { v: number, label?: string }
 * @param color        emerald | blue | violet | amber | red | teal | slate
 * @param height       altura em px (default 28)
 * @param showTooltip  mostra tooltip ao hover
 */
export default function Sparkline({
  data = [],
  color = 'emerald',
  height = 28,
  showTooltip = false,
  className,
}) {
  const palette = {
    emerald: { stroke: '#2bc196', fill: 'rgba(43, 193, 150, 0.15)' },
    blue:    { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.15)' },
    violet:  { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)' },
    amber:   { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)' },
    red:     { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.15)' },
    teal:    { stroke: '#14b8a6', fill: 'rgba(20, 184, 166, 0.15)' },
    slate:   { stroke: '#64748b', fill: 'rgba(100, 116, 139, 0.15)' },
  };
  const c = palette[color] || palette.emerald;

  // Normaliza dados: aceita array de números ou array de objetos
  const series = data.length > 0
    ? data.map((d, i) => (typeof d === 'number' ? { v: d, label: `${i}` } : d))
    : [{ v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 65 }, { v: 60 }, { v: 70 }];

  const gradientId = `spark-${color}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c.stroke} stopOpacity={0.4} />
              <stop offset="95%" stopColor={c.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                padding: '4px 8px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [value, '']}
            />
          )}
          <Area
            type="monotone"
            dataKey="v"
            stroke={c.stroke}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}