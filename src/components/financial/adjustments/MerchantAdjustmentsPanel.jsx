import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { ADJUSTMENT_TYPES, ADJUSTMENT_REASONS, formatCurrency, MOCK_ADJUSTMENTS } from './mocks/manualAdjustmentsMock';

/**
 * Painel READ-ONLY que o lojista vê dos ajustes aplicados em sua conta.
 * Filtra apenas ajustes executados E que tenham nota visível ao lojista.
 */
export default function MerchantAdjustmentsPanel({ limit = 10 }) {
  // Mock: ajustes do lojista logado (mer_001) executados
  const visibleAdjustments = MOCK_ADJUSTMENTS
    .filter(a => a.merchant.id === 'mer_001' && a.status === 'executed')
    .slice(0, limit);

  const totalCredits = visibleAdjustments
    .filter(a => a.type === 'credit')
    .reduce((s, a) => s + a.amount, 0);

  const totalDebits = visibleAdjustments
    .filter(a => a.type === 'debit')
    .reduce((s, a) => s + a.amount, 0);

  const netImpact = totalCredits - totalDebits;

  if (visibleAdjustments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-violet-600" />
            Ajustes em sua conta
          </span>
          <Badge variant="outline" className="text-[10px]">{visibleAdjustments.length} entradas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-emerald-50 rounded p-2 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" /> Créditos
            </p>
            <p className="text-sm font-bold text-emerald-700">+{formatCurrency(totalCredits)}</p>
          </div>
          <div className="bg-red-50 rounded p-2 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
              <TrendingDown className="w-2.5 h-2.5" /> Débitos
            </p>
            <p className="text-sm font-bold text-red-700">−{formatCurrency(totalDebits)}</p>
          </div>
          <div className="bg-slate-50 rounded p-2 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500">Líquido</p>
            <p className={`text-sm font-bold ${netImpact >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {netImpact >= 0 ? '+' : '−'}{formatCurrency(Math.abs(netImpact))}
            </p>
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {visibleAdjustments.map(adj => {
            const type = ADJUSTMENT_TYPES[adj.type];
            const reason = ADJUSTMENT_REASONS[adj.reason];
            return (
              <div key={adj.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${adj.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <span className={`font-bold text-sm ${adj.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {type.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {adj.merchant_visible_note || reason?.label}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{new Date(adj.executed_at).toLocaleDateString('pt-BR')}</span>
                      <Badge className={`${reason?.color} text-[9px] py-0`}>{reason?.label}</Badge>
                    </div>
                  </div>
                </div>
                <p className={`text-sm font-bold ml-2 ${adj.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {adj.type === 'credit' ? '+' : '−'}{formatCurrency(adj.amount)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 flex items-start gap-1.5">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>Ajustes manuais são aplicados pela equipe PagSmile com auditoria completa. Para mais detalhes, contate o suporte.</span>
        </div>
      </CardContent>
    </Card>
  );
}