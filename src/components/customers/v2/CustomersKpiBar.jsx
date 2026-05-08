import React from 'react';
import { Users, UserPlus, TrendingUp, DollarSign, Target, Clock, Crown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

function KpiCell({ icon: Icon, label, value, change, changeLabel, color = 'blue', isCurrency = false, sub }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center border', colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
        {change !== undefined && (
          <span className={cn(
            'text-[11px] font-bold px-1.5 py-0.5 rounded-full',
            positive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          )}>
            {positive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-0.5">
        {isCurrency ? formatCurrency(value) : value}
      </p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      {changeLabel && <p className="text-[10px] text-slate-400 mt-0.5">{changeLabel}</p>}
    </div>
  );
}

export default function CustomersKpiBar({ customers = [] }) {
  const total = customers.length;
  const vips = customers.filter(c => c.segment === 'vip').length;
  const recurring = customers.filter(c => c.segment === 'recurring' || c.segment === 'vip').length;
  const totalLtv = customers.reduce((s, c) => s + (c.total_spent || 0), 0);
  const avgLtv = total > 0 ? totalLtv / total : 0;
  const repeatRate = total > 0 ? (customers.filter(c => (c.total_purchases || 0) > 1).length / total) * 100 : 0;
  
  // Pareto: top 20% generate X% of revenue
  const sorted = [...customers].sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0));
  const top20Count = Math.max(1, Math.ceil(total * 0.2));
  const top20Revenue = sorted.slice(0, top20Count).reduce((s, c) => s + (c.total_spent || 0), 0);
  const paretoPercent = totalLtv > 0 ? (top20Revenue / totalLtv) * 100 : 0;

  // Health: % active in last 30d
  const active30d = customers.filter(c => {
    if (!c.last_purchase_date) return false;
    const d = new Date(c.last_purchase_date);
    const ago = new Date(); ago.setDate(ago.getDate() - 30);
    return d >= ago;
  }).length;
  const healthPct = total > 0 ? (active30d / total) * 100 : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCell icon={Users} label="Total" value={total} change={8.5} color="blue" sub="Base de clientes" />
      <KpiCell icon={UserPlus} label="Growth Rate" value={`+12.3%`} change={2.1} color="emerald" sub="vs mês anterior" />
      <KpiCell icon={Activity} label="Churn Rate" value={`3.2%`} change={-0.8} color="orange" sub="últimos 30d" />
      <KpiCell icon={DollarSign} label="LTV Médio" value={avgLtv} isCurrency change={3.8} color="purple" />
      <KpiCell icon={Target} label="Repeat Rate" value={`${repeatRate.toFixed(1)}%`} change={1.5} color="indigo" sub="2+ compras" />
      <KpiCell icon={Crown} label="Pareto 80/20" value={`${paretoPercent.toFixed(0)}%`} color="yellow" sub={`Top 20% = ${paretoPercent.toFixed(0)}% receita`} />
    </div>
  );
}