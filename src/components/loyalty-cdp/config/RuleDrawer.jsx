import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Layers } from 'lucide-react';
import { conditionAttributes, operators, optionSets, rewardTypes } from '@/components/loyalty-cdp/mocks/loyaltyConfigMocks';

// Drawer genérico para criar/editar regras (acumulação ou desconto)
// Props: open, onClose, onSave, mode ('earning' | 'discount'), discountTypes?, rule (edit) | null
export default function RuleDrawer({ open, onClose, onSave, mode = 'earning', discountTypes, rule = null }) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(10);
  const [status, setStatus] = useState('ativa');
  const [scope, setScope] = useState('Todos os canais');
  const [conditions, setConditions] = useState([]);
  const [actionType, setActionType] = useState(mode === 'earning' ? 'earn_multiplier' : 'percent');
  const [actionValue, setActionValue] = useState(mode === 'earning' ? 2 : 10);
  const [validityStart, setValidityStart] = useState('');
  const [validityEnd, setValidityEnd] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [stackable, setStackable] = useState(false);
  const [usesPerCustomer, setUsesPerCustomer] = useState('');
  const [totalUses, setTotalUses] = useState('');
  const [channels, setChannels] = useState([]);

  const actionTypes = mode === 'earning' ? rewardTypes : discountTypes;

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setPriority(rule.priority);
      setStatus(rule.status);
      setScope(rule.scope);
      setConditions(rule.conditions || []);
      setActionType(rule.action.type);
      setActionValue(rule.action.value);
      setValidityStart(rule.validity?.start || '');
      setValidityEnd(rule.validity?.end || '');
      setMaxDiscount(rule.limits?.max_discount ?? '');
      setStackable(rule.limits?.stackable ?? false);
      setUsesPerCustomer(rule.limits?.uses_per_customer ?? '');
      setTotalUses(rule.limits?.total_uses ?? '');
      setChannels(rule.channels || []);
    } else {
      setName(''); setPriority(10); setStatus('ativa'); setScope('Todos os canais');
      setConditions([]); setActionType(mode === 'earning' ? 'earn_multiplier' : 'percent');
      setActionValue(mode === 'earning' ? 2 : 10); setValidityStart(''); setValidityEnd('');
      setMaxDiscount(''); setStackable(false); setUsesPerCustomer(''); setTotalUses(''); setChannels([]);
    }
  }, [rule, mode]);

  if (!open) return null;

  const addCondition = () => setConditions([...conditions, { attribute: 'channel', operator: 'in', value: [] }]);
  const updateCondition = (idx, field, val) => setConditions(conditions.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  const removeCondition = (idx) => setConditions(conditions.filter((_, i) => i !== idx));

  const toggleChannel = (id) => setChannels(channels.includes(id) ? channels.filter((c) => c !== id) : [...channels, id]);

  const handleSave = () => {
    const unit = actionTypes.find((a) => a.id === actionType)?.unit || '';
    const newRule = {
      id: rule?.id || `r${Date.now()}`,
      name, type: actionType, status, priority: Number(priority),
      scope, conditions, channels,
      action: { type: actionType, value: actionType === 'bogo' || actionType === 'free_shipping' ? actionValue : Number(actionValue), unit },
      validity: { start: validityStart || null, end: validityEnd || null },
    };
    if (mode === 'discount') {
      newRule.limits = {
        max_discount: maxDiscount === '' ? null : Number(maxDiscount),
        stackable, uses_per_customer: usesPerCustomer === '' ? null : Number(usesPerCustomer),
        total_uses: totalUses === '' ? null : Number(totalUses),
      };
    }
    onSave(newRule);
    onClose();
  };

  const renderValueInput = (cond, idx) => {
    const attr = conditionAttributes.find((a) => a.id === cond.attribute);
    if (!attr) return null;
    const ops = operators[attr.type] || [];
    const op = cond.operator || ops[0]?.id;

    if (attr.type === 'select') {
      const opts = optionSets[attr.options] || [];
      return (
        <div className="flex gap-2">
          <select value={op} onChange={(e) => updateCondition(idx, 'operator', e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
            {ops.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <select multiple value={cond.value || []} onChange={(e) => updateCondition(idx, 'value', Array.from(e.target.selectedOptions).map((o) => o.value))} className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs min-h-[60px]">
            {opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      );
    }
    if (attr.type === 'number') {
      const needsTwo = op === 'between';
      return (
        <div className="flex gap-2 flex-wrap">
          <select value={op} onChange={(e) => updateCondition(idx, 'operator', e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
            {ops.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <input type="number" value={Array.isArray(cond.value) ? cond.value[0] ?? '' : cond.value ?? ''} onChange={(e) => updateCondition(idx, 'value', needsTwo ? [e.target.value, cond.value?.[1] ?? ''] : e.target.value)} className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
          {needsTwo && <input type="number" value={cond.value?.[1] ?? ''} onChange={(e) => updateCondition(idx, 'value', [cond.value?.[0] ?? '', e.target.value])} className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />}
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <select value={op} onChange={(e) => updateCondition(idx, 'operator', e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
          {ops.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <input value={cond.value ?? ''} onChange={(e) => updateCondition(idx, 'value', e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Layers className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{rule ? 'Editar regra' : 'Nova regra'}</h3>
              <p className="text-[11px] text-slate-500">{mode === 'earning' ? 'Regra de acumulação' : 'Regra de desconto/oferta'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Nome da regra</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: 2x pontos no PIX" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="ativa">Ativa</option>
                <option value="pausada">Pausada</option>
                <option value="programada">Programada</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Prioridade</label>
              <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Escopo</label>
              <input value={scope} onChange={(e) => setScope(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
          </div>

          {/* Ação / recompensa */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">{mode === 'earning' ? 'Recompensa' : 'Desconto'}</p>
            <div className="flex gap-2">
              <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="flex-1 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                {actionTypes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {actionType !== 'free_shipping' && (
                <input type={text_orNumber(actionType)} value={actionValue} onChange={(e) => setActionValue(actionType === 'bogo' ? e.target.value : Number(e.target.value))} placeholder={actionType === 'bogo' ? '3 por 2' : '0'} className="w-28 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
              )}
              {actionType !== 'bogo' && actionType !== 'free_shipping' && <span className="text-sm text-slate-400 self-center">{actionTypes.find((a) => a.id === actionType)?.unit}</span>}
            </div>
          </div>

          {/* Condições (builder) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase">Condições (SE...)</p>
              <button onClick={addCondition} className="flex items-center gap-1 text-xs font-semibold text-mint-600 hover:text-mint-700"><Plus className="w-3.5 h-3.5" /> Adicionar</button>
            </div>
            <div className="space-y-2">
              {conditions.length === 0 && <p className="text-xs text-slate-400 italic p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-center">Sem condições — regra se aplica a todos</p>}
              {conditions.map((cond, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <select value={cond.attribute} onChange={(e) => { const a = conditionAttributes.find((x) => x.id === e.target.value); const ops = operators[a.type] || []; updateCondition(idx, 'attribute', e.target.value); updateCondition(idx, 'operator', ops[0]?.id); updateCondition(idx, 'value', a.type === 'select' ? [] : ''); }} className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
                      {conditionAttributes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <button onClick={() => removeCondition(idx)} className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {renderValueInput(cond, idx)}
                </div>
              ))}
            </div>
          </div>

          {/* Canais (descontos) */}
          {mode === 'discount' && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Canais válidos</p>
              <div className="grid grid-cols-2 gap-1.5">
                {optionSets.channels.map((c) => (
                  <button key={c.id} onClick={() => toggleChannel(c.id)} className={`px-2 py-1.5 rounded-lg border text-xs font-medium text-left ${channels.includes(c.id) ? 'border-mint-500 bg-mint-50 dark:bg-mint-500/10 text-mint-700 dark:text-mint-300' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}>{c.name}</button>
                ))}
              </div>
            </div>
          )}

          {/* Limites (descontos) */}
          {mode === 'discount' && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Limites e uso</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 mb-0.5 block">Desconto máx. (R$)</label>
                  <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="Sem limite" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-0.5 block">Usos por cliente</label>
                  <input type="number" value={usesPerCustomer} onChange={(e) => setUsesPerCustomer(e.target.value)} placeholder="Ilimitado" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-0.5 block">Usos totais</label>
                  <input type="number" value={totalUses} onChange={(e) => setTotalUses(e.target.value)} placeholder="Ilimitado" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={stackable} onChange={(e) => setStackable(e.target.checked)} className="rounded" /> Acumulável
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Validade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Início</label>
              <input type="date" value={validityStart} onChange={(e) => setValidityStart(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Fim</label>
              <input type="date" value={validityEnd} onChange={(e) => setValidityEnd(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold"><Save className="w-4 h-4" /> Salvar regra</button>
        </div>
      </div>
    </>
  );
}

function text_orNumber(actionType) {
  return actionType === 'bogo' ? 'text' : 'number';
}