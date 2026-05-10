import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getPixFlowConfig } from './pixFlowConfig';

/**
 * Badge para indicar o flow do PIX (manual, automatic, biometric, scheduled).
 * Mostra ícone, label e tooltip explicativo.
 */
export default function PixFlowBadge({ flow = 'manual', size = 'sm', showLabel = true, className }) {
  const cfg = getPixFlowConfig(flow);
  const Icon = cfg.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'gap-1 font-medium',
              cfg.bgClass,
              cfg.textClass,
              cfg.borderClass,
              size === 'xs' && 'text-[10px] px-1.5 py-0',
              size === 'sm' && 'text-xs',
              className
            )}
          >
            <Icon className={cn(size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
            {showLabel && <span>{cfg.shortLabel}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold">{cfg.label}</p>
          <p className="text-xs opacity-90">{cfg.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}