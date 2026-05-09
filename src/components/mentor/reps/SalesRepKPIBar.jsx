import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Award } from 'lucide-react';

const fmt = (v) => v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function SalesRepKPIBar({ reps = [] }) {
  const total = reps.length;
  const totalTPV = reps.reduce((s, r) => s + (r.monthly_tpv || 0), 0);
  const totalCommission = reps.reduce((s, r) => s + (r.monthly_commission || 0), 0);
  const avgQuota = total ? Math.round(reps.reduce((s, r) => s + (r.quota_target_pct || 0), 0) / total) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Representantes</p><Users className="w-4 h-4 text-slate-400" /></div><p className="text-2xl font-bold mt-1">{total}</p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">TPV gerenciado</p><TrendingUp className="w-4 h-4 text-emerald-500" /></div><p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(totalTPV)}</p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Comissões/mês</p><DollarSign className="w-4 h-4 text-violet-500" /></div><p className="text-2xl font-bold text-violet-600 mt-1">{fmt(totalCommission)}</p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Atingimento médio</p><Award className="w-4 h-4 text-amber-500" /></div><p className={`text-2xl font-bold mt-1 ${avgQuota >= 100 ? 'text-emerald-600' : avgQuota >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{avgQuota}%</p></CardContent></Card>
    </div>
  );
}