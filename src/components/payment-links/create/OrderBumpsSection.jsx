import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ShoppingBag, Sparkles, ArrowUp } from 'lucide-react';

export default function OrderBumpsSection({ formData, setFormData }) {
  const orderBumps = formData.order_bumps || [];
  const upsells = formData.upsells || [];

  const addBump = () => {
    setFormData({
      ...formData,
      order_bumps: [...orderBumps, { name: '', price: '', description: '' }],
    });
  };

  const updateBump = (idx, field, value) => {
    const updated = [...orderBumps];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, order_bumps: updated });
  };

  const removeBump = (idx) => {
    setFormData({ ...formData, order_bumps: orderBumps.filter((_, i) => i !== idx) });
  };

  const addUpsell = () => {
    setFormData({
      ...formData,
      upsells: [...upsells, { name: '', price: '', discount: '' }],
    });
  };

  const updateUpsell = (idx, field, value) => {
    const updated = [...upsells];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, upsells: updated });
  };

  const removeUpsell = (idx) => {
    setFormData({ ...formData, upsells: upsells.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Order Bumps & Upsells</h3>
          <p className="text-xs text-slate-500">Aumente ticket médio com ofertas adicionais</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">+15-30% AOV</Badge>
      </div>

      {/* Order bumps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" /> Order Bumps
          </CardTitle>
          <CardDescription className="text-xs">
            Oferta opcional dentro do checkout — "Adicionar X por +R$ Y?"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orderBumps.map((bump, idx) => (
            <div key={idx} className="p-3 border rounded-lg space-y-2 bg-slate-50 dark:bg-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <Label className="text-xs">Nome do bump</Label>
                  <Input
                    placeholder="Ex: E-book complementar"
                    value={bump.name}
                    onChange={(e) => updateBump(idx, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Preço (R$)</Label>
                  <Input
                    type="number"
                    placeholder="47"
                    value={bump.price}
                    onChange={(e) => updateBump(idx, 'price', e.target.value)}
                  />
                </div>
              </div>
              <Input
                placeholder="Descrição curta — porque adicionar"
                value={bump.description}
                onChange={(e) => updateBump(idx, 'description', e.target.value)}
              />
              <Button variant="ghost" size="sm" onClick={() => removeBump(idx)} className="text-red-600">
                <Trash2 className="w-3 h-3 mr-1" /> Remover
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addBump} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Adicionar order bump
          </Button>
        </CardContent>
      </Card>

      {/* Upsells */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-emerald-500" /> Upsells pós-compra
          </CardTitle>
          <CardDescription className="text-xs">
            Após pagar, oferecer produto premium com desconto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upsells.map((up, idx) => (
            <div key={idx} className="p-3 border rounded-lg space-y-2 bg-slate-50 dark:bg-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-1">
                  <Label className="text-xs">Nome do upsell</Label>
                  <Input
                    placeholder="Ex: Plano Premium"
                    value={up.name}
                    onChange={(e) => updateUpsell(idx, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Preço (R$)</Label>
                  <Input
                    type="number"
                    placeholder="497"
                    value={up.price}
                    onChange={(e) => updateUpsell(idx, 'price', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Desconto (%)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={up.discount}
                    onChange={(e) => updateUpsell(idx, 'discount', e.target.value)}
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeUpsell(idx)} className="text-red-600">
                <Trash2 className="w-3 h-3 mr-1" /> Remover
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addUpsell} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Adicionar upsell
          </Button>
        </CardContent>
      </Card>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 text-xs flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 dark:text-blue-300">
          <strong>Dica IA:</strong> Order bumps com ticket entre 20-30% do produto principal convertem 3x mais que ofertas caras.
        </p>
      </div>
    </div>
  );
}