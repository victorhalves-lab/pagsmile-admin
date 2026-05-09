import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Clock, Zap, Coins } from 'lucide-react';
import { fmt } from '@/components/mentor/mocks/channelParametersMock';

export default function ChannelParametersKPIBar({ parameters = [] }) {
  const totalChannels = parameters.length;
  const activeChannels = parameters.filter((p) => p.status === 'active').length;
  const anticipationEnabled = parameters.filter((p) => p.anticipation_enabled).length;
  const totalAnticipationVolume = parameters.reduce((s, p) => s + (p.monthly_anticipation_volume || 0), 0);
  const avgSpreadAnticipation = (() => {
    const list = parameters.filter((p) => p.anticipation_enabled && p.spread_anticipation);
    if (!list.length) return 0;
    return list.reduce((s, p) => s + p.spread_anticipation, 0) / list.length;
  })();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Canais configurados</p>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold mt-1">
            {activeChannels} <span className="text-xs text-slate-500">/ {totalChannels}</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{totalChannels - activeChannels} em homologação</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Antecipação habilitada</p>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{anticipationEnabled}</p>
          <p className="text-[10px] text-slate-500 mt-1">{totalChannels - anticipationEnabled} desabilitados</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Volume antecipação/mês</p>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(totalAnticipationVolume)}</p>
          <p className="text-[10px] text-slate-500 mt-1">spread médio {avgSpreadAnticipation.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Prazo médio crédito</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            D+{Math.round(parameters.reduce((s, p) => s + (p.min_credit_due_days || 0), 0) / Math.max(parameters.length, 1))}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">benchmark mercado D+30</p>
        </CardContent>
      </Card>
    </div>
  );
}