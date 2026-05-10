import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, Undo2, FileText } from 'lucide-react';
import { ADJUSTMENT_STATUS, ADJUSTMENT_REASONS, formatCurrency } from './mocks/manualAdjustmentsMock';

export default function AdjustmentsTable({ items, onView, onApprove, onReject, onReverse }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 text-sm">
        Nenhum ajuste encontrado.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b">
          <tr>
            <th className="text-left p-3 font-semibold">ID</th>
            <th className="text-left p-3 font-semibold">Lojista</th>
            <th className="text-center p-3 font-semibold">Tipo</th>
            <th className="text-right p-3 font-semibold">Valor</th>
            <th className="text-left p-3 font-semibold">Motivo</th>
            <th className="text-left p-3 font-semibold">Solicitante</th>
            <th className="text-left p-3 font-semibold">Data</th>
            <th className="text-center p-3 font-semibold">Evidências</th>
            <th className="text-center p-3 font-semibold">Status</th>
            <th className="text-right p-3 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const status = ADJUSTMENT_STATUS[a.status];
            const reason = ADJUSTMENT_REASONS[a.reason || a.reason_code];
            return (
              <tr key={a.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3">
                  <button onClick={() => onView?.(a)} className="text-violet-600 hover:underline font-mono text-[10px]">
                    {a.id}
                  </button>
                </td>
                <td className="p-3">
                  <p className="font-medium truncate max-w-[180px]">{a.merchant?.name}</p>
                </td>
                <td className="p-3 text-center">
                  <Badge className={a.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                    {a.type === 'credit' ? '+' : '−'}
                  </Badge>
                </td>
                <td className={`p-3 text-right font-bold ${a.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {a.type === 'credit' ? '+' : '−'}{formatCurrency(a.amount)}
                </td>
                <td className="p-3">
                  <Badge className={`${reason?.color} text-[10px]`}>{reason?.label || a.reason_label}</Badge>
                </td>
                <td className="p-3 text-[10px] text-slate-500 truncate max-w-[140px]">{a.created_by}</td>
                <td className="p-3 text-[11px] text-slate-600">
                  {new Date(a.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </td>
                <td className="p-3 text-center">
                  {a.evidence_count > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px]">
                      <FileText className="w-3 h-3" /> {a.evidence_count}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <Badge className={`${status?.color} text-[9px]`}>{status?.label}</Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onView?.(a)} title="Detalhe">
                      <Eye className="w-3 h-3" />
                    </Button>
                    {a.status === 'pending_approval' && onApprove && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600" onClick={() => onApprove(a)} title="Aprovar">
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    {a.status === 'pending_approval' && onReject && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600" onClick={() => onReject(a)} title="Rejeitar">
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                    {a.status === 'executed' && onReverse && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-violet-600" onClick={() => onReverse(a)} title="Estornar">
                        <Undo2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}