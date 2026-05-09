import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Edit3, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Editor compacto da configuração proposta · Mentor F2908-F2910.
 * Mostra antes/depois lado a lado durante a edição.
 */
export default function MentorSplitProposedConfigEditor({ current, proposed, onChange }) {
  const update = (field, value) => onChange({ ...proposed, [field]: value });

  // Auto-balanceamento merchant_share quando owner_share muda
  const handleOwnerChange = (val) => {
    const owner = parseFloat(val) || 0;
    const additional = proposed.additional_share || 0;
    onChange({
      ...proposed,
      owner_share: owner,
      merchant_share: Math.max(0, 100 - owner - additional),
    });
  };

  const Cell = ({ label, currentVal, proposedComponent, changed }) => (
    <div className={cn('rounded-lg border p-2.5', changed ? 'bg-violet-50 border-violet-300' : 'bg-slate-50 border-slate-200')}>
      <p className="text-[10px] uppercase font-bold text-slate-500">{label}</p>
      <div className="grid grid-cols-2 gap-2 mt-1.5">
        <div>
          <p className="text-[9px] text-slate-400">Atual</p>
          <p className="text-xs font-bold text-slate-700 line-through opacity-70">{currentVal}</p>
        </div>
        <div>
          <p className="text-[9px] text-violet-700">Proposto</p>
          {proposedComponent}
        </div>
      </div>
    </div>
  );

  const ownerChanged = current.owner_share !== proposed.owner_share;
  const merchantChanged = current.merchant_share !== proposed.merchant_share;
  const feeChanged = current.charge_processing_fee !== proposed.charge_processing_fee;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-violet-600" />
          Configuração Proposta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Cell
            label="Distribuição Owner (%)"
            currentVal={`${current.owner_share}%`}
            changed={ownerChanged}
            proposedComponent={
              <Input
                type="number"
                step="0.1"
                value={proposed.owner_share}
                onChange={(e) => handleOwnerChange(e.target.value)}
                className="h-7 text-xs font-bold text-blue-700 mt-0.5"
              />
            }
          />
          <Cell
            label="Distribuição Merchant (%)"
            currentVal={`${current.merchant_share}%`}
            changed={merchantChanged}
            proposedComponent={
              <p className="text-xs font-bold text-emerald-700 mt-1">{proposed.merchant_share?.toFixed(2)}%</p>
            }
          />
        </div>

        <Cell
          label="Tratamento da MDR"
          currentVal={current.charge_processing_fee === 'liquid' ? 'Sobre líquido' : 'Sobre bruto'}
          changed={feeChanged}
          proposedComponent={
            <div className="flex gap-1 mt-0.5">
              {['liquid', 'gross'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update('charge_processing_fee', opt)}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded border',
                    proposed.charge_processing_fee === opt
                      ? 'bg-violet-600 text-white border-violet-700 font-bold'
                      : 'bg-white text-slate-600 border-slate-200'
                  )}
                >
                  {opt === 'liquid' ? 'Líquido' : 'Bruto'}
                </button>
              ))}
            </div>
          }
        />

        {/* Soma 100? */}
        <div
          className={cn(
            'rounded-lg p-2 text-[11px] flex items-center gap-1.5',
            (proposed.owner_share + proposed.merchant_share + (proposed.additional_share || 0)) === 100
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          )}
        >
          <Calculator className="w-3 h-3" />
          Total: {(proposed.owner_share + proposed.merchant_share + (proposed.additional_share || 0)).toFixed(2)}%
          {(proposed.owner_share + proposed.merchant_share + (proposed.additional_share || 0)) !== 100 &&
            ' — deve somar 100%'}
        </div>
      </CardContent>
    </Card>
  );
}