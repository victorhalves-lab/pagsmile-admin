import React from 'react';
import {
  CreditCard, QrCode, TrendUp, CurrencyDollar, Hash, ChartBar,
} from '@phosphor-icons/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { VF, VfCard, VfSectionHeader } from './analytics/vfHelpers';

/**
 * ComparativeMetrics — Pulse VF.
 * Card branco + 4 quadrantes Cartão vs PIX + barchart comparativo.
 */
export default function ComparativeMetrics({ transactions = [] }) {
  const fmtCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', notation: 'compact',
    }).format(v || 0);

  const approved = transactions.filter((t) => t.status === 'approved');
  const cardTx = approved.filter((t) => t.type === 'card');
  const pixTx = approved.filter((t) => t.type === 'pix');

  const cardVolume = cardTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const pixVolume = pixTx.reduce((sum, t) => sum + (t.amount || 0), 0);

  const cardTicket = cardTx.length > 0 ? cardVolume / cardTx.length : 0;
  const pixTicket = pixTx.length > 0 ? pixVolume / pixTx.length : 0;

  const totalCard = transactions.filter((t) => t.type === 'card');
  const cardApproved = totalCard.filter((t) => t.status === 'approved');
  const cardApprovalRate = totalCard.length > 0 ? (cardApproved.length / totalCard.length) * 100 : 0;
  const pixConversionRate = 85.5;

  const comparisons = [
    { label: 'Volume',       card: cardVolume,        pix: pixVolume,           format: 'currency',   icon: CurrencyDollar },
    { label: 'Quantidade',   card: cardTx.length,     pix: pixTx.length,        format: 'number',     icon: Hash },
    { label: 'Ticket Médio', card: cardTicket,        pix: pixTicket,           format: 'currency',   icon: TrendUp },
    { label: 'Conversão',    card: cardApprovalRate,  pix: pixConversionRate,   format: 'percentage', icon: ChartBar },
  ];

  const formatValue = (val, format) => {
    if (format === 'currency') return fmtCurrency(val);
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    return new Intl.NumberFormat('pt-BR').format(val);
  };

  const chartData = comparisons.map((c) => ({
    name: c.label,
    Cartão: c.card,
    Pix: c.pix,
    format: c.format,
  }));

  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const format = payload[0].payload.format;
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
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
          }}
        >
          {payload[0].payload.name}
        </p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3" style={{ fontSize: 11 }}>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{entry.name}</span>
            </div>
            <span className="font-mono" style={{ fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {formatValue(entry.value, format)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <VfCard>
      <VfSectionHeader
        eyebrow="Comparativo · método"
        title="Cartão vs"
        highlight="PIX"
        icon={ChartBar}
      />

      {/* 4 quadrantes lado a lado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {comparisons.map((comp) => {
          const Icon = comp.icon;
          const cardHigher = comp.card > comp.pix;
          const difference = Math.abs(comp.card - comp.pix);
          const percentDiff = comp.pix > 0 ? (difference / comp.pix) * 100 : 0;

          return (
            <div
              key={comp.label}
              className="relative overflow-hidden p-3 transition-all hover:-translate-y-0.5"
              style={{
                background: VF.surface,
                border: `1px solid ${VF.mintBorder}`,
                borderRadius: 12,
              }}
            >
              <span
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${VF.mint}, ${VF.glow})`,
                }}
              />
              <div className="flex items-center gap-1.5 mb-2">
                <Icon weight="duotone" size={13} style={{ color: VF.mintDark }} />
                <p
                  className="font-mono"
                  style={{
                    fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: VF.mintDark,
                  }}
                >
                  {comp.label}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Cartão
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12, fontWeight: 800, color: VF.navy,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatValue(comp.card, comp.format)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono" style={{ fontSize: 10, color: VF.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    PIX
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12, fontWeight: 800, color: VF.navy,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatValue(comp.pix, comp.format)}
                  </span>
                </div>
              </div>
              {difference > 0 && (
                <div
                  className="mt-2 pt-2"
                  style={{ borderTop: '1px dashed #B3F0DE' }}
                >
                  <p style={{ fontSize: 10, color: VF.muted, fontWeight: 600 }}>
                    {cardHigher ? 'Cartão' : 'PIX'}{' '}
                    <span
                      className="font-mono"
                      style={{
                        fontWeight: 800,
                        color: cardHigher ? VF.navy2 : VF.mintDark,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {percentDiff.toFixed(0)}% maior
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barchart comparativo */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0F8F1" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10.5, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: VF.muted, fontFamily: 'JetBrains Mono, monospace' }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,193,148,0.06)' }} />
            <Bar dataKey="Cartão" fill={VF.navy2} radius={[5, 5, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Pix"    fill={VF.mint}  radius={[5, 5, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </VfCard>
  );
}