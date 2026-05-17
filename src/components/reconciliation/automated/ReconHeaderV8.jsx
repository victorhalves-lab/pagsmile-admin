import React from 'react';
import { GitCompare, Pause, Play, Settings, Sparkles } from 'lucide-react';
import { RECON_KPIS } from './mocks/reconciliationAutomatedMocks';

/**
 * Header V8 oficial · gradient hero mint suave + ícone gradient brand + pill status.
 * Inline styles para garantir render independente do Tailwind/CSS scoped.
 */
export default function ReconHeaderV8({ active, onToggle }) {
  return (
    <div style={{
      position: 'relative',
      padding: 20,
      borderRadius: 16,
      border: '1px solid rgba(0,193,148,0.22)',
      background: 'linear-gradient(135deg, #E0F8F1 0%, #B4FCE8 100%)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -80, top: -80,
        width: 260, height: 260,
        background: 'radial-gradient(closest-side, rgba(92,247,207,0.35), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'linear-gradient(135deg, #1ECB9D 0%, #00C194 50%, #007A5C 100%)',
          color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 1px 2px rgba(0,193,148,0.18), 0 8px 24px -4px rgba(0,193,148,0.32)',
          flexShrink: 0,
        }}>
          <GitCompare size={24} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 6, flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#007A5C',
            }}>
              AGENTE DE CONCILIAÇÃO · ATIVO 24/7
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 999,
              background: active ? '#00C194' : '#EDEDED',
              color: active ? '#fff' : '#64748B',
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              border: '1px solid rgba(255,255,255,0.4)',
            }}>
              {active && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#fff',
                  animation: 'recon-pulse 1.6s ease-in-out infinite',
                }} />
              )}
              {active ? 'Operando' : 'Pausado'}
            </span>
          </div>

          <h2 style={{
            fontSize: 22, fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#0F172A',
            margin: 0, marginBottom: 6,
            lineHeight: 1.2,
          }}>
            Conciliação Automatizada — cada centavo conferido
          </h2>

          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
            Agente cruza{' '}
            <strong style={{ color: '#0F172A' }}>
              Tuna Ledger × Arquivos de Adquirentes × Extrato Bancário (Open Finance)
            </strong>{' '}
            automaticamente.{' '}
            <strong style={{ color: '#007A5C' }}>{RECON_KPIS.match_rate_3way}%</strong> de match em 3 vias ·{' '}
            <strong style={{ color: '#0F172A' }}>
              {RECON_KPIS.volume_conciliado_count.toLocaleString('pt-BR')}
            </strong>{' '}
            transações OK nos últimos 30 dias.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,193,148,0.25)',
          }}>
            <Sparkles size={12} style={{ color: '#007A5C' }} />
            <span style={{ fontSize: 12, color: '#1E293B' }}>
              Você só precisa revisar{' '}
              <strong style={{ color: '#0F172A' }}>
                {RECON_KPIS.divergences_open} casos críticos
              </strong>{' '}
              — agente resolveu o resto sozinho.
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
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {active ? <><Pause size={13} /> Pausar agente</> : <><Play size={13} /> Retomar</>}
          </button>
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 10,
              background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
              color: '#fff',
              border: '1px solid #009E78',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,193,148,0.18), 0 8px 24px -4px rgba(0,193,148,0.32)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Settings size={13} />
            Configurar regras
          </button>
        </div>
      </div>

      <style>{`
        @keyframes recon-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}