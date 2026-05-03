import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, ExternalLink, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Aba 4 — Margem por Cliente/Plano
 * Top 10 mais e menos rentáveis + alertas + break-even
 */
export default function TabClientMargin({ clients, fixCostPerTx }) {
  const sorted = [...clients].sort((a, b) => b.monthlyMargin - a.monthlyMargin);
  const top10 = sorted.slice(0, 10);
  const bottom10 = sorted.slice(-10).reverse();
  const lowMargin = clients.filter(c => c.marginPercent < 5);

  return (
    <div className="space-y-6">
      {lowMargin.length > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertTitle className="text-red-900">⚠️ {lowMargin.length} clientes com margem abaixo de 5% (risco de prejuízo)</AlertTitle>
          <AlertDescription className="text-red-700">
            Estes clientes estão consumindo custo fixo da operação sem retorno proporcional. Considere revisão comercial.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Top 10 Mais Rentáveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientList clients={top10} fixCostPerTx={fixCostPerTx} variant="top" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Top 10 Menos Rentáveis (alerta)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientList clients={bottom10} fixCostPerTx={fixCostPerTx} variant="bottom" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClientList({ clients, fixCostPerTx, variant }) {
  return (
    <div className="space-y-2">
      {clients.length === 0 && <p className="text-sm text-slate-500 text-center py-6">Nenhum cliente encontrado</p>}
      {clients.map((c, idx) => {
        // Break-even: Volume mínimo para cobrir o custo fixo alocado deste cliente
        const monthlyContribPerTx = c.revenuePerTx - c.varCostPerTx;
        const breakEvenTx = monthlyContribPerTx > 0 ? Math.ceil((fixCostPerTx * c.monthlyTx) / monthlyContribPerTx) : null;
        const isProfit = c.monthlyMargin >= 0;
        return (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              variant === 'top' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            )}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.business_name}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{c.plan_name || 'Sem plano'}</Badge>
                <Badge variant="outline" className="text-[10px]">{c.mainMethod}</Badge>
                {breakEvenTx && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Target className="w-2.5 h-2.5" /> BE: {breakEvenTx} tx
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={cn('font-bold text-sm', isProfit ? 'text-emerald-700' : 'text-red-700')}>{fmt(c.monthlyMargin)}</p>
              <p className="text-[11px] text-slate-500">{c.marginPercent.toFixed(1)}% margem</p>
            </div>
            <Button asChild size="icon" variant="ghost" className="h-8 w-8">
              <Link to={`${createPageUrl('AdminIntMerchantProfile')}?id=${c.id}`}>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}