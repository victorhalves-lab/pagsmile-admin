import React, { useState } from 'react';
import { Award, Globe, Store, Calendar, Percent, Save, Coins, ShoppingBag, RotateCcw, ToggleLeft } from 'lucide-react';
import { programTypes, programConfigState, channelsCatalog } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

export default function OverviewTab() {
  const [cfg, setCfg] = useState(programConfigState);
  const p = cfg.pontos;
  const setP = (field, val) => setCfg({ ...cfg, pontos: { ...p, [field]: val } });

  return (
    <div className="space-y-5">
      {/* Tipo de programa */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-mint-500" /> Tipo de programa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {programTypes.map((t) => (
            <button key={t.id} onClick={() => setCfg({ ...cfg, type: t.id })} className={`p-3 rounded-lg border text-left transition-colors ${cfg.type === t.id ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                <span className={`font-semibold text-sm ${cfg.type === t.id ? 'text-mint-700 dark:text-mint-300' : 'text-slate-700 dark:text-slate-200'}`}>{t.name}</span>
              </div>
              <p className="text-xs text-slate-500">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Config condicional por tipo */}
      {(cfg.type === 'pontos' || cfg.type === 'hibrido') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Coins className="w-4 h-4 text-mint-500" /> Regras de Pontos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Pontos por R$1 gasto</label>
              <input type="number" step="0.1" value={p.base_rate} onChange={(e) => setP('base_rate', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Arredondamento</label>
              <select value={p.rounding} onChange={(e) => setP('rounding', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="down">Para baixo</option><option value="up">Para cima</option><option value="nearest">Mais próximo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Compra mínima (R$)</label>
              <input type="number" value={p.min_purchase_to_earn} onChange={(e) => setP('min_purchase_to_earn', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Validade (dias)</label>
              <input type="number" value={p.validity_days} onChange={(e) => setP('validity_days', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Política de expiração</label>
              <select value={p.expiry_policy} onChange={(e) => setP('expiry_policy', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="rolling">Rolling (renova ao pontuar)</option><option value="fixed">Fixa (data determinada)</option><option value="never">Nunca expira</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Bônus 1ª compra (pts)</label>
              <input type="number" value={p.bonus_first_purchase} onChange={(e) => setP('bonus_first_purchase', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5"><Percent className="w-3 h-3" /> Pontua sobre: {p.earn_on?.map((x) => x === 'subtotal' ? 'Subtotal' : x).join(', ')}</p>
        </div>
      )}

      {(cfg.type === 'niveis' || cfg.type === 'hibrido') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-mint-500" /> Política de Níveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Critério de subida</label>
              <select value={cfg.niveis.criteria} onChange={(e) => setCfg({ ...cfg, niveis: { ...cfg.niveis, criteria: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="points">Pontos acumulados</option><option value="spend">Gasto total</option><option value="orders">Nº de pedidos</option><option value="hybrid">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Subida</label>
              <select value={cfg.niveis.upgrade} onChange={(e) => setCfg({ ...cfg, niveis: { ...cfg.niveis, upgrade: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="auto">Automática</option><option value="manual">Manual (aprovação)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Rebaixa após (dias inativo)</label>
              <input type="number" value={cfg.niveis.downgrade_after_days} onChange={(e) => setCfg({ ...cfg, niveis: { ...cfg.niveis, downgrade_after_days: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Carência (dias)</label>
              <input type="number" value={cfg.niveis.grace_period_days} onChange={(e) => setCfg({ ...cfg, niveis: { ...cfg.niveis, grace_period_days: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Reset</label>
              <select value={cfg.niveis.reset_policy} onChange={(e) => setCfg({ ...cfg, niveis: { ...cfg.niveis, reset_policy: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="lifetime">Vitalício</option><option value="annual">Anual</option><option value="rolling_12m">Janela 12 meses</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {cfg.type === 'hibrido' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><ToggleLeft className="w-4 h-4 text-mint-500" /> Interação entre moedas (Híbrido)</h3>
          <div className="space-y-2">
            {[
              { k: 'cashback_counts_toward_tier', label: 'Cashback conta para subir de nível' },
              { k: 'points_counts_toward_tier', label: 'Pontos contam para subir de nível' },
              { k: 'cashback_earns_points', label: 'Cashback gera pontos' },
              { k: 'points_redeem_reduces_tier', label: 'Resgate de pontos reduz progressão de nível' },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-slate-700 dark:text-slate-200">{row.label}</span>
                <button onClick={() => setCfg({ ...cfg, hibrido: { ...cfg.hibrido, [row.k]: !cfg.hibrido[row.k] } })} className={`relative w-11 h-6 rounded-full transition-colors ${cfg.hibrido[row.k] ? 'bg-mint-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${cfg.hibrido[row.k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Omnichannel externo */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-mint-500" /> Canais de Fidelidade (Omnichannel)</h3>
        <div className="space-y-4">
          {['Próprio', 'Conversacional', 'Marketplace', 'Social Commerce', 'B2B'].map((grp) => (
            <div key={grp}>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{grp}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {channelsCatalog.filter((c) => c.group === grp).map((ch) => (
                  <button key={ch.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-mint-400 hover:bg-mint-50/40 transition-colors">
                    <Store className="w-3.5 h-3.5 text-mint-500" /> {ch.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Fidelidade se aplica a qualquer canal de venda — não apenas e-commerce/foodtech.</p>
      </div>

      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Save className="w-4 h-4" /> Salvar configuração geral</button>
    </div>
  );
}