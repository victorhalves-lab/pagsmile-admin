import React from 'react';
import { Award, Users, Coins, Gift, Star, TrendingUp, Target, Zap, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  loyaltyKpis, membersEvolution, loyaltyFunnel, levelsDistribution,
} from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const kpis = [
  { label: 'Membros ativos', value: loyaltyKpis.active_members.toLocaleString('pt-BR'), icon: Users, accent: 'mint' },
  { label: 'Pontos emitidos', value: loyaltyKpis.points_issued.toLocaleString('pt-BR'), icon: Coins, accent: 'navy' },
  { label: 'Taxa de resgate', value: `${loyaltyKpis.redemption_rate}%`, icon: Target, accent: 'mint' },
  { label: 'Recompensas entregues', value: loyaltyKpis.rewards_delivered.toLocaleString('pt-BR'), icon: Gift, accent: 'navy' },
  { label: 'Engajamento', value: `${loyaltyKpis.engagement_rate}%`, icon: Zap, accent: 'mint' },
  { label: 'Cashback pago (mês)', value: `R$ ${loyaltyKpis.cashback_paid.toLocaleString('pt-BR')}`, icon: TrendingUp, accent: 'navy' },
];

const quickLinks = [
  { label: 'Configuração do Programa', icon: Award, page: 'LoyaltyConfig' },
  { label: 'Níveis & Benefícios', icon: Crown, page: 'LoyaltyLevels' },
  { label: 'Recompensas', icon: Gift, page: 'LoyaltyRewards' },
  { label: 'Gamification', icon: Target, page: 'LoyaltyGamification' },
  { label: 'Acelerador de Pontos', icon: Zap, page: 'LoyaltyAccelerator' },
  { label: 'Member Get Member', icon: Users, page: 'LoyaltyMGM' },
];

export default function LoyaltyDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fidelidade</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Visão geral do seu programa de loyalty</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-mint-50 text-mint-700 text-xs font-semibold border border-mint-200">
            Programa Híbrido · Omnichannel
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.accent === 'mint' ? 'bg-mint-50 text-mint-600' : 'bg-navy-50 text-navy-600'}`}>
                <k.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Members evolution */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Evolução de membros</h3>
            <span className="text-xs text-slate-400">Últimos 7 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={membersEvolution}>
              <defs>
                <linearGradient id="gradMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2bc196" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2bc196" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#002443" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#002443" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="members" stroke="#2bc196" strokeWidth={2} fill="url(#gradMembers)" name="Cadastrados" />
              <Area type="monotone" dataKey="active" stroke="#002443" strokeWidth={2} fill="url(#gradActive)" name="Ativos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Levels distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Distribuição por nível</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={levelsDistribution} dataKey="members" nameKey="level" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {levelsDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {levelsDistribution.map((l) => (
              <div key={l.level} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{l.level}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{l.members.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Funil de engajamento</h3>
          <div className="space-y-3">
            {loyaltyFunnel.map((f, i) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{f.stage}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{f.value.toLocaleString('pt-BR')} · {f.pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${f.pct}%`, background: `linear-gradient(90deg, #2bc196, #5cf7cf)`, opacity: 1 - i * 0.18 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mint-500" /> Acesso rápido
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((q) => (
              <Link
                key={q.page}
                to={createPageUrl(q.page)}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-mint-400 hover:bg-mint-50/50 dark:hover:bg-mint-500/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-mint-100 dark:group-hover:bg-mint-500/20 flex items-center justify-center transition-colors">
                  <q.icon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-mint-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}