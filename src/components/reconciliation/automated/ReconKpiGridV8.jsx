import React from 'react';
import { TrendingUp } from 'lucide-react';
import { RECON_KPIS, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

/**
 * KPI V8 oficial (mesmo padrão do Recovery Agent) — 4 variantes:
 *   hero (navy + glow ciano) · mint (gradient sólido) · glow (borda gradient) · accent-top
 * Inline styles puros para garantir render independente do Tailwind/CSS scoped.
 */
function Kpi({ variant = 'default', label, value, delta, deltaTone = 'up', foot }) {
  const base = {
    position: 'relative',
    padding: '18px 18px 16px',
    borderRadius: 16,
    display: 'flex', flexDirection: 'column', gap: 6,
    overflow: 'hidden',
    minHeight: 140,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    boxShadow: '0 1px 1px rgba(15,23,42,0.04)',
    transition: 'box-shadow .2s, border-color .2s',
  };

  let labelColor = '#94A3B8';
  let valueColor = '#0F172A';
  let footColor = '#64748B';
  let dotColor = '#00C194';
  let dotGlow = '0 0 0 3px rgba(0,193,148,0.18)';
  let extraStyle = {};
  let overlay = null;

  if (variant === 'hero') {
    extraStyle = {
      background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
      borderColor: 'rgba(92,247,207,0.22)',
      padding: '22px 22px 20px',
    };
    labelColor = 'rgba(255,255,255,0.62)';
    valueColor = '#FFFFFF';
    footColor = 'rgba(255,255,255,0.65)';
    dotColor = '#5CF7CF';
    dotGlow = '0 0 8px #5CF7CF, 0 0 0 3px rgba(92,247,207,0.18)';
    overlay = (
      <div style={{
        position: 'absolute', right: -90, top: -90, width: 280, height: 280,
        background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
        pointerEvents: 'none',
      }} />
    );
  } else if (variant === 'mint') {
    extraStyle = {
      background: 'linear-gradient(135deg, #00C194 0%, #007A5C 100%)',
      borderColor: 'transparent',
    };
    labelColor = 'rgba(255,255,255,0.82)';
    valueColor = '#FFFFFF';
    footColor = 'rgba(255,255,255,0.82)';
    dotColor = '#FFFFFF';
    dotGlow = '0 0 0 3px rgba(255,255,255,0.22)';
  } else if (variant === 'glow') {
    extraStyle = {
      background:
        'linear-gradient(#FFFFFF, #FFFFFF) padding-box, ' +
        'linear-gradient(135deg, #5CF7CF, #00C194 60%, transparent 100%) border-box',
      border: '1px solid transparent',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    };
    dotColor = '#5CF7CF';
    dotGlow = '0 0 8px #5CF7CF, 0 0 0 3px rgba(92,247,207,0.18)';
    overlay = (
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16,
        background: 'radial-gradient(140% 80% at 100% 0%, rgba(92,247,207,0.14), transparent 55%)',
        pointerEvents: 'none',
      }} />
    );
  } else if (variant === 'accent-warn') {
    extraStyle = { borderTop: '3px solid #B45309', paddingTop: 20 };
    dotColor = '#B45309';
    dotGlow = '0 0 0 3px rgba(180,83,9,0.18)';
  } else if (variant === 'accent-danger') {
    extraStyle = { borderTop: '3px solid #B91C1C', paddingTop: 20 };
    dotColor = '#B91C1C';
    dotGlow = '0 0 0 3px rgba(185,28,28,0.18)';
  } else if (variant === 'accent-navy') {
    extraStyle = { borderTop: '3px solid #002443', paddingTop: 20 };
    dotColor = '#002443';
    dotGlow = '0 0 0 3px rgba(0,36,67,0.18)';
  } else if (variant === 'accent') {
    extraStyle = { borderTop: '3px solid #00C194', paddingTop: 20 };
  }

  const deltaColors = { up: '#007A5C', down: '#B91C1C', warn: '#B45309', flat: '#64748B' };
  if (variant === 'hero') deltaColors.up = '#5CF7CF';
  if (variant === 'mint') deltaColors.up = '#FFFFFF';

  return (
    <div style={{ ...base, ...extraStyle }}>
      {overlay}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10.5, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.16em',
        color: labelColor,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: dotColor, boxShadow: dotGlow, flexShrink: 0,
        }} />
        {label}
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'Inter, sans-serif', fontWeight: 800,
        fontSize: variant === 'hero' ? 44 : 34,
        lineHeight: 1.05, letterSpacing: '-0.025em',
        color: valueColor, fontVariantNumeric: 'tabular-nums',
        marginTop: 4,
      }}>
        {value}
      </div>
      {(delta || foot) && (
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 2,
        }}>
          {delta && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11.5, fontWeight: 600,
              color: deltaColors[deltaTone] || deltaColors.up,
            }}>
              <TrendingUp size={11} strokeWidth={2.5} style={{
                transform: deltaTone === 'down' ? 'rotate(180deg)' : 'none',
              }} />
              {delta}
            </span>
          )}
          {foot && (
            <span style={{ fontSize: 11.5, color: footColor }}>{foot}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReconKpiGridV8() {
  const k = RECON_KPIS;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14,
    }}>
      <Kpi
        variant="hero"
        label="TAXA 3-WAY MATCH"
        value={`${k.match_rate_3way}%`}
        delta={`+${k.match_rate_change}pp vs período`}
        deltaTone="up"
      />
      <Kpi
        variant="mint"
        label="VOLUME CONCILIADO"
        value={fmtBRLFromReais(k.volume_conciliado_30d)}
        foot={`${k.volume_conciliado_count.toLocaleString('pt-BR')} transações · 30d`}
      />
      <Kpi
        variant="accent-warn"
        label="DIVERGÊNCIAS ABERTAS"
        value={k.divergences_open}
        foot={`${fmtBRLFromReais(k.divergences_value)} em jogo`}
      />
      <Kpi
        variant="accent-danger"
        label="LIQUIDAÇÕES AUSENTES"
        value={k.missing_settlements}
        foot="aguardando crédito"
      />
      <Kpi
        variant="glow"
        label="RECUPERADO PELO AGENTE"
        value={fmtBRLFromReais(k.recovered_by_agent)}
        foot="últimos 30 dias"
      />
      <Kpi
        variant="accent-navy"
        label="SLA MÉDIO RESOLUÇÃO"
        value={`${k.sla_resolution_hours}h`}
        foot="do alerta à proposta"
      />
    </div>
  );
}