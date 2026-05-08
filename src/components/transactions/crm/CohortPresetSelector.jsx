import React from 'react';
import { Sparkles, Star, AlertTriangle, RotateCw, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Seletor de coortes pré-definidas.
 */
export default function CohortPresetSelector({ active, onChange }) {
  const presets = [
    { id: 'first_purchase', label: 'Primeira compra do mês', icon: UserPlus, description: 'Novos clientes em maio/2026', count: 432 },
    { id: 'returned_90d',   label: 'Retornaram após 90d',    icon: RotateCw,  description: 'Clientes inativos que voltaram', count: 87 },
    { id: 'vip',            label: 'VIPs',                    icon: Star,      description: 'Top 10% em LTV',                count: 156 },
    { id: 'at_risk',        label: 'Em risco',                icon: AlertTriangle, description: 'Sem compras há 60+ dias',     count: 218 },
    { id: 'high_intent',    label: 'Alta intenção',           icon: Sparkles,  description: '3+ checkouts iniciados / mês',  count: 94 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {presets.map(p => {
        const Icon = p.icon;
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all",
              isActive
                ? "border-[#2bc196] bg-[#2bc196]/5 ring-2 ring-[#2bc196]/30"
                : "border-slate-200 dark:border-slate-700 hover:border-[#2bc196]/40 bg-white dark:bg-slate-900"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn("w-4 h-4", isActive ? "text-[#2bc196]" : "text-slate-400")} />
              <span className="text-xs font-semibold">{p.label}</span>
            </div>
            <p className="text-lg font-bold">{p.count}</p>
            <p className="text-[10px] text-slate-500 truncate">{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}