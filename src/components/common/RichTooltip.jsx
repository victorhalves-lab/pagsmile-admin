import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Rich Tooltip [#50] — padrão Stripe / Adyen.
 * Tooltip universal com header + body estruturado.
 *
 * Uso:
 *   <RichTooltip
 *     title="Taxa de aprovação"
 *     rows={[
 *       { label: 'Visa',       value: '91.2%' },
 *       { label: 'Mastercard', value: '88.5%' },
 *     ]}
 *     footer="Atualizado há 2min"
 *   >
 *     <span>87.4%</span>
 *   </RichTooltip>
 */
export default function RichTooltip({
  children,
  title,
  description,
  rows = [],
  footer,
  side = 'top',
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="bg-slate-900 dark:bg-slate-800 border-slate-700 max-w-xs p-0">
          <div className="space-y-2 p-3">
            {title && (
              <div>
                <p className="text-xs font-bold text-white">{title}</p>
                {description && (
                  <p className="text-[10px] text-slate-300 mt-0.5">{description}</p>
                )}
              </div>
            )}
            {rows.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-slate-700">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{r.label}</span>
                    <span className="text-white font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>
            )}
            {footer && (
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-700">{footer}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}