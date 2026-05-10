import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Lock, Unlock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { RECEIVABLE_STATUS, CERC_STATUS, formatCurrency } from './mocks/receivablesLedgerMock';

export default function ReceivablesTable({ items, selected = [], onToggle, onToggleAll, onViewDetail, onBlock, onUnblock }) {
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
          <tr className="border-b">
            <th className="text-left p-2 w-8">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
            </th>
            <th className="text-left p-2 font-semibold">ID Recebível</th>
            <th className="text-left p-2 font-semibold">Lojista</th>
            <th className="text-left p-2 font-semibold">Captura</th>
            <th className="text-left p-2 font-semibold">Previsto</th>
            <th className="text-right p-2 font-semibold">Bruto</th>
            <th className="text-right p-2 font-semibold">MDR</th>
            <th className="text-right p-2 font-semibold">Líquido</th>
            <th className="text-center p-2 font-semibold">Bandeira</th>
            <th className="text-center p-2 font-semibold">Parc.</th>
            <th className="text-center p-2 font-semibold">Status</th>
            <th className="text-center p-2 font-semibold">CERC</th>
            <th className="text-right p-2 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => {
            const status = RECEIVABLE_STATUS[r.status];
            const cerc = CERC_STATUS[r.cerc_status];
            const isSelected = selected.includes(r.id);
            return (
              <tr key={r.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}>
                <td className="p-2">
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggle?.(r.id)} />
                </td>
                <td className="p-2">
                  <button onClick={() => onViewDetail?.(r)} className="text-violet-600 hover:underline font-mono text-[10px]">
                    {r.id}
                  </button>
                  <p className="text-[9px] text-slate-400">NSU: {r.nsu}</p>
                </td>
                <td className="p-2">
                  <p className="font-medium truncate max-w-[200px]">{r.merchant.name}</p>
                  <p className="text-[9px] text-slate-400">{r.merchant.cnpj}</p>
                </td>
                <td className="p-2 text-slate-600">{new Date(r.capture_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                <td className="p-2 text-slate-600">{new Date(r.expected_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                <td className="p-2 text-right font-medium">{formatCurrency(r.gross_value)}</td>
                <td className="p-2 text-right text-red-600 text-[11px]">−{formatCurrency(r.mdr)}</td>
                <td className="p-2 text-right font-bold text-emerald-700">{formatCurrency(r.net_value)}</td>
                <td className="p-2 text-center capitalize text-[10px]">{r.brand}</td>
                <td className="p-2 text-center text-[10px]">{r.installment}/{r.total_installments}</td>
                <td className="p-2 text-center">
                  <Badge className={`${status?.color} border text-[9px]`}>{status?.label}</Badge>
                </td>
                <td className="p-2 text-center">
                  <Badge className={`${cerc?.color} text-[9px]`}>{cerc?.label}</Badge>
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onViewDetail?.(r)} title="Ver detalhe">
                      <Eye className="w-3 h-3" />
                    </Button>
                    {r.status !== 'blocked' ? (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-amber-600" onClick={() => onBlock?.(r)} title="Bloquear">
                        <Lock className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600" onClick={() => onUnblock?.(r)} title="Desbloquear">
                        <Unlock className="w-3 h-3" />
                      </Button>
                    )}
                    <Link to={`${createPageUrl('TransactionDetail')}?id=${r.transaction_id}`}>
                      <Button size="icon" variant="ghost" className="h-6 w-6" title="Transação origem">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
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