import React from 'react';
import { Zap, Plus, Calendar, TrendingUp } from 'lucide-react';
import { accelerators } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function LoyaltyAccelerator() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acelerador de Pontos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Campanhas de multiplicação de pontos por categoria, dia ou horário</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova campanha
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accelerators.map((a) => (
          <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[a.status]}`}>{a.status}</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{a.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{a.scope}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-mint-600 font-mono">{a.multiplier}x</span>
              <span className="text-xs text-slate-500">pontos</span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Período</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{a.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Pontos emitidos</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{a.points_issued.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}