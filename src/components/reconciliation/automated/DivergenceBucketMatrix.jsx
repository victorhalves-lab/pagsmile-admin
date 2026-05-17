import React from 'react';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { DIVERGENCE_BUCKETS, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

const SEVERITY_META = {
  critical: { label: 'Crítico', color: '#B91C1C', bg: '#FEE2E2', accent: '#B91C1C' },
  high:     { label: 'Alto',    color: '#B91C1C', bg: '#FEE2E2', accent: '#DC2626' },
  medium:   { label: 'Médio',   color: '#B45309', bg: '#FEF3C7', accent: '#D97706' },
  low:      { label: 'Baixo',   color: '#64748B', bg: '#F4F4F4', accent: '#94A3B8' },
};

const OWNER_META = {
  adquirente: { label: 'Adquirente', color: '#002443', bg: 'rgba(0,36,67,0.06)' },
  banco:      { label: 'Banco',      color: '#36706C', bg: 'rgba(54,112,108,0.08)' },
  ops:        { label: 'Operacional', color: '#B45309', bg: 'rgba(180,83,9,0.08)' },
  merchant:   { label: 'Merchant',   color: '#475569', bg: '#F4F4F4' },
};

/**
 * Matriz de divergências V8 — linhas com hover, severity pill, contestável badge.
 * Inline styles puros.
 */
export default function DivergenceBucketMatrix({ onSelect }) {
  const totalCount = DIVERGENCE_BUCKETS.reduce((s, b) => s + b.count, 0);
  const totalValue = DIVERGENCE_BUCKETS.reduce((s, b) => s + b.value, 0);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E2E8F0',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>
            MATRIZ DE DIVERGÊNCIAS POR TIPO
          </span>
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: '#0F172A',
            letterSpacing: '-0.018em', marginTop: 4, margin: 0,
            lineHeight: 1.3,
          }}>
            Onde está o seu dinheiro pendente, classificado por causa raiz
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: '#F4F4F4', border: '1px solid #E2E8F0',
          }}>
            <strong style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13, fontWeight: 800, color: '#0F172A',
            }}>{totalCount}</strong>
            <span style={{ color: '#64748B', fontSize: 11 }}>divergências</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: '#FEE2E2', border: '1px solid rgba(185,28,28,0.18)',
          }}>
            <strong style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13, fontWeight: 800, color: '#B91C1C',
            }}>{fmtBRLFromReais(totalValue)}</strong>
            <span style={{ color: '#7F1D1D', fontSize: 11 }}>em jogo</span>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div>
        {DIVERGENCE_BUCKETS.map((b, idx) => {
          const sev = SEVERITY_META[b.severity];
          const own = OWNER_META[b.owner];
          const isLast = idx === DIVERGENCE_BUCKETS.length - 1;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect?.(b)}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 1.8fr) 100px 130px 130px 110px 16px',
                gap: 16, alignItems: 'center',
                padding: '16px 20px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                borderLeft: `3px solid ${sev.accent}`,
                background: '#FFFFFF',
                borderTop: 'none', borderRight: 'none',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                transition: 'background .14s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
            >
              {/* Coluna 1: ícone + código + severity + label + descrição */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: sev.bg, color: sev.color,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <AlertTriangle size={17} strokeWidth={2} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: '#475569',
                      background: '#F1F5F9',
                      padding: '2px 6px', borderRadius: 4,
                      letterSpacing: '0.04em',
                    }}>{b.code}</code>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: sev.color, fontWeight: 700,
                      padding: '2px 7px', borderRadius: 999,
                      background: sev.bg,
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: sev.color,
                      }} />
                      {sev.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: '#0F172A',
                    letterSpacing: '-0.012em',
                    marginBottom: 2,
                  }}>{b.label}</div>
                  <div style={{
                    fontSize: 12, color: '#64748B',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{b.description}</div>
                </div>
              </div>

              {/* Coluna 2: count */}
              <div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
                  color: '#0F172A', letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>{b.count}</div>
                <div style={{
                  fontSize: 10, color: '#94A3B8', marginTop: 3,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontWeight: 600,
                }}>divergências</div>
              </div>

              {/* Coluna 3: valor */}
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 800,
                  color: sev.color, letterSpacing: '-0.01em',
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>{fmtBRLFromReais(b.value)}</div>
                <div style={{
                  fontSize: 10, color: '#94A3B8', marginTop: 3,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontWeight: 600,
                }}>em jogo</div>
              </div>

              {/* Coluna 4: owner */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 24, padding: '0 10px', borderRadius: 6,
                  background: own.bg,
                  border: `1px solid ${own.color}22`,
                  fontSize: 11, fontWeight: 700, color: own.color,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: own.color,
                  }} />
                  {own.label}
                </span>
              </div>

              {/* Coluna 5: contestável */}
              <div>
                {b.can_dispute ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                    color: '#FFFFFF',
                    background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                    padding: '4px 9px', borderRadius: 999,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    boxShadow: '0 2px 6px -1px rgba(0,193,148,0.4)',
                  }}>contestável</span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                    color: '#64748B',
                    background: '#F1F5F9',
                    padding: '4px 9px', borderRadius: 999,
                    border: '1px solid #E2E8F0',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>interno</span>
                )}
              </div>

              <ChevronRight size={16} strokeWidth={2} style={{ color: '#94A3B8' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}