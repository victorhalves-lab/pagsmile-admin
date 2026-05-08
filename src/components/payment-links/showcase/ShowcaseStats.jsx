import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

export default function ShowcaseStats({ stats }) {
  const items = [
    {
      label: 'Visitantes (30d)',
      value: stats?.visitors || '2.847',
      icon: Eye,
      color: 'blue',
    },
    {
      label: 'Vendas (30d)',
      value: stats?.sales || 142,
      icon: ShoppingBag,
      color: 'emerald',
    },
    {
      label: 'Receita (30d)',
      value: formatBRL(stats?.revenue || 24500),
      icon: TrendingUp,
      color: 'purple',
    },
    {
      label: 'Conv. da vitrine',
      value: `${stats?.conversion || '4.9'}%`,
      icon: Users,
      color: 'amber',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className={`p-3 border ${colorMap[item.color]}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-semibold opacity-80">{item.label}</span>
              <Icon className="w-3.5 h-3.5 opacity-70" />
            </div>
            <p className="text-xl font-bold">{item.value}</p>
          </Card>
        );
      })}
    </div>
  );
}