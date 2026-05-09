import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, AlertTriangle, CheckCircle2, CreditCard, QrCode, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const METHOD_OPTIONS = [
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, color: 'blue' },
  { value: 'debit_card', label: 'Cartão de Débito', icon: CreditCard, color: 'cyan' },
  { value: 'pix', label: 'PIX', icon: QrCode, color: 'emerald' },
  { value: 'boleto', label: 'Boleto', icon: FileText, color: 'amber' },
];

/**
 * PaymentSplitter
 * UI para dividir um valor total entre múltiplos métodos de pagamento.
 * Suporta a criação de payloads multi-método para Payment/Init da Tuna.
 */
export default function PaymentSplitter({ 
  totalAmount = 1000, 
  onMethodsChange, 
  initialMethods,
  maxMethods = 4 
}) {
  const [methods, setMethods] = useState(
    initialMethods || [
      { id: 1, type: 'credit_card', amount: totalAmount * 0.6, installments: 6 },
      { id: 2, type: 'pix', amount: totalAmount * 0.4, installments: 1 },
    ]
  );

  const sumMethods = methods.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);
  const remaining = totalAmount - sumMethods;
  const isValid = Math.abs(remaining) < 0.01;

  useEffect(() => {
    if (onMethodsChange) onMethodsChange(methods, isValid);
  }, [methods]);

  const addMethod = () => {
    if (methods.length >= maxMethods) return;
    const newId = Math.max(...methods.map(m => m.id)) + 1;
    setMethods([...methods, { id: newId, type: 'credit_card', amount: Math.max(0, remaining), installments: 1 }]);
  };

  const removeMethod = (id) => {
    if (methods.length <= 1) return;
    setMethods(methods.filter(m => m.id !== id));
  };

  const updateMethod = (id, key, value) => {
    setMethods(methods.map(m => m.id === id ? { ...m, [key]: value } : m));
  };

  const distributeEqually = () => {
    const equal = totalAmount / methods.length;
    setMethods(methods.map(m => ({ ...m, amount: equal })));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Dividir Pagamento</h4>
          <p className="text-xs text-slate-500">Total: R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={distributeEqually} className="text-xs h-8">
            Dividir igualmente
          </Button>
          <Button size="sm" variant="outline" onClick={addMethod} disabled={methods.length >= maxMethods} className="text-xs h-8">
            <Plus className="w-3 h-3 mr-1" />
            Método
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {methods.map((method, idx) => {
          const opt = METHOD_OPTIONS.find(o => o.value === method.type) || METHOD_OPTIONS[0];
          const Icon = opt.icon;
          const percent = totalAmount > 0 ? (method.amount / totalAmount) * 100 : 0;

          return (
            <div key={method.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  opt.color === 'blue' && 'bg-blue-50 text-blue-600',
                  opt.color === 'cyan' && 'bg-cyan-50 text-cyan-600',
                  opt.color === 'emerald' && 'bg-emerald-50 text-emerald-600',
                  opt.color === 'amber' && 'bg-amber-50 text-amber-600'
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <select
                  value={method.type}
                  onChange={(e) => updateMethod(method.id, 'type', e.target.value)}
                  className="flex-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800"
                >
                  {METHOD_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {methods.length > 1 && (
                  <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => removeMethod(method.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={method.amount}
                    onChange={(e) => updateMethod(method.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                    step="0.01"
                  />
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {percent.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <Slider
                value={[method.amount]}
                onValueChange={([v]) => updateMethod(method.id, 'amount', v)}
                min={0}
                max={totalAmount}
                step={1}
                className="w-full"
              />

              {method.type === 'credit_card' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Parcelas:</span>
                  <select
                    value={method.installments || 1}
                    onChange={(e) => updateMethod(method.id, 'installments', parseInt(e.target.value))}
                    className="border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-white dark:bg-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n}>{n}x</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={cn(
        'mt-4 p-3 rounded-xl border-2 flex items-center justify-between',
        isValid ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      )}>
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <div>
            <p className={cn('text-sm font-semibold', isValid ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300')}>
              {isValid ? 'Soma válida' : 'Soma divergente'}
            </p>
            <p className={cn('text-xs', isValid ? 'text-emerald-600' : 'text-red-600')}>
              {isValid 
                ? `Total = R$ ${sumMethods.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : `Diferença: R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}