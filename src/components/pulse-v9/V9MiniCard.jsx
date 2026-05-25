import React from 'react';
import { cn } from '@/lib/utils';
import V9GrowthPill from './V9GrowthPill';

/**
 * V9 Mini Card — Pulse V9 / VF official.
 * Denso, com top accent gradient + label mono uppercase + número HUGE com gradient text.
 *
 * Props:
 *  - variant: 'mint' (default) | 'blue' | 'deep' | 'glow'
 *  - label: string
 *  - value: ReactNode (pode incluir <small> nas unidades)
 *  - growth: number (mostra pill +X% se passado)
 *  - growthLabel: string opcional override do pill
 *  - growthVariant: same as V9GrowthPill (default 'up')
 */
export default function V9MiniCard({
  variant = 'mint',
  label,
  value,
  growth,
  growthLabel,
  growthVariant,
  onClick,
  className,
}) {
  const showGrowth = growth !== undefined || growthLabel;
  return (
    <div
      onClick={onClick}
      className={cn(
        'v9mc',
        variant === 'blue' && 'v9mc-blue',
        variant === 'deep' && 'v9mc-deep',
        variant === 'glow' && 'v9mc-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="top">
        <div>{label && <div className="lab">{label}</div>}</div>
        {showGrowth && (
          <V9GrowthPill
            value={growth}
            label={growthLabel}
            variant={growthVariant}
          />
        )}
      </div>
      <div className="v">{value}</div>
    </div>
  );
}