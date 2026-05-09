import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Repeat } from 'lucide-react';
import { ACQUIRERS } from '@/components/mentor/mocks/transactionMentorMock';
import { toast } from 'sonner';

const STATUS_CFG = {
  completed: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700' },
  running: { label: 'Em execução', color: 'bg-blue-100 text-blue-700' },
  queued: { label: 'Em fila', color: 'bg-slate-100 text-slate-700' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' },
};

const SCOPE_CFG = {
  transaction: 'Transação única',
  filtered_set: 'Conjunto filtrado',
  period: 'Período',
};

export default function SyncJobsTable({ jobs = [] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Job · Disparado por</th>
                <th className="text-center p-2 font-semibold">Adquirente</th>
                <th className="text-center p-2 font-semibold">Escopo</th>
                <th className="text-right p-2 font-semibold">Total</th>
                <th className="text-right p-2 font-semibold">Sincronizado</th>
                <th className="text-right p-2 font-semibold">Divergências</th>
                <th className="text-left p-2 font-semibold">Justificativa</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const acq = ACQUIRERS.find((a) => a.id === j.acquirer);
                const status = STATUS_CFG[j.status];
                const pct = j.total > 0 ? (j.synced / j.total) * 100 : 0;
                return (
                  <tr key={j.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <p className="font-mono text-[10px]">{j.id}</p>
                      <p className="text-[10px] text-slate-500">{j.triggered_by.split('@')[0]} · {new Date(j.started_at).toLocaleString('pt-BR')}</p>
                    </td>
                    <td className="text-center p-2">
                      <span className="text-base">{acq?.logo}</span>
                      <span className="ml-1 text-[11px]">{acq?.name}</span>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-[9px]">{SCOPE_CFG[j.scope]}</Badge>
                      {j.target && <p className="text-[9px] font-mono text-slate-500 mt-0.5">{j.target}</p>}
                    </td>
                    <td className="text-right p-2 font-mono">{j.total.toLocaleString('pt-BR')}</td>
                    <td className="text-right p-2">
                      <p className="font-mono text-emerald-600">{j.synced.toLocaleString('pt-BR')}</p>
                      {j.status === 'running' && (
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-1">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="text-right p-2">
                      {j.divergences > 0 ? (
                        <Badge className="text-[9px] bg-amber-100 text-amber-700">{j.divergences}</Badge>
                      ) : <span className="text-slate-400">0</span>}
                    </td>
                    <td className="p-2 text-[10px] italic max-w-[260px]">"{j.reason}"</td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                      {j.error && <p className="text-[9px] text-red-600 mt-0.5 max-w-[140px]">{j.error}</p>}
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Detalhes" onClick={() => toast.info(`Detalhes do job ${j.id}`)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Reexecutar" onClick={() => toast.info('Job reexecutado com mesmos parâmetros')}>
                          <Repeat className="w-3 h-3" />
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