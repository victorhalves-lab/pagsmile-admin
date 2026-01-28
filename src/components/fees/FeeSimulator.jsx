import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, Sparkles, RotateCcw, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import SelectionButton from '@/components/ui/selection-button';

export default function FeeSimulator({
  currentData = {},
  formatCurrency,
  className
}) {
  // Estado para simulação de antecipação
  const [saleAmount, setSaleAmount] = useState(1000);
  const [installments, setInstallments] = useState(1);
  const [mdrRate, setMdrRate] = useState(3.00); // 3%
  const [anticipationRate, setAnticipationRate] = useState(2.00); // 2% a.m.
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    calculateAnticipation();
  }, [saleAmount, installments, mdrRate, anticipationRate]);

  const calculateAnticipation = () => {
    // Fórmula: Valor Líquido = Venda - (Venda * MDR) - (Valor Líquido * TaxaAnt * Meses)
    // No exemplo do usuário:
    // MDR sobre total bruto.
    // Antecipação sobre valor já deduzido do MDR (Valor Líquido Parcial).
    // Prazo: 30 dias (1 mês) para 1ª parcela, 60 dias (2 meses) para 2ª...
    
    // Passo 1: Calcular MDR Total
    const mdrValue = saleAmount * (mdrRate / 100);
    const amountAfterMdr = saleAmount - mdrValue;
    
    // Valor base de cada parcela (após MDR)
    const installmentValueAfterMdr = amountAfterMdr / installments;

    let totalAnticipationFee = 0;
    const installmentsDetails = [];

    for (let i = 1; i <= installments; i++) {
      // Meses a antecipar. Se for 1x, antecipa 1 mês (30 dias). Se for 2x, 1ª parcela 1 mês, 2ª parcela 2 meses.
      const months = i; 
      
      // Taxa de antecipação para esta parcela = Valor da parcela * Taxa mensal * Meses
      const fee = installmentValueAfterMdr * (anticipationRate / 100) * months;
      
      totalAnticipationFee += fee;
      
      installmentsDetails.push({
        number: i,
        baseValue: installmentValueAfterMdr,
        months,
        fee
      });
    }

    const totalFees = mdrValue + totalAnticipationFee;
    const netAmount = saleAmount - totalFees;
    const effectiveRate = (totalFees / saleAmount) * 100;

    setSimulationResult({
      saleAmount,
      mdrValue,
      totalAnticipationFee,
      totalFees,
      netAmount,
      effectiveRate,
      installmentsDetails
    });
  };

  return (
    <Card className={cn("border-l-4 border-l-purple-500", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">Simulador de Antecipação</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Calcule o custo efetivo da antecipação</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Valor da Venda</Label>
            <Input
              type="number"
              value={saleAmount}
              onChange={(e) => setSaleAmount(Number(e.target.value))}
              className="text-right font-mono h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Parcelas</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="text-right font-mono h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">MDR (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={mdrRate}
              onChange={(e) => setMdrRate(Number(e.target.value))}
              className="text-right font-mono h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Taxa Antecipação (% a.m.)</Label>
            <Input
              type="number"
              step="0.01"
              value={anticipationRate}
              onChange={(e) => setAnticipationRate(Number(e.target.value))}
              className="text-right font-mono h-9"
            />
          </div>
        </div>

        {simulationResult && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">MDR Total</p>
                <p className="font-semibold text-gray-700">{formatCurrency(simulationResult.mdrValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Custo Antecipação</p>
                <p className="font-semibold text-purple-600">{formatCurrency(simulationResult.totalAnticipationFee)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Taxa Total (R$)</p>
                <p className="font-semibold text-red-600">{formatCurrency(simulationResult.totalFees)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Taxa Efetiva Total</p>
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                  {simulationResult.effectiveRate.toFixed(2)}%
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Valor Líquido a Receber</span>
              <span className="text-xl font-bold text-emerald-600">{formatCurrency(simulationResult.netAmount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}