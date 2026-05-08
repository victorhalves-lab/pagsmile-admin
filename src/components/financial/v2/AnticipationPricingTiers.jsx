import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/**
 * Tabela de tiers de antecipação visível para transparency.
 */
export default function AnticipationPricingTiers({ currentRate = 1.99, monthVolume = 18500 }) {
  const tiers = [
    { range: '< R$ 10.000', rate: 1.99, min: 0, max: 10000 },
    { range: 'R$ 10k – 50k', rate: 1.79, min: 10000, max: 50000 },
    { range: 'R$ 50k – 200k', rate: 1.59, min: 50000, max: 200000 },
    { range: '> R$ 200k (VIP)', rate: 1.49, min: 200000, max: Infinity, vip: true },
  ];

  const currentTier = tiers.find(t => monthVolume >= t.min && monthVolume < t.max) || tiers[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-500" />
          Tabela de Taxas de Antecipação
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Volume antecipado este mês: <strong>{formatCurrency(monthVolume)}</strong>
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {tiers.map((tier) => {
            const isCurrent = tier.range === currentTier.range;
            return (
              <div
                key={tier.range}
                className={cn(
                  'flex items-center justify-between px-6 py-3',
                  isCurrent && 'bg-emerald-50'
                )}
              >
                <div className="flex items-center gap-2">
                  {tier.vip && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                  <span className={cn('text-sm', isCurrent ? 'font-semibold text-emerald-700' : 'text-slate-600')}>
                    {tier.range}
                  </span>
                  {isCurrent && (
                    <Badge className="bg-emerald-600 text-white text-[10px] h-5">Sua faixa</Badge>
                  )}
                </div>
                <span className={cn('text-sm font-bold', isCurrent ? 'text-emerald-700' : 'text-slate-700')}>
                  {tier.rate}% a.m.
                </span>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-3 bg-slate-50 text-xs text-slate-500 border-t">
          💡 Antecipe mais para subir de faixa e pagar menos. Próxima faixa em{' '}
          <strong className="text-slate-700">
            {formatCurrency(Math.max(0, (currentTier.max === Infinity ? 0 : currentTier.max) - monthVolume))}
          </strong>
        </div>
      </CardContent>
    </Card>
  );
}