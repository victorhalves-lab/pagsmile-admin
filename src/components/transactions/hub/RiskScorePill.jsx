import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Pill colorido de Score de Risco — paridade Stripe/Adyen.
 * 0-30: baixo (verde) | 31-69: médio (amarelo) | 70-100: alto (vermelho)
 */
export default function RiskScorePill({ score }) {
  if (score == null) return <span className="text-slate-400 text-xs">—</span>;

  let level, classes, Icon;
  if (score <= 30) {
    level = 'Baixo';
    classes = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
    Icon = ShieldCheck;
  } else if (score <= 69) {
    level = 'Médio';
    classes = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
    Icon = Shield;
  } else {
    level = 'Alto';
    classes = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
    Icon = ShieldAlert;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
            classes
          )}>
            <Icon className="w-3 h-3" />
            {score}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Risco {level} ({score}/100)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}