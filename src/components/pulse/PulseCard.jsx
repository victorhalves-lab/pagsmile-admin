import React from 'react';
import { cn } from '@/lib/utils';

/**
 * PulseCard — container padrão Pulse (Pack 03).
 *
 * <PulseCard title="..." sub="..." right={<PulsePill .../>} foot="atualizado 14:32">
 *   …body…
 * </PulseCard>
 */
export default function PulseCard({
  title,
  sub,
  right,
  foot,
  bodyClassName,
  className,
  children,
}) {
  return (
    <div className={cn('pulse-card', className)}>
      {(title || right) && (
        <div className="pulse-card-head">
          <div className="min-w-0">
            {title && <h3 className="pulse-card-title">{title}</h3>}
            {sub && <p className="pulse-section-sub mt-1">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={cn('pulse-card-body', bodyClassName)}>{children}</div>
      {foot && <div className="pulse-card-foot">{foot}</div>}
    </div>
  );
}