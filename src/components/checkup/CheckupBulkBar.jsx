import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, UserPlus, Tag, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckupBulkBar({ selectedCount, selectedIds, onClear, totalValue }) {
  if (selectedCount === 0) return null;

  return (
    <Card className="p-3 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-purple-200 dark:border-purple-800 sticky top-4 z-20">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="w-4 h-4" />
          </Button>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {selectedCount} diagnóstico{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
            </div>
            {totalValue && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Valor agregado: <span className="font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/AdminIntCheckupAuthorizeFlow?ids=${Array.from(selectedIds).join(',')}`}>
            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Autorizar Lote (OTP)
            </Button>
          </Link>
          <Link to={`/AdminIntCheckupSoftDeleteFlow?ids=${Array.from(selectedIds).join(',')}`}>
            <Button size="sm" variant="destructive" className="gap-1">
              <Trash2 className="w-4 h-4" /> Soft Delete (OTP)
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="gap-1">
            <UserPlus className="w-4 h-4" /> Atribuir
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Tag className="w-4 h-4" /> Tag
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>
    </Card>
  );
}