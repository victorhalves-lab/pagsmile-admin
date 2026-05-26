import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { VF } from './analytics/vfHelpers';

/**
 * PaymentMethodsChart — Pulse VF.
 * Donut com cores brand-only (navy + mint) e tooltip dark navy V9.
 */
const COLORS = [VF.navy2, VF.mint];

export default function PaymentMethodsChart({ data = [], className }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Cartão', value: 65, amount: 152340.50 },
    { name: 'Pix',    value: 35, amount: 82150.75 },
  ];

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', notation: 'compact',
    }).format(v);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
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
          {payload[0].name}
        </p>
        <p className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
          {payload[0].value}% das vendas
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: 13, fontWeight: 800, color: VF.glow,
            fontVariantNumeric: 'tabular-nums', marginTop: 2,
          }}
        >
          {fmt(payload[0].payload.amount)}
        </p>
      </div>
    );
  };

  return (
    <div className={className} style={{ height: 256 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={64} outerRadius={86}
            paddingAngle={5}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-2">
        {chartData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              style={{
                width: 12, height: 12, borderRadius: 3,
                background: COLORS[idx % COLORS.length],
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 11, color: VF.muted, fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              <strong style={{ color: VF.navy }}>{entry.name}</strong>{' '}
              <span style={{ fontVariantNumeric: 'tabular-nums', color: VF.mintDark, fontWeight: 800 }}>
                {entry.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}