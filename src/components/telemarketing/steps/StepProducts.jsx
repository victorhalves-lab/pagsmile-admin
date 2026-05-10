import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Trash2, ArrowLeft } from 'lucide-react';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function StepProducts({ sale, updateSale, onNext, onBack }) {
  const [draft, setDraft] = useState({ name: '', qty: 1, unit_price: '', sku: '' });

  const items = sale.items || [];

  const addItem = () => {
    if (!draft.name.trim() || !draft.unit_price) return;
    const newItem = {
      name: draft.name.trim(),
      sku: draft.sku.trim(),
      qty: Math.max(1, Number(draft.qty) || 1),
      unit_price: Number(draft.unit_price) || 0,
    };
    const newItems = [...items, newItem];
    updateSale({ items: newItems, total: calcTotal(newItems, sale.discount) });
    setDraft({ name: '', qty: 1, unit_price: '', sku: '' });
  };

  const removeItem = (i) => {
    const newItems = items.filter((_, idx) => idx !== i);
    updateSale({ items: newItems, total: calcTotal(newItems, sale.discount) });
  };

  const calcTotal = (its, discount = 0) => {
    const sub = its.reduce((s, it) => s + it.qty * it.unit_price, 0);
    return Math.max(0, sub - (Number(discount) || 0));
  };

  const subtotal = items.reduce((s, it) => s + it.qty * it.unit_price, 0);
  const total = calcTotal(items, sale.discount);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="w-4 h-4 text-[#2bc196]" /> Etapa 2 · Itens da Venda
        </CardTitle>
        <p className="text-xs text-slate-500">Adicione cada produto/serviço que o cliente está comprando.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form de novo item */}
        <div className="border rounded-lg p-3 bg-slate-50 space-y-2">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-5">
              <Label className="text-xs">Produto / serviço *</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Ex.: Plano Premium Anual"
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <Label className="text-xs">SKU</Label>
              <Input value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} placeholder="opcional" />
            </div>
            <div className="col-span-3 md:col-span-1">
              <Label className="text-xs">Qtd</Label>
              <Input type="number" min="1" value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: e.target.value })} />
            </div>
            <div className="col-span-5 md:col-span-2">
              <Label className="text-xs">Valor unit. (R$) *</Label>
              <Input type="number" step="0.01" min="0" value={draft.unit_price} onChange={(e) => setDraft({ ...draft, unit_price: e.target.value })} placeholder="0,00" />
            </div>
            <div className="col-span-12 md:col-span-2 flex items-end">
              <Button onClick={addItem} disabled={!draft.name || !draft.unit_price} className="w-full bg-[#2bc196] hover:bg-[#25a880]">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>
        </div>

        {/* Lista */}
        {items.length > 0 ? (
          <div className="border rounded-lg divide-y">
            {items.map((it, i) => (
              <div key={i} className="p-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{it.name}</div>
                  <div className="text-xs text-slate-500">
                    {it.sku && `SKU ${it.sku} · `}{it.qty} × {formatBRL(it.unit_price)}
                  </div>
                </div>
                <div className="font-mono font-semibold">{formatBRL(it.qty * it.unit_price)}</div>
                <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg text-sm text-slate-400">
            Nenhum item adicionado ainda.
          </div>
        )}

        {/* Desconto e totais */}
        {items.length > 0 && (
          <div className="border rounded-lg p-3 space-y-2 bg-slate-50">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-mono">{formatBRL(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm">Desconto (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={sale.discount || ''}
                onChange={(e) => updateSale({ discount: Number(e.target.value) || 0, total: calcTotal(items, e.target.value) })}
                className="w-32 text-right"
                placeholder="0,00"
              />
            </div>
            <div className="flex items-center justify-between text-base font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-[#2bc196] font-mono">{formatBRL(total)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button onClick={onNext} disabled={items.length === 0 || total <= 0} className="flex-1 bg-[#2bc196] hover:bg-[#25a880]">
            Prosseguir para pagamento →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}