import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, RotateCw } from 'lucide-react';
import { ACQUIRERS } from '@/components/mentor/mocks/transactionMentorMock';
import { toast } from 'sonner';

const STATUS_CFG = {
  processed: { label: 'Processado', color: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'Processando', color: 'bg-blue-100 text-blue-700' },
  processed_with_errors: { label: 'Com erros', color: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' },
  queued: { label: 'Em fila', color: 'bg-slate-100 text-slate-700' },
};

const TYPE_CFG = {
  movimentacao_diaria: 'Mov. Diária',
  mensal_consolidado: 'Mensal',
  chargebacks: 'Chargebacks',
  ajustes: 'Ajustes',
};

export default function ReconciliationFilesTable({ files = [], onViewDivergences }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Adquirente</th>
                <th className="text-left p-2 font-semibold">Arquivo</th>
                <th className="text-center p-2 font-semibold">Tipo</th>
                <th className="text-center p-2 font-semibold">Período</th>
                <th className="text-right p-2 font-semibold">Registros</th>
                <th className="text-right p-2 font-semibold">OK</th>
                <th className="text-right p-2 font-semibold">Divergências</th>
                <th className="text-right p-2 font-semibold">TPV adquirente</th>
                <th className="text-right p-2 font-semibold">Δ Financeiro</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => {
                const acq = ACQUIRERS.find((a) => a.id === f.acquirer_id);
                const status = STATUS_CFG[f.status];
                const okPct = f.total_records > 0 ? (f.processed_ok / f.total_records) * 100 : 0;
                return (
                  <tr key={f.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <span className="text-base">{acq?.logo}</span>
                      <span className="ml-1 font-bold">{f.acquirer_name}</span>
                    </td>
                    <td className="p-2">
                      <p className="font-mono text-[10px] truncate max-w-[180px]">{f.file_name}</p>
                      <p className="text-[9px] text-slate-500">por {f.uploaded_by.split('@')[0]} · {new Date(f.uploaded_at).toLocaleString('pt-BR')}</p>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-[9px]">{TYPE_CFG[f.file_type]}</Badge>
                    </td>
                    <td className="text-center p-2 text-[10px]">{f.period}</td>
                    <td className="text-right p-2 font-mono">{f.total_records.toLocaleString('pt-BR')}</td>
                    <td className="text-right p-2">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-mono text-emerald-600">{f.processed_ok.toLocaleString('pt-BR')}</span>
                        <Badge className="text-[9px] bg-emerald-100 text-emerald-700">{okPct.toFixed(1)}%</Badge>
                      </div>
                    </td>
                    <td className="text-right p-2">
                      {f.divergences > 0 ? (
                        <button onClick={() => onViewDivergences?.(f)} className="font-mono text-amber-600 font-bold hover:underline">
                          {f.divergences.toLocaleString('pt-BR')}
                        </button>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="text-right p-2 font-mono">{f.tpv_acquirer > 0 ? `R$ ${(f.tpv_acquirer / 1_000_000).toFixed(2)}M` : '—'}</td>
                    <td className="text-right p-2">
                      {Math.abs(f.delta_brl) > 0 ? (
                        <Badge className={`text-[9px] ${Math.abs(f.delta_brl) > 10000 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          R$ {(Math.abs(f.delta_brl) / 1000).toFixed(1)}k
                        </Badge>
                      ) : (
                        <Badge className="text-[9px] bg-emerald-100 text-emerald-700">—</Badge>
                      )}
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Ver divergências" onClick={() => onViewDivergences?.(f)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Reprocessar" onClick={() => toast.info('Reprocessamento agendado')}>
                          <RotateCw className="w-3 h-3" />
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