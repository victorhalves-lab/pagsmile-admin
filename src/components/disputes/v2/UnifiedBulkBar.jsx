import React from 'react';
import { X, Undo2, Ban, FileText, UserPlus, Download, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnifiedBulkBar({ selectedCount, onClear, onAction }) {
  if (selectedCount === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-full px-4 py-2 shadow-2xl flex items-center gap-2">
      <span className="text-xs font-bold">{selectedCount} selecionadas</span>
      <div className="w-px h-4 bg-white/20" />
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('refund')}>
        <Undo2 className="w-3 h-3 mr-1" /> Reembolsar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('ignore')}>
        <Ban className="w-3 h-3 mr-1" /> Ignorar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('contest')}>
        <FileText className="w-3 h-3 mr-1" /> Contestar
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('assign')}>
        <UserPlus className="w-3 h-3 mr-1" /> Atribuir
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-white hover:bg-white/10" onClick={() => onAction('tag')}>
        <Tag className="w-3 h-3 mr-1" /> Tag
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