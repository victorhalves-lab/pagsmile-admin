import React, { useState } from 'react';
import { Percent, Calendar, Wallet, Layers, Save, Coins } from 'lucide-react';
import { cashbackConfig } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

const payoutMethods = [
  { id: 'next_purchase', name: 'Crédito na próxima compra', desc: 'Aplica automaticamente no próximo pedido' },
  { id: 'account_credit', name: 'Saldo em conta', desc: 'Acumula como carteira interna' },
  { id: 'withdrawable', name: 'Saque', desc: 'Cliente pode sacar via PIX' },
  { id: 'statement', name: 'Crédito em fatura', desc: 'Abate na fatura do cartão' },
];

export default function CashbackTab() {
  const [cfg, setCfg] = useState(cashbackConfig);
  const set = (k, v) => setCfg({ ...cfg, [k]: v });
  const [excluded, setExcluded] = useState(cfg.exclude_categories);
  const [newExcl, setNewExcl] = useState('');

  const addExcl = () => { if (newExcl) { setExcluded([...excluded, newExcl]); set('exclude_categories', [...excluded, newExcl]); setNewExcl(''); } };
  const removeExcl = (i) => { const n = excluded.filter((_, x) => x !== i); setExcluded(n); set('exclude_categories', n); };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração de Cashback</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Taxa, limites, expiração e forma de payout</p>
      </div>

      {/* Taxa base + limites */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Percent className="w-4 h-4 text-mint-500" /> Taxa e Limites</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Taxa base (%)</label>
            <input type="number" step="0.5" value={cfg.base_rate} onChange={(e) => set('base_rate', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Wallet className="w-3 h-3" /> Cap por transação (R$)</label>
            <input type="number" value={cfg.cap_per_transaction} onChange={(e) => set('cap_per_transaction', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Cap mensal (R$)</label>
            <input type="number" value={cfg.cap_monthly} onChange={(e) => set('cap_monthly', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Compra mínima (R$)</label>
            <input type="number" value={cfg.min_purchase} onChange={(e) => set('min_purchase', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>
        </div>
      </div>

      {/* Expiração + Payout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-mint-500" /> Expiração</h3>
          <label className="text-xs text-slate-500 mb-1 block">Cashback expira em (dias)</label>
          <input type="number" value={cfg.expiration_days} onChange={(e) => set('expiration_days', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          <p className="text-xs text-slate-400 mt-2">Após expirar, o saldo não utilizado retorna ao programa.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Coins className="w-4 h-4 text-mint-500" /> Forma de Payout</h3>
          <div className="space-y-2">
            {payoutMethods.map((m) => (
              <button key={m.id} onClick={() => set('payout_method', m.id)} className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${cfg.payout_method === m.id ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-mint-400'}`}>
                <span className={`w-4 h-4 rounded-full border-2 mt-0.5 ${cfg.payout_method === m.id ? 'border-mint-500 bg-mint-500' : 'border-slate-300'}`} />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Taxas por nível */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-mint-500" /> Cashback por Nível</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cfg.tiered_rates.map((t, i) => (
            <div key={t.level} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">{t.level}</p>
              <div className="flex items-center gap-1">
                <input type="number" step="0.5" value={t.rate} onChange={(e) => { const n = [...cfg.tiered_rates]; n[i] = { ...t, rate: Number(e.target.value) }; set('tiered_rates', n); }} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                <span className="text-sm text-slate-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias excluídas */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Categorias que NÃO geram cashback</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {excluded.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200">{c} <button onClick={() => removeExcl(i)} className="text-red-400 hover:text-red-700">×</button></span>
          ))}
          {excluded.length === 0 && <span className="text-xs text-slate-400 italic">Nenhuma exclusão</span>}
        </div>
        <div className="flex gap-2 max-w-xs">
          <input value={newExcl} onChange={(e) => setNewExcl(e.target.value)} placeholder="Ex: gift_cards" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" onKeyDown={(e) => { if (e.key === 'Enter') addExcl(); }} />
          <button onClick={addExcl} className="px-3 py-2 rounded-lg bg-mint-50 text-mint-600 text-sm font-semibold border border-mint-200 hover:bg-mint-100">Adicionar</button>
        </div>
      </div>

      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Save className="w-4 h-4" /> Salvar cashback</button>
    </div>
  );
}