import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';

const METRICS = [
  { id: 'gmv', name: 'GMV', cat: 'Vendas' },
  { id: 'transactions', name: 'Transações', cat: 'Vendas' },
  { id: 'avg_ticket', name: 'Ticket Médio', cat: 'Vendas' },
  { id: 'approval_rate', name: 'Taxa Aprovação', cat: 'Performance' },
  { id: 'mrr', name: 'MRR', cat: 'SaaS' },
  { id: 'churn', name: 'Churn Rate', cat: 'SaaS' },
  { id: 'ltv', name: 'LTV', cat: 'SaaS' },
  { id: 'chargeback_rate', name: 'Chargeback Rate', cat: 'Risco' },
  { id: 'disputes_count', name: 'Disputas', cat: 'Risco' },
];

const SIZES = [
  { id: '1x1', name: 'Pequeno (3 col)' },
  { id: '2x1', name: 'Médio (6 col)' },
  { id: '3x1', name: 'Grande (9 col)' },
  { id: '4x1', name: 'Largura total (12 col)' },
  { id: '2x2', name: 'Médio Alto' },
  { id: '3x2', name: 'Grande Alto' },
];

export default function WidgetPropertiesPanel({ widget, onChange, onRemove }) {
  if (!widget) {
    return (
      <Card className="p-4">
        <div className="text-center text-xs text-slate-500 py-8">
          <Settings className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          Selecione um widget para editar suas propriedades
        </div>
      </Card>
    );
  }

  const update = (k, v) => onChange?.({ ...widget, [k]: v });

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase text-slate-500">Propriedades</h3>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => onRemove?.(widget.instanceId)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div>
        <Label className="text-[10px] uppercase font-bold text-slate-500">Título</Label>
        <Input value={widget.title || ''} onChange={(e) => update('title', e.target.value)} className="h-8 text-xs" />
      </div>

      <div>
        <Label className="text-[10px] uppercase font-bold text-slate-500">Métrica</Label>
        <Select value={widget.metric || ''} onValueChange={(v) => update('metric', v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {METRICS.map(m => (
              <SelectItem key={m.id} value={m.id} className="text-xs">{m.name} ({m.cat})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] uppercase font-bold text-slate-500">Tamanho</Label>
        <Select value={widget.size || '2x1'} onValueChange={(v) => update('size', v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SIZES.map(s => (
              <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] uppercase font-bold text-slate-500">Período</Label>
        <Select value={widget.period || '30d'} onValueChange={(v) => update('period', v)}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="today" className="text-xs">Hoje</SelectItem>
            <SelectItem value="7d" className="text-xs">Últimos 7 dias</SelectItem>
            <SelectItem value="30d" className="text-xs">Últimos 30 dias</SelectItem>
            <SelectItem value="90d" className="text-xs">Últimos 90 dias</SelectItem>
            <SelectItem value="ytd" className="text-xs">Ano até hoje</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] uppercase font-bold text-slate-500">Cor</Label>
        <div className="flex gap-1 mt-1">
          {['#2bc196', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map(c => (
            <button
              key={c}
              onClick={() => update('color', c)}
              className="w-6 h-6 rounded-md border-2 transition"
              style={{ backgroundColor: c, borderColor: widget.color === c ? '#000' : 'transparent' }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}