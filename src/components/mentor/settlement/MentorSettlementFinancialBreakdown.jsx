import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function MentorSettlementFinancialBreakdown({ financial }) {
  const lines = [
    { label: 'Valor bruto agregado', value: financial.gross_amount, type: 'positive', detail: null },
    { label: `MDR aplicado (média ${financial.mdr_avg_rate}%)`, value: -financial.mdr_amount, type: 'deduction', detail: 'Soma do MDR de cada transação' },
    financial.anticipation_fee > 0 && {
      label: `Taxa de antecipação (em ${((financial.anticipation_volume / financial.gross_amount) * 100).toFixed(0)}% do valor antecipado D+1)`,
      value: -financial.anticipation_fee,
      type: 'deduction',
      detail: `Volume antecipado: ${fmt(financial.anticipation_volume)}`,
    },
    financial.terminal_rental > 0 && {
      label: `Aluguel mensal de terminais (${financial.terminals_charged} terminais × ${fmt(financial.terminal_unit_price)})`,
      value: -financial.terminal_rental,
      type: 'deduction',
      detail: 'Cobrança via desconto da liquidação',
    },
    financial.chargebacks_deducted > 0 && {
      label: `Chargebacks descontados (${financial.chargebacks_count} chargebacks confirmados)`,
      value: -financial.chargebacks_deducted,
      type: 'deduction',
      detail: 'Recursos cobrados de pagamentos anteriores via desconto',
    },
    financial.adjustments > 0 && {
      label: 'Ajuste compensatório',
      value: financial.adjustments,
      type: 'positive',
      detail: financial.adjustments_note,
    },
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-600" />
            Decomposição financeira
          </span>
          {financial.has_anomaly && (
            <Badge className="bg-amber-100 text-amber-700 text-[10px] gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" /> Cálculo atípico
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="group flex items-center justify-between py-2 px-2 rounded hover:bg-slate-50 transition cursor-pointer border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2 flex-1">
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-violet-500" />
                <div>
                  <p className="text-xs text-slate-700 font-medium">{line.label}</p>
                  {line.detail && <p className="text-[10px] text-slate-500 mt-0.5">{line.detail}</p>}
                </div>
              </div>
              <span className={cn(
                'font-mono font-bold text-sm tabular-nums',
                line.type === 'positive' && line.value > 0 ? 'text-slate-800' : 'text-red-700'
              )}>
                {line.value > 0 && line.type === 'positive' ? '' : ''}
                {fmt(Math.abs(line.value))}
                {line.value < 0 || line.type === 'deduction' ? ' −' : ' +'}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-slate-300">
            <span className="text-sm font-black text-slate-800 uppercase">Valor líquido a transferir</span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">{fmt(financial.net_amount)}</span>
          </div>
        </div>

        {financial.expected_net !== financial.net_amount && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2 text-[11px]">
            <p className="font-bold text-amber-900">Divergência esperado vs efetivo</p>
            <p className="text-amber-800">Esperado: {fmt(financial.expected_net)} · Efetivo: {fmt(financial.net_amount)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}