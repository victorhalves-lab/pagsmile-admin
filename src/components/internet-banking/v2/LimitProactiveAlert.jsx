import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Alerta proativo no IBPixLimits — surface quando uso > 70%.
 * Não bloqueia, só informa.
 */
export default function LimitProactiveAlert({ used = 160000, daily = 200000 }) {
  const pct = (used / daily) * 100;
  if (pct < 70) return null;

  const remaining = daily - used;
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const critical = pct >= 90;

  return (
    <Card className={critical ? "border-2 border-red-300 bg-red-50 dark:bg-red-950/20" : "border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20"}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${critical ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
              <AlertTriangle className={`w-5 h-5 ${critical ? 'text-red-600' : 'text-amber-600'}`} />
            </div>
            <div>
              <p className={`font-bold text-sm ${critical ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                Você usou {pct.toFixed(0)}% do seu limite diurno
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Restam apenas <strong>{formatCurrency(remaining)}</strong> disponíveis hoje
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Solicitar boost
            </Button>
          </div>
        </div>
        <Progress value={pct} className="h-2 mt-3" />
      </CardContent>
    </Card>
  );
}