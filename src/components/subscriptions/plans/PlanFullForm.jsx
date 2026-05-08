import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function PlanFullForm({ formData, setFormData }) {
  const update = (k, v) => setFormData({ ...formData, [k]: v });
  const addBenefit = () => update('benefits', [...(formData.benefits || []), '']);
  const setBenefit = (i, v) => {
    const arr = [...(formData.benefits || [])];
    arr[i] = v;
    update('benefits', arr);
  };
  const removeBenefit = (i) => update('benefits', (formData.benefits || []).filter((_, idx) => idx !== i));

  return (
    <Tabs defaultValue="basic" className="space-y-3">
      <TabsList className="h-8">
        <TabsTrigger value="basic" className="text-xs h-6">Básico</TabsTrigger>
        <TabsTrigger value="pricing" className="text-xs h-6">Preço & Trial</TabsTrigger>
        <TabsTrigger value="payment" className="text-xs h-6">Pagamento</TabsTrigger>
        <TabsTrigger value="visibility" className="text-xs h-6">Visibilidade</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-3">
        <div>
          <Label className="text-xs">Nome do plano *</Label>
          <Input value={formData.name} onChange={(e) => update('name', e.target.value)} className="mt-1 h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs">Descrição</Label>
          <Textarea value={formData.description} onChange={(e) => update('description', e.target.value)} className="mt-1 text-xs" rows={2} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs">Benefícios</Label>
            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={addBenefit}><Plus className="w-3 h-3 mr-0.5" /> Adicionar</Button>
          </div>
          <div className="space-y-1.5">
            {(formData.benefits || []).map((b, i) => (
              <div key={i} className="flex gap-1.5">
                <Input value={b} onChange={(e) => setBenefit(i, e.target.value)} className="h-7 text-xs flex-1" />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeBenefit(i)}><X className="w-3 h-3" /></Button>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Valor *</Label>
            <Input type="number" value={formData.amount} onChange={(e) => update('amount', parseFloat(e.target.value))} className="mt-1 h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs">Frequência</Label>
            <Select value={formData.frequency} onValueChange={(v) => update('frequency', v)}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly" className="text-xs">Semanal</SelectItem>
                <SelectItem value="monthly" className="text-xs">Mensal</SelectItem>
                <SelectItem value="quarterly" className="text-xs">Trimestral</SelectItem>
                <SelectItem value="annual" className="text-xs">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs">Trial (dias)</Label>
          <Input type="number" value={formData.trial_days} onChange={(e) => update('trial_days', parseInt(e.target.value))} className="mt-1 h-8 w-32 text-xs" />
        </div>
      </TabsContent>

      <TabsContent value="payment" className="space-y-3">
        <Label className="text-xs">Métodos de pagamento</Label>
        <div className="space-y-1.5">
          {['card', 'pix', 'boleto'].map((m) => (
            <div key={m} className="flex items-center justify-between p-2 border rounded-lg">
              <span className="text-xs capitalize">{m}</span>
              <Switch
                checked={(formData.payment_methods || []).includes(m)}
                onCheckedChange={(v) => {
                  const set = new Set(formData.payment_methods || []);
                  if (v) set.add(m); else set.delete(m);
                  update('payment_methods', Array.from(set));
                }}
              />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="visibility" className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Plano popular (destaque)</Label>
          <Switch checked={formData.is_popular} onCheckedChange={(v) => update('is_popular', v)} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Plano ativo</Label>
          <Switch checked={formData.status === 'active'} onCheckedChange={(v) => update('status', v ? 'active' : 'inactive')} />
        </div>
      </TabsContent>
    </Tabs>
  );
}