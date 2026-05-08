import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Layers, Gift, MapPin, CreditCard, Zap, Plus, Trash2, ShoppingBag,
} from 'lucide-react';

/**
 * Builder de regras avançadas: escalonamento, BOGO, geo, método, gatilho.
 */
export default function CouponAdvancedRules({ form, update }) {
  const tiers = form.tiered_rules || [];

  const addTier = () => {
    update('tiered_rules', [...tiers, { min_amount: 0, discount: 0 }]);
  };
  const updateTier = (idx, field, value) => {
    const next = [...tiers];
    next[idx][field] = parseFloat(value) || 0;
    update('tiered_rules', next);
  };
  const removeTier = (idx) => {
    update('tiered_rules', tiers.filter((_, i) => i !== idx));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Regras avançadas
          <Badge className="bg-amber-100 text-amber-700 text-[9px] border-0">PRO</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Escalonado */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold">Desconto escalonado</p>
                <p className="text-[11px] text-slate-500">Mais compra → mais desconto</p>
              </div>
            </div>
            <Switch
              checked={form.is_tiered || false}
              onCheckedChange={(v) => update('is_tiered', v)}
            />
          </div>
          {form.is_tiered && (
            <div className="space-y-2 mt-3">
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-12">Acima</span>
                  <Input
                    type="number"
                    value={tier.min_amount}
                    onChange={(e) => updateTier(i, 'min_amount', e.target.value)}
                    placeholder="100"
                    className="h-8 text-xs flex-1"
                  />
                  <span className="text-[10px] text-slate-500">→</span>
                  <Input
                    type="number"
                    value={tier.discount}
                    onChange={(e) => updateTier(i, 'discount', e.target.value)}
                    placeholder="10"
                    className="h-8 text-xs flex-1"
                  />
                  <span className="text-[10px] text-slate-500">%</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeTier(i)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={addTier}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar faixa
              </Button>
            </div>
          )}
        </div>

        {/* BOGO */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-pink-600" />
              <div>
                <p className="text-sm font-semibold">Compre X, leve Y (BOGO)</p>
                <p className="text-[11px] text-slate-500">Ou frete grátis acima de valor</p>
              </div>
            </div>
            <Switch
              checked={form.is_bogo || false}
              onCheckedChange={(v) => update('is_bogo', v)}
            />
          </div>
          {form.is_bogo && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <Label className="text-[11px]">Compre</Label>
                <Input
                  type="number"
                  value={form.bogo_buy_qty || ''}
                  onChange={(e) => update('bogo_buy_qty', e.target.value)}
                  placeholder="2"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px]">Leve</Label>
                <Input
                  type="number"
                  value={form.bogo_get_qty || ''}
                  onChange={(e) => update('bogo_get_qty', e.target.value)}
                  placeholder="3"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Geo */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold">Restrição geográfica</p>
                <p className="text-[11px] text-slate-500">Limitar por estado / região</p>
              </div>
            </div>
            <Switch
              checked={form.has_geo_restriction || false}
              onCheckedChange={(v) => update('has_geo_restriction', v)}
            />
          </div>
          {form.has_geo_restriction && (
            <Select
              value={form.geo_scope || 'states'}
              onValueChange={(v) => update('geo_scope', v)}
            >
              <SelectTrigger className="h-8 text-xs mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="states">Estados específicos</SelectItem>
                <SelectItem value="region_se">Apenas Sudeste</SelectItem>
                <SelectItem value="region_sul">Apenas Sul</SelectItem>
                <SelectItem value="exclude_norte">Excluir Norte/Nordeste</SelectItem>
                <SelectItem value="brasil">Apenas Brasil</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Método */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm font-semibold">Restrição de método</p>
                <p className="text-[11px] text-slate-500">Empurrar PIX ou específico</p>
              </div>
            </div>
            <Switch
              checked={form.has_method_restriction || false}
              onCheckedChange={(v) => update('has_method_restriction', v)}
            />
          </div>
          {form.has_method_restriction && (
            <Select
              value={form.method_required || 'pix'}
              onValueChange={(v) => update('method_required', v)}
            >
              <SelectTrigger className="h-8 text-xs mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">Apenas PIX</SelectItem>
                <SelectItem value="card">Apenas cartão</SelectItem>
                <SelectItem value="not_intl">Excluir cartão estrangeiro</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Gatilho automático */}
        <div className="border rounded-lg p-3 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-sm font-semibold">Gatilho automático</p>
                <p className="text-[11px] text-slate-500">Aplicar quando evento ocorrer</p>
              </div>
            </div>
            <Switch
              checked={form.has_trigger || false}
              onCheckedChange={(v) => update('has_trigger', v)}
            />
          </div>
          {form.has_trigger && (
            <Select
              value={form.trigger_event || 'cart_abandon'}
              onValueChange={(v) => update('trigger_event', v)}
            >
              <SelectTrigger className="h-8 text-xs mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cart_abandon">Carrinho abandonado &gt; 1h</SelectItem>
                <SelectItem value="payment_failed">Falha de pagamento</SelectItem>
                <SelectItem value="customer_inactive">Cliente inativo 60+ dias</SelectItem>
                <SelectItem value="subscription_cancel">Cancelamento de subscription</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}