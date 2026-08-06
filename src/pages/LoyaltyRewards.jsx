import React, { useState } from 'react';
import { Gift, Plus, Edit2, Trash2, Tag, Truck, Package, Wallet, Star, Ticket } from 'lucide-react';
import { rewardsCatalog } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const typeMeta = {
  desconto: { label: 'Desconto', icon: Tag, color: '#2bc196' },
  frete: { label: 'Frete Grátis', icon: Truck, color: '#002443' },
  produto: { label: 'Produto', icon: Package, color: '#5cf7cf' },
  cashback: { label: 'Cashback', icon: Wallet, color: '#f59e0b' },
  experiencia: { label: 'Experiência', icon: Star, color: '#8b5cf6' },
  giftcard: { label: 'Gift Card', icon: Ticket, color: '#ec4899' },
};

export default function LoyaltyRewards() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? rewardsCatalog : rewardsCatalog.filter((r) => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recompensas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Catálogo de resgates disponíveis para os membros</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova recompensa
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === 'all' ? 'bg-mint-500 text-white border-mint-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}>
          Todas
        </button>
        {Object.entries(typeMeta).map(([key, meta]) => (
          <button key={key} onClick={() => setFilter(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === key ? 'bg-mint-500 text-white border-mint-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}>
            <meta.icon className="w-3.5 h-3.5" /> {meta.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-4 py-3 font-medium">Recompensa</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium text-right">Pontos</th>
              <th className="px-4 py-3 font-medium text-right">Resgates</th>
              <th className="px-4 py-3 font-medium text-right">Estoque</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((r) => {
              const meta = typeMeta[r.type];
              return (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}20`, color: meta.color }}>
                        <meta.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{meta.label}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-mint-600">{r.points.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-200">{r.redeemed.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{r.stock ?? '∞'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}