import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { simulatorScenarios } from '@/components/mentor/mocks/spotAnticipationMock';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function MentorSimulatorScenarios() {
  return (
    <Card className="border-violet-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          Cenários Comparativos Mentor
          <Badge className="bg-violet-100 text-violet-700 text-[10px]">F3299 IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 mb-3">
          Compare cenários antes de decidir — simulador inteligente recomenda o melhor para você
        </p>
        <div className="space-y-2">
          {simulatorScenarios.map((sc, i) => (
            <div key={i} className={`border rounded-lg p-3 ${sc.recommended ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {sc.recommended && <Star className="w-4 h-4 text-emerald-600 fill-emerald-500" />}
                  <span className="font-medium text-sm">{sc.label}</span>
                  {sc.recommended && <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Recomendado</Badge>}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="text-slate-500">Taxa:</span> <strong>{sc.rate_pct}%</strong></span>
                  <span><span className="text-slate-500">Líquido:</span> <strong className="text-emerald-600">{formatCurrency(sc.net)}</strong></span>
                </div>
              </div>
              {sc.savings && (
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                  <Lightbulb className="w-3 h-3" />
                  {sc.savings}
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] text-slate-500">
                <span>Valor: {formatCurrency(sc.value)}</span>
                <span>Prazo médio: {sc.term}d</span>
                <span>Taxa: {formatCurrency(sc.rate_value)}</span>
                <span>IOF: {formatCurrency(sc.iof)}</span>
              </div>
              {sc.recommended && (
                <Button size="sm" className="mt-2 w-full" onClick={() => toast.success('Cenário aplicado ao simulador')}>
                  Aplicar este cenário
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}