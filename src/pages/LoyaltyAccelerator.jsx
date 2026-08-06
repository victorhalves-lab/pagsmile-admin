import React, { useState } from 'react';
import { Zap, Plus, Calendar, TrendingUp, Edit2, Trash2, Target, DollarSign, Percent } from 'lucide-react';
import { acceleratorsRich } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';
import AcceleratorDrawer from '@/components/loyalty-cdp/config/AcceleratorDrawer';

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
  pausada: 'bg-slate-100 text-slate-500 border-slate-200',
};

const dimLabel = {
  product: 'Produto', category: 'Categoria', day_of_week: 'Dia sem.', day_of_month: 'Dia mês',
  month: 'Mês', date_range: 'Período', time_window: 'Horário', spend_threshold: 'Valor',
  channel: 'Canal', segment: 'Segmento', level: 'Nível', payment_method: 'Pagamento',
};

export default function LoyaltyAccelerator() {
  const [campaigns, setCampaigns] = useState(acceleratorsRich);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (c) => { setEditing(c); setDrawerOpen(true); };
  const handleSave = (c) => setCampaigns((prev) => editing ? prev.map((x) => x.id === c.id ? c : x) : [c, ...prev]);
  const remove = (id) => setCampaigns((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acelerador de Pontos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Campanhas de multiplicação de pontos por categoria, dia, período, valor e mais</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Plus className="w-4 h-4" /> Nova campanha</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((a) => (
          <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Zap className="w-5 h-5" /></div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[a.status]}`}>{a.status}</span>
                <button onClick={() => openEdit(a)} className="p-1 rounded-lg text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(a.id)} className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{a.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{a.scope}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-mint-600 font-mono">{a.multiplier}x</span>
              <span className="text-xs text-slate-500">pontos</span>
              {a.stackable && <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-semibold bg-mint-50 text-mint-600 border border-mint-200">EMPILHÁVEL</span>}
            </div>

            {/* Dimensions */}
            {a.dimensions && a.dimensions.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {a.dimensions.map((d) => <span key={d} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">{dimLabel[d] || d}</span>)}
              </div>
            )}

            <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Período</span><span className="text-slate-700 dark:text-slate-200 font-medium">{a.period}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Pontos emitidos</span><span className="font-mono font-semibold text-slate-900 dark:text-white">{a.points_issued.toLocaleString('pt-BR')}</span></div>
              {a.targeting && !a.targeting.all_members && a.targeting.levels?.length > 0 && (
                <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Target className="w-3 h-3" /> Público</span><span className="text-slate-700 dark:text-slate-200">{a.targeting.levels.join(', ')}</span></div>
              )}
            </div>

            {/* Performance */}
            {a.performance && a.performance.conversions > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div><p className="text-[10px] text-slate-400 uppercase">Conversões</p><p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200">{a.performance.conversions}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase">Receita</p><p className="text-sm font-mono font-semibold text-mint-600">R$ {(a.performance.revenue / 1000).toFixed(0)}k</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase">Lift</p><p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200">+{a.performance.lift}%</p></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AcceleratorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} editing={editing} />
    </div>
  );
}