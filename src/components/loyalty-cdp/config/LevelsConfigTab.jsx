import React, { useState } from 'react';
import { Crown, Plus, Edit2, Trash2, X, Save, ChevronUp, ChevronDown, Gift } from 'lucide-react';
import { levelsConfig } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';
import { levelFields } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

export default function LevelsConfigTab() {
  const [levels, setLevels] = useState(levelsConfig);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);

  const move = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= levels.length) return;
    const copy = [...levels]; [copy[idx], copy[ni]] = [copy[ni], copy[idx]]; setLevels(copy);
  };
  const remove = (id) => setLevels((p) => p.filter((l) => l.id !== id));
  const handleSave = (lvl) => setLevels((p) => editing ? p.map((x) => x.id === lvl.id ? lvl : x) : [...p, lvl]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Níveis & Benefícios</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Crie níveis, defina pontos para atingir e benefícios escalonados</p>
        </div>
        <button onClick={() => { setEditing(null); setDrawer(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Plus className="w-4 h-4" /> Novo nível</button>
      </div>

      <div className="space-y-3">
        {levels.map((lvl, idx) => (
          <div key={lvl.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-mint-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === levels.length - 1} className="text-slate-300 hover:text-mint-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${lvl.color}20`, color: lvl.color }}><Crown className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{lvl.name}</h3>
                  <p className="text-xs text-slate-500">Threshold: {lvl.threshold}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(lvl); setDrawer(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(lvl.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lvl.benefits.map((b, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300"><Gift className="w-3 h-3" style={{ color: lvl.color }} /> {b}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {drawer && <LevelDrawer level={editing} onClose={() => setDrawer(false)} onSave={(l) => { handleSave(l); setDrawer(false); }} />}
    </div>
  );
}

function LevelDrawer({ level, onClose, onSave }) {
  const [name, setName] = useState(level?.name || '');
  const [color, setColor] = useState(level?.color || '#2bc196');
  const [thresholdType, setThresholdType] = useState(level?.thresholdType || 'points');
  const [thresholdValue, setThresholdValue] = useState(level?.thresholdValue || 0);
  const [benefits, setBenefits] = useState(level?.benefitsList || []);
  const [earnMult, setEarnMult] = useState(level?.earnMult || 1);
  const [cashbackRate, setCashbackRate] = useState(level?.cashbackRate || 0);
  const [discountPct, setDiscountPct] = useState(level?.discountPct || 0);
  const [flags, setFlags] = useState(level?.flags || { free_shipping: false, priority_support: false, exclusive_rewards: false, early_access: false, concierge: false });

  const toggleFlag = (k) => setFlags({ ...flags, [k]: !flags[k] });
  const addBenefit = (b) => setBenefits([...benefits, b]);
  const removeBenefit = (i) => setBenefits(benefits.filter((_, x) => x !== i));

  const handleSave = () => {
    const builtBenefits = [
      `${earnMult} pts por R$1`,
      ...(flags.free_shipping ? ['Frete grátis'] : []),
      ...(cashbackRate > 0 ? [`Cashback ${cashbackRate}%`] : []),
      ...(discountPct > 0 ? [`Desconto ${discountPct}%`] : []),
      ...(flags.priority_support ? ['Atendimento prioritário'] : []),
      ...(flags.exclusive_rewards ? ['Recompensas exclusivas'] : []),
      ...(flags.early_access ? ['Acesso antecipado'] : []),
      ...(flags.concierge ? ['Concierge'] : []),
      ...benefits,
    ];
    const thresholdLabel = thresholdType === 'points' ? `${thresholdValue} pontos` : thresholdType === 'spend' ? `R$ ${thresholdValue}` : `${thresholdValue} pedidos`;
    onSave({ id: level?.id || Date.now(), name, color, threshold: thresholdLabel, benefits: builtBenefits, thresholdType, thresholdValue, benefitsList: benefits, earnMult, cashbackRate, discountPct, flags });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Crown className="w-4 h-4" /></div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{level ? 'Editar nível' : 'Novo nível'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">Nome do nível</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ouro" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Cor</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white" />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Threshold para atingir</p>
            <div className="flex gap-2">
              <select value={thresholdType} onChange={(e) => setThresholdType(e.target.value)} className="px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                {levelFields.thresholdTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input type="number" value={thresholdValue} onChange={(e) => setThresholdValue(Number(e.target.value))} placeholder="0" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Mult. pontos (x)</label>
              <input type="number" step="0.1" value={earnMult} onChange={(e) => setEarnMult(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Cashback (%)</label>
              <input type="number" step="0.5" value={cashbackRate} onChange={(e) => setCashbackRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Desconto (%)</label>
              <input type="number" step="1" value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Benefícios (toggle)</p>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { k: 'free_shipping', l: 'Frete grátis' },
                { k: 'priority_support', l: 'Atendimento prioritário' },
                { k: 'exclusive_rewards', l: 'Recompensas exclusivas' },
                { k: 'early_access', l: 'Acesso antecipado a lançamentos' },
                { k: 'concierge', l: 'Concierge / Gerente dedicado' },
              ].map((row) => (
                <button key={row.k} onClick={() => toggleFlag(row.k)} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left">
                  <span className="text-xs text-slate-700 dark:text-slate-200">{row.l}</span>
                  <span className={`w-9 h-5 rounded-full relative transition-colors ${flags[row.k] ? 'bg-mint-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${flags[row.k] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Benefícios customizados</p>
            <div className="space-y-1.5">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="flex-1 text-xs text-slate-700 dark:text-slate-200">{b}</span>
                  <button onClick={() => removeBenefit(i)} className="text-slate-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <AddBenefit onAdd={addBenefit} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold"><Save className="w-4 h-4" /> Salvar nível</button>
        </div>
      </div>
    </>
  );
}

function AddBenefit({ onAdd }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Novo benefício..." className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" onKeyDown={(e) => { if (e.key === 'Enter' && val) { onAdd(val); setVal(''); } }} />
      <button onClick={() => { if (val) { onAdd(val); setVal(''); } }} className="px-3 py-1.5 rounded-lg bg-mint-50 text-mint-600 text-xs font-semibold border border-mint-200 hover:bg-mint-100"><Plus className="w-3.5 h-3.5" /></button>
    </div>
  );
}