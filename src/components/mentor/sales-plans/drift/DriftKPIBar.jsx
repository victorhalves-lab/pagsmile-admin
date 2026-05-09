import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

export default function DriftKPIBar({ drifts = [] }) {
  const total = drifts.length;
  const high = drifts.filter((d) => d.severity === 'high').length;
  const medium = drifts.filter((d) => d.severity === 'medium').length;
  const totalImpact = drifts.reduce((acc, d) => acc + Math.abs(d.revenue_impact), 0);
  const avgDrift = drifts.length > 0 ? drifts.reduce((acc, d) => acc + d.drift_pct, 0) / drifts.length : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Drifts ativos</p>
            <Activity className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-bold mt-0.5 text-violet-600">{total}</p>
          <p className="text-[10px] text-slate-500">monitorados continuamente</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Severidade alta</p>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold mt-0.5 text-red-600">{high}</p>
          <p className="text-[10px] text-slate-500">ação imediata</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Severidade média</p>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold mt-0.5 text-amber-600">{medium}</p>
          <p className="text-[10px] text-slate-500">monitoramento ativo</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Drift médio</p>
            <TrendingDown className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold mt-0.5">{avgDrift.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500">vs configurado</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-red-700 font-bold">Receita não realizada</p>
            <DollarSign className="w-4 h-4 text-red-700" />
          </div>
          <p className="text-2xl font-black mt-0.5 text-red-700">R$ {(totalImpact / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-red-600">últimos 90 dias</p>
        </CardContent>
      </Card>
    </div>
  );
}