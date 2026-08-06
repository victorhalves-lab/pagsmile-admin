import React from 'react';
import { Award, Users, Coins, TrendingUp, Building2, ShieldCheck, AlertTriangle, ChevronRight, Flame, Gift } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { adminIntLoyaltyKpisRich as k } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const burnStatusStyle = {
  saudável: 'bg-mint-100 text-mint-700',
  baixo: 'bg-amber-100 text-amber-700',
  crítico: 'bg-red-100 text-red-700',
};

export default function AdminIntLoyaltyDashboard() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Loyalty · Governança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{k.merchants_with_program} merchants com programa de {k.merchants_eligible} elegíveis · supervisão consolidada</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-navy-50 text-navy-700 text-xs font-semibold border border-navy-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Supervisão PagSmile
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Merchants com programa', value: k.merchants_with_program, sub: `${k.merchants_eligible} elegíveis`, icon: Building2 },
          { label: 'Membros na plataforma', value: `${(k.total_members_platform / 1000000).toFixed(2)}M`, sub: 'total acumulado', icon: Users },
          { label: 'Pontos emitidos', value: `${(k.points_issued_platform / 1000000).toFixed(0)}M`, sub: `${(k.points_redeemed_platform / 1000000).toFixed(1)}M resgatados`, icon: Coins },
          { label: 'Receita via loyalty', value: `R$ ${(k.revenue_via_loyalty / 1000000).toFixed(1)}M`, sub: `burn rate: ${k.redemption_rate_platform}%`, icon: TrendingUp },
        ].map((kp) => (
          <div key={kp.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2"><kp.icon className="w-4 h-4" /></div>
            <p className="text-xs text-slate-500">{kp.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{kp.value}</p>
            <p className="text-[11px] text-slate-400">{kp.sub}</p>
          </div>
        ))}
      </div>

      {/* Points liability banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-50/30 dark:from-amber-500/10 dark:to-transparent rounded-xl border border-amber-200 dark:border-amber-500/20 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Liabilidade de pontos pendentes: R$ {(k.points_liability_cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Pontos emitidos não resgatados — monitorar expiração para evitar impacto contábil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Program type distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Distribuição por tipo de programa</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={k.program_types} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v, n, p) => [`${v} merchants (${p.payload.pct}%)`, 'Programas']} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {k.program_types.map((t, i) => <Cell key={i} fill={t.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Burn rate by merchant */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-mint-500" /> Burn rate por merchant</h3>
          <div className="space-y-2">
            {k.burn_rate_by_merchant.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 w-24 truncate">{m.name}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.burn}%`, background: m.burn >= 40 ? '#2bc196' : m.burn >= 25 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 w-10 text-right">{m.burn}%</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${burnStatusStyle[m.status]}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expiry alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Gift className="w-4 h-4 text-amber-500" /> Expiração de pontos</h3>
          <div className="space-y-2">
            {k.expiry_alerts.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${e.severity === 'alto' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.merchant}</p>
                    <p className="text-xs text-slate-500">{e.expiring_points.toLocaleString('pt-BR')} pts · R$ {(e.value_cents / 100).toLocaleString('pt-BR')} · expira em {e.days}d</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.severity === 'alto' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{e.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MGM fraud detection */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-500" /> Detecção de fraude MGM</h3>
          <div className="space-y-2">
            {k.mgm_fraud_cases.map((f, i) => (
              <div key={i} className="p-3 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.merchant}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${f.severity === 'crítico' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>{f.severity}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-slate-400">Taxa conversão indicação</p><p className="font-mono font-bold text-red-600">{f.referral_rate}%</p></div>
                  <div><p className="text-slate-400">Self-referral</p><p className="font-mono font-bold text-red-600">{f.self_referral}</p></div>
                  <div><p className="text-slate-400">IP overlap</p><p className="font-mono font-bold text-red-600">{f.ip_overlap}</p></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Status: <span className="font-semibold text-amber-600">{f.status}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top merchants engagement */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Top merchants por engajamento</h3>
        <div className="space-y-3">
          {k.top_merchants.map((m, i) => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{m.name}</span>
                  <span className="font-mono text-slate-500">{m.members.toLocaleString('pt-BR')} membros · R$ {m.revenue.toLocaleString('pt-BR')}</span>
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
    </div>
  );
}