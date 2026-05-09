import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Mock: status comparado entre PagSmile e o adquirente para a transação atual
const MOCK_COMPARISON = {
  pagsmile: { status: 'approved', amount: 1259.90, settlement_date: '2026-06-08', last_update: '2026-05-09T08:30:00' },
  acquirer: { status: 'approved', amount: 1259.90, settlement_date: '2026-06-08', last_update: '2026-05-09T08:32:00', source: 'Cielo API' },
  reconciliation_history: [
    { date: '2026-05-09T05:40:00', type: 'file_cnab', acquirer: 'Cielo', result: 'matched', notes: 'Arquivo diário · sem divergências' },
    { date: '2026-05-09T08:32:00', type: 'active_sync', acquirer: 'Cielo', result: 'matched', triggered_by: 'opstech@pagsmile.com', notes: 'Sync manual após contestação · validação OK' },
  ],
};

const RESULT_CFG = {
  matched: { label: 'OK', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  divergent: { label: 'Divergente', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  phantom: { label: 'Fantasma', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

export default function MentorSyncReconciliationCard({ transaction }) {
  const [syncing, setSyncing] = useState(false);
  const data = MOCK_COMPARISON;
  const isMatched = data.pagsmile.status === data.acquirer.status && data.pagsmile.amount === data.acquirer.amount;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Sync ativo concluído · status confirmado pelo adquirente em 1.4s');
    }, 1400);
  };

  return (
    <Card className="border-violet-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Sincronização & Conciliação
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Comparativo PagSmile vs Adquirente */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
            <p className="text-[10px] uppercase font-bold text-blue-700">PagSmile</p>
            <p className="text-sm font-bold mt-1">Status: {data.pagsmile.status}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Valor: R$ {data.pagsmile.amount.toFixed(2)}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Liquidação: {data.pagsmile.settlement_date}</p>
            <p className="text-[9px] text-slate-500 mt-1">Atualizado {new Date(data.pagsmile.last_update).toLocaleString('pt-BR')}</p>
          </div>
          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200">
            <p className="text-[10px] uppercase font-bold text-violet-700">Adquirente · {data.acquirer.source}</p>
            <p className="text-sm font-bold mt-1">Status: {data.acquirer.status}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Valor: R$ {data.acquirer.amount.toFixed(2)}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Liquidação: {data.acquirer.settlement_date}</p>
            <p className="text-[9px] text-slate-500 mt-1">Atualizado {new Date(data.acquirer.last_update).toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {isMatched ? (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Fonte da verdade confirmada · sem divergências entre PagSmile e adquirente.</p>
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">Divergência detectada · revise os campos destacados ou execute novo sync.</p>
          </div>
        )}

        {/* Histórico de conciliações */}
        <div>
          <p className="text-xs font-bold mb-1.5 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-slate-500" />Histórico de conciliações ({data.reconciliation_history.length})
          </p>
          <div className="space-y-1.5">
            {data.reconciliation_history.map((h, i) => {
              const cfg = RESULT_CFG[h.result];
              return (
                <div key={i} className="p-2 rounded border bg-slate-50 dark:bg-slate-900 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[9px] ${cfg.color}`}>
                      <cfg.icon className="w-2.5 h-2.5 mr-0.5" />{cfg.label}
                    </Badge>
                    <span className="font-bold">{h.type === 'active_sync' ? 'Sync ativo' : 'Arquivo CNAB'} · {h.acquirer}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500">{new Date(h.date).toLocaleString('pt-BR')}</p>
                    {h.triggered_by && <p className="text-[9px] text-slate-400">por {h.triggered_by.split('@')[0]}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}