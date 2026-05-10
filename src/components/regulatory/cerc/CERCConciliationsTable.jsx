import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';

export default function CERCConciliationsTable({ items, onViewDetail }) {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr className="border-b">
            <th className="text-left p-2 font-semibold">ID</th>
            <th className="text-left p-2 font-semibold">Data execução</th>
            <th className="text-center p-2 font-semibold">Método</th>
            <th className="text-right p-2 font-semibold">Comparados</th>
            <th className="text-right p-2 font-semibold">Concordantes</th>
            <th className="text-right p-2 font-semibold">Divergentes</th>
            <th className="text-center p-2 font-semibold">Críticas</th>
            <th className="text-center p-2 font-semibold">% Concordância</th>
            <th className="text-center p-2 font-semibold">Status</th>
            <th className="text-center p-2 font-semibold">Duração</th>
            <th className="text-right p-2 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="p-2 font-mono text-[10px]">
                <button onClick={() => onViewDetail?.(c)} className="text-violet-600 hover:underline">{c.id}</button>
              </td>
              <td className="p-2 text-[11px]">{new Date(c.execution_date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
              <td className="p-2 text-center">
                <Badge variant={c.method === 'manual' ? 'default' : 'outline'} className="text-[9px]">
                  {c.method === 'manual' ? 'Manual' : 'Auto'}
                </Badge>
              </td>
              <td className="p-2 text-right">{c.total_compared}</td>
              <td className="p-2 text-right text-emerald-600">{c.concordant}</td>
              <td className={`p-2 text-right ${c.divergent > 0 ? 'text-red-600 font-bold' : ''}`}>{c.divergent}</td>
              <td className="p-2 text-center">
                {c.critical_divergences > 0 ? (
                  <Badge className="bg-red-100 text-red-700 text-[9px]">
                    <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />{c.critical_divergences}
                  </Badge>
                ) : <span className="text-slate-400 text-[10px]">—</span>}
              </td>
              <td className={`p-2 text-center font-bold ${c.concordance_rate >= 99 ? 'text-emerald-600' : c.concordance_rate >= 97 ? 'text-amber-600' : 'text-red-600'}`}>
                {c.concordance_rate}%
              </td>
              <td className="p-2 text-center">
                {c.status === 'success' && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">Sucesso</Badge>}
                {c.status === 'with_divergences' && <Badge className="bg-amber-100 text-amber-700 text-[9px]">Divergências</Badge>}
                {c.status === 'failed' && <Badge className="bg-red-100 text-red-700 text-[9px]">Falhou</Badge>}
              </td>
              <td className="p-2 text-center text-[10px] text-slate-500">{c.duration_seconds}s</td>
              <td className="p-2 text-right">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onViewDetail?.(c)}>
                  <Eye className="w-3 h-3" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}