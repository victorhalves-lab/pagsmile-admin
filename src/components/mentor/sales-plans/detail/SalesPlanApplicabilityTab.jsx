import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Tag, CreditCard, Network } from 'lucide-react';

export default function SalesPlanApplicabilityTab({ plan }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4" />Estabelecimentos vinculados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{plan?.terminal_count?.toLocaleString('pt-BR') || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">{plan?.merchant_count} merchants únicos · TPV mensal: R$ {((plan?.monthly_tpv || 0) / 1_000_000).toFixed(1)}M</p>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Top 1: Marketplace BR</span><span className="font-mono">38.2%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Top 2: TechStore Plus</span><span className="font-mono">12.1%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Top 3: EduMax</span><span className="font-mono">8.9%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Demais ({(plan?.terminal_count || 0) - 3})</span><span className="font-mono">40.8%</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Tag className="w-4 h-4" />Restrições MCC</CardTitle>
          </CardHeader>
          <CardContent>
            {plan?.mcc_restrictions?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Sem restrições · plano aplicável a todos os MCCs permitidos pelos contratos</p>
            ) : (
              <>
                <p className="text-xs mb-2">Aplicável apenas aos MCCs:</p>
                <div className="flex flex-wrap gap-1.5">
                  {plan?.mcc_restrictions?.map((mcc) => (
                    <Badge key={mcc} variant="outline" className="text-[10px] font-mono">{mcc}</Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Network className="w-4 h-4" />Canais habilitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {plan?.channels?.map((c) => (
                <Badge key={c} className="text-[10px] bg-blue-100 text-blue-700 capitalize">{c}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><CreditCard className="w-4 h-4" />Bandeiras suportadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {plan?.card_brands?.map((b) => (
                <Badge key={b} className="text-[10px] bg-violet-100 text-violet-700 capitalize">{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}