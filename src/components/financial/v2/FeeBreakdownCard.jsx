import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, ArrowRight } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/**
 * Componente shared para decomposição transparente de fees em qualquer operação financeira.
 * Uso: saques, antecipações, splits — pricing transparency cross-tela.
 */
export default function FeeBreakdownCard({ title = 'Decomposição de custos', items = [], total, net }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Receipt className="w-4 h-4 text-slate-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {total != null && (
          <div className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-600">Valor bruto</span>
            <span className="font-semibold text-slate-800">{formatCurrency(total)}</span>
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600">{item.label}</span>
              {item.percentage != null && (
                <span className="text-xs text-slate-400">({item.percentage}%)</span>
              )}
            </div>
            <span className={item.value < 0 ? 'text-red-600 font-medium' : 'text-slate-700 font-medium'}>
              {item.value < 0 ? '-' : ''}{formatCurrency(Math.abs(item.value))}
            </span>
          </div>
        ))}
        {net != null && (
          <div className="flex justify-between text-sm pt-3 mt-2 border-t-2 border-emerald-200 bg-emerald-50 -mx-6 px-6 py-3">
            <span className="font-semibold text-emerald-700">Valor líquido</span>
            <span className="font-bold text-emerald-700 text-base">{formatCurrency(net)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}