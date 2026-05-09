import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { fmt } from '@/components/mentor/mocks/channelParametersMock';

/**
 * What-if: "se reduzirmos 0,1pp em todos os spreads de Visa..." — F1538
 */
export default function SpreadMDRWhatIfSimulator({ rules = [] }) {
  const [delta, setDelta] = useState([0]); // pp variation
  const [scope, setScope] = useState('all');

  const filtered = scope === 'all' ? rules : rules.filter((r) => r.brand === scope);
  const totalTx = filtered.reduce((s, r) => s + (r.applied_count || 0), 0);
  const avgTicket = 85; // mock R$
  const monthlyVolume = totalTx * avgTicket;

  const deltaPP = delta[0];
  const deltaPct = deltaPP / 100;
  const monthlyImpact = deltaPct * monthlyVolume;
  const yearlyImpact = monthlyImpact * 12;

  // Elasticidade aproximada: redução de spread aumenta adoção
  const adoptionDelta = -deltaPP * 0.08; // -0.1pp = +0.8% adoption
  const additionalRevenue = -adoptionDelta * monthlyVolume * 0.012; // recovery via volume

  return (
    <Card className="border-violet-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />Simulador What-If · variação global de spread
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold mb-2">Escopo da simulação</p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'visa', 'mastercard', 'elo', 'amex'].map((s) => (
              <Badge
                key={s}
                onClick={() => setScope(s)}
                className={`cursor-pointer ${scope === s ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {s === 'all' ? 'Todas as bandeiras' : s.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold">Variação de spread</p>
            <Badge className={`text-sm font-bold ${deltaPP > 0 ? 'bg-emerald-100 text-emerald-700' : deltaPP < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100'}`}>
              {deltaPP >= 0 ? '+' : ''}{deltaPP.toFixed(2)}pp
            </Badge>
          </div>
          <Slider value={delta} onValueChange={setDelta} min={-0.5} max={0.5} step={0.01} />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>-0.50pp (redução agressiva)</span>
            <span>0</span>
            <span>+0.50pp (alta agressiva)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className={monthlyImpact >= 0 ? 'border-emerald-200' : 'border-red-200'}>
            <CardContent className="p-3">
              <p className="text-[10px] uppercase text-slate-500">Impacto receita/mês</p>
              <p className={`text-lg font-bold flex items-center gap-1 ${monthlyImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {monthlyImpact > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {monthlyImpact >= 0 ? '+' : ''}{fmt(monthlyImpact)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] uppercase text-slate-500">Impacto anualizado</p>
              <p className={`text-lg font-bold ${yearlyImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {yearlyImpact >= 0 ? '+' : ''}{fmt(yearlyImpact)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] uppercase text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" />Adoção esperada</p>
              <p className={`text-lg font-bold ${adoptionDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {adoptionDelta >= 0 ? '+' : ''}{adoptionDelta.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {deltaPP < 0 && additionalRevenue > 0 && (
          <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200">
            <CardContent className="p-3 text-xs">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">💡 Compensação por volume</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Redução de spread pode ser parcialmente compensada por <strong>{fmt(additionalRevenue)}/mês</strong> via aumento de adoção.
                Resultado líquido: <strong className={monthlyImpact + additionalRevenue >= 0 ? 'text-emerald-600' : 'text-red-600'}>{fmt(monthlyImpact + additionalRevenue)}/mês</strong>
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-[10px] text-slate-500 italic">
          Simulação baseada em volume mensal de {totalTx.toLocaleString('pt-BR')} transações ({fmt(monthlyVolume)}) · ticket médio R$ {avgTicket}.
          Elasticidade observada: -0,1pp ≈ +0,8% adoção.
        </div>
      </CardContent>
    </Card>
  );
}