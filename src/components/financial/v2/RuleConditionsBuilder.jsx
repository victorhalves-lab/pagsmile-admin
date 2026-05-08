import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Filter } from 'lucide-react';

const FIELDS = [
  { key: 'amount', label: 'Valor da transação', type: 'number' },
  { key: 'payment_method', label: 'Método de pagamento', type: 'select', options: [
    { value: 'card', label: 'Cartão' },
    { value: 'pix', label: 'PIX' },
    { value: 'boleto', label: 'Boleto' },
  ]},
  { key: 'category', label: 'Categoria do produto', type: 'text' },
  { key: 'installments', label: 'Nº de parcelas', type: 'number' },
];

const OPS = {
  number: [
    { value: 'gt', label: 'maior que' },
    { value: 'gte', label: 'maior ou igual' },
    { value: 'lt', label: 'menor que' },
    { value: 'lte', label: 'menor ou igual' },
    { value: 'between', label: 'entre' },
  ],
  text: [
    { value: 'equals', label: 'igual a' },
    { value: 'contains', label: 'contém' },
  ],
  select: [
    { value: 'equals', label: 'igual a' },
    { value: 'in', label: 'entre as opções' },
  ],
};

/**
 * Builder visual de condições para split rules. Usado no dialog.
 */
export default function RuleConditionsBuilder({ conditions = [], onChange }) {
  const handleAdd = () => {
    onChange([...conditions, { field: 'amount', operator: 'gt', value: '' }]);
  };

  const handleRemove = (idx) => {
    onChange(conditions.filter((_, i) => i !== idx));
  };

  const handleUpdate = (idx, field, val) => {
    const next = [...conditions];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          Condições (opcional)
        </Label>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
        </Button>
      </div>

      {conditions.length === 0 && (
        <div className="text-xs text-slate-400 italic p-3 border border-dashed rounded-lg text-center">
          Sem condições — esta regra se aplica a todas as transações.
        </div>
      )}

      {conditions.map((cond, idx) => {
        const fieldDef = FIELDS.find(f => f.key === cond.field) || FIELDS[0];
        const ops = OPS[fieldDef.type] || OPS.number;
        return (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 rounded-lg">
            <div className="col-span-4">
              <Label className="text-xs">Campo</Label>
              <Select value={cond.field} onValueChange={(v) => handleUpdate(idx, 'field', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FIELDS.map(f => <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Label className="text-xs">Operador</Label>
              <Select value={cond.operator} onValueChange={(v) => handleUpdate(idx, 'operator', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ops.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label className="text-xs">Valor</Label>
              {fieldDef.type === 'select' ? (
                <Select value={cond.value} onValueChange={(v) => handleUpdate(idx, 'value', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {fieldDef.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={fieldDef.type === 'number' ? 'number' : 'text'}
                  value={cond.value}
                  onChange={(e) => handleUpdate(idx, 'value', e.target.value)}
                />
              )}
            </div>
            <div className="col-span-1">
              <Button variant="ghost" size="icon" onClick={() => handleRemove(idx)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}