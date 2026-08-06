import React from 'react';
import { Users, Send, Target, TrendingUp, Building2, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { adminIntCdpKpis } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const kpis = [
  { label: 'Merchants ativos no CDP', value: adminIntCdpKpis.merchants_active_cdp, icon: Building2 },
  { label: 'Mensagens enviadas (plataforma)', value: `${(adminIntCdpKpis.messages_sent_platform / 1000000).toFixed(1)}M`, icon: Send },
  { label: 'Conversões (plataforma)', value: `${(adminIntCdpKpis.conversions_platform / 1000).toFixed(0)}k`, icon: Target },
  { label: 'Receita gerada (plataforma)', value: `R$ ${(adminIntCdpKpis.revenue_generated_platform / 1000000).toFixed(1)}M`, icon: TrendingUp },
];

export default function AdminIntCdpDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CDP / CRM · Governança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Visão consolidada de todos os merchants usando CDP</p>
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
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Top merchants por receita gerada</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adminIntCdpKpis.top_merchants} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="#2bc196" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost & monitor */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Custos de disparo (mensal)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">WhatsApp</p>
                  <p className="text-xs text-slate-500">Marketing</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">R$ {adminIntCdpKpis.whatsapp_cost_monthly.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">SMS</p>
                  <p className="text-xs text-slate-500">Marketing</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">R$ {adminIntCdpKpis.sms_cost_monthly.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Monitor de compliance</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">3 merchants com fila de opt-out pendente · 1 merchant acima do limite de disparos/hora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}