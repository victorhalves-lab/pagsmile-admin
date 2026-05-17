import React from 'react';
import { CheckCircle2, DollarSign, AlertTriangle, Clock, TrendingUp, Timer } from 'lucide-react';
import { RECON_KPIS, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

const KPIS = [
  {
    eyebrow: 'TAXA 3-WAY MATCH',
    value: `${RECON_KPIS.match_rate_3way}%`,
    sub: `+${RECON_KPIS.match_rate_change}pp vs período`,
    icon: CheckCircle2,
    accent: 'var(--pag-mint-500)',
    highlight: true,
  },
  {
    eyebrow: 'VOLUME CONCILIADO',
    value: fmtBRLFromReais(RECON_KPIS.volume_conciliado_30d),
    sub: `${RECON_KPIS.volume_conciliado_count.toLocaleString('pt-BR')} transações · 30d`,
    icon: DollarSign,
    accent: 'var(--pag-mint-700)',
  },
  {
    eyebrow: 'DIVERGÊNCIAS ABERTAS',
    value: RECON_KPIS.divergences_open,
    sub: `${fmtBRLFromReais(RECON_KPIS.divergences_value)} em jogo`,
    icon: AlertTriangle,
    accent: 'var(--sys-warn)',
  },
  {
    eyebrow: 'LIQUIDAÇÕES AUSENTES',
    value: RECON_KPIS.missing_settlements,
    sub: 'aguardando crédito',
    icon: Clock,
    accent: 'var(--sys-danger)',
  },
  {
    eyebrow: 'RECUPERADO PELO AGENTE',
    value: fmtBRLFromReais(RECON_KPIS.recovered_by_agent),
    sub: 'últimos 30 dias',
    icon: TrendingUp,
    accent: 'var(--pag-mint-500)',
    highlight: true,
  },
  {
    eyebrow: 'SLA MÉDIO RESOLUÇÃO',
    value: `${RECON_KPIS.sla_resolution_hours}h`,
    sub: 'do alerta à proposta',
    icon: Timer,
    accent: 'var(--pag-blue-700)',
  },
];

export default function ReconKpiGridV8() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 12,
    }}>
      {KPIS.map((k) => {
        const Icon = k.icon;
        return (
          <div
            key={k.eyebrow}
            className="v8-card"
            style={{
              padding: '14px 16px',
              background: k.highlight ? 'var(--grad-hero)' : 'var(--v8-bg-surface)',
              borderColor: k.highlight ? 'var(--v8-bd-brand)' : 'var(--v8-bd-default)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="v8-eyebrow" style={{ fontSize: 9 }}>{k.eyebrow}</span>
              <Icon size={13} strokeWidth={1.9} style={{ color: k.accent }} />
            </div>
            <div className="v8-num" style={{
              fontSize: 22, fontWeight: 700,
              letterSpacing: 'var(--tr-tighter)',
              color: 'var(--v8-fg-strong)',
              lineHeight: 1.1,
            }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 4 }}>
              {k.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}