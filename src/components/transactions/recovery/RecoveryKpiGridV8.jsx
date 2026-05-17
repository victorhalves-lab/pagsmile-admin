import React from 'react';
import { RECOVERY_KPIS } from './mocks/recoveryAgentMocks';

const fmtBRL0 = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

/**
 * KPI V8 oficial — usa classes do v8-tokens.css:
 *   .v8-kpi              · base (branca)
 *   .v8-kpi--hero        · gradient navy + glow ciano
 *   .v8-kpi--mint        · gradient mint sólido (branco)
 *   .v8-kpi--glow        · borda gradient ciano (azul-esverdeado)
 *   .v8-kpi--accent      · barra topo colorida
 */
function Kpi({ variant = '', label, value, delta, deltaTone = 'up', foot, labelTone }) {
  const cls = ['v8-kpi'];
  if (variant) cls.push(`v8-kpi--${variant}`);

  const labelCls = ['v8-kpi__label'];
  if (labelTone) labelCls.push(`v8-kpi__label--${labelTone}`);

  return (
    <div className={cls.join(' ')}>
      <span className={labelCls.join(' ')}>{label}</span>
      <div className="v8-kpi__value">{value}</div>
      {(delta || foot) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {delta && (
            <span className={`v8-kpi__delta v8-kpi__delta--${deltaTone}`}>
              {deltaTone === 'down' ? '↘' : '↗'} {delta}
            </span>
          )}
          {foot && <span className="v8-kpi__foot">{foot}</span>}
        </div>
      )}
    </div>
  );
}

export default function RecoveryKpiGridV8() {
  const k = RECOVERY_KPIS;
  const sign = k.recovered_value_delta_pct >= 0 ? '+' : '';

  return (
    <div className="v8-kpi-row v8-kpi-row--3">
      {/* Linha 1 — destaque visual: hero (navy+glow), mint (verde sólido), glow (borda ciano) */}
      <Kpi
        variant="hero"
        label="VALOR RECUPERADO · 30D"
        value={fmtBRL0(k.recovered_value_30d)}
        delta={`${sign}${k.recovered_value_delta_pct.toFixed(1)}% vs mês anterior`}
        deltaTone="up"
      />
      <Kpi
        variant="mint"
        label="TAXA DE RECUPERAÇÃO"
        value={`${k.recovery_rate}%`}
        foot={`${k.recovered_count_30d} transações`}
      />
      <Kpi
        variant="glow"
        label="EM FILA AGORA"
        value={k.in_queue_count}
        foot={fmtBRL0(k.in_queue_value)}
        labelTone="warn"
      />

      {/* Linha 2 — neutros com accent top */}
      <Kpi
        variant="accent-navy"
        label="ECONOMIA VS MANUAL"
        value={fmtBRL0(k.manual_cost_saved)}
        foot={`${k.manual_cost_equivalent_fte} analistas / mês`}
      />
      <Kpi
        variant="accent"
        label="MELHOR CANAL"
        value={k.best_channel}
        foot={`${k.best_channel_rate}% de conversão`}
      />
      <Kpi
        variant="accent-info"
        label="MELHOR HORÁRIO"
        value={k.best_hour}
        foot={`${k.best_hour_rate}% de sucesso`}
        labelTone="info"
      />
    </div>
  );
}