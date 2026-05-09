import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, QrCode, FileText, Wallet, Plus, Trash2, GripVertical, 
  ArrowDown, Sparkles, Percent, Clock, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_TYPES = [
  { value: 'card_a', label: 'Cartão A (principal)', icon: CreditCard, color: 'blue' },
  { value: 'card_b', label: 'Cartão B (alternativo)', icon: CreditCard, color: 'indigo' },
  { value: 'apple_pay', label: 'Apple Pay', icon: Wallet, color: 'slate' },
  { value: 'google_pay', label: 'Google Pay', icon: Wallet, color: 'amber' },
  { value: 'pix', label: 'PIX (com desconto opcional)', icon: QrCode, color: 'emerald' },
  { value: 'pix_express', label: 'PIX Express (5% off)', icon: QrCode, color: 'green' },
  { value: 'boleto', label: 'Boleto Bancário', icon: FileText, color: 'orange' },
  { value: 'two_cards', label: 'Dividir em 2 Cartões', icon: CreditCard, color: 'purple' },
];

const TRIGGER_CONDITIONS = [
  { value: 'any_decline', label: 'Qualquer recusa' },
  { value: 'nsf', label: 'NSF (Insufficient Funds)' },
  { value: 'do_not_honor', label: 'Do Not Honor' },
  { value: 'hard_decline', label: 'Hard Decline' },
  { value: 'timeout', label: 'Timeout do adquirente' },
  { value: 'card_expired', label: 'Cartão expirado' },
  { value: 'velocity', label: 'Velocity check' },
  { value: 'pix_expired', label: 'PIX expirado' },
];

/**
 * RecoveryLadderEditor
 * Editor visual de Recovery Ladder — escada configurável de retentativas cross-method.
 * Cartão A → Cartão B → Apple Pay → PIX (5% off) → Boleto
 */
export default function RecoveryLadderEditor({ initialSteps, onChange }) {
  const [steps, setSteps] = useState(initialSteps || [
    { id: 1, type: 'card_a', trigger: 'any_decline', discount: 0, delay: 0 },
    { id: 2, type: 'card_b', trigger: 'any_decline', discount: 0, delay: 0 },
    { id: 3, type: 'apple_pay', trigger: 'any_decline', discount: 0, delay: 0 },
    { id: 4, type: 'pix_express', trigger: 'any_decline', discount: 5, delay: 0 },
    { id: 5, type: 'boleto', trigger: 'any_decline', discount: 0, delay: 0 },
  ]);

  const updateSteps = (newSteps) => {
    setSteps(newSteps);
    if (onChange) onChange(newSteps);
  };

  const addStep = () => {
    const newId = Math.max(...steps.map(s => s.id), 0) + 1;
    updateSteps([...steps, { id: newId, type: 'pix', trigger: 'any_decline', discount: 0, delay: 0 }]);
  };

  const removeStep = (id) => {
    updateSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id, key, value) => {
    updateSteps(steps.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const moveStep = (idx, dir) => {
    const newSteps = [...steps];
    const target = idx + dir;
    if (target < 0 || target >= newSteps.length) return;
    [newSteps[idx], newSteps[target]] = [newSteps[target], newSteps[idx]];
    updateSteps(newSteps);
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Recovery Ladder</h4>
            <p className="text-xs text-slate-500 max-w-md">
              Configure a escada de retentativas. Quando 1 método falhar, oferta automaticamente o próximo.
            </p>
          </div>
        </div>
        <Button onClick={addStep} size="sm" className="gap-1">
          <Plus className="w-3.5 h-3.5" />
          Adicionar passo
        </Button>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const opt = STEP_TYPES.find(s => s.value === step.type) || STEP_TYPES[0];
          const Icon = opt.icon;
          const trigger = TRIGGER_CONDITIONS.find(t => t.value === step.trigger);

          return (
            <div key={step.id}>
              <div className={cn(
                'flex items-stretch gap-2 rounded-xl border-2 p-3 transition-all hover:shadow-md',
                idx === 0 ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
              )}>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm',
                    idx === 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                                'bg-gradient-to-br from-slate-400 to-slate-500'
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-slate-600 disabled:opacity-20">
                      <GripVertical className="w-3 h-3 rotate-180" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase">Método</Label>
                    <select
                      value={step.type}
                      onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 mt-0.5 bg-white dark:bg-slate-800"
                    >
                      {STEP_TYPES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase">Quando acionar</Label>
                    <select
                      value={step.trigger}
                      onChange={(e) => updateStep(step.id, 'trigger', e.target.value)}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 mt-0.5 bg-white dark:bg-slate-800"
                    >
                      {TRIGGER_CONDITIONS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Percent className="w-3 h-3" /> Desconto (%)
                    </Label>
                    <Input
                      type="number"
                      value={step.discount}
                      onChange={(e) => updateStep(step.id, 'discount', parseFloat(e.target.value) || 0)}
                      className="h-9 text-sm mt-0.5"
                      min={0}
                      max={50}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Delay (s)
                    </Label>
                    <Input
                      type="number"
                      value={step.delay}
                      onChange={(e) => updateStep(step.id, 'delay', parseInt(e.target.value) || 0)}
                      className="h-9 text-sm mt-0.5"
                      min={0}
                    />
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="self-center w-8 h-8"
                  onClick={() => removeStep(step.id)}
                  disabled={steps.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border border-violet-200 dark:border-violet-800">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-violet-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-violet-800 dark:text-violet-300">
              {steps.length} passo{steps.length > 1 ? 's' : ''} configurado{steps.length > 1 ? 's' : ''}
            </p>
            <p className="text-[11px] text-violet-700 dark:text-violet-400 mt-0.5">
              Quando o método falhar, o próximo é ofertado automaticamente. Configure descontos para incentivar conversão.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}