import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Zap, Gift, RotateCcw, ShoppingBag, Star } from 'lucide-react';

export const couponTemplates = [
  {
    id: 'welcome',
    name: 'Boas-vindas',
    icon: Heart,
    color: 'text-pink-600 bg-pink-50',
    description: '10% OFF na primeira compra',
    config: { code: 'BEMVINDO10', name: 'Boas-vindas 10%', type: 'percentage', value: 10, min_purchase_amount: 50, applies_to: 'all_products', usage_limit_per_user: 1 },
  },
  {
    id: 'reactivation',
    name: 'Reativação',
    icon: RotateCcw,
    color: 'text-blue-600 bg-blue-50',
    description: '20% após 60 dias inativo',
    config: { code: 'VOLTA20', name: 'Volte com 20% OFF', type: 'percentage', value: 20, applies_to: 'all_products', usage_limit_per_user: 1 },
  },
  {
    id: 'loyalty',
    name: 'Loyalty / VIP',
    icon: Star,
    color: 'text-amber-600 bg-amber-50',
    description: '5% para clientes VIP',
    config: { code: 'VIP5', name: 'Cupom VIP', type: 'percentage', value: 5, applies_to: 'all_products', is_stackable: true },
  },
  {
    id: 'birthday',
    name: 'Aniversário',
    icon: Gift,
    color: 'text-purple-600 bg-purple-50',
    description: '15% no mês de aniversário',
    config: { code: 'NIVER15', name: 'Mês de aniversário', type: 'percentage', value: 15, applies_to: 'all_products', usage_limit_per_user: 1 },
  },
  {
    id: 'recovery',
    name: 'Recuperação',
    icon: ShoppingBag,
    color: 'text-emerald-600 bg-emerald-50',
    description: '10% para abandono de carrinho',
    config: { code: 'VOLTA10', name: 'Recuperação de carrinho', type: 'percentage', value: 10, min_purchase_amount: 50 },
  },
  {
    id: 'flash',
    name: 'Flash Sale',
    icon: Zap,
    color: 'text-red-600 bg-red-50',
    description: '25% OFF por 24h',
    config: { code: 'FLASH25', name: 'Flash Sale 24h', type: 'percentage', value: 25, applies_to: 'all_products' },
  },
];

export default function CouponTemplatesPicker({ onPick }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2bc196]" />
          Templates rápidos
          <Badge className="bg-[#2bc196]/10 text-[#2bc196] text-[9px] border-0 ml-1">NOVO</Badge>
        </CardTitle>
        <p className="text-xs text-slate-500">Click para aplicar configuração inicial</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {couponTemplates.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.config)}
              className="text-left p-2.5 border rounded-lg hover:border-[#2bc196]/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className={`inline-flex p-1.5 rounded-md ${t.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-semibold mt-1.5">{t.name}</p>
              <p className="text-[10px] text-slate-500">{t.description}</p>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}