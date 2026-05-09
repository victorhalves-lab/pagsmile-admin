import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * NRR + GRR + Quick Ratio — métricas SaaS-grade essenciais
 * NRR (Net Revenue Retention) > 110% = world-class
 * GRR (Gross Revenue Retention) > 90% = saudável
 * Quick Ratio > 4 = crescimento eficiente
 */
const CARDS = [
  {
    key: 'nrr',
    label: 'Net Revenue Retention',
    value: '118%',
    target: '> 110%',
    status: 'excellent',
    icon: TrendingUp,
    color: 'emerald',
    desc: 'Receita do mesmo grupo de clientes 12m depois (inclui expansão)',
    benchmark: 'Top SaaS: 130% • Mediana: 100%',
    interpretation: 'Excelente — sua base cresce mesmo sem novos clientes',
  },
  {
    key: 'grr',
    label: 'Gross Revenue Retention',
    value: '94%',
    target: '> 90%',
    status: 'good',
    icon: Shield,
    color: 'blue',
    desc: 'Retenção pura, sem contar upsells (perde apenas churn + downgrade)',
    benchmark: 'Top SaaS: 95% • Mediana: 85%',
    interpretation: 'Saudável — perda controlada de receita base',
  },
  {
    key: 'quick',
    label: 'Quick Ratio',
    value: '5.2',
    target: '> 4',
    status: 'excellent',
    icon: Zap,
    color: 'purple',
    desc: '(New + Expansion) ÷ (Contraction + Churn) — eficiência do crescimento',
    benchmark: 'Excellent: > 4 • Healthy: > 2',
    interpretation: 'Crescimento muito eficiente — para cada R$1 perdido, ganha R$5.20',
  },
];

const STATUS_STYLES = {
  excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  good: 'bg-blue-100 text-blue-700 border-blue-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const ICON_BG = {
  emerald: 'bg-gradient-to-br from-emerald-500 to-green-600',
  blue: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  purple: 'bg-gradient-to-br from-purple-500 to-indigo-600',
};

export default function RetentionCardsRow() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CARDS.map(c => (
          <Card key={c.key} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', ICON_BG[c.color])}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <Badge className={cn('text-[10px]', STATUS_STYLES[c.status])}>
                  {c.status === 'excellent' ? '★ World-class' : c.status === 'good' ? '✓ Saudável' : '⚠ Atenção'}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{c.label}</p>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{c.desc}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{c.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">Meta: {c.target}</p>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 mb-0.5">{c.benchmark}</p>
                <p className="text-[11px] font-semibold text-emerald-600">{c.interpretation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}