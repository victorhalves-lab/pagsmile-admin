import React from 'react';
import { Gift, Pause, Repeat, Mail, UserPlus, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionsBulkBar({ selectedCount, onClear, onAction }) {
  if (selectedCount === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-full px-4 py-2 shadow-2xl flex items-center gap-2">
      <span className="text-xs font-bold">{selectedCount} selecionadas</span>
      <div className="w-px h-4 bg-white/20" />
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('discount')}>
        <Gift className="w-3 h-3 mr-1" /> Desconto
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('pause')}>
        <Pause className="w-3 h-3 mr-1" /> Pausar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('change_plan')}>
        <Repeat className="w-3 h-3 mr-1" /> Migrar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('communicate')}>
        <Mail className="w-3 h-3 mr-1" /> Comunicar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('assign_cs')}>
        <UserPlus className="w-3 h-3 mr-1" /> CS
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('export')}>
        <Download className="w-3 h-3 mr-1" /> Exportar
      </Button>
      <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/10" onClick={onClear}>
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}