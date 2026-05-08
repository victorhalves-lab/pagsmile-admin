import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Package } from 'lucide-react';

/**
 * Mostra o "tamanho" do impacto antes de salvar.
 */
export default function CouponImpactIndicator({ form }) {
  // Mock: estimar volume/audiência baseado em config
  const estimateProducts = form.applies_to === 'all_products' ? 340 : 28;
  const estimateAudience = form.is_nominal ? 1 : (form.audience_segment === 'vip' ? 84 : 2300);

  return (
    <Card className="border-[#2bc196]/30 bg-[#2bc196]/5">
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <Target className="w-4 h-4 text-[#2bc196] mt-0.5" />
          <div>
            <p className="text-xs font-semibold">Impacto estimado</p>
            <p className="text-[10px] text-slate-500">Quando ativar este cupom</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-slate-900 rounded p-2">
            <div className="flex items-center gap-1.5">
              <Package className="w-3 h-3 text-slate-500" />
              <p className="text-[10px] text-slate-500">Produtos elegíveis</p>
            </div>
            <p className="text-sm font-bold mt-0.5">~{estimateProducts}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded p-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-slate-500" />
              <p className="text-[10px] text-slate-500">Clientes elegíveis</p>
            </div>
            <p className="text-sm font-bold mt-0.5">~{estimateAudience.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}