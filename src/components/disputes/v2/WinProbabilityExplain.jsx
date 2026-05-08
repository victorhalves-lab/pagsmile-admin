import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { explainWinProb } from './utils';

export default function WinProbabilityExplain({ dispute, children }) {
  const { probability, factors } = explainWinProb(dispute);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-help">{children}</button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <p className="text-xs font-bold text-slate-900">Decomposição IA · {probability}%</p>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">Como chegamos nessa probabilidade:</p>
        <div className="space-y-1.5">
          {factors.length === 0 && (
            <p className="text-xs text-slate-500">Sem fatores específicos identificados.</p>
          )}
          {factors.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={cn(
                'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                f.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              )}>
                {f.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              </div>
              <span className="flex-1 text-slate-700">{f.label}</span>
              <span className={cn('font-mono font-bold text-[11px]', f.positive ? 'text-emerald-700' : 'text-red-700')}>{f.impact}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-500">
            💡 Adicionar evidências adicionais pode aumentar a probabilidade de ganho.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}