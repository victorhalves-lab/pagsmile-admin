import React from 'react';
import { Tag, Mail, Download, Ban, Crown, Users, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CustomersBulkBar({ selectedIds = [], onClear }) {
  const count = selectedIds.length;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 px-4 py-3 flex items-center gap-2 max-w-3xl"
        >
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <div className="w-7 h-7 rounded-full bg-[#2bc196] flex items-center justify-center text-xs font-bold">
              {count}
            </div>
            <span className="text-sm font-medium">selecionado{count > 1 ? 's' : ''}</span>
          </div>

          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`Tag adicionada para ${count} clientes`)}>
            <Tag className="w-3.5 h-3.5" /> Tag
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`Email enviado para ${count} clientes`)}>
            <Mail className="w-3.5 h-3.5" /> Email
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`WhatsApp enviado para ${count} clientes`)}>
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`${count} clientes promovidos a VIP`)}>
            <Crown className="w-3.5 h-3.5" /> VIP
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`${count} clientes adicionados a lista`)}>
            <Users className="w-3.5 h-3.5" /> Lista
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-slate-800 gap-1.5"
            onClick={() => toast.success(`Export de ${count} clientes iniciado`)}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-1.5"
            onClick={() => toast.warning(`${count} clientes bloqueados`)}>
            <Ban className="w-3.5 h-3.5" /> Block
          </Button>

          <button onClick={onClear} className="ml-2 p-1 hover:bg-slate-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}