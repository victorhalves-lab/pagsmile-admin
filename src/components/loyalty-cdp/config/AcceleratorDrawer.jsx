import React, { useState, useEffect } from 'react';
import { X, Zap, Plus, Trash2, Calendar, DollarSign, Users, Award, Tag, Store, Clock, CreditCard, Package, ChevronRight } from 'lucide-react';
import { acceleratorTriggerDimensions, acceleratorConfigDefaults } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

const iconMap = { Package, Tag, Calendar, CalendarDays: Calendar, CalendarRange: Calendar, Clock, DollarSign, Store, Users, Award, CreditCard };
const dimGroups = ['Catálogo', 'Tempo', 'Valor', 'Contexto'];

export default function AcceleratorDrawer({ open, onClose, onSave, editing }) {
  const [cfg, setCfg] = useState(acceleratorConfigDefaults);
  const [selectedDims, setSelectedDims] = useState([]);

  useEffect(() => {
    if (editing) {
      setCfg({ ...acceleratorConfigDefaults, ...editing });
      setSelectedDims(editing.dimensions || []);
    } else {
      setCfg(acceleratorConfigDefaults);
      setSelectedDims([]);
    }
  }, [editing, open]);

  if (!open) return null;

  const set = (field, val) => setCfg((c) => ({ ...c, [field]: val }));
  const toggleDim = (id) => setSelectedDims((d) => d.includes(id) ? d.filter((x) => x !== id) : [...d, id]);

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm';
  const labelCls = 'text-xs text-slate-500 mb-1 block font-medium';

  const handleSave = () => {
    onSave({ ...cfg, dimensions: selectedDims, id: editing?.id || `a${Date.now()}`, status: 'ativa', points_issued: editing?.points_issued || 0, performance: editing?.performance || { conversions: 0, revenue: 0, lift: 0, roi: 0 }, period: cfg.validity.start && cfg.validity.end ? `${cfg.validity.start} a ${cfg.validity.end}` : 'Recorrente' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Zap className="w-4 h-4" /></div>
            <div><h3 className="font-semibold text-slate-900 dark:text-white text-sm">{editing ? 'Editar campanha' : 'Nova campanha aceleradora'}</h3><p className="text-xs text-slate-500">Configure o gatilho e o multiplicador de pontos</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic info */}
          <div className="space-y-3">
            <div><label className={labelCls}>Nome da campanha</label><input value={cfg.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex: 2x pontos em Beleza" className={inputCls} /></div>
            <div><label className={labelCls}>Escopo (descrição curta)</label><input value={cfg.scope} onChange={(e) => set('scope', e.target.value)} placeholder="Ex: Categoria: Beleza" className={inputCls} /></div>
          </div>

          {/* Trigger dimensions */}
          <div>
            <label className={labelCls}>Dimensões de gatilho</label>
            <p className="text-xs text-slate-400 mb-2">Selecione quais dimensões ativam o acelerador. Multi-seleção = todas precisam ser verdadeiras simultaneamente.</p>
            <div className="space-y-3">
              {dimGroups.map((grp) => (
                <div key={grp}>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{grp}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {acceleratorTriggerDimensions.filter((d) => d.group === grp).map((d) => {
                      const Icon = iconMap[d.icon] || Zap;
                      const active = selectedDims.includes(d.id);
                      return (
                        <button key={d.id} onClick={() => toggleDim(d.id)} className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-colors ${active ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-mint-400'}`}>
                          <Icon className="w-3.5 h-3.5" /> {d.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multiplier */}
          <div>
            <label className={labelCls}>Multiplicador</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={() => set('multiplier_mode', 'flat')} className={`p-2.5 rounded-lg border text-sm font-medium ${cfg.multiplier_mode === 'flat' ? 'border-mint-500 bg-mint-50 text-mint-700 dark:bg-mint-500/10 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>Flat (ex: 2x)</button>
              <button onClick={() => set('multiplier_mode', 'progressive')} className={`p-2.5 rounded-lg border text-sm font-medium ${cfg.multiplier_mode === 'progressive' ? 'border-mint-500 bg-mint-50 text-mint-700 dark:bg-mint-500/10 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>Progressivo por valor</button>
            </div>
            {cfg.multiplier_mode === 'flat' ? (
              <div className="flex items-center gap-2">
                <input type="number" step="0.5" value={cfg.flat_multiplier} onChange={(e) => set('flat_multiplier', Number(e.target.value))} className={`${inputCls} w-24`} />
                <span className="text-sm text-slate-500">x pontos</span>
              </div>
            ) : (
              <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                {cfg.progressive.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Carrinho ≥ R$</span>
                    <input type="number" value={p.threshold} onChange={(e) => { const arr = [...cfg.progressive]; arr[i] = { ...p, threshold: Number(e.target.value) }; set('progressive', arr); }} className="flex-1 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <input type="number" step="0.5" value={p.multiplier} onChange={(e) => { const arr = [...cfg.progressive]; arr[i] = { ...p, multiplier: Number(e.target.value) }; set('progressive', arr); }} className="w-16 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
                    <span className="text-xs text-slate-400">x</span>
                    <button onClick={() => set('progressive', cfg.progressive.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => set('progressive', [...cfg.progressive, { threshold: 0, multiplier: 1 }])} className="flex items-center gap-1 text-xs text-mint-600 hover:text-mint-700 font-medium"><Plus className="w-3 h-3" /> Adicionar faixa</button>
              </div>
            )}
          </div>

          {/* Caps & budget */}
          <div>
            <label className={labelCls}>Limites e orçamento</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div><span className="text-[11px] text-slate-400">Máx pts/transação</span><input type="number" value={cfg.cap_per_transaction || ''} onChange={(e) => set('cap_per_transaction', e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={inputCls} /></div>
              <div><span className="text-[11px] text-slate-400">Máx pts/campanha</span><input type="number" value={cfg.cap_per_campaign || ''} onChange={(e) => set('cap_per_campaign', e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={inputCls} /></div>
              <div><span className="text-[11px] text-slate-400">Orçamento total (pts)</span><input type="number" value={cfg.budget_points || ''} onChange={(e) => set('budget_points', e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={inputCls} /></div>
            </div>
            <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm text-slate-600 dark:text-slate-300">Empilhável com outros aceleradores</span>
              <button onClick={() => set('stackable', !cfg.stackable)} className={`relative w-11 h-6 rounded-full transition-colors ${cfg.stackable ? 'bg-mint-500' : 'bg-slate-300 dark:bg-slate-700'}`}><span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${cfg.stackable ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
            </div>
          </div>

          {/* Targeting */}
          <div>
            <label className={labelCls}>Público-alvo</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => set('targeting', { ...cfg.targeting, all_members: true })} className={`p-2.5 rounded-lg border text-sm ${cfg.targeting.all_members ? 'border-mint-500 bg-mint-50 text-mint-700 dark:bg-mint-500/10 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>Todos os membros</button>
              <button onClick={() => set('targeting', { ...cfg.targeting, all_members: false })} className={`p-2.5 rounded-lg border text-sm ${!cfg.targeting.all_members ? 'border-mint-500 bg-mint-50 text-mint-700 dark:bg-mint-500/10 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>Níveis/segmentos específicos</button>
            </div>
            {!cfg.targeting.all_members && (
              <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div><span className="text-[11px] text-slate-400">Níveis</span><div className="flex flex-wrap gap-1.5 mt-1">
                  {['bronze', 'prata', 'ouro', 'diamante'].map((lv) => {
                    const active = cfg.targeting.levels.includes(lv);
                    return <button key={lv} onClick={() => set('targeting', { ...cfg.targeting, levels: active ? cfg.targeting.levels.filter((x) => x !== lv) : [...cfg.targeting.levels, lv] })} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${active ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>{lv}</button>;
                  })}
                </div></div>
                <div><span className="text-[11px] text-slate-400">Segmentos RFV</span><div className="flex flex-wrap gap-1.5 mt-1">
                  {['champions', 'loyal', 'promising', 'at_risk', 'hibernating'].map((sg) => {
                    const active = cfg.targeting.segments.includes(sg);
                    return <button key={sg} onClick={() => set('targeting', { ...cfg.targeting, segments: active ? cfg.targeting.segments.filter((x) => x !== sg) : [...cfg.targeting.segments, sg] })} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${active ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>{sg}</button>;
                  })}
                </div></div>
              </div>
            )}
          </div>

          {/* Validity */}
          <div>
            <label className={labelCls}>Vigência</label>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-[11px] text-slate-400">Início</span><input type="date" value={cfg.validity.start} onChange={(e) => set('validity', { ...cfg.validity, start: e.target.value })} className={inputCls} /></div>
              <div><span className="text-[11px] text-slate-400">Fim (vazio = recorrente)</span><input type="date" value={cfg.validity.end} onChange={(e) => set('validity', { ...cfg.validity, end: e.target.value })} className={inputCls} /></div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={handleSave} disabled={!cfg.name} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"><Zap className="w-4 h-4" /> {editing ? 'Salvar' : 'Criar campanha'}</button>
        </div>
      </div>
    </div>
  );
}