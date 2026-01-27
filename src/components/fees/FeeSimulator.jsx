import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, Sparkles, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function FeeSimulator({
  currentData = {},
  formatCurrency,
  className
}) {
  const [simulatedVolume, setSimulatedVolume] = useState(currentData.totalVolume || 100000);
  const [pixPercentage, setPixPercentage] = useState(currentData.pixPercentage || 30);
  const [pixRate, setPixRate] = useState(currentData.pixRate || 0.99);
  const [cardRate, setCardRate] = useState(currentData.cardRate || 2.49);

  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateSimulation();
  }, [simulatedVolume, pixPercentage, pixRate, cardRate]);

  const calculateSimulation = () => {
    const pixVolume = simulatedVolume * (pixPercentage / 100);
    const cardVolume = simulatedVolume * ((100 - pixPercentage) / 100);

    const pixFees = pixVolume * (pixRate / 100);
    const cardFees = cardVolume * (cardRate / 100);
    const totalFees = pixFees + cardFees;
    const netAmount = simulatedVolume - totalFees;
    const totalFeePercentage = (totalFees / simulatedVolume) * 100;

    // Compare with current
    const currentTotalFees = currentData.totalFees || 0;
    const feesDiff = totalFees - currentTotalFees;
    const feesDiffPercentage = currentTotalFees > 0 ? ((feesDiff / currentTotalFees) * 100) : 0;

    setResults({
      pixVolume,
      cardVolume,
      pixFees,
      cardFees,
      totalFees,
      netAmount,
      totalFeePercentage,
      feesDiff,
      feesDiffPercentage
    });
  };

  const resetToDefaults = () => {
    setSimulatedVolume(currentData.totalVolume || 100000);
    setPixPercentage(currentData.pixPercentage || 30);
    setPixRate(currentData.pixRate || 0.99);
    setCardRate(currentData.cardRate || 2.49);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100">
              <Calculator className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-base">Simulador de Cenários</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Teste diferentes cenários de tarifas</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Resetar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Volume */}
          <div className="space-y-2">
            <Label className="text-sm">Volume de Vendas Esperado</Label>
            <Input
              type="number"
              value={simulatedVolume}
              onChange={(e) => setSimulatedVolume(Number(e.target.value))}
              className="text-right font-mono"
            />
          </div>

          {/* PIX vs Card Split */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">PIX vs Cartão</Label>
              <span className="text-xs text-gray-500">{pixPercentage}% PIX / {100 - pixPercentage}% Cartão</span>
            </div>
            <Slider
              value={[pixPercentage]}
              onValueChange={(val) => setPixPercentage(val[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>100% Cartão</span>
              <span>100% PIX</span>
            </div>
          </div>

          {/* PIX Rate */}
          <div className="space-y-2">
            <Label className="text-sm">Taxa PIX (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={pixRate}
              onChange={(e) => setPixRate(Number(e.target.value))}
              className="text-right font-mono"
            />
          </div>

          {/* Card Rate */}
          <div className="space-y-2">
            <Label className="text-sm">Taxa Cartão (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={cardRate}
              onChange={(e) => setCardRate(Number(e.target.value))}
              className="text-right font-mono"
            />
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="h-px bg-gray-200" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Custo Total de Tarifas</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(results.totalFees)}</p>
                <p className="text-xs text-gray-400">{results.totalFeePercentage.toFixed(2)}% do volume</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Valor Líquido</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(results.netAmount)}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Tarifas PIX</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(results.pixFees)}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Tarifas Cartão</p>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(results.cardFees)}</p>
              </div>
            </div>

            {/* Comparison */}
            {currentData.totalFees > 0 && (
              <div className={cn(
                "p-4 rounded-xl border",
                results.feesDiff < 0 
                  ? "bg-emerald-50 border-emerald-200" 
                  : results.feesDiff > 0 
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex items-center gap-3">
                  {results.feesDiff < 0 ? (
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  ) : results.feesDiff > 0 ? (
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  ) : null}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {results.feesDiff < 0 
                        ? `Economia de ${formatCurrency(Math.abs(results.feesDiff))} (${Math.abs(results.feesDiffPercentage).toFixed(1)}% menos)`
                        : results.feesDiff > 0
                          ? `Custo adicional de ${formatCurrency(results.feesDiff)} (${results.feesDiffPercentage.toFixed(1)}% a mais)`
                          : "Sem alteração nos custos"
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Comparado ao período atual</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Suggestion */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Sugestão do DIA Copilot</p>
                  <p className="text-xs text-gray-600">
                    {pixPercentage < 30 
                      ? "Aumentar a participação de PIX nas vendas pode reduzir significativamente seus custos de tarifas. Considere incentivar pagamentos via PIX com descontos."
                      : pixPercentage > 60
                        ? "Boa estratégia! Com alta participação de PIX, seus custos de tarifas estão otimizados. Continue incentivando essa modalidade."
                        : "Seu mix de pagamentos está equilibrado. Analise se há oportunidade de aumentar o PIX em segmentos específicos de clientes."
                    }
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}