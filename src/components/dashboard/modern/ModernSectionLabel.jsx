import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/**
 * Label de seção moderno (estilo "ANÁLISE TEMPORAL >" do print)
 * Título mono uppercase com caret + subtítulo discreto.
 */
export default function ModernSectionLabel({
  title,
  subtitle,
  href,
  className,
}) {
  const Inner = (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] font-bold text-white hover:text-[#00c194] transition-colors">
      {title}
      <CaretRight className="w-3 h-3" weight="bold" />
    </span>
  );

  return (
    <div className={cn('mb-3', className)}>
      {href ? <Link to={href}>{Inner}</Link> : Inner}
      {subtitle && (
        <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}