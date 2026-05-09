import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Users, Plus, Trash2, AlertTriangle, CheckCircle2, Building2, Percent, 
  DollarSign, ShieldAlert, ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SplitDesigner — Designer granular de regras de split/marketplace.
 * Cada recipient tem: nome, percentage|amount, liable, charge_processing_fee
 */
export default function SplitDesigner({ totalAmount = 1000, initialSplits, onChange, readOnly = false }) {
  const [splits, setSplits] = useState(initialSplits || [
    { id: 1, name: 'Marketplace (você)', recipientId: 'rec_master', percentage: 10, liable: true, chargeProcessingFee: true, type: 'percentage' },
    { id: 2, name: 'Sub-lojista A', recipientId: 'sub_001', percentage: 70, liable: false, chargeProcessingFee: false, type: 'percentage' },
    { id: 3, name: 'Parceiro B', recipientId: 'sub_002', percentage: 20, liable: false, chargeProcessingFee: false, type: 'percentage' },
  ]);

  const sumPercent = splits.filter(s => s.type === 'percentage').reduce((s, x) => s + (parseFloat(x.percentage) || 0), 0);
  const sumFixed = splits.filter(s => s.type === 'fixed').reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const totalCovered = (totalAmount * sumPercent / 100) + sumFixed;
  const isValid = Math.abs(totalCovered - totalAmount) < 0.01;
  const liableCount = splits.filter(s => s.liable).length;

  useEffect(() => {
    onChange?.(splits, isValid);
  }, [splits]);

  const updateSplits = (s) => setSplits(s);

  const addSplit = () => {
    const id = Math.max(...splits.map(s => s.id), 0) + 1;
    const remaining = Math.max(0, 100 - sumPercent);
    updateSplits([...splits, { id, name: `Recipient ${id}`, recipientId: `rec_${id}`, percentage: remaining, liable: false, chargeProcessingFee: false, type: 'percentage' }]);
  };

  const removeSplit = (id) => {
    if (splits.length <= 1) return;
    updateSplits(splits.filter(s => s.id !== id));
  };

  const updateSplit = (id, key, value) => {
    updateSplits(splits.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-base">Designer de Split</h4>
            <p className="text-xs text-slate-500">Total: R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        {!readOnly && (
          <Button size="sm" onClick={addSplit} disabled={sumPercent >= 100}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Recipient
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {splits.map((split, idx) => {
          const valueGet = split.type === 'percentage' 
            ? (totalAmount * (split.percentage || 0) / 100) 
            : (split.amount || 0);
          
          return (
            <div key={split.id} className={cn(
              'rounded-xl border-2 p-3 space-y-3',
              split.liable ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            )}>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <Input
                  value={split.name}
                  onChange={(e) => updateSplit(split.id, 'name', e.target.value)}
                  className="h-8 text-sm flex-1"
                  readOnly={readOnly}
                />
                <Badge variant="outline" className="font-mono text-[10px]">{split.recipientId}</Badge>
                {!readOnly && splits.length > 1 && (
                  <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => removeSplit(split.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2">
                  <select
                    value={split.type}
                    onChange={(e) => updateSplit(split.id, 'type', e.target.value)}
                    className="w-full h-8 text-xs border border-slate-200 dark:border-slate-700 rounded px-1.5 bg-white dark:bg-slate-800"
                    disabled={readOnly}
                  >
                    <option value="percentage">% (Percentual)</option>
                    <option value="fixed">R$ (Fixo)</option>
                  </select>
                </div>
                <div className="col-span-3">
                  {split.type === 'percentage' ? (
                    <div className="relative">
                      <Input
                        type="number"
                        value={split.percentage}
                        onChange={(e) => updateSplit(split.id, 'percentage', parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm pr-7"
                        readOnly={readOnly}
                      />
                      <Percent className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  ) : (
                    <Input
                      type="number"
                      value={split.amount || 0}
                      onChange={(e) => updateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                      readOnly={readOnly}
                    />
                  )}
                </div>
                <div className="col-span-3 text-sm font-bold text-emerald-600">
                  R$ {valueGet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={split.liable}
                      onChange={(e) => updateSplit(split.id, 'liable', e.target.checked)}
                      disabled={readOnly}
                    />
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>Liable</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={split.chargeProcessingFee}
                      onChange={(e) => updateSplit(split.id, 'chargeProcessingFee', e.target.checked)}
                      disabled={readOnly}
                    />
                    <DollarSign className="w-3 h-3 text-blue-600" />
                    <span>Paga MDR</span>
                  </label>
                </div>
              </div>

              {split.type === 'percentage' && !readOnly && (
                <Slider
                  value={[split.percentage || 0]}
                  onValueChange={([v]) => updateSplit(split.id, 'percentage', v)}
                  min={0}
                  max={100}
                  step={0.1}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Validation summary */}
      <div className={cn(
        'mt-4 p-3 rounded-xl border-2 grid grid-cols-3 gap-3',
        isValid ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      )}>
        <div className="flex items-center gap-2">
          {isValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
          <div>
            <p className="text-xs text-slate-500">Soma % + Fixos</p>
            <p className={cn('text-sm font-bold', isValid ? 'text-emerald-700' : 'text-red-700')}>
              R$ {totalCovered.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Soma percentuais</p>
          <p className="text-sm font-bold">{sumPercent.toFixed(1)}%</p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span className="text-xs">{liableCount} liable</span>
        </div>
      </div>
    </Card>
  );
}