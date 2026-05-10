import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { EFFECT_TYPES, EFFECT_STATUS, REGISTRARS, formatCurrency } from '../mocks/urMock';

export default function EffectsTable({ items, selected = [], onToggle, onToggleAll, onViewDetail, onReprocess }) {
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
          <tr className="border-b">
            <th className="p-2 w-8"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></th>
            <th className="text-left p-2 font-semibold">ID</th>
            <th className="text-left p-2 font-semibold">Tipo</th>
            <th className="text-left p-2 font-semibold">UR Vinculada</th>
            <th className="text-left p-2 font-semibold">Lojista</th>
            <th className="text-left p-2 font-semibold">Contraparte</th>
            <th className="text-right p-2 font-semibold">Valor afetado</th>
            <th className="text-center p-2 font-semibold">% UR</th>
            <th className="text-left p-2 font-semibold">Aplicação</th>
            <th className="text-center p-2 font-semibold">Registradora</th>
            <th className="text-center p-2 font-semibold">Status</th>
            <th className="text-right p-2 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((eff) => {
            const type = EFFECT_TYPES[eff.type];
            const status = EFFECT_STATUS[eff.status];
            const registrar = REGISTRARS[eff.registrar];
            const isSelected = selected.includes(eff.id);

            return (
              <tr key={eff.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-violet-50' : ''} ${eff.has_conflict ? 'bg-red-50/30' : ''}`}>
                <td className="p-2"><Checkbox checked={isSelected} onCheckedChange={() => onToggle?.(eff.id)} /></td>
                <td className="p-2">
                  <button onClick={() => onViewDetail?.(eff)} className="text-violet-600 hover:underline font-mono text-[10px]">{eff.id}</button>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span>{type?.icon}</span>
                    <Badge className={`${type?.color} text-[9px]`}>{type?.label}</Badge>
                  </div>
                  {eff.sub_type && <p className="text-[9px] text-slate-500 mt-0.5">{eff.sub_type}</p>}
                </td>
                <td className="p-2">
                  <Link to={`${createPageUrl('AdminIntURDetail360')}?id=${eff.ur_id}`} className="text-blue-600 hover:underline font-mono text-[10px]">
                    {eff.ur_id}
                  </Link>
                </td>
                <td className="p-2">
                  <p className="font-medium truncate max-w-[150px] text-[11px]">{eff.ur?.merchant?.name}</p>
                </td>
                <td className="p-2">
                  <p className="font-medium text-[11px] truncate max-w-[160px]">{eff.counterparty?.name}</p>
                  {eff.counterparty?.cnpj && <p className="text-[9px] text-slate-400">{eff.counterparty.cnpj}</p>}
                  {eff.counterparty?.process && <p className="text-[9px] text-slate-400 font-mono">Proc: {eff.counterparty.process.slice(0, 14)}…</p>}
                </td>
                <td className="p-2 text-right font-bold text-red-700">{formatCurrency(eff.value_affected)}</td>
                <td className="p-2 text-center text-[10px]">{eff.pct_of_ur}%</td>
                <td className="p-2 text-[10px]">{new Date(eff.application_date).toLocaleDateString('pt-BR')}</td>
                <td className="p-2 text-center"><Badge className={`${registrar?.color} text-[9px] border`}>{registrar?.label}</Badge></td>
                <td className="p-2 text-center">
                  <Badge className={`${status?.color} text-[9px]`}>{status?.label}</Badge>
                  {eff.has_conflict && <AlertTriangle className="w-3 h-3 text-red-600 inline ml-1" />}
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onViewDetail?.(eff)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    {eff.status === 'failed_registration' && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-amber-600" onClick={() => onReprocess?.(eff)} title="Reprocessar">
                        <RefreshCw className="w-3 h-3" />
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