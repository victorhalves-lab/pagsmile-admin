import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Toggle global para ativar comparação de períodos em todos os gráficos da tela.
 */
export default function PeriodCompareToggle({ active, onToggle, label = 'Comparar com período anterior' }) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      className={cn(
        'gap-1.5 h-8 text-xs',
        active && 'bg-[#2bc196] hover:bg-[#239b7a] text-white'
      )}
    >
      {active ? <Check className="w-3.5 h-3.5" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
      {label}
    </Button>
  );
}