import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Sparkles } from 'lucide-react';
import { availableValueMock } from '@/components/mentor/mocks/spotAnticipationMock';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AvailableValueDecomposition() {
  const data = availableValueMock;

  return (
    <Card className="border-violet-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600" />
          Como seu valor disponível é calculado
          <Badge className="bg-violet-100 text-violet-700 text-[10px]"><Sparkles className="w-2.5 h-2.5 mr-1" /> Transparência Mentor</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 font-mono text-sm">
        {data.decomposition.map((item, i) => (
          <div key={i} className={`flex justify-between py-2 border-b ${item.type === 'negative' ? 'text-red-600' : item.type === 'positive' ? 'text-slate-700' : 'text-slate-400'}`}>
            <span className="text-xs">{item.label}</span>
            <span className="font-semibold">{item.value < 0 ? '−' : ''}{formatCurrency(Math.abs(item.value))}</span>
          </div>
        ))}
        <div className="flex justify-between py-3 bg-emerald-50 px-3 rounded-lg border-2 border-emerald-200">
          <span className="font-bold text-emerald-700">(=) Valor disponível para antecipação</span>
          <span className="font-bold text-emerald-700 text-base">{formatCurrency(data.available_value)}</span>
        </div>

        {/* Distribuição temporal */}
        <div className="pt-4 mt-2 border-t font-sans">
          <p className="text-xs text-slate-500 mb-2">Distribuição temporal (até vencimento natural):</p>
          <div className="grid grid-cols-4 gap-2">
            {data.receivables_distribution.map((d, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">{d.range}</p>
                <p className="text-sm font-bold">{formatCurrency(d.value)}</p>
                <p className="text-[10px] text-slate-400">{d.count} recebíveis</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}