import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Power, Pause, CalendarPlus, Tag, Download, Copy, Mail, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { id: 'activate', label: 'Ativar', icon: Power, color: 'text-emerald-600' },
  { id: 'pause', label: 'Pausar', icon: Pause, color: 'text-amber-600' },
  { id: 'extend', label: 'Estender validade', icon: CalendarPlus, color: 'text-blue-600' },
  { id: 'tag', label: 'Aplicar tag', icon: Tag, color: 'text-purple-600' },
  { id: 'export', label: 'Exportar pacote', icon: Download, color: 'text-slate-600' },
  { id: 'duplicate', label: 'Duplicar', icon: Copy, color: 'text-slate-600' },
  { id: 'notify', label: 'Notificar atribuídos', icon: Mail, color: 'text-indigo-600' },
];

export default function CouponListBulkBar({ selectedCount, onClear, onAction }) {
  if (selectedCount === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2 max-w-[95vw] overflow-x-auto animate-in slide-in-from-bottom-4">
      <span className="text-xs font-semibold whitespace-nowrap pl-2">
        {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
      </span>
      <div className="h-5 w-px bg-slate-700" />
      <div className="flex items-center gap-1">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Button
              key={a.id}
              size="sm"
              variant="ghost"
              className={cn('h-8 text-xs hover:bg-slate-700 text-white gap-1', a.color)}
              onClick={() => onAction(a.id)}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{a.label}</span>
            </Button>
          );
        })}
      </div>
      <div className="h-5 w-px bg-slate-700" />
      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-700 text-white" onClick={onClear}>
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}