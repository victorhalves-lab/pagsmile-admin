import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Zap,
  Calculator,
  TrendingDown,
  DollarSign,
  Calendar,
  Info,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function AnticipationSimulator({ 
  availableAmount = 0, 
  feePercentage = 1.99, 
  onAnticipate,
  isLoading 
}) {
  const [amount, setAmount] = useState(availableAmount);
  const [anticipateAll, setAnticipateAll] = useState(false);

  const simulation = useMemo(() => {
    const requestedAmount = anticipateAll ? availableAmount : amount;
    const avgDays = 15; // Average days to settlement
    const dailyRate = feePercentage / 30;
    const fee = requestedAmount * (dailyRate * avgDays) / 100;
    const netAmount = requestedAmount - fee;

    return {
      grossAmount: requestedAmount,
      fee,
      netAmount,
      effectiveRate: (fee / requestedAmount) * 100 || 0
    };
  }, [amount, anticipateAll, availableAmount, feePercentage]);

  const handleAmountChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setAmount(Math.min(numValue, availableAmount));
    setAnticipateAll(false);
  };

  const handleSliderChange = ([value]) => {
    setAmount(value);
    setAnticipateAll(value === availableAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Simulador de Antecipação
        </CardTitle>
        <CardDescription>
          Calcule quanto você receberá antecipando seus recebíveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Amount */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Disponível para Antecipar</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(availableAmount)}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Valor a Antecipar</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={anticipateAll}
                onCheckedChange={(checked) => {
                  setAnticipateAll(checked);
                  if (checked) setAmount(availableAmount);
                }}
              />
              <span className="text-sm text-gray-600">Antecipar tudo</span>
            </div>
          </div>

          <Input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            disabled={anticipateAll}
            className="text-lg font-semibold"
          />

          <Slider
            value={[amount]}
            onValueChange={handleSliderChange}
            max={availableAmount}
            step={100}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>R$ 0</span>
            <span>{formatCurrency(availableAmount)}</span>
          </div>
        </div>

        {/* Fee Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Taxa de antecipação: <strong>{feePercentage}% ao mês</strong></span>
          </div>
        </div>

        {/* Simulation Results */}
        <div className="border rounded-lg divide-y">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Valor Bruto</span>
            </div>
            <span className="font-semibold">{formatCurrency(simulation.grossAmount)}</span>
          </div>
          <div className="p-4 flex justify-between items-center bg-red-50">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>Taxa de Antecipação</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-red-600">- {formatCurrency(simulation.fee)}</span>
              <p className="text-xs text-red-500">({simulation.effectiveRate.toFixed(2)}%)</p>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center bg-green-50">
            <div className="flex items-center gap-2 text-green-700">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Valor Líquido</span>
            </div>
            <span className="text-xl font-bold text-green-700">
              {formatCurrency(simulation.netAmount)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          disabled={simulation.grossAmount <= 0 || isLoading}
          onClick={() => onAnticipate?.(simulation)}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Antecipar {formatCurrency(simulation.netAmount)}
            </>
          )}
        </Button>

        <Alert>
          <Calendar className="w-4 h-4" />
          <AlertDescription>
            O valor será creditado no seu saldo disponível em até 1 hora.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}