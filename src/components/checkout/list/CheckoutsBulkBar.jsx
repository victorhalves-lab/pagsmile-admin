import React from 'react';
import { Button } from '@/components/ui/button';
import { Power, PowerOff, Archive, X, Copy, FileJson } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Barra de bulk actions para múltiplos checkouts selecionados.
 */
export default function CheckoutsBulkBar({ count, onClear }) {
  if (!count) return null;

  const actions = [
    { icon: Power, label: 'Ativar', onClick: () => toast.success(`${count} checkouts ativados`) },
    { icon: PowerOff, label: 'Desativar', onClick: () => toast.success(`${count} checkouts desativados`) },
    { icon: Copy, label: 'Duplicar', onClick: () => toast.success(`${count} checkouts duplicados`) },
    { icon: Archive, label: 'Arquivar', onClick: () => toast.success(`${count} checkouts arquivados`) },
    { icon: FileJson, label: 'Exportar', onClick: () => toast.success(`${count} configs exportadas`) },
  ];

  return (
    <div className="sticky top-2 z-30 bg-slate-900 text-white rounded-xl shadow-lg p-3 flex items-center gap-2">
      <span className="text-sm font-medium px-2">{count} selecionado{count > 1 ? 's' : ''}</span>
      <div className="h-5 w-px bg-white/30" />
      <div className="flex gap-1 flex-wrap">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <Button key={i} size="sm" variant="ghost" className="text-white hover:bg-white/10 gap-1.5" onClick={a.onClick}>
              <Icon className="w-3.5 h-3.5" /> {a.label}
            </Button>
          );
        })}
      </div>
      <Button size="sm" variant="ghost" className="ml-auto text-white hover:bg-white/10" onClick={onClear}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}