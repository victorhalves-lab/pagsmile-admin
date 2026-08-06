import React from 'react';
import { Target, Plus, Play, Pause, Trophy, CheckCircle2 } from 'lucide-react';
import { missions } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function LoyaltyGamification() {
  const totalCompletions = missions.reduce((s, m) => s + m.completions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gamification</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Missões e desafios para engajar seus clientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova missão
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center mb-2"><Target className="w-4 h-4" /></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Missões ativas</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{missions.filter((m) => m.status === 'ativa').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center mb-2"><CheckCircle2 className="w-4 h-4" /></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total de conclusões</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{totalCompletions.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2"><Trophy className="w-4 h-4" /></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pontos distribuídos</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">{(missions.reduce((s, m) => s + m.reward * m.completions, 0) / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-4 py-3 font-medium">Missão</th>
              <th className="px-4 py-3 font-medium text-right">Recompensa</th>
              <th className="px-4 py-3 font-medium text-right">Conclusões</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {missions.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{m.name}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-mint-600">{m.reward} pts</td>
                <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-200">{m.completions.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[m.status]}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-mint-600 px-2 py-1 rounded-lg">
                    {m.status === 'ativa' ? <><Pause className="w-3 h-3" /> Pausar</> : <><Play className="w-3 h-3" /> Ativar</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}