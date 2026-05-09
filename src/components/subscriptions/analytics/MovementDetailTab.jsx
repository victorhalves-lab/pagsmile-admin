import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Plus, Minus, RefreshCcw, Sparkles, ChevronRight } from 'lucide-react';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

const MOVEMENTS = [
  {
    id: 'new',
    label: 'New MRR',
    desc: 'Novos clientes adquiridos',
    value: 18450,
    count: 24,
    delta: '+8',
    color: 'emerald',
    icon: Plus,
    examples: ['Acme Inc → Plano Pro', 'TechStart → Starter', 'BigCo → Enterprise'],
  },
  {
    id: 'expansion',
    label: 'Expansion MRR',
    desc: 'Upgrades, add-ons e seats adicionais',
    value: 7820,
    count: 12,
    delta: '+3',
    color: 'blue',
    icon: ArrowUp,
    examples: ['Globex Corp → Upgrade Pro→Premium (+R$ 1.200)', '4 clientes adicionaram seats'],
  },
  {
    id: 'reactivation',
    label: 'Reactivation MRR',
    desc: 'Clientes que cancelaram e voltaram',
    value: 1240,
    count: 4,
    delta: '+1',
    color: 'purple',
    icon: RefreshCcw,
    examples: ['StartupX retornou após 2 meses', '3 outros reativaram'],
  },
  {
    id: 'contraction',
    label: 'Contraction MRR',
    desc: 'Downgrades e remoção de seats',
    value: -2340,
    count: 6,
    delta: '+2',
    color: 'amber',
    icon: ArrowDown,
    examples: ['MegaCorp → Downgrade Premium→Pro (-R$ 800)', '5 outros downgrades'],
  },
  {
    id: 'churn',
    label: 'Churned MRR',
    desc: 'Cancelamentos definitivos',
    value: -4280,
    count: 9,
    delta: '+1',
    color: 'red',
    icon: Minus,
    examples: ['SmallBiz cancelou (motivo: preço)', 'TechFail cancelou (motivo: bug)', '7 outros'],
  },
];

const COLOR_BG = {
  emerald: 'bg-emerald-50 border-emerald-200',
  blue: 'bg-blue-50 border-blue-200',
  purple: 'bg-purple-50 border-purple-200',
  amber: 'bg-amber-50 border-amber-200',
  red: 'bg-red-50 border-red-200',
};
const COLOR_TXT = {
  emerald: 'text-emerald-700',
  blue: 'text-blue-700',
  purple: 'text-purple-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
};

export default function MovementDetailTab() {
  const [expanded, setExpanded] = useState(null);

  const netNew = MOVEMENTS.reduce((s, m) => s + m.value, 0);

  return (
    <div className="space-y-3">
      {/* Net New Summary */}
      <Card className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-emerald-200">
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Net New MRR este mês</p>
            <p className={cn('text-4xl font-black', netNew > 0 ? 'text-emerald-700' : 'text-red-700')}>
              {netNew > 0 ? '+' : ''}{fmtCurrency(netNew, { short: true })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              MRR líquido após todos os movimentos
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-500">Adições</p>
              <p className="text-lg font-bold text-emerald-700">+{fmtCurrency(MOVEMENTS.filter(m => m.value > 0).reduce((s, m) => s + m.value, 0), { short: true })}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-500">Perdas</p>
              <p className="text-lg font-bold text-red-700">{fmtCurrency(MOVEMENTS.filter(m => m.value < 0).reduce((s, m) => s + m.value, 0), { short: true })}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-500">Quick Ratio</p>
              <p className="text-lg font-bold text-purple-700">5.2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
            Detalhamento de movimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOVEMENTS.map(m => {
            const isExpanded = expanded === m.id;
            const Icon = m.icon;
            return (
              <div key={m.id} className={cn('rounded-lg border', COLOR_BG[m.color])}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : m.id)}
                  className="w-full p-3 flex items-center gap-3 text-left"
                >
                  <div className={cn('p-2 bg-white rounded-lg', COLOR_TXT[m.color])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{m.label}</p>
                    <p className="text-[10px] text-slate-600">{m.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-base font-black', COLOR_TXT[m.color])}>
                      {m.value > 0 ? '+' : ''}{fmtCurrency(m.value, { short: true })}
                    </p>
                    <p className="text-[10px] text-slate-500">{m.count} clientes ({m.delta} vs mês passado)</p>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 text-slate-400 transition-transform', isExpanded && 'rotate-90')} />
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-white/50">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 mt-2">Exemplos</p>
                    <ul className="space-y-1">
                      {m.examples.map((ex, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-slate-400">•</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" variant="outline" className="h-7 mt-3 text-xs gap-1">
                      Ver todos os {m.count} clientes <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}