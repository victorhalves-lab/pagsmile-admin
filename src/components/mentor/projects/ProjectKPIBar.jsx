import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, TrendingUp, DollarSign, Heart } from 'lucide-react';

const fmt = (v) => v >= 1_000_000_000 ? `R$ ${(v / 1_000_000_000).toFixed(2)}bi` : v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(0)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function ProjectKPIBar({ projects = [] }) {
  const totalTPV = projects.reduce((s, p) => s + (p.monthly_tpv || 0), 0);
  const totalRevenue = projects.reduce((s, p) => s + (p.monthly_revenue || 0), 0);
  const avgHealth = projects.length ? Math.round(projects.reduce((s, p) => s + (p.health_score || 0), 0) / projects.length) : 0;
  const active = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Projetos ativos</p><Layers className="w-4 h-4 text-slate-400" /></div><p className="text-2xl font-bold mt-1">{active} <span className="text-xs text-slate-500">/ {projects.length}</span></p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">TPV consolidado/mês</p><TrendingUp className="w-4 h-4 text-emerald-500" /></div><p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(totalTPV)}</p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Receita PagSmile/mês</p><DollarSign className="w-4 h-4 text-blue-500" /></div><p className="text-2xl font-bold text-blue-600 mt-1">{fmt(totalRevenue)}</p></CardContent></Card>
      <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500">Saúde média</p><Heart className={`w-4 h-4 ${avgHealth >= 85 ? 'text-emerald-500' : avgHealth >= 60 ? 'text-amber-500' : 'text-red-500'}`} /></div><p className={`text-2xl font-bold mt-1 ${avgHealth >= 85 ? 'text-emerald-600' : avgHealth >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avgHealth}</p></CardContent></Card>
    </div>
  );
}