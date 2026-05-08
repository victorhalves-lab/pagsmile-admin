import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Wrapper que torna QUALQUER número grande clicável e drill-down-able.
 * Padrão Stripe / Adyen — convenção universal do design system.
 *
 * Uso:
 *   <DrillDownNumber to="/transactions">R$ 1.234.567</DrillDownNumber>
 *   <DrillDownNumber onClick={() => openDrawer()}>87.4%</DrillDownNumber>
 */
export default function DrillDownNumber({
  children,
  to,
  onClick,
  className,
  showChevron = true,
}) {
  const inner = (
    <span
      className={cn(
        'inline-flex items-center gap-1 transition-colors group cursor-pointer',
        'hover:text-[#2bc196]',
        className
      )}
    >
      {children}
      {showChevron && (
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#2bc196]" />
      )}
    </span>
  );

  if (to) {
    return <Link to={to}>{inner}</Link>;
  }
  if (onClick) {
    return (
      <button onClick={onClick} className="text-left">
        {inner}
      </button>
    );
  }
  return inner;
}