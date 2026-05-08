import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Sparkles, AlertCircle } from 'lucide-react';

// Insights bar para FinancialStatement — Brex inspired
export default function StatementInsightsBar({ entries = [] }) {
  // Mock-driven insights for now
  const insights = [
    {
      icon: TrendingUp,
      tone: 'amber',
      label: 'Taxas',
      value: '+12% vs mês passado',
      detail: 'Volume de débito subiu — MDR médio aumentou de 2.1% para 2.4%',
    },
    {
      icon: TrendingDown,
      tone: 'emerald',
      label: 'Estornos',
      value: '-34% vs mês passado',
      detail: 'Refunds caíram para 0.8% do GMV (era 1.2%)',
    },
    {
      icon: AlertCircle,
      tone: 'blue',
      label: 'PIX D+0',
      value: 'R$ 142k/dia',
      detail: 'PIX representa 58% do GMV — liquidez instantânea acima da média',
    },
  ];

  const toneStyle = {
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Insights do extrato</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {insights.map((ins, i) => (
            <div key={i} className={`p-3 rounded-lg border ${toneStyle[ins.tone]}`}>
              <div className="flex items-center gap-2 mb-1">
                <ins.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{ins.label}</span>
              </div>
              <p className="text-sm font-bold mb-1">{ins.value}</p>
              <p className="text-[11px] opacity-90 leading-snug">{ins.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}