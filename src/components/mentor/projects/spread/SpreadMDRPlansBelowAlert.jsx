import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { CARD_BRANDS, PAYMENT_MODALITIES } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Alerta para planos abaixo do mínimo — F1545
 */
export default function SpreadMDRPlansBelowAlert({ plans = [], onCommunicate }) {
  if (plans.length === 0) return null;

  return (
    <Card className="border-amber-300 bg-amber-50/40 dark:bg-amber-900/10">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4" />Planos comerciais abaixo do MDR mínimo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {plans.length} planos atualmente vendidos com MDR menor que o mínimo recém-cadastrado. Total {plans.reduce((s, p) => s + p.merchants, 0)} lojistas afetados.
        </p>
        {plans.map((p) => (
          <div key={p.plan_id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-200">
            <div className="flex-1">
              <p className="text-sm font-bold">{p.plan_name}</p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <Badge variant="outline" className="text-[9px]">{CARD_BRANDS[p.brand]?.label}</Badge>
                <Badge variant="outline" className="text-[9px]">{PAYMENT_MODALITIES[p.modality]?.label}</Badge>
                <span className="text-[10px] text-slate-500">{p.merchants} lojistas</span>
              </div>
            </div>
            <div className="text-right mr-3">
              <p className="text-[10px] text-slate-500">MDR atual / novo mínimo</p>
              <p className="text-sm font-mono">
                <span className="text-red-600">{p.current_mdr.toFixed(2)}%</span>
                {' / '}
                <span>{p.new_min.toFixed(2)}%</span>
              </p>
              <p className="text-[10px] text-amber-700 font-semibold">gap {p.gap.toFixed(2)}pp</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onCommunicate?.(p)}>
              <MessageSquare className="w-3 h-3 mr-1" />Comunicar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}