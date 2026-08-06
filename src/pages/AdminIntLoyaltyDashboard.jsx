import React from 'react';
import { Award, Users, Coins, TrendingUp, Building2, ShieldCheck } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { adminIntLoyaltyKpis } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const kpis = [
  { label: 'Merchants com programa', value: adminIntLoyaltyKpis.merchants_with_program, icon: Building2 },
  { label: 'Membros na plataforma', value: `${(adminIntLoyaltyKpis.total_members_platform / 1000000).toFixed(2)}M`, icon: Users },
  { label: 'Pontos emitidos', value: `${(adminIntLoyaltyKpis.points_issued_platform / 1000000).toFixed(0)}M`, icon: Coins },
  { label: 'Receita via loyalty', value: `R$ ${(adminIntLoyaltyKpis.revenue_via_loyalty / 1000000).toFixed(1)}M`, icon: TrendingUp },
];

export default function AdminIntLoyaltyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Loyalty · Governança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Visão consolidada de todos os programas de fidelidade</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-navy-50 text-navy-700 text-xs font-semibold border border-navy-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Supervisão PagSmile
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2">
              <k.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top merchants */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Top merchants por engajamento</h3>
          <div className="space-y-3">
            {adminIntLoyaltyKpis.top_merchants.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{m.name}</span>
                    <span className="font-mono text-slate-500">{m.members.toLocaleString('pt-BR')} membros</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-mint-600" style={{ width: `${m.engagement}%` }} />
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-mint-600 w-10 text-right">{m.engagement}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by merchant */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Receita via loyalty por merchant</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adminIntLoyaltyKpis.top_merchants} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="#2bc196" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Governance alerts */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-mint-500" /> Alertas de governança
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Cashback alto</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">2 merchants com cashback acima de 10% (acima do teto recomendado)</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Possível fraude MGM</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">1 merchant com taxa de conversão de indicação acima de 80% (anômala)</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">LGPD - opt-out pendente</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">4 merchants com fila de opt-out acima de 7 dias</p>
          </div>
        </div>
      </div>
    </div>
  );
}