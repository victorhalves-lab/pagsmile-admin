import React from 'react';
import { GitCompare, Pause, Play, Settings, Sparkles } from 'lucide-react';
import { RECON_KPIS } from './mocks/reconciliationAutomatedMocks';

export default function ReconHeaderV8({ active, onToggle }) {
  return (
    <div data-ds="v8" className="v8-card" style={{
      padding: 20,
      background: 'var(--grad-hero)',
      borderColor: 'var(--v8-bd-brand)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--grad-brand)',
          color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: 'var(--sh-brand)',
          flexShrink: 0,
        }}>
          <GitCompare size={24} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="v8-eyebrow">AGENTE DE CONCILIAÇÃO · ATIVO 24/7</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 8px', borderRadius: 999,
              background: active ? 'var(--pag-mint-500)' : 'var(--v8-bg-surface-3)',
              color: active ? '#fff' : 'var(--v8-fg-muted)',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#fff', display: active ? 'block' : 'none',
                animation: 'v8-pulse 1.6s ease-in-out infinite',
              }} />
              {active ? 'Operando' : 'Pausado'}
            </span>
          </div>

          <h2 style={{
            fontSize: 22, fontWeight: 700,
            letterSpacing: 'var(--tr-tight)',
            color: 'var(--v8-fg-strong)',
            margin: 0, marginBottom: 6,
          }}>
            Conciliação Automatizada — cada centavo conferido
          </h2>

          <p style={{ fontSize: 13, color: 'var(--v8-fg-muted)', margin: 0, lineHeight: 1.5 }}>
            Agente cruza <strong style={{ color: 'var(--v8-fg-strong)' }}>Tuna Ledger × Arquivos de Adquirentes × Extrato Bancário (Open Finance)</strong> automaticamente.
            <strong style={{ color: 'var(--pag-mint-700)' }}> {RECON_KPIS.match_rate_3way}%</strong> de match em 3 vias ·
            <strong style={{ color: 'var(--v8-fg-strong)' }}> {RECON_KPIS.volume_conciliado_count.toLocaleString('pt-BR')}</strong> transações OK nos últimos 30 dias.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <Sparkles size={13} style={{ color: 'var(--pag-mint-700)' }} />
            <span style={{ fontSize: 12, color: 'var(--v8-fg-default)' }}>
              Você só precisa revisar <strong style={{ color: 'var(--v8-fg-strong)' }}>{RECON_KPIS.divergences_open} casos críticos</strong> — agente resolveu o resto sozinho.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onToggle}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 10,
              background: 'var(--v8-bg-surface)',
              border: '1px solid var(--v8-bd-default)',
              color: 'var(--v8-fg-strong)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {active ? <><Pause size={13} /> Pausar agente</> : <><Play size={13} /> Retomar</>}
          </button>
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 10,
              background: 'var(--grad-brand)',
              color: '#fff',
              border: 'none',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--sh-brand)',
            }}
          >
            <Settings size={13} />
            Configurar regras
          </button>
        </div>
      </div>

      <style>{`
        @keyframes v8-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}