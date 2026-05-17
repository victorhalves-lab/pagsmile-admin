import React from 'react';
import { Zap, Activity, ArrowRight } from 'lucide-react';
import { AUTO_RETRY_ROUTERS } from '../mocks/recoveryAgentMocks';

export default function RecoveryAutoRetryView() {
  const enabled = AUTO_RETRY_ROUTERS.filter(r => r.enabled);
  const totalRetries = enabled.reduce((s, r) => s + r.used_for, 0);
  const avgSuccess = enabled.length
    ? enabled.reduce((s, r) => s + r.success_rate * r.used_for, 0) / totalRetries
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero info */}
      <div className="v8-card" style={{
        padding: 18,
        background: 'var(--grad-hero)',
        borderColor: 'var(--v8-bd-brand)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--pag-mint-500)', color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--sh-brand)', flexShrink: 0,
          }}>
            <Zap size={20} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="v8-eyebrow">AUTO-RETRY SILENCIOSO</span>
            <h3 style={{
              fontSize: 16, fontWeight: 700, color: 'var(--v8-fg-strong)',
              marginTop: 4, marginBottom: 4, margin: 0,
            }}>
              {totalRetries} retries automáticos com {avgSuccess.toFixed(0)}% de sucesso
            </h3>
            <p style={{ fontSize: 12, color: 'var(--v8-fg-muted)', margin: 0 }}>
              Cliente NÃO recebe mensagem. Agente reprocessa em roteador alternativo após timeout/erro técnico do emissor.
            </p>
          </div>
        </div>
      </div>

      {/* Roteadores */}
      <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--v8-bd-default)',
          background: 'var(--v8-bg-surface-2)',
        }}>
          <span className="v8-eyebrow">ROTEADORES ALTERNATIVOS</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
            Performance de cada adquirente no retry inteligente
          </div>
        </div>
        <div>
          {AUTO_RETRY_ROUTERS.map(r => (
            <div key={r.id} style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr 90px 90px 90px',
              gap: 14, alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--v8-bd-subtle)',
              opacity: r.enabled ? 1 : 0.5,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: r.enabled ? 'var(--pag-mint-50)' : 'var(--v8-bg-surface-3)',
                color: r.enabled ? 'var(--pag-mint-700)' : 'var(--v8-fg-subtle)',
                display: 'grid', placeItems: 'center',
              }}>
                <Activity size={14} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                  {r.name}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: 'var(--v8-fg-muted)', marginTop: 2,
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
                }}>
                  {r.enabled ? 'ativo' : 'desativado'}
                </div>
              </div>
              <div>
                <div className="v8-num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--pag-mint-700)' }}>
                  {r.success_rate}%
                </div>
                <div style={{ fontSize: 9, color: 'var(--v8-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  sucesso
                </div>
              </div>
              <div>
                <div className="v8-num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                  {r.latency_ms}ms
                </div>
                <div style={{ fontSize: 9, color: 'var(--v8-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  latência
                </div>
              </div>
              <div>
                <div className="v8-num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
                  {r.used_for}
                </div>
                <div style={{ fontSize: 9, color: 'var(--v8-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  retries
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flow */}
      <div className="v8-card" style={{ padding: 18 }}>
        <span className="v8-eyebrow">FLUXO AUTOMÁTICO</span>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
          marginTop: 4, marginBottom: 14,
        }}>O que o agente faz quando detecta timeout/erro técnico</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {['Recusa com código 91', 'Aguarda 2h', 'Tenta outro adquirente', 'Aprovado?', 'Notifica merchant'].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div style={{
                padding: '8px 14px',
                background: 'var(--v8-bg-surface-2)',
                border: '1px solid var(--v8-bd-default)',
                borderRadius: 10,
                fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)',
              }}>{step}</div>
              {i < arr.length - 1 && <ArrowRight size={14} style={{ color: 'var(--v8-fg-subtle)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}