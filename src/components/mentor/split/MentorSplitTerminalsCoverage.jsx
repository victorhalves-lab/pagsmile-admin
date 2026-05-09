import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, AlertTriangle, Plus, Minus } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const formatDateTime = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export default function MentorSplitTerminalsCoverage({ terminals = [], totalOwnerTerminals = 0, inactiveCount = 0 }) {
  const coveragePct = totalOwnerTerminals > 0 ? (terminals.length / totalOwnerTerminals * 100).toFixed(1) : 0;
  const tpvAggregate = terminals.reduce((s, t) => s + (t.tpv_30d || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-600" />
          Terminais Vinculados ({terminals.length})
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Plus className="w-3 h-3" /> Adicionar
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Minus className="w-3 h-3" /> Remover
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cobertura */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-100">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Cobertura</p>
            <p className="text-xl font-bold text-cyan-700">{coveragePct}%</p>
            <p className="text-[10px] text-slate-500">{terminals.length} de {totalOwnerTerminals} terminais</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">TPV agregado 30d</p>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(tpvAggregate)}</p>
          </div>
          <div className={`rounded-lg p-3 border ${inactiveCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100' : 'bg-slate-50 dark:bg-slate-800 border-slate-100'}`}>
            <p className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
              {inactiveCount > 0 && <AlertTriangle className="w-3 h-3 text-amber-600" />}
              Sem atividade
            </p>
            <p className={`text-xl font-bold ${inactiveCount > 0 ? 'text-amber-700' : 'text-slate-500'}`}>{inactiveCount}</p>
            <p className="text-[10px] text-slate-500">{inactiveCount > 0 ? 'Revisar limpeza' : 'Tudo OK'}</p>
          </div>
        </div>

        {/* Lista */}
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="text-left p-2 font-semibold">Terminal</th>
                <th className="text-left p-2 font-semibold">TID</th>
                <th className="text-left p-2 font-semibold">Modalidade</th>
                <th className="text-right p-2 font-semibold">TPV 30d</th>
                <th className="text-right p-2 font-semibold">Última atividade</th>
                <th className="text-center p-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((t) => (
                <tr key={t.terminal_id} className={`border-t border-slate-200 dark:border-slate-700 ${t.status === 'inactive' ? 'bg-amber-50/50' : ''}`}>
                  <td className="p-2">
                    <code className="font-mono text-[10px] text-slate-500">{t.terminal_id}</code>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{t.name}</p>
                  </td>
                  <td className="p-2 font-mono">{t.tid}</td>
                  <td className="p-2">
                    <Badge variant="outline" className="text-[10px]">{t.modality}</Badge>
                  </td>
                  <td className="p-2 text-right font-bold">{formatCurrency(t.tpv_30d)}</td>
                  <td className="p-2 text-right text-slate-500 text-[11px]">{formatDateTime(t.last_activity_at)}</td>
                  <td className="p-2 text-center">
                    {t.status === 'active' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Ativo</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px]">Inativo</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}