import React from 'react';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { DIVERGENCE_BUCKETS, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

const SEVERITY_META = {
  critical: { label: 'Crítico', color: 'var(--sys-danger)', bg: 'var(--sys-danger-soft)' },
  high: { label: 'Alto', color: 'var(--sys-danger)', bg: 'var(--sys-danger-soft)' },
  medium: { label: 'Médio', color: 'var(--sys-warn)', bg: 'var(--sys-warn-soft)' },
  low: { label: 'Baixo', color: 'var(--v8-fg-muted)', bg: 'var(--v8-bg-surface-2)' },
};

const OWNER_META = {
  adquirente: { label: 'Adquirente', color: 'var(--pag-blue-700)' },
  banco: { label: 'Banco', color: 'var(--pag-teal-500)' },
  ops: { label: 'Operacional', color: 'var(--sys-warn)' },
  merchant: { label: 'Merchant', color: 'var(--v8-fg-default)' },
};

export default function DivergenceBucketMatrix({ onSelect }) {
  const totalCount = DIVERGENCE_BUCKETS.reduce((s, b) => s + b.count, 0);
  const totalValue = DIVERGENCE_BUCKETS.reduce((s, b) => s + b.value, 0);

  return (
    <div data-ds="v8" className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--v8-bd-default)',
        background: 'var(--v8-bg-surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <span className="v8-eyebrow">MATRIZ DE DIVERGÊNCIAS POR TIPO</span>
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: 'var(--v8-fg-strong)',
            letterSpacing: 'var(--tr-tight)', marginTop: 4, margin: 0,
          }}>
            Onde está o seu dinheiro pendente — classificado por causa raiz
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span style={{ color: 'var(--v8-fg-muted)' }}>
            <strong className="v8-num" style={{ color: 'var(--v8-fg-strong)' }}>{totalCount}</strong> divergências
          </span>
          <span style={{ color: 'var(--v8-fg-muted)' }}>
            <strong className="v8-num" style={{ color: 'var(--sys-danger)' }}>{fmtBRLFromReais(totalValue)}</strong> em jogo
          </span>
        </div>
      </div>

      <div>
        {DIVERGENCE_BUCKETS.map((b) => {
          const sev = SEVERITY_META[b.severity];
          const own = OWNER_META[b.owner];
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect?.(b)}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 1.6fr) 90px 110px 100px 110px 16px',
                gap: 14,
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid var(--v8-bd-subtle)',
                borderLeft: `3px solid ${sev.color}`,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                transition: 'background .14s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--v8-bg-surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: sev.bg, color: sev.color,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <AlertTriangle size={15} strokeWidth={1.9} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: 'var(--v8-fg-muted)',
                      background: 'var(--v8-bg-surface-3)',
                      padding: '1px 6px', borderRadius: 4,
                    }}>{b.code}</code>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: sev.color, fontWeight: 700,
                    }}>{sev.label}</span>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--v8-fg-strong)',
                    letterSpacing: 'var(--tr-tight)',
                  }}>{b.label}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{b.description}</div>
                </div>
              </div>

              <div>
                <div className="v8-num" style={{
                  fontSize: 16, fontWeight: 700, color: 'var(--v8-fg-strong)',
                }}>{b.count}</div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>divergências</div>
              </div>

              <div>
                <div className="v8-num" style={{
                  fontSize: 13, fontWeight: 700, color: sev.color,
                }}>{fmtBRLFromReais(b.value)}</div>
                <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>em jogo</div>
              </div>

              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  height: 22, padding: '0 8px', borderRadius: 6,
                  background: 'var(--v8-bg-surface-2)',
                  border: '1px solid var(--v8-bd-default)',
                  fontSize: 11, fontWeight: 600, color: own.color,
                }}>{own.label}</span>
              </div>

              <div>
                {b.can_dispute ? (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                    color: 'var(--pag-mint-700)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>contestável</span>
                ) : (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: 'var(--v8-fg-subtle)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>interno</span>
                )}
              </div>

              <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--v8-fg-subtle)' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}