import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wrench, Eye } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_CFG = {
  value_mismatch: { label: 'Valor divergente', icon: '💰', color: 'bg-amber-100 text-amber-700' },
  status_mismatch: { label: 'Status divergente', icon: '🔄', color: 'bg-orange-100 text-orange-700' },
  phantom_pagsmile: { label: 'Fantasma PagSmile', icon: '👻', color: 'bg-violet-100 text-violet-700' },
  phantom_acquirer: { label: 'Fantasma adquirente', icon: '👻', color: 'bg-red-100 text-red-700' },
  settlement_date: { label: 'Data liquidação', icon: '📅', color: 'bg-blue-100 text-blue-700' },
};

const SEV_CFG = {
  critical: { label: 'CRÍTICA', color: 'bg-red-100 text-red-700' },
  high: { label: 'ALTA', color: 'bg-amber-100 text-amber-700' },
  medium: { label: 'MÉDIA', color: 'bg-blue-100 text-blue-700' },
  low: { label: 'BAIXA', color: 'bg-slate-100 text-slate-700' },
};

const STATUS_CFG = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' },
  investigating: { label: 'Investigando', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolvida', color: 'bg-emerald-100 text-emerald-700' },
};

export default function DivergencesTable({ divergences = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />Divergências detectadas ({divergences.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Tipo</th>
                <th className="text-center p-2 font-semibold">Severidade</th>
                <th className="text-left p-2 font-semibold">Transação · NSU</th>
                <th className="text-left p-2 font-semibold">Lojista</th>
                <th className="text-right p-2 font-semibold">PagSmile</th>
                <th className="text-right p-2 font-semibold">Adquirente</th>
                <th className="text-center p-2 font-semibold">Δ</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {divergences.map((d) => {
                const type = TYPE_CFG[d.type];
                const sev = SEV_CFG[d.severity];
                const status = STATUS_CFG[d.status];
                return (
                  <tr key={d.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <Badge className={`text-[9px] ${type?.color}`}>
                        <span className="mr-1">{type?.icon}</span>{type?.label}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${sev?.color}`}>{sev?.label}</Badge>
                    </td>
                    <td className="p-2">
                      <p className="font-mono text-[10px]">{d.tx_id || <span className="text-slate-400 italic">—</span>}</p>
                      <p className="text-[9px] text-slate-500">NSU {d.nsu}</p>
                    </td>
                    <td className="p-2 text-[11px]">{d.merchant_name}</td>
                    <td className="text-right p-2">
                      {d.value_pagsmile !== null && d.value_pagsmile !== undefined ? (
                        <>
                          <p className="font-mono text-[11px]">R$ {d.value_pagsmile.toFixed(2)}</p>
                          {d.status_pagsmile && <Badge className="text-[9px] bg-blue-100 text-blue-700 mt-0.5">{d.status_pagsmile}</Badge>}
                        </>
                      ) : <span className="text-slate-400 italic text-[10px]">não existe</span>}
                    </td>
                    <td className="text-right p-2">
                      {d.value_acquirer !== null && d.value_acquirer !== undefined ? (
                        <>
                          <p className="font-mono text-[11px]">R$ {d.value_acquirer.toFixed(2)}</p>
                          {d.status_acquirer && <Badge className="text-[9px] bg-violet-100 text-violet-700 mt-0.5">{d.status_acquirer}</Badge>}
                        </>
                      ) : <span className="text-slate-400 italic text-[10px]">não existe</span>}
                    </td>
                    <td className="text-center p-2">
                      {d.delta_brl !== undefined && d.delta_brl !== null ? (
                        <span className={`font-mono text-[11px] font-bold ${d.delta_brl < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {d.delta_brl > 0 ? '+' : ''}{d.delta_brl.toFixed(2)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Ver detalhes" onClick={() => toast.info(`Drill-down em divergência ${d.id}`)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Resolver" onClick={() => toast.success('Workflow de resolução iniciado · sync ativo + sugestões IA')}>
                          <Wrench className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}