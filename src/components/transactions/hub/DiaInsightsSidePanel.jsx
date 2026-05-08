import React from 'react';
import { X, Sparkles, TrendingDown, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * Painel lateral retrátil com insights da DIA sobre as transações filtradas atualmente.
 */
export default function DiaInsightsSidePanel({ open, onClose }) {
  if (!open) return null;

  const insights = [
    {
      type: 'anomaly',
      icon: TrendingDown,
      color: 'red',
      title: 'Aprovação Visa caiu 4.2pp em 2h',
      detail: 'A queda concentra-se em BINs do Itaú entre 14h-16h. Sugiro acionar fallback para Cielo.',
      cta: 'Aplicar fallback',
    },
    {
      type: 'opportunity',
      icon: Zap,
      color: 'emerald',
      title: 'R$ 4.382 em pré-auth para capturar',
      detail: '12 transações pré-autorizadas há mais de 6h. Capturar agora antes de expirar.',
      cta: 'Capturar lote',
    },
    {
      type: 'risk',
      icon: AlertTriangle,
      color: 'amber',
      title: '3 transações suspeitas (mesmo IP)',
      detail: 'Mesmo IP 187.45.X.X em 3 cartões diferentes nos últimos 30min. Recomendo revisar.',
      cta: 'Investigar',
    },
    {
      type: 'insight',
      icon: Sparkles,
      color: 'blue',
      title: 'Você está 8% acima da média do segmento',
      detail: 'Sua aprovação 87.3% vs média e-commerce BR 79.1%. Top 10% do mercado: 91%.',
      cta: 'Ver benchmark',
    },
  ];

  const tones = {
    red:     { bg: 'bg-red-50 dark:bg-red-900/20',         text: 'text-red-700 dark:text-red-400',         border: 'border-red-200' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     text: 'text-amber-700 dark:text-amber-400',     border: 'border-amber-200' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',       text: 'text-blue-700 dark:text-blue-400',       border: 'border-blue-200' },
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-[#2bc196]/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2bc196] to-[#5cf7cf] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">DIA Insights</h3>
            <p className="text-[10px] text-slate-500">{insights.length} insights sobre a visão atual</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {insights.map((ins, idx) => {
            const t = tones[ins.color];
            const Icon = ins.icon;
            return (
              <div
                key={idx}
                className={cn("rounded-lg border p-3 space-y-2", t.bg, t.border)}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", t.text)} />
                  <p className={cn("text-sm font-semibold leading-tight", t.text)}>{ins.title}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ins.detail}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn("h-7 px-2 text-[11px] gap-1", t.text)}
                >
                  {ins.cta}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <Button variant="outline" size="sm" className="w-full text-xs">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Conversar com a DIA
        </Button>
      </div>
    </div>
  );
}