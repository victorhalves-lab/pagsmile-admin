import React from 'react';
import { MessageSquare, Phone, Mail, Zap, RefreshCw, Send } from 'lucide-react';
import { LIVE_QUEUE, DECLINE_REASONS } from '../mocks/recoveryAgentMocks';

const CHANNEL_ICON = { whatsapp: MessageSquare, phone: Phone, email: Mail, auto_retry: Zap };

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

export default function RecoveryLiveQueueView() {
  return (
    <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--v8-bd-default)',
        background: 'var(--v8-bg-surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      }}>
        <div>
          <span className="v8-eyebrow">FILA AO VIVO · {LIVE_QUEUE.length} TRANSAÇÕES</span>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
            marginTop: 4, margin: 0,
          }}>Transações em recuperação agora</h3>
        </div>
        <button
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 30,
            padding: '0 12px', background: 'var(--v8-bg-surface)',
            border: '1px solid var(--v8-bd-default)', borderRadius: 8,
            fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', cursor: 'pointer',
          }}
        >
          <RefreshCw size={12} />
          Atualizar
        </button>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{
              background: 'var(--v8-bg-surface-2)',
              borderBottom: '1px solid var(--v8-bd-default)',
            }}>
              {['Cliente', 'Valor', 'Motivo', 'Canal', 'Tentativa', 'Prob.', 'ETA', ''].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 14px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--v8-fg-muted)', fontWeight: 700,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIVE_QUEUE.map(item => {
              const reason = DECLINE_REASONS.find(r => r.id === item.reason);
              const ChIcon = CHANNEL_ICON[item.channel] || MessageSquare;
              const probColor = item.prob >= 60 ? 'var(--pag-mint-500)'
                : item.prob >= 40 ? 'var(--sys-warn)'
                : 'var(--sys-danger)';
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--v8-bd-subtle)' }}>
                  <td style={{ padding: '12px 14px', color: 'var(--v8-fg-strong)', fontWeight: 500 }}>
                    {item.customer}
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">
                    <span style={{ fontWeight: 600, color: 'var(--v8-fg-strong)' }}>{fmtBRL(item.amount)}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <code style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                        color: 'var(--v8-fg-muted)',
                        background: 'var(--v8-bg-surface-3)',
                        padding: '1px 5px', borderRadius: 4,
                      }}>{item.code}</code>
                      <span style={{ color: 'var(--v8-fg-default)', fontSize: 11 }}>
                        {reason?.label || item.reason}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 22, padding: '0 8px', borderRadius: 6,
                      background: 'var(--v8-bg-surface-2)',
                      border: '1px solid var(--v8-bd-default)',
                      fontSize: 11, fontWeight: 600, color: 'var(--v8-fg-default)',
                    }}>
                      <ChIcon size={11} />
                      {item.channel}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">#{item.step}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 40, height: 4, borderRadius: 2,
                        background: 'var(--v8-bg-surface-3)', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${item.prob}%`, height: '100%', background: probColor,
                        }} />
                      </div>
                      <span className="v8-num" style={{ fontSize: 11, fontWeight: 700, color: probColor }}>
                        {item.prob}%
                      </span>
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 14px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    color: 'var(--v8-fg-muted)',
                  }}>{item.eta}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button type="button" style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'transparent', border: '1px solid var(--v8-bd-default)',
                      color: 'var(--v8-fg-muted)', cursor: 'pointer',
                      display: 'grid', placeItems: 'center',
                    }}>
                      <Send size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}