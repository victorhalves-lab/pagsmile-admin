import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, TrendingUp, Users, DollarSign, Target, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

function Kpi({ icon: Icon, color, label, value, sub, trend }) {
  const colors = {
    emerald: 'from-emerald-50 to-emerald-100/40 border-emerald-200 text-emerald-700',
    blue: 'from-blue-50 to-blue-100/40 border-blue-200 text-blue-700',
    purple: 'from-purple-50 to-purple-100/40 border-purple-200 text-purple-700',
    orange: 'from-orange-50 to-orange-100/40 border-orange-200 text-orange-700',
    pink: 'from-pink-50 to-pink-100/40 border-pink-200 text-pink-700',
    yellow: 'from-yellow-50 to-yellow-100/40 border-yellow-200 text-yellow-700',
  };
  return (
    <Card className={cn('p-4 bg-gradient-to-br border', colors[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-4 h-4 opacity-70" />
        {trend && <span className="text-[10px] font-bold">↑ {trend}</span>}
      </div>
      <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-[11px] mt-0.5 opacity-70">{sub}</p>}
    </Card>
  );
}

export default function EngagementHubKpis() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Kpi icon={Mail} color="blue" label="Campanhas Ativas" value="8" sub="3 disparando agora" trend="2 vs sem. ant." />
      <Kpi icon={Users} color="purple" label="Audiência Total" value="14.2k" sub="alcançável" trend="8.5%" />
      <Kpi icon={Target} color="emerald" label="Open Rate Médio" value="42.3%" sub="vs 23% benchmark" trend="3.1pp" />
      <Kpi icon={TrendingUp} color="orange" label="Conversão" value="6.8%" sub="campanhas → vendas" trend="1.2pp" />
      <Kpi icon={DollarSign} color="emerald" label="Revenue Recuperado" value={formatCurrency(48900)} sub="últimos 30d" trend="22%" />
      <Kpi icon={Heart} color="pink" label="NPS Score" value="62" sub="Promotor 71% · Detrator 9%" trend="5 pts" />
    </div>
  );
}