import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { fmt } from '@/components/mentor/mocks/channelParametersMock';
import { fmtPP } from '@/components/mentor/mocks/spreadMdrMock';

export default function SpreadMDRPlansBelowMin({ plans = [] }) {
  if (plans.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10">
        <CardContent className="p-3 text-xs text-emerald-800 dark:text-emerald-200">
          ✅ Nenhum plano comercial abaixo do spread mínimo configurado.
        </CardContent>
      </Card>
    );
  }

  const totalLoss = plans.reduce((s, p) => s + p.estimated_revenue_loss, 0);
  const totalMerchants = plans.reduce((s, p) => s + p.merchant_count, 0);

  return (
    <Card className="border-red-300 bg-red-50/50 dark:bg-red-900/10">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2 text-red-900 dark:text-red-200">
            <AlertTriangle className="w-4 h-4" />Planos comerciais abaixo do spread mínimo
          </span>
          <div className="text-xs">
            <Badge className="bg-red-100 text-red-700">{plans.length} planos</Badge>
            <Badge className="bg-red-100 text-red-700 ml-1">{totalMerchants} lojistas</Badge>
            <Badge className="bg-red-100 text-red-700 ml-1">{fmt(totalLoss)}/mês</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {plans.map((p) => (
          <div key={p.plan_id} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-red-200">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex-1">
                <p className="text-sm font-bold">{p.plan_name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{p.merchant_count} lojistas</Badge>
                  {p.affected_combinations.map((c) => (
                    <Badge key={c} className="text-[9px] bg-amber-100 text-amber-700">{c}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px]">
                  <span>Plano: <strong>{p.plan_spread.toFixed(2)}%</strong></span>
                  <span>Mínimo: <strong className="text-emerald-600">{p.minimum_spread.toFixed(2)}%</strong></span>
                  <Badge className="bg-red-100 text-red-700 text-[9px]">{fmtPP(p.delta_pp)}</Badge>
                  <span className="text-red-600 font-bold">{fmt(p.estimated_revenue_loss)}/mês</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Resolver <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}