import React from 'react';
import { ShieldWarning, CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * FinancialRiskCard — Pulse VF.
 * Card branco + icon container err + progress bar com cor por nível de risco.
 */
export default function FinancialRiskCard({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const items = [
    { label: 'Rolling reserve',       value: data.rollingReserve ?? 18500, link: createPageUrl('FinancialOverview') },
    { label: 'Disputas em curso',     value: data.disputesOpen ?? 8420,    link: createPageUrl('DisputeDashboard') },
    { label: 'Retentativas pendentes', value: data.retriesPending ?? 3680, link: createPageUrl('Transactions') },
    { label: 'MED em jogo',           value: data.medAtRisk ?? 2150,        link: createPageUrl('MEDDashboard') },
  ];

  const total = items.reduce((sum, i) => sum + (i.value || 0), 0);
  const totalLimit = data.totalLimit ?? 100000;
  const riskPct = Math.min((total / totalLimit) * 100, 100);

  const level =
    riskPct < 30 ? { label: 'Baixo', bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '#4DD8AB', bar: 'linear-gradient(90deg, #1ECB9D, #007A5C)' }
    : riskPct < 60 ? { label: 'Moderado', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', border: '#FDE68A', bar: 'linear-gradient(90deg, #FBBF24, #F59E0B)' }
    : { label: 'Alto', bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '#FCA5A5', bar: 'linear-gradient(90deg, #F87171, #DC2626)' };

  return (
    <div
      className="relative h-full overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #fff, #F0FAF6)',
        border: '1px solid #80E5C6',
        boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)',
              color: '#B91C1C',
              border: '1px solid #FCA5A5',
            }}
          >
            <ShieldWarning weight="duotone" size={18} />
          </div>
          <div>
            <p
              className="font-mono"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#B91C1C',
              }}
            >
              Risco financeiro
            </p>
            <p className="font-mono" style={{ fontSize: 10, color: '#547C9D', fontWeight: 600 }}>
              Exposição consolidada
            </p>
          </div>
        </div>
        <span
          className="font-mono inline-flex items-center"
          style={{
            padding: '4px 10px', borderRadius: 99,
            background: level.bg, color: level.color, border: `1px solid ${level.border}`,
            fontSize: 9.5, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          {level.label}
        </span>
      </div>

      {/* Valor */}
      <div
        className="font-mono"
        style={{
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.024em', lineHeight: 1,
          background: 'linear-gradient(135deg, #007A5C, #001124)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {fmt(total)}
      </div>
      <p className="mt-1" style={{ fontSize: 11, color: '#547C9D' }}>
        <span className="font-mono" style={{ fontWeight: 800, color: '#001124' }}>{riskPct.toFixed(0)}%</span>{' '}
        do limite ({fmt(totalLimit)})
      </p>

      {/* Risk bar */}
      <div
        className="mt-2.5 overflow-hidden"
        style={{
          height: 6, background: '#E0F8F1', borderRadius: 99, border: '1px solid #B3F0DE',
        }}
      >
        <div
          style={{
            height: '100%', width: `${riskPct}%`,
            background: level.bar, borderRadius: 99,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Breakdown */}
      <div
        className="mt-4 pt-3 space-y-2"
        style={{ borderTop: '1px dashed #B3F0DE' }}
      >
        {items.map((i) => (
          <Link
            key={i.label}
            to={i.link}
            className="group flex items-center justify-between transition-colors"
            style={{ textDecoration: 'none', fontSize: 11 }}
          >
            <span style={{ color: '#547C9D', fontWeight: 600 }}>{i.label}</span>
            <span
              className="font-mono inline-flex items-center gap-0.5"
              style={{
                fontWeight: 800, color: '#001124',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(i.value)}
              <CaretRight weight="bold" size={11} style={{ opacity: 0.3 }} className="group-hover:opacity-100" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}