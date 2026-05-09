import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowDownUp } from 'lucide-react';

/**
 * 5º card de Period Summary no Extract.
 * Net Cashflow = entries - exits.
 */
export default function NetCashflowCard({ entries = 250000, exits = 185000 }) {
  const net = entries - exits;
  const positive = net >= 0;
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(v));

  return (
    <Card className={positive ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <ArrowDownUp className={`w-3 h-3 ${positive ? 'text-blue-600' : 'text-orange-600'}`} />
          <p className={`text-xs uppercase tracking-wider ${positive ? 'text-blue-600' : 'text-orange-600'}`}>
            Net Cashflow
          </p>
        </div>
        <p className={`text-lg font-bold mt-1 ${positive ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>
          {positive ? '+' : '-'} {formatCurrency(net)}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          {positive ? 'Saldo positivo no período' : 'Saldo negativo no período'}
        </p>
      </CardContent>
    </Card>
  );
}