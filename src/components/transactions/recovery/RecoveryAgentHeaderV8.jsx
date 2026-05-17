import React from 'react';
import { Sparkles, Settings, Pause, Play } from 'lucide-react';

/**
 * Header V8 do Recovery Agent — eyebrow + título + status toggle + storytelling 1 linha.
 */
export default function RecoveryAgentHeaderV8({ active, onToggle, lastActionLabel = 'há 3min' }) {
  return (
    <div className="v8-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'var(--grad-brand)',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--sh-brand)',
            flexShrink: 0,
          }}>
            <Sparkles size={20} strokeWidth={1.9} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span className="v8-eyebrow">AGENTE IA · RECUPERAÇÃO DE VENDAS</span>
              <span className={`v8-pill ${active ? 'v8-pill--success' : 'v8-pill--neutral'}`}>
                <span className="v8-pill__dot" />{active ? 'Ativo' : 'Pausado'}
              </span>
            </div>
            <h2 style={{
              fontSize: 22, fontWeight: 700, letterSpacing: 'var(--tr-tight)',
              color: 'var(--v8-fg-strong)', lineHeight: 1.15, margin: 0,
            }}>
              Recuperou <span style={{ color: 'var(--v8-fg-success)' }}>R$ 487.300</span> nos últimos 30 dias
            </h2>
            <p style={{ fontSize: 12, color: 'var(--v8-fg-muted)', marginTop: 4, margin: 0 }}>
              Taxa de sucesso 32,4% · última ação {lastActionLabel} · economia equivale a 2,3 analistas
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onToggle}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 36,
              padding: '0 14px', borderRadius: 12,
              background: active ? 'var(--v8-bg-surface)' : 'var(--grad-brand)',
              border: active ? '1px solid var(--v8-bd-default)' : '0',
              color: active ? 'var(--v8-fg-default)' : '#fff',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: active ? 'none' : 'var(--sh-brand)',
            }}
          >
            {active ? <Pause size={14} /> : <Play size={14} />}
            {active ? 'Pausar agente' : 'Ativar agente'}
          </button>
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 36,
              padding: '0 14px', background: 'var(--v8-bg-surface)',
              border: '1px solid var(--v8-bd-default)', borderRadius: 12,
              color: 'var(--v8-fg-strong)', fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Settings size={14} />
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
}