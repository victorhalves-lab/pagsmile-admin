import React from 'react';
import { cn } from '@/lib/utils';

/**
 * EditorialSection · Pagsmile 2026
 * Container de seção com header tipográfico estilo editorial.
 *
 * Uso:
 *   <EditorialSection
 *     number="01"
 *     title="ENTRADAS DIÁRIAS"
 *     subtitle="FLUXO DE CAIXA POR PERÍODO"
 *     action={<button>...</button>}
 *   >
 *     ...children
 *   </EditorialSection>
 */
export default function EditorialSection({
  number,
  title,
  subtitle,
  action,
  children,
  className,
  noCard = false,
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            {number && (
              <span className="font-mono text-[11px] font-bold text-[#00c194] tracking-widest">
                {number}
              </span>
            )}
            <h2 className="text-[16px] sm:text-[18px] font-extrabold uppercase tracking-[-0.01em] text-pag-navy-900 dark:text-white">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7a9b97] mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {noCard ? (
        children
      ) : (
        <div className="bg-white dark:bg-[#163838] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 sm:p-5">
          {children}
        </div>
      )}
    </section>
  );
}