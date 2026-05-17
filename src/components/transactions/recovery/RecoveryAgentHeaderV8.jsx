import React from 'react';
import { Sparkles, Settings, Pause, Play, TrendingUp, Activity, Users } from 'lucide-react';

/**
 * Header V8 do Recovery Agent — redesenho premium.
 * Gradient navy + glow ciano, número HERO grande, mini-stats inline e botões com peso.
 */
export default function RecoveryAgentHeaderV8({ active, onToggle, lastActionLabel = 'há 3min' }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        padding: '24px 26px',
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.22)',
        boxShadow: '0 4px 12px rgba(0,36,67,0.20), 0 16px 40px -12px rgba(0,193,148,0.20)',
        color: '#fff',
      }}
    >
      {/* Glow ciano decorativo */}
      <div style={{
        position: 'absolute', right: -120, top: -120,
        width: 360, height: 360,
        background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: -80, bottom: -120,
        width: 280, height: 280,
        background: 'radial-gradient(closest-side, rgba(0,193,148,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
      }}>
        {/* Lado esquerdo · agente + número hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 22px rgba(92,247,207,0.42), 0 0 0 4px rgba(92,247,207,0.16)',
            flexShrink: 0,
          }}>
            <Sparkles size={26} strokeWidth={2.2} color="#002443" />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#5CF7CF',
              }}>
                AGENTE IA · RECUPERAÇÃO DE VENDAS
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '3px 10px', borderRadius: 999,
                background: active ? 'rgba(92,247,207,0.16)' : 'rgba(255,255,255,0.08)',
                color: active ? '#5CF7CF' : 'rgba(255,255,255,0.65)',
                border: `1px solid ${active ? 'rgba(92,247,207,0.42)' : 'rgba(255,255,255,0.18)'}`,
                fontSize: 10.5, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: active ? '#5CF7CF' : 'rgba(255,255,255,0.5)',
                  boxShadow: active ? '0 0 8px #5CF7CF' : 'none',
                  animation: active ? 'rkp-blink 1.4s ease-in-out infinite' : 'none',
                }} />
                {active ? 'Ativo' : 'Pausado'}
              </span>
            </div>

            <h2 style={{
              fontSize: 28, fontWeight: 800,
              letterSpacing: '-0.025em', lineHeight: 1.1,
              color: '#fff', margin: 0,
            }}>
              Recuperou{' '}
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontVariantNumeric: 'tabular-nums',
                color: '#5CF7CF',
                textShadow: '0 0 24px rgba(92,247,207,0.45)',
              }}>R$&nbsp;487.300</span>{' '}
              nos últimos 30 dias
            </h2>

            {/* Mini-stats inline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 18,
              marginTop: 10, flexWrap: 'wrap',
            }}>
              <MiniStat
                icon={TrendingUp}
                label="Sucesso"
                value="32,4%"
                accent="#5CF7CF"
              />
              <Divider />
              <MiniStat
                icon={Activity}
                label="Última ação"
                value={lastActionLabel}
                accent="#88F9D9"
              />
              <Divider />
              <MiniStat
                icon={Users}
                label="Economia"
                value="2,3 analistas"
                accent="#5CF7CF"
              />
            </div>
          </div>
        </div>

        {/* Lado direito · botões */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onToggle}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 42, padding: '0 18px', borderRadius: 12,
              background: active
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
              border: active ? '1px solid rgba(255,255,255,0.18)' : 'none',
              color: active ? '#fff' : '#002443',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 700,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              boxShadow: active ? 'none' : '0 6px 18px rgba(92,247,207,0.32)',
              transition: 'transform .15s, box-shadow .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {active ? <Pause size={15} strokeWidth={2.4} /> : <Play size={15} strokeWidth={2.4} />}
            {active ? 'Pausar agente' : 'Ativar agente'}
          </button>
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 42, padding: '0 18px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12,
              color: '#fff', fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <Settings size={15} strokeWidth={2.2} />
            Configurar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes rkp-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.14)',
        display: 'grid', placeItems: 'center',
        color: accent,
      }}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}>{label}</div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13.5, fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: '#fff',
          letterSpacing: '-0.012em',
        }}>{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <span style={{
      width: 1, height: 26,
      background: 'rgba(255,255,255,0.14)',
    }} />
  );
}