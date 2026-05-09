import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent, Layers, GitBranch, Calculator, Info, AlertCircle } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const BRAND_LABELS = { visa: 'Visa', mastercard: 'Mastercard', elo: 'Elo', amex: 'Amex', hipercard: 'Hipercard' };
const TYPE_LABELS = { credit_card: 'Crédito', debit_card: 'Débito', pix: 'PIX', boleto: 'Boleto' };

export default function MentorSplitConfigViewer({ ruleConfig, simulations = [] }) {
  if (!ruleConfig) return null;

  const isLiquid = ruleConfig.charge_processing_fee === 'liquid';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-600" />
          Configuração da Divisão (split_rate)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Distribuição visual */}
        <div>
          <p className="text-xs uppercase font-bold text-slate-500 mb-2">Distribuição</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-24 text-xs font-semibold text-slate-700 dark:text-slate-300">Owner</div>
              <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${ruleConfig.owner_share}%` }}
                >
                  {ruleConfig.owner_share}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 text-xs font-semibold text-slate-700 dark:text-slate-300">Merchant</div>
              <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${ruleConfig.merchant_share}%` }}
                >
                  {ruleConfig.merchant_share}%
                </div>
              </div>
            </div>
            {ruleConfig.additional_share_total > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-24 text-xs font-semibold text-slate-700 dark:text-slate-300">Adicionais</div>
                <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                    style={{ width: `${Math.max(ruleConfig.additional_share_total, 2)}%` }}
                  >
                    {ruleConfig.additional_share_total}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tratamento de tarifa de processamento */}
        <div className={`p-3 rounded-lg border ${isLiquid ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <Calculator className={`w-4 h-4 ${isLiquid ? 'text-blue-600' : 'text-amber-600'} mt-0.5 flex-shrink-0`} />
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Tarifa de processamento: {isLiquid ? 'split sobre LÍQUIDO' : 'split sobre BRUTO'}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {isLiquid
                  ? 'MDR e tarifas são deduzidas antes da divisão. Os percentuais aplicam ao valor líquido.'
                  : 'Cada beneficiário paga sua parcela proporcional da tarifa. Os percentuais aplicam ao valor bruto.'}
              </p>
            </div>
          </div>
        </div>

        {/* Condições de aplicabilidade */}
        <div>
          <p className="text-xs uppercase font-bold text-slate-500 mb-2">Condições de aplicabilidade</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-[10px] text-slate-500">Bandeiras</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(ruleConfig.applicable_brands || []).map((b) => (
                  <Badge key={b} variant="outline" className="text-[10px]">{BRAND_LABELS[b] || b}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-[10px] text-slate-500">Tipos de transação</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(ruleConfig.applicable_types || []).map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">{TYPE_LABELS[t] || t}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-[10px] text-slate-500">Valor mínimo / máximo</p>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                {ruleConfig.min_amount ? formatCurrency(ruleConfig.min_amount) : 'sem mín.'} →{' '}
                {ruleConfig.max_amount ? formatCurrency(ruleConfig.max_amount) : 'sem máx.'}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-[10px] text-slate-500">Dias / horários</p>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                {ruleConfig.applicable_days === 'all' ? 'Todos os dias · 24/7' : ruleConfig.applicable_days}
              </p>
            </div>
          </div>
        </div>

        {/* Simulações */}
        {simulations.length > 0 && (
          <div>
            <p className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> Simulações com valores típicos
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900">
                  <tr>
                    <th className="text-left p-2 font-semibold">Transação</th>
                    <th className="text-right p-2 font-semibold text-blue-700">Owner</th>
                    <th className="text-right p-2 font-semibold text-emerald-700">Merchant</th>
                    {simulations[0].additional > 0 && (
                      <th className="text-right p-2 font-semibold text-violet-700">Adicional</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {simulations.map((s, i) => (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="p-2 font-mono">{formatCurrency(s.transaction_amount)}</td>
                      <td className="p-2 text-right font-bold text-blue-700">{formatCurrency(s.owner_receives)}</td>
                      <td className="p-2 text-right font-bold text-emerald-700">{formatCurrency(s.merchant_receives)}</td>
                      {simulations[0].additional > 0 && (
                        <td className="p-2 text-right font-bold text-violet-700">{formatCurrency(s.additional)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}