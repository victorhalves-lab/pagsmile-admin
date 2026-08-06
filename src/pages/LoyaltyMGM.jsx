import React from 'react';
import { Users, Gift, UserPlus, TrendingUp, Share2 } from 'lucide-react';
import { mgmStats } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const kpis = [
  { label: 'Convites enviados', value: mgmStats.invitations_sent.toLocaleString('pt-BR'), icon: Share2 },
  { label: 'Indicações convertidas', value: mgmStats.invitations_converted.toLocaleString('pt-BR'), icon: UserPlus },
  { label: 'Taxa de conversão', value: `${mgmStats.conversion_rate}%`, icon: TrendingUp },
  { label: 'Pontos ao indicador', value: mgmStats.points_to_referrer.toLocaleString('pt-BR'), icon: Gift },
];

export default function LoyaltyMGM() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Member Get Member</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Programa de indicação: indique amigos e ganhe pontos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2"><k.icon className="w-4 h-4" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Regras */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Regras de indicação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-1">Pontos para o indicado (1ª compra)</p>
            <p className="text-2xl font-bold text-mint-600 font-mono">100 pts</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-1">Pontos para o indicador (após conversão)</p>
            <p className="text-2xl font-bold text-mint-600 font-mono">500 pts</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">A indicação é confirmada após a primeira compra do amigo indicado.</p>
      </div>

      {/* Top referrers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-mint-500" /> Top indicadores
        </h3>
        <div className="space-y-2">
          {mgmStats.top_referrers.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="w-7 h-7 rounded-full bg-mint-100 text-mint-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-slate-500">{r.invites} convites · {r.converted} convertidos</p>
              </div>
              <span className="font-mono font-bold text-mint-600 text-sm">{r.points.toLocaleString('pt-BR')} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}