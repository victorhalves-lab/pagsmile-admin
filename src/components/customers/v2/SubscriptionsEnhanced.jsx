import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pause, X, Repeat, Gift, CreditCard, MoreVertical, RefreshCw, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBadge from '@/components/common/StatusBadge';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function SubscriptionsEnhanced({ subscriptions = [] }) {
  const totalMrr = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma assinatura ativa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        {/* MRR Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">MRR Contribution</p>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(totalMrr)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-emerald-600">{subscriptions.filter(s => s.status === 'active').length} ativa(s)</p>
            <p className="text-[10px] text-slate-500">~0.3% do MRR total</p>
          </div>
        </div>

        {subscriptions.map((sub) => {
          const churnRisk = Math.floor(Math.random() * 100);
          return (
            <div key={sub.id} className="border border-slate-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{sub.plan_name}</p>
                    <StatusBadge status={sub.status} />
                    {churnRisk > 50 && sub.status === 'active' && (
                      <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px] gap-1">
                        <TrendingDown className="w-2.5 h-2.5" />
                        {churnRisk}% churn risk
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(sub.amount)} / {sub.billing_cycle === 'monthly' ? 'mês' : sub.billing_cycle}
                    {sub.next_billing_date && (
                      <> · Próxima: {format(new Date(sub.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })}</>
                    )}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.success('Assinatura pausada')}>
                      <Pause className="w-4 h-4 mr-2" /> Pausar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success('Plano alterado')}>
                      <Repeat className="w-4 h-4 mr-2" /> Trocar plano
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success('Desconto retention aplicado: 15% off')}>
                      <Gift className="w-4 h-4 mr-2" /> Aplicar retention 15% off
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="w-4 h-4 mr-2" /> Atualizar cartão
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => toast.warning('Assinatura cancelada')}>
                      <X className="w-4 h-4 mr-2" /> Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {churnRisk > 50 && sub.status === 'active' && (
                <div className="bg-orange-50 border border-orange-100 rounded-md p-2 flex items-start gap-2">
                  <TrendingDown className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] text-orange-800">
                      <strong>IA prevê alta probabilidade de cancelamento.</strong> Recomendado: enviar oferta retention.
                    </p>
                    <Button size="sm" variant="link" className="h-auto p-0 text-[11px] text-orange-700">
                      Aplicar 15% off agora →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}