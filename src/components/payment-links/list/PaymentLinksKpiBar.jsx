import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Trophy, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

export default function PaymentLinksKpiBar({ links = [], onFilterClick }) {
  // Links com problema: ativos sem venda há 7d ou queda forte de conversão
  const problemLinks = links.filter((l) => {
    if (l.status !== 'active') return false;
    const noSales = (l.usage_count || 0) === 0 && (l.views_count || 0) > 30;
    return noSales;
  }).length;

  // Top performer
  const topLink = [...links]
    .filter((l) => l.status === 'active')
    .sort((a, b) => (b.total_collected || 0) - (a.total_collected || 0))[0];

  // Receita projetada do mês — baseado em ritmo dos últimos 7d (mock simples)
  const totalCollected = links.reduce((s, l) => s + (l.total_collected || 0), 0);
  const projectedMonth = totalCollected * 1.42; // mock — ritmo projetado

  // PIX vs Cartão (mock — apenas se há transações)
  const pixShare = 64; // mock
  const cardShare = 36;

  // Ticket médio
  const totalSales = links.reduce((s, l) => s + (l.usage_count || 0), 0);
  const avgTicket = totalSales > 0 ? totalCollected / totalSales : 0;

  const cards = [
    {
      key: 'problem',
      title: 'Links com problema',
      value: problemLinks,
      sub: problemLinks > 0 ? 'Sem venda há 7+ dias' : 'Tudo saudável',
      icon: AlertTriangle,
      color: problemLinks > 0 ? 'red' : 'slate',
      filter: 'problem',
    },
    {
      key: 'top',
      title: 'Top performer (mês)',
      value: topLink?.name || '—',
      sub: topLink ? `${formatBRL(topLink.total_collected)}` : 'Nenhum link ativo',
      icon: Trophy,
      color: 'amber',
      isText: true,
    },
    {
      key: 'forecast',
      title: 'Receita projetada (mês)',
      value: formatBRL(projectedMonth),
      sub: 'Ritmo dos últimos 7d',
      icon: TrendingUp,
      color: 'emerald',
      isText: true,
    },
    {
      key: 'mix',
      title: 'PIX vs Cartão',
      value: `${pixShare}% / ${cardShare}%`,
      sub: 'Decomposição do total',
      icon: Wallet,
      color: 'blue',
      isText: true,
    },
    {
      key: 'ticket',
      title: 'Ticket médio',
      value: formatBRL(avgTicket),
      sub: `${totalSales} vendas no total`,
      icon: Receipt,
      color: 'purple',
      isText: true,
    },
  ];

  const colorMap = {
    red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900/20 dark:border-slate-800',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card
            key={c.key}
            onClick={() => c.filter && onFilterClick?.(c.filter)}
            className={cn(
              'p-3 border transition-all',
              colorMap[c.color],
              c.filter && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wide font-semibold opacity-80">{c.title}</span>
              <Icon className="w-3.5 h-3.5 opacity-70" />
            </div>
            <p className={cn('font-bold truncate', c.isText ? 'text-base' : 'text-2xl')}>{c.value}</p>
            <p className="text-[11px] opacity-70 truncate mt-0.5">{c.sub}</p>
            {c.filter && problemLinks > 0 && c.key === 'problem' && (
              <Badge className="bg-red-500 text-white text-[9px] mt-1">Clique para filtrar</Badge>
            )}
          </Card>
        );
      })}
    </div>
  );
}