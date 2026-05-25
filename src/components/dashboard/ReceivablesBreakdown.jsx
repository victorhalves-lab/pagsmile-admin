import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Calendar, CaretRight, Clock } from '@phosphor-icons/react';

/**
 * ReceivablesBreakdown — Pulse VF.
 * Container `.pvf-card` + grid de `.pvf-kpi` (V9 mini cards) — um por bucket.
 * Top accent gradient mint→glow, gradient number, .pvf-prog bar.
 * Mantém todos os dados e links originais.
 */

const BUCKETS_BASE = [
  { id: 'd1',   label: 'D+1',   sub: 'Próximas 24h',     variant: 'pvf-kpi' },
  { id: 'd7',   label: 'D+7',   sub: 'Esta semana',      variant: 'pvf-kpi pvf-kpi-blue' },
  { id: 'd30',  label: 'D+30',  sub: 'Próximos 30 dias', variant: 'pvf-kpi pvf-kpi-deep' },
  { id: 'd30p', label: 'D+30+', sub: 'Mais de 30 dias',  variant: 'pvf-kpi' },
];

export default function ReceivablesBreakdown({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const defaults = { d1: 18420, d7: 47830, d30: 125640, d30p: 38990 };
  const buckets = BUCKETS_BASE.map((b) => ({ ...b, value: data[b.id] ?? defaults[b.id] }));
  const total = buckets.reduce((s, b) => s + (b.value || 0), 0);

  return (
    <div className="pvf-card">
      {/* Header com Section Header VF */}
      <div className="pvf-section-h" style={{ marginBottom: 16 }}>
        <div>
          <div className="pvf-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
            Recebíveis · breakdown por bucket
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.018em',
            color: '#001124',
          }}>
            A <em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg,#00C194,#007A5C)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>receber</em>
            <span style={{
              marginLeft: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#013766',
              background: '#E6ECF2',
              padding: '3px 10px',
              borderRadius: 99,
              border: '1px solid #C0CFDC',
            }}>
              {fmt(total)}
            </span>
          </h2>
        </div>
        <Link
          to={createPageUrl('ReceivablesAgenda')}
          className="pvf-btn pvf-btn-out pvf-btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <Calendar weight="duotone" size={14} />
          Ver agenda
          <CaretRight weight="bold" size={12} />
        </Link>
      </div>

      {/* Buckets · grid de V9 mini cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {buckets.map((b) => {
          const pct = total > 0 ? (b.value / total) * 100 : 0;
          return (
            <Link
              key={b.id}
              to={`${createPageUrl('ReceivablesAgenda')}?bucket=${b.id}`}
              className={b.variant}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className="pvf-kpi-top">
                <div className="pvf-kpi-lab">{b.label}</div>
                <div className="pvf-ic pvf-ic-sm pvf-ic-mint">
                  <Clock weight="duotone" size={16} />
                </div>
              </div>
              <div className="pvf-kpi-val">
                <span className="pvf-ccy">R$</span>
                {fmt(b.value).replace('R$', '').trim()}
              </div>
              <div className="pvf-prog" style={{ marginTop: 10, height: 6 }}>
                <div className="pvf-prog-bar" style={{ width: `${pct}%` }} />
              </div>
              <div className="pvf-kpi-foot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>{b.sub}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#007A5C' }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}