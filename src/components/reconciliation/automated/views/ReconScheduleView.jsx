import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { ACQUIRER_SCHEDULE, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

export default function ReconScheduleView() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12,
    }}>
      {ACQUIRER_SCHEDULE.map(s => {
        const isLate = s.status === 'late';
        return (
          <div key={s.acquirer} className="v8-card" style={{
            padding: 16,
            borderLeft: `3px solid ${isLate ? 'var(--sys-warn)' : 'var(--pag-mint-500)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: isLate ? 'var(--sys-warn-soft)' : 'var(--pag-mint-50)',
                color: isLate ? 'var(--sys-warn)' : 'var(--pag-mint-700)',
                display: 'grid', placeItems: 'center',
              }}>
                {isLate ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                  {s.acquirer}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: isLate ? 'var(--sys-warn)' : 'var(--pag-mint-700)',
                  marginTop: 2,
                }}>
                  {isLate ? 'Arquivo atrasado' : 'No prazo'}
                </div>
              </div>
            </div>

            <div style={{
              padding: '10px 12px',
              background: 'var(--v8-bg-surface-2)',
              border: '1px solid var(--v8-bd-default)',
              borderRadius: 8, marginBottom: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>
                  <Clock size={10} style={{ marginRight: 4, verticalAlign: '-1px' }} />
                  Esperado
                </span>
                <span className="v8-num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                  {s.file_expected}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>Último recebido</span>
                <span className="v8-num" style={{
                  fontSize: 12, fontWeight: 700,
                  color: isLate ? 'var(--sys-warn)' : 'var(--pag-mint-700)',
                }}>{s.last_received}</span>
              </div>
            </div>

            <div style={{
              padding: '10px 12px',
              background: 'var(--pag-mint-50)',
              border: '1px solid var(--v8-bd-brand)',
              borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Calendar size={11} style={{ color: 'var(--pag-mint-700)' }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--pag-mint-700)',
                }}>PRÓXIMA LIQUIDAÇÃO</span>
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--v8-fg-default)',
                fontWeight: 600,
              }}>{s.next_settlement}</div>
              <div className="v8-num" style={{
                fontSize: 18, fontWeight: 700,
                color: 'var(--pag-mint-700)',
                letterSpacing: 'var(--tr-tighter)',
                marginTop: 4,
              }}>{fmtBRLFromReais(s.next_settlement_value)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}