import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * Top 5 Alavancas de Receita [#7].
 * Yuno tem versão (smart routing recommendations). Demais não.
 * Cada card: oportunidade + R$ projetado + CTA.
 */
export default function TopRevenueLevers({ levers = [] }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    {
      id: 'route_visa',
      title: 'Rotear Visa débito → Stone',
      desc: 'Stone tem 4.3pp mais aprovação que Getnet em Visa débito',
      impact: 8420,
      type: 'orchestration',
      cta: 'Configurar roteamento',
      to: createPageUrl('AdminIntOrchestration'),
    },
    {
      id: 'recover_3ds',
      title: 'Ativar 3DS soft-decline retry',
      desc: '127 transações soft-declined recuperáveis nos últimos 7 dias',
      impact: 5340,
      type: 'recovery',
      cta: 'Ativar regra',
      to: createPageUrl('RecoveryAgent'),
    },
    {
      id: 'pix_discount',
      title: 'Oferecer 2% desconto no PIX',
      desc: 'Migrar 15% do volume cartão → PIX reduz custos em ~1.8%',
      impact: 3870,
      type: 'pricing',
      cta: 'Configurar checkout',
      to: createPageUrl('CheckoutBuilder'),
    },
    {
      id: 'recurring_card_update',
      title: 'Account Updater nas recorrências',
      desc: '47 cartões expirando em 30 dias — evitar churn de R$ 12.4k',
      impact: 12480,
      type: 'churn',
      cta: 'Configurar',
      to: createPageUrl('Subscriptions'),
    },
    {
      id: 'cb_alert',
      title: 'Conectar Ethoca/Verifi',
      desc: 'Reduzir 30% dos chargebacks do mês via pré-disputa',
      impact: 4250,
      type: 'risk',
      cta: 'Conectar',
      to: createPageUrl('PreChargebacks'),
    },
  ];

  const list = levers.length > 0 ? levers : defaults;
  const total = list.reduce((sum, l) => sum + (l.impact || 0), 0);

  const typeColors = {
    orchestration: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    recovery:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pricing:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    churn:         'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    risk:          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 5 alavancas de receita</h3>
              <p className="text-[11px] text-slate-500">
                Potencial total: <span className="font-bold text-emerald-600">{formatCurrency(total)}/mês</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {list.map((lever, idx) => (
            <div
              key={lever.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#2bc196] hover:shadow-sm transition-all group"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{lever.title}</p>
                  <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider', typeColors[lever.type])}>
                    {lever.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{lever.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Impacto/mês</p>
                <p className="text-sm font-bold text-emerald-600 inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +{formatCurrency(lever.impact)}
                </p>
              </div>
              <Link to={lever.to}>
                <Button size="sm" variant="outline" className="h-8 text-xs flex-shrink-0">
                  {lever.cta}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}