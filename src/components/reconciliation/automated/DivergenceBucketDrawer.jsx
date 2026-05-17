import React from 'react';
import { X, Send, FileSignature, AlertTriangle, ArrowRight } from 'lucide-react';
import { DIVERGENCES_LIST, fmtBRL, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

const STATUS_META = {
  detected: { label: 'Detectada', color: 'var(--sys-warn)' },
  investigating: { label: 'Investigando', color: 'var(--pag-blue-700)' },
  proposed: { label: 'Proposta pronta', color: 'var(--pag-mint-700)' },
  resolved: { label: 'Resolvida', color: 'var(--pag-mint-500)' },
};

const ACTION_META = {
  contest: { label: 'Contestar adquirente', icon: FileSignature, color: 'var(--sys-danger)' },
  adjust: { label: 'Ajuste contábil', icon: ArrowRight, color: 'var(--pag-blue-700)' },
  escalate: { label: 'Escalar para suporte', icon: AlertTriangle, color: 'var(--sys-warn)' },
  monitor: { label: 'Monitorar', icon: AlertTriangle, color: 'var(--v8-fg-muted)' },
};

export default function DivergenceBucketDrawer({ bucket, onClose }) {
  if (!bucket) return null;

  const items = DIVERGENCES_LIST.filter(d => d.bucket === bucket.id);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
        zIndex: 9990, backdropFilter: 'blur(2px)',
      }} />
      <div
        data-ds="v8"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 680, maxWidth: '96vw', zIndex: 9991,
          background: 'var(--v8-bg-surface)',
          boxShadow: 'var(--sh-2xl)',
          display: 'flex', flexDirection: 'column',
          animation: 'v8-drawer-in 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--v8-bd-default)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
                color: 'var(--v8-fg-strong)',
                background: 'var(--v8-bg-surface-2)',
                padding: '2px 8px', borderRadius: 6,
                border: '1px solid var(--v8-bd-default)',
              }}>{bucket.code}</code>
              <span className="v8-eyebrow">{items.length} CASOS · {bucket.label.toUpperCase()}</span>
            </div>
            <h2 style={{
              fontSize: 19, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', margin: 0,
            }}>{bucket.label}</h2>
            <p style={{ fontSize: 12, color: 'var(--v8-fg-muted)', marginTop: 4, margin: 0 }}>
              {bucket.description} · <strong style={{ color: 'var(--sys-danger)' }}>{fmtBRLFromReais(bucket.value)}</strong> em jogo
            </p>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'transparent', border: '1px solid var(--v8-bd-default)',
              cursor: 'pointer', display: 'grid', placeItems: 'center',
              color: 'var(--v8-fg-muted)', flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
          {items.length === 0 && (
            <div style={{
              padding: 40, textAlign: 'center',
              color: 'var(--v8-fg-muted)', fontSize: 13,
            }}>
              Nenhum caso individual listado neste bucket no momento.
            </div>
          )}

          {items.map((item) => {
            const status = STATUS_META[item.status];
            const action = ACTION_META[item.proposed_action];
            const ActionIcon = action?.icon || AlertTriangle;

            return (
              <div key={item.id} style={{
                padding: 16, marginBottom: 12,
                background: 'var(--v8-bg-surface-2)',
                border: '1px solid var(--v8-bd-default)',
                borderRadius: 12,
              }}>
                {/* Header do caso */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
                    color: 'var(--v8-fg-strong)',
                  }}>{item.id}</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: 'var(--v8-fg-muted)',
                  }}>· {item.transaction_id}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 999,
                    background: 'var(--v8-bg-surface)',
                    border: `1px solid ${status.color}40`,
                    fontSize: 10, fontWeight: 700,
                    color: status.color,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>{status.label}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    color: 'var(--v8-fg-muted)',
                  }}>{item.acquirer}</span>
                </div>

                {/* Valores 3-way */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                  marginBottom: 12,
                }}>
                  <div style={{
                    padding: '8px 10px',
                    background: 'var(--v8-bg-surface)',
                    border: '1px solid var(--v8-bd-default)', borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--v8-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      Esperado
                    </div>
                    <div className="v8-num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
                      {fmtBRL(item.expected_value)}
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 10px',
                    background: 'var(--v8-bg-surface)',
                    border: '1px solid var(--v8-bd-default)', borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--v8-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      Recebido
                    </div>
                    <div className="v8-num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
                      {item.received_value !== null ? fmtBRL(item.received_value) : '— ausente —'}
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 10px',
                    background: item.delta < 0 ? 'var(--sys-danger-soft)' : 'var(--pag-mint-50)',
                    border: `1px solid ${item.delta < 0 ? 'var(--sys-danger)' : 'var(--pag-mint-500)'}40`,
                    borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--v8-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      Diferença
                    </div>
                    <div className="v8-num" style={{
                      fontSize: 13, fontWeight: 700, marginTop: 2,
                      color: item.delta < 0 ? 'var(--sys-danger)' : 'var(--pag-mint-700)',
                    }}>
                      {item.delta > 0 ? '+' : ''}{fmtBRL(item.delta)}
                    </div>
                  </div>
                </div>

                {/* Análise do Investigator */}
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--v8-bg-surface)',
                  border: '1px solid var(--v8-bd-default)',
                  borderRadius: 8, marginBottom: 10,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: 'var(--pag-mint-700)',
                    }}>ANÁLISE DA IA · INVESTIGATOR AGENT</div>
                    <span className="v8-num" style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--pag-mint-700)',
                    }}>{item.agent_confidence}% confiança</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--v8-fg-default)', margin: 0, lineHeight: 1.5 }}>
                    {item.root_cause}
                  </p>
                </div>

                {/* Ação proposta */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 10, flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: `${action.color}18`, color: action.color,
                      display: 'grid', placeItems: 'center',
                    }}>
                      <ActionIcon size={13} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--v8-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        Ação proposta
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>
                        {action.label}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {item.proposed_letter_ready && (
                      <button type="button" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        height: 30, padding: '0 12px', borderRadius: 8,
                        background: 'var(--v8-bg-surface)',
                        border: '1px solid var(--v8-bd-default)',
                        fontSize: 11, fontWeight: 600, color: 'var(--v8-fg-strong)', cursor: 'pointer',
                      }}>
                        <FileSignature size={11} />
                        Ver carta
                      </button>
                    )}
                    <button type="button" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 30, padding: '0 14px', borderRadius: 8,
                      background: 'var(--grad-brand)', color: '#fff',
                      border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      boxShadow: 'var(--sh-brand)',
                    }}>
                      <Send size={11} />
                      Executar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes v8-drawer-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}