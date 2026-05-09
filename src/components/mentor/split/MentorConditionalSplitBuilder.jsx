import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Builder visual condicional Mentor (F2890):
 * matriz de bandeiras × tipos × faixa de valor.
 * Diferencial vs concorrentes (só Tuna tem algo similar).
 */
const BRANDS = [
  { key: 'visa', label: 'Visa' },
  { key: 'mastercard', label: 'Mastercard' },
  { key: 'elo', label: 'Elo' },
  { key: 'amex', label: 'Amex' },
  { key: 'hipercard', label: 'Hipercard' },
];

const METHODS = [
  { key: 'credit_card', label: 'Crédito' },
  { key: 'debit_card', label: 'Débito' },
  { key: 'pix', label: 'PIX' },
  { key: 'boleto', label: 'Boleto' },
];

export default function MentorConditionalSplitBuilder({ value = {}, onChange }) {
  const brands = value.applicable_brands || [];
  const methods = value.applicable_types || [];

  const toggleArr = (field, key) => {
    const arr = value[field] || [];
    const next = arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key];
    onChange({ ...value, [field]: next });
  };

  const update = (field, val) => onChange({ ...value, [field]: val });

  return (
    <div className="space-y-3 border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg p-3">
      <Label className="text-sm flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-amber-600" />
        Condições de Aplicabilidade
      </Label>
      <p className="text-[11px] text-amber-700 dark:text-amber-300">
        Esta regra só será aplicada quando TODAS as condições forem satisfeitas. Ex: split apenas para crédito Visa em
        valores acima de R$50.
      </p>

      {/* Bandeiras */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-amber-100">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Bandeiras aceitas</p>
        <div className="flex flex-wrap gap-1.5">
          {BRANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => toggleArr('applicable_brands', b.key)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md border transition',
                brands.includes(b.key)
                  ? 'bg-amber-600 text-white border-amber-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
        {brands.length === 0 && <p className="text-[10px] text-slate-400 italic mt-1">Nenhuma → aplica em todas as bandeiras</p>}
      </div>

      {/* Tipos */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-amber-100">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Tipos / métodos</p>
        <div className="flex flex-wrap gap-1.5">
          {METHODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => toggleArr('applicable_types', m.key)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md border transition',
                methods.includes(m.key)
                  ? 'bg-amber-600 text-white border-amber-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        {methods.length === 0 && <p className="text-[10px] text-slate-400 italic mt-1">Nenhum → aplica em todos os métodos</p>}
      </div>

      {/* Faixa de valor */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-amber-100">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Faixa de valor (R$)</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px]">Mínimo</Label>
            <Input
              type="number"
              value={value.min_amount || ''}
              onChange={(e) => update('min_amount', e.target.value ? parseFloat(e.target.value) : null)}
              className="h-8 text-xs"
              placeholder="sem mínimo"
            />
          </div>
          <div>
            <Label className="text-[10px]">Máximo</Label>
            <Input
              type="number"
              value={value.max_amount || ''}
              onChange={(e) => update('max_amount', e.target.value ? parseFloat(e.target.value) : null)}
              className="h-8 text-xs"
              placeholder="sem máximo"
            />
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2 text-[11px] text-amber-800 dark:text-amber-200">
        <strong>Resumo:</strong> aplica em{' '}
        {brands.length > 0 ? <Badge className="bg-white text-amber-800 mx-1">{brands.length} bandeira(s)</Badge> : 'todas bandeiras'} ·{' '}
        {methods.length > 0 ? <Badge className="bg-white text-amber-800 mx-1">{methods.length} tipo(s)</Badge> : 'todos tipos'}
        {value.min_amount && <> · ≥ R$ {value.min_amount}</>}
        {value.max_amount && <> · ≤ R$ {value.max_amount}</>}
      </div>
    </div>
  );
}