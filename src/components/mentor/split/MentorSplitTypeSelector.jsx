import React from 'react';
import { Percent, DollarSign, Layers, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Seletor visual dos 4 tipos de regra Mentor (F2791).
 * % fixo · valor fixo · escalonado · condicional
 */
const TYPES = [
  {
    key: 'percentage',
    label: 'Percentual',
    description: 'Cada beneficiário recebe um % do valor',
    icon: Percent,
    color: 'border-blue-300 bg-blue-50 text-blue-700',
  },
  {
    key: 'fixed',
    label: 'Valor Fixo',
    description: 'Cada beneficiário recebe um R$ fixo',
    icon: DollarSign,
    color: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  },
  {
    key: 'scaled',
    label: 'Escalonado',
    description: 'Faixas de valor com % distintos',
    icon: Layers,
    color: 'border-purple-300 bg-purple-50 text-purple-700',
    badge: 'Mentor',
  },
  {
    key: 'conditional',
    label: 'Condicional',
    description: 'Por bandeira / tipo / valor',
    icon: GitBranch,
    color: 'border-amber-300 bg-amber-50 text-amber-700',
    badge: 'Mentor',
  },
];

export default function MentorSplitTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {TYPES.map((t) => {
        const Icon = t.icon;
        const selected = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cn(
              'relative text-left p-3 rounded-lg border-2 transition-all',
              selected
                ? `${t.color} shadow-sm ring-2 ring-offset-1 ring-current`
                : 'border-slate-200 bg-white hover:border-slate-300'
            )}
          >
            {t.badge && (
              <span className="absolute top-1.5 right-1.5 text-[8px] font-bold uppercase bg-violet-600 text-white px-1.5 py-0.5 rounded">
                {t.badge}
              </span>
            )}
            <Icon className={cn('w-5 h-5 mb-1.5', selected ? '' : 'text-slate-500')} />
            <p className={cn('text-sm font-bold', selected ? '' : 'text-slate-800')}>{t.label}</p>
            <p className={cn('text-[10px] mt-0.5', selected ? 'opacity-80' : 'text-slate-500')}>
              {t.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}