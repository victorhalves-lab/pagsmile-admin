import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Truck, Layers, ArrowRight, Filter } from 'lucide-react';
import { discountRules, discountRuleTypes } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';
import RuleDrawer from './RuleDrawer';

const typeIcon = { percent: Tag, fixed: Tag, fixed_shipping: Truck, free_shipping: Truck, bogo: Layers, progressive: Layers, bundle: Layers };
const statusStyle = { ativa: 'bg-mint-100 text-mint-700 border-mint-200', pausada: 'bg-slate-100 text-slate-500 border-slate-200', programada: 'bg-amber-100 text-amber-700 border-amber-200' };

export default function DiscountsTab() {
  const [rules, setRules] = useState(discountRules);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (r) => { setEditing(r); setDrawerOpen(true); };
  const handleSave = (r) => setRules((prev) => editing ? prev.map((x) => x.id === r.id ? r : x) : [...prev, r]);
  const remove = (id) => setRules((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Regras de Desconto / Oferta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cupons, ofertas, BOGO, progressivo, bundle — com condições e limites</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors"><Plus className="w-4 h-4" /> Nova regra de desconto</button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Filter className="w-3.5 h-3.5" /> Tipos: {discountRuleTypes.map((t) => t.name).join(' · ')}
      </div>

      <div className="space-y-3">
        {rules.map((r) => {
          const Icon = typeIcon[r.type] || Tag;
          const typeMeta = discountRuleTypes.find((t) => t.id === r.type);
          return (
            <div key={r.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{r.name}</h3>
                    <p className="text-xs text-slate-500">Escopo: {r.scope} · Prioridade {r.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[r.status]}`}>{r.status}</span>
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-mint-600 hover:bg-mint-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs mb-2">
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">SE</span>
                {r.conditions.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-400 font-semibold">E</span>}
                    <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">{attrLabel(c)} {opLabel(c)} {valLabel(c)}</span>
                  </React.Fragment>
                ))}
                {r.conditions.length === 0 && <span className="text-slate-400 italic">sempre</span>}
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="px-2 py-1 rounded-md bg-mint-50 text-mint-700 border border-mint-200 text-[11px] font-semibold">ENTÃO {String(r.action.value)}{r.action.unit} ({typeMeta?.name})</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                <span>Canais: {r.channels.join(', ')}</span>
                <span>·</span>
                <span>Usos/cliente: {r.limits.uses_per_customer ?? '∞'}</span>
                <span>·</span>
                <span>Total: {r.limits.total_uses ?? '∞'}</span>
                <span>·</span>
                <span>Desc. máx: R$ {r.limits.max_discount ?? '∞'}</span>
                <span>·</span>
                <span className={r.limits.stackable ? 'text-mint-600 font-semibold' : ''}>{r.limits.stackable ? 'Acumulável' : 'Não acumulável'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <RuleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} mode="discount" discountTypes={discountRuleTypes} rule={editing} />
    </div>
  );
}

function attrLabel(c) {
  const map = { channel: 'Canal', category: 'Categoria', segment: 'Segmento', level: 'Nível', payment_method: 'Pagamento', cart_value: 'Carrinho', items_count: 'Itens', day_of_week: 'Dia', time_window: 'Horário', customer_tag: 'Tag' };
  return map[c.attribute] || c.attribute;
}
function opLabel(c) {
  const map = { in: '∈', not_in: '∉', equals: '=', not_equals: '≠', contains: '⊃', gt: '>', gte: '≥', lt: '<', lte: '≤', between: '↔' };
  return map[c.operator] || c.operator;
}
function valLabel(c) {
  if (Array.isArray(c.value)) return c.value.join(', ');
  return String(c.value);
}