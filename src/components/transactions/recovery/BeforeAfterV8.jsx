import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v);

const METRICS = [
  { label: 'Taxa de aprovação', before: 79.4, after: 87.3, unit: '%', good: 'up' },
  { label: 'Volume recuperado / mês', before: 12400, after: 45780, unit: 'R$', good: 'up', isCurrency: true },
  { label: 'Churn involuntário', before: 4.8, after: 2.1, unit: '%', good: 'down' },
  { label: 'Retentativas manuais', before: 380, after: 47, unit: '', good: 'down' },
];

export default function BeforeAfterV8() {
  return (
    <div className="v8-card" style={{
      padding: 18,
      background: 'var(--grad-hero)',
      borderColor: 'var(--v8-bd-brand)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span className="v8-eyebrow">ROI · ANTES VS DEPOIS DO AGENTE</span>
          <h3 style={{
            fontSize: 15, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
            color: 'var(--v8-fg-strong)', marginTop: 4, margin: 0,
          }}>
            Impacto tangível nos últimos 90 dias
          </h3>
        </div>
        <span className="v8-pill v8-pill--brand"><span className="v8-pill__dot" />Comprovado</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {METRICS.map((m, i) => {
          const delta = m.after - m.before;
          const pct = ((m.after - m.before) / m.before) * 100;
          const isGood = (m.good === 'up' && delta > 0) || (m.good === 'down' && delta < 0);
          const Icon = delta > 0 ? TrendingUp : TrendingDown;

          return (
            <div key={i} style={{
              background: 'var(--v8-bg-surface)',
              border: '1px solid var(--v8-bd-default)',
              borderRadius: 12,
              padding: '12px 14px',
            }}>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--v8-fg-muted)', fontWeight: 700,
                marginBottom: 8, margin: 0,
              }}>{m.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>Antes</div>
                  <div className="v8-num" style={{
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--v8-fg-subtle)', textDecoration: 'line-through',
                  }}>
                    {m.isCurrency ? fmtBRL(m.before) : `${m.before}${m.unit}`}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--v8-fg-success)' }}>Depois</div>
                  <div className="v8-num" style={{
                    fontSize: 18, fontWeight: 700,
                    color: 'var(--v8-fg-success)', letterSpacing: 'var(--tr-tighter)',
                  }}>
                    {m.isCurrency ? fmtBRL(m.after) : `${m.after}${m.unit}`}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                marginTop: 6, fontSize: 10, fontWeight: 700,
                color: isGood ? 'var(--v8-fg-success)' : 'var(--v8-fg-danger)',
              }}>
                <Icon size={10} strokeWidth={2.5} />
                {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}