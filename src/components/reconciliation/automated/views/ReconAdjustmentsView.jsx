import React from 'react';
import { CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { PROPOSED_ADJUSTMENTS, fmtBRL } from '../mocks/reconciliationAutomatedMocks';

export default function ReconAdjustmentsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="v8-card" style={{
        padding: 14,
        background: 'var(--grad-hero)',
        borderColor: 'var(--v8-bd-brand)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--grad-brand)', color: '#fff',
            display: 'grid', placeItems: 'center',
          }}>
            <ArrowUpRight size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="v8-eyebrow">AJUSTES CONTÁBEIS PROPOSTOS · AGUARDANDO APROVAÇÃO</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
              {PROPOSED_ADJUSTMENTS.length} propostas geradas pelo Communicator Agent
            </div>
          </div>
        </div>
      </div>

      {PROPOSED_ADJUSTMENTS.map(adj => (
        <div key={adj.id} className="v8-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
              color: 'var(--v8-fg-strong)',
            }}>{adj.id}</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: 'var(--v8-fg-muted)',
            }}>· {adj.divergence_id}</span>
            <span style={{
              marginLeft: 'auto',
              padding: '2px 8px', borderRadius: 999,
              background: 'var(--pag-mint-50)',
              border: '1px solid var(--v8-bd-brand)',
              fontSize: 10, fontWeight: 700, color: 'var(--pag-mint-700)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{adj.confidence}% confiança</span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 24px 1fr 1fr', gap: 12, alignItems: 'center',
            marginBottom: 12,
          }}>
            <div style={{
              padding: '10px 12px',
              background: 'var(--sys-danger-soft)',
              border: '1px solid var(--sys-danger)40',
              borderRadius: 8,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--v8-fg-muted)',
              }}>DÉBITO</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
                {adj.debit_account}
              </div>
            </div>
            <ArrowUpRight size={16} style={{ color: 'var(--v8-fg-muted)', margin: '0 auto' }} />
            <div style={{
              padding: '10px 12px',
              background: 'var(--pag-mint-50)',
              border: '1px solid var(--v8-bd-brand)',
              borderRadius: 8,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--v8-fg-muted)',
              }}>CRÉDITO</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
                {adj.credit_account}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="v8-num" style={{
                fontSize: 20, fontWeight: 700,
                color: 'var(--v8-fg-strong)',
                letterSpacing: 'var(--tr-tighter)',
              }}>{fmtBRL(adj.amount)}</div>
              <div style={{ fontSize: 10, color: 'var(--v8-fg-subtle)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                valor
              </div>
            </div>
          </div>

          <div style={{
            padding: '10px 12px',
            background: 'var(--v8-bg-surface-2)',
            border: '1px solid var(--v8-bd-default)',
            borderRadius: 8, marginBottom: 12,
            fontSize: 12, color: 'var(--v8-fg-default)', lineHeight: 1.5,
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--pag-mint-700)', marginBottom: 4,
            }}>JUSTIFICATIVA · COMMUNICATOR AGENT</div>
            {adj.rationale}
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 14px', borderRadius: 8,
              background: 'transparent',
              border: '1px solid var(--sys-danger)40',
              color: 'var(--sys-danger)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <XCircle size={13} />
              Rejeitar
            </button>
            <button type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 16px', borderRadius: 8,
              background: 'var(--grad-brand)', color: '#fff',
              border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--sh-brand)',
            }}>
              <CheckCircle2 size={13} />
              Aprovar ajuste
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}