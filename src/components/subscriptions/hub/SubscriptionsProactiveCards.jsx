import React from 'react';
import { Calendar, CreditCard, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

const cards = [
  { id: 'upcoming', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', title: 'Próximas 24h', value: '38 cobranças', subtitle: fmtCurrency(12450), action: 'Ver lista' },
  { id: 'cards_expiring', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', title: 'Cartões expirando', value: '12 em 30d', subtitle: 'Acionar Account Updater', action: 'Atualizar' },
  { id: 'at_risk', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200', title: 'Em risco IA', value: '8 assinaturas', subtitle: `${fmtCurrency(4500)} MRR`, action: 'Mitigar' },
  { id: 'pipeline', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', title: 'Pipeline upgrade', value: '15 candidatas', subtitle: `+${fmtCurrency(3200)}/mês potencial`, action: 'Ofertar' },
];

export default function SubscriptionsProactiveCards({ onAction }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.id} className={cn('border-2', c.bg)}>
            <CardContent className="p-3">
              <Icon className={cn('w-4 h-4 mb-2', c.color)} />
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{c.title}</p>
              <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">{c.value}</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">{c.subtitle}</p>
              <Button variant="ghost" size="sm" className="h-6 px-1.5 mt-1 text-[10px] font-bold" onClick={() => onAction?.(c.id)}>
                {c.action} <ArrowRight className="w-3 h-3 ml-0.5" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}