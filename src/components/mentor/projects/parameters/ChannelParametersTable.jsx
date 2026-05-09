import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, History, Zap, ZapOff, AlertTriangle } from 'lucide-react';
import { CHANNEL_TYPES } from '@/components/mentor/mocks/channelParametersMock';

export default function ChannelParametersTable({ parameters = [], onEdit, onViewHistory }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-3 font-semibold">Canal</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-center p-3 font-semibold">D+ Débito</th>
                <th className="text-center p-3 font-semibold">D+ Crédito</th>
                <th className="text-center p-3 font-semibold">Antecipação</th>
                <th className="text-right p-3 font-semibold">Spread Antec.</th>
                <th className="text-right p-3 font-semibold">Spread Proc.</th>
                <th className="text-right p-3 font-semibold">Lojistas</th>
                <th className="text-right p-3 font-semibold">Última alteração</th>
                <th className="text-center p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p) => {
                const ch = CHANNEL_TYPES[p.channel_type];
                const stale = (() => {
                  if (!p.last_modified) return false;
                  const d = new Date(p.last_modified);
                  const months = (Date.now() - d.getTime()) / (30 * 24 * 60 * 60 * 1000);
                  return months > 6;
                })();
                return (
                  <tr key={p.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ch?.icon}</span>
                        <div>
                          <p className="font-bold">{p.channel_name}</p>
                          <Badge className={`text-[9px] mt-0.5 ${ch?.color}`}>{ch?.label}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <Badge className={`text-[9px] ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status === 'active' ? 'Ativo' : 'Homologação'}
                      </Badge>
                    </td>
                    <td className="text-center p-3 font-mono">D+{p.min_debit_due_days}</td>
                    <td className="text-center p-3 font-mono">D+{p.min_credit_due_days}</td>
                    <td className="text-center p-3">
                      {p.anticipation_enabled ? (
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-700 font-semibold">D+{p.min_anticipation_due_days}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-slate-400">
                          <ZapOff className="w-3 h-3" />
                          <span>Off</span>
                        </div>
                      )}
                    </td>
                    <td className="text-right p-3 font-mono">{p.spread_anticipation ? `${p.spread_anticipation.toFixed(2)}%` : '—'}</td>
                    <td className="text-right p-3 font-mono">R$ {p.spread_process_price.toFixed(2)}</td>
                    <td className="text-right p-3">{p.affected_merchants.toLocaleString('pt-BR')}</td>
                    <td className="text-right p-3">
                      <div className="flex items-center justify-end gap-1">
                        {stale && <AlertTriangle className="w-3 h-3 text-amber-500" title="Sem revisão há mais de 6 meses" />}
                        <span className="text-[10px] text-slate-500">
                          {p.last_modified ? new Date(p.last_modified).toLocaleDateString('pt-BR') : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit?.(p)} title="Editar parâmetros">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onViewHistory?.(p)} title="Histórico de mudanças">
                          <History className="w-3 h-3" />
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