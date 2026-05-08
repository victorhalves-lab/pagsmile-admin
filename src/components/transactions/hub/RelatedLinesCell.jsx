import React from 'react';
import { AlertTriangle, RotateCcw, Split, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Coluna "Linhas relacionadas" — DIFERENCIAL PagSmile.
 * Mostra de forma visual se a transação tem CB, refund, split, recurring vinculado.
 */
export default function RelatedLinesCell({ row }) {
  const items = [];

  if (row.status === 'chargeback' || row.has_chargeback) {
    items.push({ key: 'cb', label: 'CB', icon: AlertTriangle, color: 'bg-red-50 text-red-700 border-red-200', tooltip: 'Tem chargeback vinculado' });
  }
  if (row.refund_count > 0 || row.status === 'refunded' || row.status === 'partial_refunded') {
    items.push({ key: 'refund', label: 'Refund', icon: RotateCcw, color: 'bg-amber-50 text-amber-700 border-amber-200', tooltip: 'Tem reembolso(s)' });
  }
  if (row.has_split || row.split_rules?.length > 0) {
    items.push({ key: 'split', label: 'Split', icon: Split, color: 'bg-purple-50 text-purple-700 border-purple-200', tooltip: 'Transação com split' });
  }
  if (row.is_recurring || row.subscription_id) {
    items.push({ key: 'rec', label: 'Recorrente', icon: Repeat, color: 'bg-blue-50 text-blue-700 border-blue-200', tooltip: 'Vinculada a assinatura' });
  }

  if (items.length === 0) return <span className="text-slate-300 text-xs">—</span>;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
        {items.map(it => {
          const Icon = it.icon;
          return (
            <Tooltip key={it.key}>
              <TooltipTrigger>
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border", it.color)}>
                  <Icon className="w-2.5 h-2.5" />
                  {it.label}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{it.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}