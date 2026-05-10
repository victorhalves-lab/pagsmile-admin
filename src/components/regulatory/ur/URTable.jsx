import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { UR_STATUS, REGISTRARS, REGISTRATION_STATUS, PAYMENT_ARRANGEMENTS, formatCurrency } from '../mocks/urMock';
import { toast } from 'sonner';

export default function URTable({ items, selected = [], onToggle, onToggleAll, onViewDetail, onReprocess, columns }) {
  const allSelected = items.length > 0 && selected.length === items.length;
  const visibleColumns = columns || {
    id: true, registrar_id: true, merchant: true, brand: true, acquirer: true,
    arrangement: true, dates: true, gross: true, available: true, status: true,
    effects: true, registration: true, conciliation: true,
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`ID copiado: ${id}`);
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
          <tr className="border-b">
            <th className="p-2 w-8"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></th>
            {visibleColumns.id && <th className="text-left p-2 font-semibold">ID UR</th>}
            {visibleColumns.registrar_id && <th className="text-left p-2 font-semibold">ID Registradora</th>}
            {visibleColumns.merchant && <th className="text-left p-2 font-semibold">Lojista</th>}
            {visibleColumns.brand && <th className="text-center p-2 font-semibold">Bandeira</th>}
            {visibleColumns.acquirer && <th className="text-center p-2 font-semibold">Adquirente</th>}
            {visibleColumns.arrangement && <th className="text-left p-2 font-semibold">Arranjo</th>}
            {visibleColumns.dates && <th className="text-left p-2 font-semibold">Vencimento</th>}
            {visibleColumns.gross && <th className="text-right p-2 font-semibold">Bruto</th>}
            {visibleColumns.available && <th className="text-right p-2 font-semibold">Disponível</th>}
            {visibleColumns.status && <th className="text-center p-2 font-semibold">Status</th>}
            {visibleColumns.effects && <th className="text-center p-2 font-semibold">Efeitos</th>}
            {visibleColumns.registration && <th className="text-center p-2 font-semibold">Registro</th>}
            {visibleColumns.conciliation && <th className="text-center p-2 font-semibold">CERC</th>}
            <th className="text-right p-2 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((ur) => {
            const status = UR_STATUS[ur.status];
            const registrar = REGISTRARS[ur.registrar];
            const regStatus = REGISTRATION_STATUS[ur.registration_status];
            const arrangement = PAYMENT_ARRANGEMENTS[ur.arrangement];
            const isSelected = selected.includes(ur.id);
            const concord = ur.cerc_conciliation_status;

            return (
              <tr key={ur.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}>
                <td className="p-2"><Checkbox checked={isSelected} onCheckedChange={() => onToggle?.(ur.id)} /></td>
                {visibleColumns.id && (
                  <td className="p-2">
                    <button onClick={() => onViewDetail?.(ur)} className="text-violet-600 hover:underline font-mono text-[10px]">{ur.id}</button>
                    <button onClick={() => copyId(ur.id)} className="ml-1 text-slate-400 hover:text-slate-600"><Copy className="w-2.5 h-2.5 inline" /></button>
                  </td>
                )}
                {visibleColumns.registrar_id && (
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <Badge className={`${registrar?.color} text-[9px] border`}>{registrar?.label}</Badge>
                      <span className="font-mono text-[9px] text-slate-500">{ur.registrar_id?.slice(-8)}</span>
                    </div>
                  </td>
                )}
                {visibleColumns.merchant && (
                  <td className="p-2">
                    <p className="font-medium truncate max-w-[170px]">{ur.merchant.name}</p>
                    <p className="text-[9px] text-slate-400">{ur.merchant.cnpj}</p>
                  </td>
                )}
                {visibleColumns.brand && <td className="p-2 text-center capitalize text-[10px]">{ur.brand}</td>}
                {visibleColumns.acquirer && <td className="p-2 text-center text-[10px]">{ur.acquirer}</td>}
                {visibleColumns.arrangement && (
                  <td className="p-2">
                    <Badge className={`${arrangement?.color} text-[9px]`}>{arrangement?.label}</Badge>
                    {ur.total_installments > 1 && (
                      <p className="text-[9px] text-slate-500 mt-0.5">{ur.installment}/{ur.total_installments}</p>
                    )}
                  </td>
                )}
                {visibleColumns.dates && (
                  <td className="p-2 text-[10px]">
                    {new Date(ur.expected_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                )}
                {visibleColumns.gross && <td className="p-2 text-right font-medium">{formatCurrency(ur.gross_value)}</td>}
                {visibleColumns.available && (
                  <td className={`p-2 text-right font-bold ${ur.available_value === 0 ? 'text-orange-700' : ur.available_value < ur.net_value ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {formatCurrency(ur.available_value)}
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="p-2 text-center">
                    <Badge className={`${status?.color} border text-[9px]`} title={status?.desc}>{status?.label}</Badge>
                  </td>
                )}
                {visibleColumns.effects && (
                  <td className="p-2 text-center">
                    {ur.effects_count > 0 ? (
                      <Badge variant="outline" className="text-[10px]">
                        {ur.effects_count}
                        {ur.has_judicial_lien && <span className="ml-1">⚖️</span>}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </td>
                )}
                {visibleColumns.registration && (
                  <td className="p-2 text-center">
                    <Badge className={`${regStatus?.color} text-[9px]`}>{regStatus?.label}</Badge>
                  </td>
                )}
                {visibleColumns.conciliation && (
                  <td className="p-2 text-center">
                    {concord === 'conciliated' && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">OK</Badge>}
                    {concord === 'pending' && <Badge className="bg-slate-100 text-slate-700 text-[9px]">Pend.</Badge>}
                    {concord === 'divergence' && <Badge className="bg-red-100 text-red-700 text-[9px]"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />Diverg.</Badge>}
                  </td>
                )}
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onViewDetail?.(ur)} title="Ficha 360">
                      <Eye className="w-3 h-3" />
                    </Button>
                    {ur.registration_status === 'failed' && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-amber-600" onClick={() => onReprocess?.(ur)} title="Reprocessar registro">
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    )}
                    <Link to={`${createPageUrl('TransactionDetail')}?id=${ur.transaction_id}`}>
                      <Button size="icon" variant="ghost" className="h-6 w-6" title="Transação origem"><ExternalLink className="w-3 h-3" /></Button>
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