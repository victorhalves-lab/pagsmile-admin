import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { availableValueMock } from '@/components/mentor/mocks/spotAnticipationMock';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function ExposureLimitCard() {
  const { exposure_limit, exposure_current, exposure_utilization_pct } = availableValueMock;
  const isWarning = exposure_utilization_pct >= 80;
  const remaining = exposure_limit - exposure_current;

  return (
    <Card className={isWarning ? 'border-amber-300' : ''}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wallet className="w-5 h-5 text-slate-600" />
          Limite de Exposição
          {isWarning && <Badge className="bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3 mr-1" /> Atenção</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Utilização atual</span>
            <span className="font-bold">{exposure_utilization_pct}%</span>
          </div>
          <Progress value={exposure_utilization_pct} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-[10px] text-slate-500">Limite</p>
            <p className="text-sm font-bold text-blue-700">{formatCurrency(exposure_limit)}</p>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <p className="text-[10px] text-slate-500">Em uso</p>
            <p className="text-sm font-bold text-orange-700">{formatCurrency(exposure_current)}</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-[10px] text-slate-500">Disponível</p>
            <p className="text-sm font-bold text-green-700">{formatCurrency(remaining)}</p>
          </div>
        </div>
        {isWarning && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
            ⚠️ Próximo do limite. Antecipações adicionais podem ser bloqueadas se exposição total ultrapassar {formatCurrency(exposure_limit)}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}