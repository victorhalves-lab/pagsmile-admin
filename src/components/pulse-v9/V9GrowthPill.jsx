import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V9 Growth Pill — Pulse V9 / VF.
 * Pill destacada para variação. Auto-detecta up/down via value se variant não passado.
 *
 * variants: 'up' | 'up-solid' | 'up-glow' | 'up-dark' | 'down' | 'warn'
 */
export default function V9GrowthPill({ value, label, variant, xl = false, className }) {
  const auto = variant || (value !== undefined ? (value >= 0 ? 'up' : 'down') : 'up');
  const isUp = auto.startsWith('up');
  const formatted = label
    ? label
    : value !== undefined
    ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
    : '';

  const classMap = {
    up: 'v9gp-up',
    'up-solid': 'v9gp-up-solid',
    'up-glow': 'v9gp-up-glow',
    'up-dark': 'v9gp-up-dark',
    down: 'v9gp-down',
    warn: 'v9gp-warn',
  };

  return (
    <span className={cn('v9gp', classMap[auto], xl && 'v9gp-up-xl', className)}>
      {isUp ? (
        <svg viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <polyline points="1 6 10.5 15.5 15.5 10.5 23 18" />
        </svg>
      )}
      {formatted}
    </span>
  );
}