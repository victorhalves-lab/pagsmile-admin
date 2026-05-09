import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

/**
 * Projeção de impacto financeiro · Mentor F2872, F2942.
 * Calcula a variação esperada de receita do owner com a mudança proposta.
 */
export default function SplitTerminalImpactProjection({
  ownerSharePct = 10,
  tpvBefore = 0,
  tpvAfter = 0,
  conflictsCount = 0,
  inactivesCount = 0,
}) {
  const revenueBefore = (tpvBefore * ownerSharePct) / 100;
  const revenueAfter = (tpvAfter * ownerSharePct) / 100;
  const delta = revenueAfter - revenueBefore;
  const deltaPct = revenueBefore > 0 ? (delta / revenueBefore) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Impacto Financeiro Projetado (mensal)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Receita owner ANTES</p>
            <p className="text-xl font-bold text-slate-700">{formatCurrency(revenueBefore)}</p>
            <p className="text-[10px] text-slate-400">{ownerSharePct}% × {formatCurrency(tpvBefore)}</p>
          </div>
          <div className="text-center">
            <ArrowRight className="w-6 h-6 text-blue-600 mx-auto" />
            <Badge
              className={`mt-1 ${delta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
            >
              {delta >= 0 ? '+' : ''}{formatCurrency(delta)} ({deltaPct >= 0 ? '+' : ''}{deltaPct.toFixed(1)}%)
            </Badge>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-blue-300">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Receita owner DEPOIS</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(revenueAfter)}</p>
            <p className="text-[10px] text-slate-400">{ownerSharePct}% × {formatCurrency(tpvAfter)}</p>
          </div>
        </div>

        {/* Avisos */}
        {(conflictsCount > 0 || inactivesCount > 0) && (
          <div className="space-y-1.5">
            {conflictsCount > 0 && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{conflictsCount}</strong> terminal(is) descartado(s) por conflito com outros splits ativos. Resolva manualmente antes de proceder.
                </span>
              </div>
            )}
            {inactivesCount > 0 && (
              <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                <span>
                  <strong>{inactivesCount}</strong> terminal(is) selecionado(s) sem atividade nos últimos 30 dias. Confirme se faz sentido vincular.
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-[10px] text-slate-500 italic text-center">
          * Projeção baseada no TPV histórico dos últimos 30 dias. Não considera sazonalidades nem mudanças de tarifa.
        </p>
      </CardContent>
    </Card>
  );
}