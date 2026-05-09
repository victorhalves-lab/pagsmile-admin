import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Layers, AlertCircle } from 'lucide-react';

/**
 * Builder de split escalonado por faixa de valor (Mentor F2791 + F2889).
 * Cada faixa tem min, max e percentual do owner — diferencial vs Stripe/Adyen.
 */
export default function MentorScaledSplitBuilder({ tiers = [], onChange }) {
  const addTier = () => {
    const last = tiers[tiers.length - 1];
    const newMin = last ? (last.max || 0) : 0;
    onChange([
      ...tiers,
      { min: newMin, max: newMin + 1000, owner_share: 10, merchant_share: 90 },
    ]);
  };

  const removeTier = (idx) => onChange(tiers.filter((_, i) => i !== idx));

  const updateTier = (idx, field, value) => {
    const next = [...tiers];
    next[idx] = { ...next[idx], [field]: parseFloat(value) || 0 };
    if (field === 'owner_share') {
      next[idx].merchant_share = 100 - (parseFloat(value) || 0);
    }
    onChange(next);
  };

  // Validações
  const hasGap = tiers.some((t, i) => i > 0 && t.min !== tiers[i - 1].max);
  const hasInvalid = tiers.some((t) => t.max <= t.min);

  return (
    <div className="space-y-3 border-l-4 border-l-purple-500 bg-purple-50/40 dark:bg-purple-900/10 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          Faixas de Valor Escalonadas
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addTier} className="gap-1">
          <Plus className="w-3.5 h-3.5" /> Adicionar faixa
        </Button>
      </div>

      <p className="text-[11px] text-purple-700 dark:text-purple-300">
        Quanto maior o ticket, geralmente menor o % retido pelo owner. Ex: até R$100 → 15%; R$100-1000 → 10%; acima → 7%.
      </p>

      {tiers.length === 0 && (
        <div className="text-xs text-slate-400 italic p-4 border-2 border-dashed border-purple-200 rounded-lg text-center">
          Adicione pelo menos uma faixa para configurar este tipo de split.
        </div>
      )}

      {tiers.map((tier, idx) => (
        <div
          key={idx}
          className="grid grid-cols-12 gap-2 items-end bg-white dark:bg-slate-900 rounded-lg p-3 border border-purple-100"
        >
          <div className="col-span-1 text-[10px] font-bold text-purple-700 pb-2">#{idx + 1}</div>
          <div className="col-span-3">
            <Label className="text-[10px] uppercase">De (R$)</Label>
            <Input
              type="number"
              value={tier.min}
              onChange={(e) => updateTier(idx, 'min', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="col-span-3">
            <Label className="text-[10px] uppercase">Até (R$)</Label>
            <Input
              type="number"
              value={tier.max}
              onChange={(e) => updateTier(idx, 'max', e.target.value)}
              className="h-8 text-xs"
              placeholder="∞ se vazio"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-[10px] uppercase">Owner %</Label>
            <Input
              type="number"
              step="0.1"
              value={tier.owner_share}
              onChange={(e) => updateTier(idx, 'owner_share', e.target.value)}
              className="h-8 text-xs font-bold text-blue-700"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-[10px] uppercase">Merchant %</Label>
            <Input
              type="number"
              value={tier.merchant_share}
              readOnly
              className="h-8 text-xs font-bold text-emerald-700 bg-slate-50"
            />
          </div>
          <div className="col-span-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500"
              onClick={() => removeTier(idx)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}

      {(hasGap || hasInvalid) && tiers.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            {hasInvalid && <p>Há faixas com "até" menor ou igual ao "de". Corrija para evitar gaps.</p>}
            {hasGap && <p>Há descontinuidade entre faixas — alguns valores podem não ter regra aplicável.</p>}
          </div>
        </div>
      )}
    </div>
  );
}