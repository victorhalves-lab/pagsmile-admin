import React from 'react';
import {
  DollarSign, Target, Clock, Zap, MessageSquare, Calendar, TrendingUp,
} from 'lucide-react';
import { RECOVERY_KPIS } from './mocks/recoveryAgentMocks';

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

function KpiCard({ eyebrow, value, sub, icon: Icon, accent, trend }) {
  return (
    <div className="v8-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="v8-eyebrow" style={{ fontSize: 10 }}>{eyebrow}</span>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: accent ? `${accent}14` : 'var(--v8-bg-surface-2)',
          color: accent || 'var(--v8-fg-muted)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon size={13} strokeWidth={2} />
        </div>
      </div>
      <div className="v8-num" style={{
        fontSize: 24, fontWeight: 700, letterSpacing: 'var(--tr-tighter)',
        color: 'var(--v8-fg-strong)', lineHeight: 1.05,
      }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend != null && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 600,
            color: trend >= 0 ? 'var(--v8-fg-success)' : 'var(--v8-fg-danger)',
          }}>
            <TrendingUp size={10} strokeWidth={2.5} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
        {sub && (
          <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)' }}>{sub}</span>
        )}
      </div>
    </div>
  );
}

export default function RecoveryKpiGridV8() {
  const k = RECOVERY_KPIS;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14,
    }}>
      <KpiCard
        eyebrow="VALOR RECUPERADO · 30D"
        value={fmtBRL(k.recovered_value_30d)}
        trend={k.recovered_value_delta_pct}
        sub="vs mês anterior"
        icon={DollarSign}
        accent="var(--pag-mint-500)"
      />
      <KpiCard
        eyebrow="TAXA DE RECUPERAÇÃO"
        value={`${k.recovery_rate}%`}
        sub={`${k.recovered_count_30d} transações`}
        icon={Target}
        accent="var(--pag-mint-500)"
      />
      <KpiCard
        eyebrow="EM FILA AGORA"
        value={k.in_queue_count}
        sub={fmtBRL(k.in_queue_value)}
        icon={Clock}
        accent="var(--sys-warn)"
      />
      <KpiCard
        eyebrow="ECONOMIA VS MANUAL"
        value={fmtBRL(k.manual_cost_saved)}
        sub={`${k.manual_cost_equivalent_fte} analistas / mês`}
        icon={Zap}
        accent="var(--pag-blue-700)"
      />
      <KpiCard
        eyebrow="MELHOR CANAL"
        value={k.best_channel}
        sub={`${k.best_channel_rate}% de conversão`}
        icon={MessageSquare}
        accent="var(--pag-mint-500)"
      />
      <KpiCard
        eyebrow="MELHOR HORÁRIO"
        value={k.best_hour}
        sub={`${k.best_hour_rate}% de sucesso`}
        icon={Calendar}
        accent="var(--pag-blue-700)"
      />
    </div>
  );
}