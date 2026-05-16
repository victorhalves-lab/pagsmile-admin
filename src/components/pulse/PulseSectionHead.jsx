import React from 'react';
import { cn } from '@/lib/utils';

/**
 * PulseSectionHead — heading numerado padrão Pulse (Pack 13).
 *
 * <PulseSectionHead num="01" eyebrow="MANDATOS" title="Saúde dos consentimentos" sub="…"/>
 */
export default function PulseSectionHead({
  num,
  eyebrow,
  title,
  sub,
  right,
  className,
}) {
  return (
    <div className={cn('pulse-section', className)}>
      <div className="pulse-section-meta">
        {num && <span className="pulse-section-num">{num}</span>}
        {eyebrow && <span className="pulse-eyebrow">{eyebrow}</span>}
        {right && <div className="ml-auto">{right}</div>}
      </div>
      {title && <h2 className="pulse-section-title">{title}</h2>}
      {sub && <p className="pulse-section-sub">{sub}</p>}
    </div>
  );
}