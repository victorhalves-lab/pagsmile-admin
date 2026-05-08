import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Pause, Play, Tag, TicketPercent, Download, Share2, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function PaymentLinksBulkBar({ selectedCount = 0, onClear, onAction }) {
  if (selectedCount === 0) return null;

  const handle = (action, label) => {
    onAction?.(action);
    toast.success(`${label} aplicado em ${selectedCount} link(s)`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl px-3 py-2 flex items-center gap-2 border border-slate-700"
      >
        <span className="text-xs px-2 font-semibold">
          {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
        </span>
        <div className="h-5 w-px bg-slate-700" />

        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('duplicate', 'Duplicar')}>
          <Copy className="w-3.5 h-3.5 mr-1" /> Duplicar
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('pause', 'Pausar')}>
          <Pause className="w-3.5 h-3.5 mr-1" /> Pausar
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('activate', 'Ativar')}>
          <Play className="w-3.5 h-3.5 mr-1" /> Ativar
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('tag', 'Tag adicionada')}>
          <Tag className="w-3.5 h-3.5 mr-1" /> Tag
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('coupon', 'Cupom aplicado')}>
          <TicketPercent className="w-3.5 h-3.5 mr-1" /> Cupom
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('export', 'Export gerado')}>
          <Download className="w-3.5 h-3.5 mr-1" /> Export
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" onClick={() => handle('share_bio', 'Vitrine bio gerada')}>
          <Share2 className="w-3.5 h-3.5 mr-1" /> Bio Linktree
        </Button>

        <div className="h-5 w-px bg-slate-700" />
        <Button size="sm" variant="ghost" className="h-8 text-red-300 hover:bg-red-500/20" onClick={() => handle('delete', 'Exclusão')}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={onClear}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}