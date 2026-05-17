import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v);

const METRICS = [
  {
    label: 'Taxa de aprovação',
    before: 79.4, after: 87.3, unit: '%', good: 'up',
    accent: '#00C194',
  },
  {
    label: 'Volume recuperado / mês',
    before: 12400, after: 45780, unit: 'R$', good: 'up', isCurrency: true,
    accent: '#5CF7CF',
  },
  {
    label: 'Churn involuntário',
    before: 4.8, after: 2.1, unit: '%', good: 'down',
    accent: '#00C194',
  },
  {
    label: 'Retentativas manuais',
    before: 380, after: 47, unit: '', good: 'down',
    accent: '#5CF7CF',
  },
];

export default function BeforeAfterV8() {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        padding: '22px 24px',
        background: 'linear-gradient(135deg, #0F2B2B 0%, #002443 65%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.20)',
        boxShadow: '0 4px 12px rgba(0,36,67,0.18), 0 16px 40px -12px rgba(0,193,148,0.18)',
        color: '#fff',
      }}
    >
      {/* Glow decorativos */}
      <div style={{
        position: 'absolute', right: -100, top: -100,
        width: 320, height: 320,
        background: 'radial-gradient(closest-side, rgba(92,247,207,0.18), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 18, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#5CF7CF',
          }}>
            ROI · ANTES VS DEPOIS DO AGENTE
          </span>
          <h3 style={{
            fontSize: 18, fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginTop: 4, margin: 0,
          }}>
            Impacto tangível nos últimos 90 dias
          </h3>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          background: 'rgba(92,247,207,0.16)',
          color: '#5CF7CF',
          border: '1px solid rgba(92,247,207,0.42)',
          fontSize: 11, fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <CheckCircle2 size={12} strokeWidth={2.5} />
          Comprovado
        </span>
      </div>

      {/* Grid de métricas */}
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {METRICS.map((m, i) => {
          const delta = m.after - m.before;
          const pct = ((m.after - m.before) / m.before) * 100;
          const isGood = (m.good === 'up' && delta > 0) || (m.good === 'down' && delta < 0);
          const Icon = delta > 0 ? TrendingUp : TrendingDown;

          // Largura visual relativa (barras de progresso)
          const maxVal = Math.max(m.before, m.after);
          const beforePct = (m.before / maxVal) * 100;
          const afterPct = (m.after / maxVal) * 100;

          const fmt = (v) => m.isCurrency ? fmtBRL(v) : `${v}${m.unit}`;

          return (
            <div key={i} style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              backdropFilter: 'blur(8px)',
            }}>
              {/* Label + delta pill */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.62)',
                }}>{m.label}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '2px 8px', borderRadius: 999,
                  background: isGood ? 'rgba(92,247,207,0.14)' : 'rgba(252,165,165,0.16)',
                  color: isGood ? '#5CF7CF' : '#FCA5A5',
                  fontSize: 10.5, fontWeight: 800,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  <Icon size={10} strokeWidth={2.8} />
                  {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
                </span>
              </div>

              {/* Antes */}
              <div style={{ marginBottom: 8 }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>Antes</span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14, fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'line-through',
                    letterSpacing: '-0.012em',
                  }}>{fmt(m.before)}</span>
                </div>
                <div style={{
                  height: 4, borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${beforePct}%`, height: '100%',
                    background: 'rgba(255,255,255,0.22)',
                    borderRadius: 999,
                  }} />
                </div>
              </div>

              {/* Depois */}
              <div>
                <div style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: m.accent,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                  }}>
                    <ArrowRight size={9} strokeWidth={3} />
                    Depois
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 22, fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                    color: '#fff',
                    letterSpacing: '-0.025em',
                    textShadow: `0 0 18px ${m.accent}40`,
                  }}>{fmt(m.after)}</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${afterPct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${m.accent} 0%, #5CF7CF 100%)`,
                    borderRadius: 999,
                    boxShadow: `0 0 12px ${m.accent}60`,
                    transition: 'width .8s ease',
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}