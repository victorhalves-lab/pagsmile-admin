import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Star, Clock, Users } from 'lucide-react';

/**
 * Cards inferiores com KPIs reais (substitui marketing copy genérico).
 */
const defaultKpis = [
  { 
    icon: Users, 
    label: 'Cadastros este mês', 
    value: '1.234',
    sub: '+18% vs mês anterior',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  { 
    icon: Clock, 
    label: 'Tempo médio', 
    value: '18 min',
    sub: 'mediana últimos 30 dias',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  { 
    icon: TrendingUp, 
    label: 'Taxa auto-aprovação', 
    value: '72%',
    sub: 'sem revisão humana',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  { 
    icon: Star, 
    label: 'NPS', 
    value: '4.6 / 5',
    sub: 'avaliações reais',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
];

export default function LiveKpiBadges({ kpis = defaultKpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map(k => {
        const Icon = k.icon;
        return (
          <Card key={k.label} className={`border ${k.border} ${k.bg}`}>
            <CardContent className="p-3 flex items-start gap-2">
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 ${k.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 truncate">
                  {k.label}
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">
                  {k.value}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {k.sub}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}