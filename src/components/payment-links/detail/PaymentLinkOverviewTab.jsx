import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PaymentLinkHealthScore from '@/components/payment-links/list/PaymentLinkHealthScore';
import { TrendingUp, Eye, MousePointerClick, ShoppingCart, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function PaymentLinkOverviewTab({ link }) {
  // Mock funnel
  const funnel = [
    { label: 'Visualizações', value: link?.views_count || 1247, icon: Eye, color: 'slate' },
    { label: 'Cliques no checkout', value: Math.floor((link?.views_count || 1247) * 0.42), icon: MousePointerClick, color: 'blue' },
    { label: 'Checkout iniciado', value: Math.floor((link?.views_count || 1247) * 0.18), icon: ShoppingCart, color: 'amber' },
    { label: 'Pagamentos aprovados', value: link?.usage_count || 42, icon: CheckCircle2, color: 'emerald' },
  ];

  const conversion = link?.views_count > 0
    ? ((link.usage_count || 0) / link.views_count * 100).toFixed(1)
    : 0;

  const avgTicket = link?.usage_count > 0
    ? (link.total_collected || 0) / link.usage_count
    : 0;

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200">
          <p className="text-[10px] uppercase font-semibold text-emerald-700">GMV total</p>
          <p className="text-2xl font-bold text-emerald-700">{formatBRL(link?.total_collected || 0)}</p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% vs mês anterior
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase font-semibold text-slate-500">Vendas</p>
          <p className="text-2xl font-bold">{link?.usage_count || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">{link?.views_count || 0} visualizações</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase font-semibold text-slate-500">Conversão</p>
          <p className="text-2xl font-bold">{conversion}%</p>
          <p className="text-[11px] text-slate-500 mt-1">média do segmento: 8%</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase font-semibold text-slate-500">Ticket médio</p>
          <p className="text-2xl font-bold">{formatBRL(avgTicket)}</p>
          <p className="text-[11px] text-slate-500 mt-1">por venda concluída</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funil */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Funil de conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {funnel.map((step, i) => {
              const pct = (step.value / funnel[0].value) * 100;
              const Icon = step.icon;
              const colors = {
                slate: 'bg-slate-400',
                blue: 'bg-blue-500',
                amber: 'bg-amber-500',
                emerald: 'bg-emerald-500',
              };
              return (
                <div key={step.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700 dark:text-slate-300">{step.label}</span>
                    </div>
                    <span className="font-semibold">{step.value.toLocaleString('pt-BR')} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    <div className={`h-full ${colors[step.color]} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 mt-2 border-t text-xs text-slate-500">
              <strong>Maior abandono:</strong> entre "Cliques" e "Checkout iniciado" — possível problema na seleção de método.
            </div>
          </CardContent>
        </Card>

        {/* Health + Insights */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentLinkHealthScore link={link} size="lg" />
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between"><span>Config</span><Badge variant="outline" className="text-[10px]">85/100</Badge></div>
                <div className="flex justify-between"><span>Performance</span><Badge variant="outline" className="text-[10px]">72/100</Badge></div>
                <div className="flex justify-between"><span>Tracking</span><Badge variant="outline" className="text-[10px]">40/100</Badge></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> Insight da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>
                Conversão de <strong>{conversion}%</strong> está acima da média (8%) do segmento.
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                <Lightbulb className="w-3 h-3 inline mr-1" />
                Para subir mais: ative pixel de tracking (+5pts saúde) e considere PIX-first.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Últimas 5 vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { customer: 'João Silva', amount: 297, time: 'há 12 min', method: 'PIX' },
              { customer: 'Maria Santos', amount: 297, time: 'há 1h', method: 'Cartão 6x' },
              { customer: 'Pedro Costa', amount: 297, time: 'há 3h', method: 'PIX' },
              { customer: 'Ana Lima', amount: 297, time: 'há 5h', method: 'PIX' },
              { customer: 'Carlos Souza', amount: 297, time: 'ontem', method: 'Cartão 12x' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-xs">{tx.customer}</p>
                  <p className="text-[11px] text-slate-500">{tx.time} • {tx.method}</p>
                </div>
                <span className="font-semibold text-emerald-600 text-sm">{formatBRL(tx.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}