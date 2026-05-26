import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { VF } from './analytics/vfHelpers';

/**
 * ApprovalRateChart — Pulse VF.
 * Bars com cores brand-only + ref line meta + tooltip dark navy V9.
 */
export default function ApprovalRateChart({ data = [], target = 85, className }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Visa',   rate: 92.5 },
    { name: 'Master', rate: 88.3 },
    { name: 'Elo',    rate: 85.1 },
    { name: 'Amex',   rate: 79.8 },
    { name: 'Hiper',  rate: 82.4 },
    { name: 'Pix',    rate: 98.5 },
  ];

  const barColor = (rate) =>
    rate >= target ? VF.mint
    : rate >= target - 10 ? '#F59E0B'
    : '#DC2626';

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const rate = payload[0].value;
    const above = rate >= target;
    return (
      <div
        style={{
          background: VF.navy, color: '#fff',
          padding: '8px 12px', borderRadius: 8,
          border: '1px solid rgba(92,247,207,0.3)',
          boxShadow: '0 8px 24px -8px rgba(0,17,36,0.4)',
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: 10, color: VF.glow, fontWeight: 800,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2,
          }}
        >
          {payload[0].payload.name}
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: 18, fontWeight: 800,
            color: above ? VF.glow : rate >= target - 10 ? '#FBBF24' : '#FCA5A5',
            fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
          }}
        >
          {rate.toFixed(1)}%
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
          {above ? 'Acima da meta' : `${(target - rate).toFixed(1)}% abaixo da meta`}
        </p>
      </div>
    );
  };

  return (
    <div className={className} style={{ height: 256, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 24, right: 56, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0F8F1" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace' }}
            tickFormatter={(v) => `${v}%`}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,193,148,0.06)' }} />
          <ReferenceLine
            y={target}
            stroke={VF.mintDark}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Meta ${target}%`,
              position: 'right',
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 800,
              fill: VF.mintDark,
            }}
          />
          <Bar dataKey="rate" radius={[5, 5, 0, 0]} maxBarSize={44}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={barColor(entry.rate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}