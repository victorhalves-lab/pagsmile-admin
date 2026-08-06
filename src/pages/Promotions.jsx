import React, { useState } from 'react';
import { ShoppingBag, Layers, Package, Plus, Play, Pause, Clock, TrendingUp } from 'lucide-react';
import { promotionsList } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const typeMeta = {
  compre_mais: { label: 'Compre + Pague -', icon: ShoppingBag, color: '#2bc196', bg: 'bg-mint-50 text-mint-700' },
  progressivo: { label: 'Desconto Progressivo', icon: Layers, color: '#002443', bg: 'bg-navy-50 text-navy-700' },
  compre_junto: { label: 'Compre Junto', icon: Package, color: '#5cf7cf', bg: 'bg-cyan-50 text-cyan-700' },
};

const statusMeta = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function Promotions() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? promotionsList : promotionsList.filter((p) => p.type === filter);

  const totalRevenue = promotionsList.reduce((sum, p) => sum + p.revenue, 0);
  const totalUses = promotionsList.reduce((sum, p) => sum + p.uses, 0);
  const activeCount = promotionsList.filter((p) => p.status === 'ativa').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promoções</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Compre + Pague -, Desconto Progressivo e Compre Junto</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Criar promoção
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">Promoções ativas</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">Usos no período</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalUses.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">Receita gerada</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === 'all' ? 'bg-mint-500 text-white border-mint-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}
        >
          Todas
        </button>
        {Object.entries(typeMeta).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === key ? 'bg-mint-500 text-white border-mint-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}
          >
            <meta.icon className="w-3.5 h-3.5" /> {meta.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const meta = typeMeta[p.type];
          return (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.bg}`}>
                  <meta.icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{p.discount}</p>

              <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Escopo</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium text-right">{p.scope}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Período</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{p.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Usos</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{p.uses.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Receita</span>
                  <span className="font-mono font-semibold text-mint-600">R$ {p.revenue.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-mint-600 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-mint-400 transition-colors">
                  Editar
                </button>
                {p.status === 'ativa' ? (
                  <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors">
                    <Pause className="w-3 h-3" /> Pausar
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-xs font-semibold text-white bg-mint-500 hover:bg-mint-600 px-3 py-1.5 rounded-lg transition-colors">
                    <Play className="w-3 h-3" /> Ativar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}