import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, Pause, X, Plus, Minus, Eye, GitCompare, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export default function MentorSplitActionsBar({ split, onEdit, onSuspend, onTerminate }) {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900">
      <CardContent className="p-3 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">Ações</span>
        <Button variant="default" size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700" onClick={onEdit}>
          <Edit3 className="w-3.5 h-3.5" /> Editar split
        </Button>
        {split?.status === 'active' && (
          <Button variant="outline" size="sm" className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50" onClick={onSuspend}>
            <Pause className="w-3.5 h-3.5" /> Suspender
          </Button>
        )}
        <Button variant="outline" size="sm" className="gap-1 border-red-300 text-red-700 hover:bg-red-50" onClick={onTerminate}>
          <X className="w-3.5 h-3.5" /> Encerrar (OTP)
        </Button>
        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.info('Adicionar terminais — abriria o linker')}>
          <Plus className="w-3.5 h-3.5" /> Adicionar terminais
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.info('Remover terminais — abriria o linker')}>
          <Minus className="w-3.5 h-3.5" /> Remover terminais
        </Button>
        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.info('Filtrando transações deste split')}>
          <Eye className="w-3.5 h-3.5" /> Ver transações
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.info('Modal de comparação')}>
          <GitCompare className="w-3.5 h-3.5" /> Comparar com outro
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success('PDF da ficha do split sendo gerado…')}>
          <FileDown className="w-3.5 h-3.5" /> Gerar relatório PDF
        </Button>
      </CardContent>
    </Card>
  );
}