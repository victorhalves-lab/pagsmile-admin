import React from 'react';
import { cn } from '@/lib/utils';

/**
 * PulsePill — pill mono-uppercase do Pulse DS (Pack 02).
 *
 * @param {('mint'|'amber'|'coral'|'info'|'purple'|'pink'|'teal'|'neutral'|'ink')} tone
 * @param {('soft'|'outline'|'solid')} variant
 * @param {('xs'|'sm'|'md'|'lg'|'xl')} size
 * @param {boolean} dot          — adiciona um dot leading
 * @param {boolean} pulse        — anima o dot (live)
 */
export default function PulsePill({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  pulse = false,
  icon: Icon,
  className,
  children,
  ...rest
}) {
  return (
    <span
      className={cn(
        'pulse-pill',
        `is-${size}`,
        `is-${tone}`,
        variant === 'outline' && 'is-outline',
        variant === 'solid' && 'is-solid',
        className
      )}
      {...rest}
    >
      {dot && <span className={cn('pulse-pill-dot', pulse && 'is-pulse')} />}
      {Icon && <Icon />}
      {children}
    </span>
  );
}