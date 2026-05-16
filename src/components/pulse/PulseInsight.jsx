import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

/**
 * PulseInsight — card de insight (Pack 03 · família F·02).
 *
 * @param {('trend'|'watch'|'anomaly'|'info')} tone
 */
const ICONS = {
  trend: TrendingUp,
  watch: AlertTriangle,
  anomaly: AlertOctagon,
  info: Info,
};

const LABELS = {
  trend: 'Trend · win',
  watch: 'Watch · oportunidade',
  anomaly: 'Anomaly · investigar',
  info: 'Info · ciência',
};

export default function PulseInsight({
  tone = 'info',
  eyebrow,
  title,
  children,
  actions,
  className,
}) {
  const Icon = ICONS[tone] || Info;
  return (
    <div className={cn('pulse-insight', `is-${tone}`, className)}>
      <div className="pulse-insight-icon">
        <Icon className="w-4 h-4" />
      </div>
      <div className="pulse-insight-body">
        <span className="pulse-eyebrow">{eyebrow || LABELS[tone]}</span>
        {title && <h4 className="pulse-insight-title">{title}</h4>}
        {children && <p className="pulse-insight-text">{children}</p>}
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}