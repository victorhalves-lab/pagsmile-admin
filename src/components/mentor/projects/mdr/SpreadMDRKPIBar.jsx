import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

export default function SpreadMDRKPIBar({ rules = [], plansBelowMin = [] }) {
  const total = rules.length;
  const avgSpread = rules.length ? rules.reduce((s, r) => s + r.spread, 0) / rules.length : 0;
  const minSpread = rules.length ? Math.min(...rules.map((r) => r.spread)) : 0;
  const maxSpread = rules.length ? Math.max(...rules.map((r) => r.spread)) : 0;
  const totalApplications = rules.reduce((s, r) => s + (r.applied_count || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Combinações cadastradas</p>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold mt-1">{total}</p>
          <p className="text-[10px] text-slate-500 mt-1">{totalApplications.toLocaleString('pt-BR')} transações/mês</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Spread médio (pp)</p>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgSpread.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Min {minSpread.toFixed(2)}% · Max {maxSpread.toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Spread top (premium)</p>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{maxSpread.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">crédito 7-12x · Amex/Visa</p>
        </CardContent>
      </Card>
      <Card className={plansBelowMin.length > 0 ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Planos abaixo do mínimo</p>
            <AlertTriangle className={`w-4 h-4 ${plansBelowMin.length ? 'text-red-500' : 'text-slate-400'}`} />
          </div>
          <p className={`text-2xl font-bold mt-1 ${plansBelowMin.length ? 'text-red-600' : ''}`}>{plansBelowMin.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {plansBelowMin.reduce((s, p) => s + p.merchant_count, 0)} lojistas em violação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}