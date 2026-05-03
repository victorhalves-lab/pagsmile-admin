import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0);
const fmtBig = (v) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)} M`;
  if (Math.abs(v) >= 1_000) return `R$ ${(v / 1_000).toFixed(0)} K`;
  return fmt(v);
};

/**
 * KPIs Hero da Visão de Rentabilidade.
 * Mostra a equação: Receita/Tx − Custo Var/Tx − Custo Fix/Tx = Margem/Tx
 */
export default function HeroKPIs({ revenuePerTx, varCostPerTx, fixCostPerTx, monthlyVolume }) {
  const marginPerTx = revenuePerTx - varCostPerTx - fixCostPerTx;
  const marginPercent = revenuePerTx > 0 ? (marginPerTx / revenuePerTx) * 100 : 0;
  const monthlyMargin = marginPerTx * monthlyVolume;
  const isHealthy = marginPercent >= 15;

  const cards = [
    { label: 'Receita / Tx', value: fmt(revenuePerTx), icon: DollarSign, color: 'emerald', sub: 'MDR + Antec. + Fees' },
    { label: 'Custo Variável / Tx', value: `− ${fmt(varCostPerTx)}`, icon: TrendingDown, color: 'amber', sub: 'Parceiros + Bandeiras' },
    { label: 'Custo Fixo / Tx', value: `− ${fmt(fixCostPerTx)}`, icon: PieChart, color: 'blue', sub: 'Pessoas + Overhead' },
    {
      label: 'MARGEM / Tx',
      value: fmt(marginPerTx),
      icon: Target,
      color: marginPerTx >= 0 ? 'green' : 'red',
      sub: `${marginPercent.toFixed(1)}% sobre receita`,
      highlight: true,
    },
  ];

  const colorMap = {
    emerald: 'from-emerald-50 to-white border-emerald-200 text-emerald-700',
    amber: 'from-amber-50 to-white border-amber-200 text-amber-700',
    blue: 'from-blue-50 to-white border-blue-200 text-blue-700',
    green: 'from-green-100 to-emerald-50 border-green-300 text-green-800',
    red: 'from-red-50 to-white border-red-300 text-red-700',
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className={cn('bg-gradient-to-br border-2', colorMap[c.color], c.highlight && 'ring-2 ring-offset-2 ring-green-300 shadow-lg')}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{c.label}</span>
                <c.icon className="w-4 h-4 opacity-70" />
              </div>
              <p className="text-3xl font-bold">{c.value}</p>
              <p className="text-xs mt-1 opacity-70">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={cn('border-2', isHealthy ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-emerald-300' : 'bg-gradient-to-r from-amber-50 to-red-50 border-amber-300')}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isHealthy ? <TrendingUp className="w-6 h-6 text-emerald-600" /> : <TrendingDown className="w-6 h-6 text-amber-600" />}
            <div>
              <p className="text-xs text-slate-500 uppercase">Margem Líquida Mensal</p>
              <p className={cn('text-2xl font-bold', isHealthy ? 'text-emerald-700' : 'text-amber-700')}>{fmtBig(monthlyMargin)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase">Sobre Volume Mensal</p>
            <p className="text-xl font-semibold text-slate-700">
              {new Intl.NumberFormat('pt-BR').format(monthlyVolume)} tx
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}