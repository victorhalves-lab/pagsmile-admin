import React, { useState } from 'react';
import { Users, Gift, UserPlus, TrendingUp, Share2, Settings } from 'lucide-react';
import { mgmStats } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';
import MgmConfigTab from '@/components/loyalty-cdp/config/MgmConfigTab';

const kpis = [
  { label: 'Convites enviados', value: mgmStats.invitations_sent.toLocaleString('pt-BR'), icon: Share2 },
  { label: 'Indicações convertidas', value: mgmStats.invitations_converted.toLocaleString('pt-BR'), icon: UserPlus },
  { label: 'Taxa de conversão', value: `${mgmStats.conversion_rate}%`, icon: TrendingUp },
  { label: 'Pontos ao indicador', value: mgmStats.points_to_referrer.toLocaleString('pt-BR'), icon: Gift },
];

export default function LoyaltyMGM() {
  const [tab, setTab] = useState('performance');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Member Get Member</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Programa de indicação: indique amigos e ganhe pontos</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button onClick={() => setTab('performance')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'performance' ? 'bg-white dark:bg-slate-900 text-mint-600 shadow-sm' : 'text-slate-500'}`}>Performance</button>
          <button onClick={() => setTab('config')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'config' ? 'bg-white dark:bg-slate-900 text-mint-600 shadow-sm' : 'text-slate-500'}`}><Settings className="w-3.5 h-3.5" /> Configuração</button>
        </div>
      </div>

      {tab === 'performance' ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2"><k.icon className="w-4 h-4" /></div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-mint-500" /> Top indicadores</h3>
            <div className="space-y-2">
              {mgmStats.top_referrers.map((r, i) => (
                <div key={r.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="w-7 h-7 rounded-full bg-mint-100 text-mint-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1"><p className="text-sm font-medium text-slate-900 dark:text-white">{r.name}</p><p className="text-xs text-slate-500">{r.invites} convites · {r.converted} convertidos</p></div>
                  <span className="font-mono font-bold text-mint-600 text-sm">{r.points.toLocaleString('pt-BR')} pts</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">As regras de indicação agora são configuráveis na aba <strong>Configuração</strong>.</p>
        </>
      ) : (
        <MgmConfigTab />
      )}
    </div>
  );
}