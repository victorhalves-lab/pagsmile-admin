import React from 'react';
import { Sparkles, TrendingDown, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Smart insights automáticos + benchmark de mercado.
 * Substitui parcialmente os 4 KPIs genéricos por alertas acionáveis.
 */
export default function SmartInsightsBar() {
  const insights = [
    {
      tone: 'red',
      icon: TrendingDown,
      title: 'Conversão mobile despencou 8pp esta semana',
      detail: 'Mobile: 7.2% (vs 15.4% desktop). Algo mudou no layout mobile?',
      action: 'Investigar no Builder',
      cta: () => toast.info('Abrindo Builder no modo mobile...'),
    },
    {
      tone: 'emerald',
      icon: Target,
      title: 'Você está acima do benchmark SaaS BR',
      detail: 'Sua conversão 12.4% · Média segmento 8.5% · Top 10% 18%',
      action: 'Ver detalhes',
      cta: () => toast.info('Abrindo benchmark detalhado...'),
    },
    {
      tone: 'amber',
      icon: AlertTriangle,
      title: 'Quarta-feira teve queda anômala',
      detail: 'IA detectou queda de 3pp dia 06/05. Possível causa: deploy às 14h.',
      action: 'Ver mudanças',
      cta: () => toast.info('Abrindo histórico de versões...'),
    },
  ];

  const tones = {
    red: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: 'text-red-600' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600' },
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-emerald-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h4 className="text-sm font-semibold">Smart Insights — IA detectou</h4>
        <span className="text-[9px] uppercase tracking-wide text-purple-700 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full font-bold ml-auto">
          Acionável
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((ins, i) => {
          const t = tones[ins.tone];
          const Icon = ins.icon;
          return (
            <div key={i} className={cn("rounded-lg border p-3", t.bg, t.border)}>
              <div className="flex items-start gap-2 mb-2">
                <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", t.icon)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight">{ins.title}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-tight">{ins.detail}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[11px] h-6 mt-1" onClick={ins.cta}>
                {ins.action} →
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}