import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * PulseKpi — KPI card mono / numeric do Pulse DS (Pack 01).
 *
 * Anatomia:  [eyebrow + pill]  →  VALUE  →  delta  →  foot
 *
 * @param {string} label                 — eyebrow uppercase
 * @param {React.ReactNode} value        — número formatado (string)
 * @param {string} ccy                   — moeda exibida em prefixo (ex: 'R$')
 * @param {('sm'|'md'|'lg'|'xl'|'hero')} valueSize
 * @param {{ direction:'up'|'down'|'flat', text:string }} delta
 * @param {React.ReactNode} foot         — texto auxiliar abaixo
 * @param {React.ReactNode} pill         — qualquer <PulsePill/> no head
 * @param {('compact'|'cozy'|'comfort')} density
 * @param {('none'|'mint'|'amber'|'coral'|'info'|'purple')} glow
 */
export default function PulseKpi({
  label,
  value,
  ccy,
  valueSize = 'lg',
  delta,
  foot,
  pill,
  density = 'cozy',
  glow = 'none',
  className,
  children,
}) {
  const DeltaIcon =
    delta?.direction === 'up' ? TrendingUp :
    delta?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        'pulse-kpi',
        density === 'compact' && 'is-compact',
        density === 'comfort' && 'is-comfort',
        glow !== 'none' && `is-glow-${glow}`,
        className
      )}
    >
      {(label || pill) && (
        <div className="pulse-kpi-head">
          {label && <span className="pulse-eyebrow">{label}</span>}
          {pill}
        </div>
      )}

      <div className={cn('pulse-kpi-value', `is-${valueSize}`)}>
        {ccy && <span className="pulse-ccy">{ccy}</span>}
        {value}
      </div>

      {delta && (
        <span className={cn('pulse-kpi-delta', `is-${delta.direction}`)}>
          <DeltaIcon className="w-3 h-3" />
          {delta.text}
        </span>
      )}

      {foot && <div className="pulse-kpi-foot">{foot}</div>}
      {children}
    </div>
  );
}