import React from 'react';
import { TrendUp, Sparkle, ArrowsClockwise, ShieldCheck } from '@phosphor-icons/react';
import Sparkline from './Sparkline';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * RecoveryRevenueCard — Pulse VF.
 * Reference card hero V9 gradient mint + watermark Sparkle + breakdown.
 */
export default function RecoveryRevenueCard({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const recovery = data.recovery ?? 18420;
  const disputes = data.disputes ?? 8950;
  const retries = data.retries ?? 12380;
  const total = recovery + disputes + retries;

  const breakdowns = [
    { label: 'Recovery Agent',  value: recovery, icon: ArrowsClockwise, to: createPageUrl('RecoveryAgent') },
    { label: 'Dispute Manager', value: disputes, icon: ShieldCheck,     to: createPageUrl('DisputeManager') },
    { label: 'Smart retries',   value: retries,  icon: TrendUp,         to: createPageUrl('Transactions') },
  ];

  return (
    <div
      className="relative h-full overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #00C194, #007A5C)',
        color: '#fff',
        boxShadow: '0 12px 32px -8px rgba(0,193,148,0.5)',
        minHeight: 320,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60, right: -40, width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,247,207,0.4), transparent 60%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 20, right: 20, color: '#fff', opacity: 0.85,
          filter: 'drop-shadow(0 0 14px rgba(92,247,207,0.65))',
        }}
      >
        <Sparkle weight="duotone" size={40} />
      </div>

      {/* Header */}
      <div className="relative mb-3">
        <p
          className="font-mono"
          style={{
            fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#5CF7CF',
          }}
        >
          Receita recuperada · mês
        </p>
        <p className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', fontWeight: 600 }}>
          Pelos agentes IA da PagSmile
        </p>
      </div>

      {/* Valor */}
      <div className="relative">
        <div
          className="font-mono"
          style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-0.030em', lineHeight: 0.95,
            color: '#fff', display: 'flex', alignItems: 'flex-start', gap: 2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span
            style={{
              fontSize: 16, color: 'rgba(255,255,255,0.55)',
              fontWeight: 600, marginRight: 6, marginTop: 6,
            }}
          >
            R$
          </span>
          {fmt(total).replace('R$', '').trim()}
        </div>
        <p
          className="font-mono inline-flex items-center gap-1 mt-1"
          style={{
            fontSize: 11, color: '#5CF7CF', fontWeight: 700, letterSpacing: '0.06em',
          }}
        >
          <TrendUp weight="bold" size={11} />
          ROI do PagSmile este mês
        </p>
      </div>

      {/* Sparkline */}
      <div className="relative mt-3">
        <Sparkline data={[8, 12, 15, 18, 22, 28, 35, 42]} color="emerald" height={28} />
      </div>

      {/* Breakdown */}
      <div
        className="relative mt-4 pt-3 space-y-2"
        style={{ borderTop: '1px dashed rgba(92,247,207,0.3)' }}
      >
        {breakdowns.map((b) => {
          const Icon = b.icon;
          return (
            <Link
              key={b.label}
              to={b.to}
              className="flex items-center justify-between transition-colors group"
              style={{ textDecoration: 'none', fontSize: 11.5 }}
            >
              <span
                className="inline-flex items-center gap-1.5"
                style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}
              >
                <Icon weight="duotone" size={13} style={{ color: '#5CF7CF' }} />
                {b.label}
              </span>
              <span
                className="font-mono"
                style={{
                  fontWeight: 800, color: '#fff',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmt(b.value)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}