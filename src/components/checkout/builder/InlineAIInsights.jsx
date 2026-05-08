import React, { useState } from 'react';
import { Sparkles, ChevronRight, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Card flutuante com insights da IA contextuais ao Builder.
 * Mostra sugestões inline em vez de viver em aba separada.
 */
export default function InlineAIInsights() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);

  if (dismissed) return null;

  const insights = [
    {
      severity: 'high',
      label: 'Botão pequeno demais para mobile',
      detail: 'Atual 32px · ideal 44px+',
      lift: '+8% taps no CTA',
    },
    {
      severity: 'medium',
      label: 'Campo CPF antes do email',
      detail: 'Inverter a ordem reduz abandono em 12%',
      lift: '+12% conversão',
    },
    {
      severity: 'low',
      label: 'PIX em segundo lugar',
      detail: 'Para mobile BR, PIX-first ganha em 87% dos testes',
      lift: '+5% conversão mobile',
    },
  ];

  const tones = {
    high: 'border-red-300 bg-red-50 dark:bg-red-900/20',
    medium: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20',
    low: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 w-80 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-700 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm font-semibold">Converter Agent</p>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
            {insights.length} insights
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)} className="text-white/80 hover:text-white">
            <ChevronRight className={cn("w-4 h-4 transition-transform", expanded && "rotate-90")} />
          </button>
          <button onClick={() => setDismissed(true)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
          {insights.map((ins, i) => (
            <div key={i} className={cn("rounded-lg border p-2.5", tones[ins.severity])}>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight">{ins.label}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{ins.detail}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-emerald-600">{ins.lift}</span>
                    <Button size="sm" className="h-6 text-[10px] gap-1 bg-[#2bc196] hover:bg-[#25a880]"
                      onClick={() => toast.success(`Aplicando: ${ins.label}`)}>
                      Aplicar
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}