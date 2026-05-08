import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Table2, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  { key: 'executive', label: 'Executivo', icon: LayoutDashboard, hint: 'Só KPIs e gráficos' },
  { key: 'operational', label: 'Operacional', icon: Table2, hint: 'Tabela detalhada' },
  { key: 'planning', label: 'Planejamento', icon: CalendarRange, hint: 'Calendário + forecast' },
];

/**
 * Toggle 3 modos de visualização da agenda.
 */
export default function ReceivablesViewModes({ value = 'planning', onChange }) {
  return (
    <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
      {modes.map((m) => {
        const Icon = m.icon;
        const active = value === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange?.(m.key)}
            title={m.hint}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              active
                ? 'bg-white shadow text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}