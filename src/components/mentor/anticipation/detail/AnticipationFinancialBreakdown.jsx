import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AnticipationFinancialBreakdown({ data }) {
  const taxBase = data.rt_spot_anticipation;
  const proporcional = (taxBase * (data.avg_term_days / 30)).toFixed(3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600" />
          Decomposição Financeira Detalhada
          <Badge className="bg-violet-100 text-violet-700 text-[10px]">F3400 Mentor</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cálculo da taxa */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm space-y-2">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Cálculo da taxa de antecipação</div>
          <div className="flex justify-between">
            <span>Taxa base do plano vigente</span>
            <span className="font-semibold">{taxBase}% ao mês</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Aplicação proporcional ao prazo médio ({data.avg_term_days}d)</span>
            <span>{taxBase}% × ({data.avg_term_days}/30) = {proporcional}%</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
            <span>Valor da taxa retida</span>
            <span className="text-violet-600">{formatCurrency(data.rate_value)}</span>
          </div>
        </div>

        {/* Decomposição final */}
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600">Valor solicitado (vl_ordered)</span>
            <span className="font-mono font-semibold">{formatCurrency(data.vl_ordered)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>(−) Taxa de antecipação</span>
            <span className="font-mono">{formatCurrency(data.rate_value)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>(−) IOF retido</span>
            <span className="font-mono">{formatCurrency(data.iof)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>(−) IR retido na fonte</span>
            <span className="font-mono">{formatCurrency(0)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>(−) ISS sobre serviço financeiro</span>
            <span className="font-mono">{formatCurrency(0)}</span>
          </div>
          <div className="flex justify-between py-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 rounded-lg">
            <span className="font-semibold text-emerald-700">(=) Valor líquido a pagar</span>
            <span className="font-mono font-bold text-emerald-700 text-lg">{formatCurrency(data.total)}</span>
          </div>
        </div>

        {/* Breakdown fiscal */}
        <div className="border rounded-lg p-3 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-sm">Tributação Aplicável</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-500">IOF (0,0041%/dia + 0,38%)</span>
              <p className="font-semibold">{formatCurrency(data.iof)}</p>
            </div>
            <div>
              <span className="text-slate-500">IR (regime PJ)</span>
              <p className="font-semibold">N/A</p>
            </div>
            <div>
              <span className="text-slate-500">ISS</span>
              <p className="font-semibold">N/A</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}