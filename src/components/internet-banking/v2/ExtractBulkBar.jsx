import React from 'react';
import { Download, X, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Bulk action bar para o Extract (não-intrusivo, aparece quando há seleção).
 * Esta é uma versão visual — backend é mock.
 */
export default function ExtractBulkBar({ count = 3, onClear }) {
  if (count === 0) return null;

  return (
    <div className="sticky top-2 z-20 bg-gradient-to-r from-[#2bc196] to-emerald-600 text-white rounded-xl shadow-xl p-3 flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
          {count}
        </div>
        <span className="font-semibold text-sm">
          {count} {count === 1 ? 'movimentação selecionada' : 'movimentações selecionadas'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 gap-2">
          <Tag className="w-4 h-4" />
          Categorizar
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 gap-2">
          <FileText className="w-4 h-4" />
          Marcar como revisado
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 gap-2">
          <Download className="w-4 h-4" />
          Exportar selecionados
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}