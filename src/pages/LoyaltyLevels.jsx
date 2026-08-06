import React from 'react';
import { Crown, Plus, Edit2, Users } from 'lucide-react';
import { levelsConfig, levelsDistribution } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

export default function LoyaltyLevels() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Níveis & Benefícios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Defina tiers e os benefícios exclusivos de cada nível</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Novo nível
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levelsConfig.map((lvl) => {
          const dist = levelsDistribution.find((d) => d.level === lvl.name);
          return (
            <div key={lvl.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${lvl.color}20`, color: lvl.color }}>
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{lvl.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lvl.threshold}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Membros neste nível:</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white ml-auto">{dist?.members.toLocaleString('pt-BR') ?? '—'}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Benefícios</p>
                {lvl.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: lvl.color }} />
                    <span className="text-slate-600 dark:text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}