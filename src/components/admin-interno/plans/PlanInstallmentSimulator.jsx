import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp } from 'lucide-react';
import { calculateAutoRate } from '@/lib/mdrCalculator';

/**
 * Simulador de parcelas 1-12x usando o mdrCalculator existente.
 * Permite o cliente/admin ver a taxa efetiva e o valor líquido por parcela.
 */
export default function PlanInstallmentSimulator({ plan }) {
  const [amount, setAmount] = useState(1000);

  const rows = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
      const rate = calculateAutoRate({
        baseRate: plan.card.mdr_1x,
        anticipationRateMonthly: plan.anticipation.rate_monthly,
        installments: n,
      });
      const gatewayCost = plan.card.gateway_approved;
      const antifraudCost = plan.card.antifraud_per_tx;
      const threedsCost = plan.card.threeds_per_auth;
      const fixedCostsTotal = gatewayCost + antifraudCost + threedsCost;
      const mdrCost = (amount * rate) / 100;
      const totalCost = mdrCost + fixedCostsTotal;
      const netReceived = amount - totalCost;
      const installmentValue = amount / n;

      return { n, rate, mdrCost, fixedCostsTotal, totalCost, netReceived, installmentValue };
    });
  }, [amount, plan]);

  return (
    <Card className="border-2 border-[#2bc196]/20 bg-gradient-to-br from-[#2bc196]/5 to-white">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-[#2bc196]" />
              <h4 className="font-bold text-sm text-slate-900">Simulador de parcelas (1x a 12x)</h4>
            </div>
            <p className="text-[11px] text-slate-500">Taxa efetiva = MDR base + custo de antecipação por parcela</p>
          </div>

          <div className="flex items-end gap-2">
            <div>
              <Label className="text-[10px] uppercase tracking-wide text-slate-500">Valor da venda</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="h-9 w-32 mt-1 font-mono"
                step={100}
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-2 px-2 font-semibold">Parcelas</th>
                <th className="text-right py-2 px-2 font-semibold">Taxa</th>
                <th className="text-right py-2 px-2 font-semibold hidden sm:table-cell">MDR (R$)</th>
                <th className="text-right py-2 px-2 font-semibold hidden md:table-cell">Custos fixos</th>
                <th className="text-right py-2 px-2 font-semibold">Total descontado</th>
                <th className="text-right py-2 px-2 font-semibold">Você recebe</th>
                <th className="text-right py-2 px-2 font-semibold hidden lg:table-cell">Por parcela (cliente)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.n} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-2 px-2 font-bold text-slate-900">
                    {r.n}x
                    {r.n === 1 && <Badge variant="outline" className="ml-2 text-[9px] py-0 px-1.5">à vista</Badge>}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-semibold text-slate-900">{r.rate.toFixed(2)}%</td>
                  <td className="py-2 px-2 text-right font-mono text-slate-600 hidden sm:table-cell">R$ {r.mdrCost.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-mono text-slate-600 hidden md:table-cell">R$ {r.fixedCostsTotal.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-mono text-red-600">- R$ {r.totalCost.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-[#2bc196]">R$ {r.netReceived.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right font-mono text-slate-500 hidden lg:table-cell">R$ {r.installmentValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <TrendingUp className="w-3.5 h-3.5 text-[#2bc196]" />
          <span>
            Custos fixos = Gateway (R$ {plan.card.gateway_approved.toFixed(2)}) + Antifraude (R$ {plan.card.antifraud_per_tx.toFixed(2)}) + 3DS (R$ {plan.card.threeds_per_auth.toFixed(2)})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}