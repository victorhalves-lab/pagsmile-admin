import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Smartphone, Globe, Link2, Store, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Performance por Canal [#18] — paridade Adyen.
 * E-commerce, app, link de pagamento, marketplace, POS.
 */
export default function ChannelBreakdownCard({ channels = [] }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { id: 'ecommerce',   label: 'E-commerce',     volume: 485200, approval: 88.4, icon: Globe,      color: 'blue' },
    { id: 'app',         label: 'App',            volume: 247800, approval: 92.1, icon: Smartphone, color: 'violet' },
    { id: 'links',       label: 'Links pagto',    volume: 142500, approval: 86.7, icon: Link2,      color: 'emerald' },
    { id: 'marketplace', label: 'Marketplace',    volume: 87420,  approval: 84.2, icon: ShoppingBag, color: 'amber' },
    { id: 'pos',         label: 'POS (físico)',   volume: 23180,  approval: 95.3, icon: Store,      color: 'teal' },
  ];

  const list = channels.length > 0 ? channels : defaults;
  const total = list.reduce((sum, c) => sum + (c.volume || 0), 0);

  const colorMap = {
    blue:    { text: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30',       bar: 'bg-blue-500' },
    violet:  { text: 'text-violet-600',  bg: 'bg-violet-100 dark:bg-violet-900/30',   bar: 'bg-violet-500' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', bar: 'bg-emerald-500' },
    amber:   { text: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30',     bar: 'bg-amber-500' },
    teal:    { text: 'text-teal-600',    bg: 'bg-teal-100 dark:bg-teal-900/30',       bar: 'bg-teal-500' },
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Performance por canal</h3>
            <p className="text-[10px] text-slate-500">Volume e aprovação por origem</p>
          </div>
        </div>

        <div className="space-y-2">
          {list.map((ch) => {
            const Icon = ch.icon;
            const c = colorMap[ch.color] || colorMap.blue;
            const sharePct = (ch.volume / total) * 100;
            return (
              <Link
                key={ch.id}
                to={`${createPageUrl('Transactions')}?channel=${ch.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#2bc196] transition-all group"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
                  <Icon className={cn('w-4 h-4', c.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{ch.label}</p>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(ch.volume)}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn('h-full', c.bar)} style={{ width: `${sharePct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-slate-500">{sharePct.toFixed(1)}% do total</span>
                    <span className={cn('text-[10px] font-bold', ch.approval >= 88 ? 'text-emerald-600' : ch.approval >= 84 ? 'text-amber-600' : 'text-red-600')}>
                      {ch.approval.toFixed(1)}% aprovação
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2bc196] flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}