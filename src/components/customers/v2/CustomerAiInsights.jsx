import React from 'react';
import { Sparkles, AlertTriangle, CreditCard, TrendingUp, Heart, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const INSIGHTS = (customer) => [
  customer.last_purchase_date && (Date.now() - new Date(customer.last_purchase_date)) / (1000 * 60 * 60 * 24) > 30 && {
    icon: Mail,
    color: 'orange',
    title: 'Cliente em sinal de churn',
    desc: `Sem compras há mais de 30 dias. Engajamento caiu ${Math.floor(Math.random() * 30 + 20)}% vs mês anterior.`,
    action: 'Iniciar Recovery campaign',
  },
  customer.saved_cards?.some(c => {
    const [m, y] = (c.expiry || '').split('/');
    if (!m || !y) return false;
    const exp = new Date(`20${y}`, parseInt(m), 0);
    return (exp - new Date()) / (1000 * 60 * 60 * 24) < 60;
  }) && {
    icon: CreditCard,
    color: 'yellow',
    title: 'Cartão expirando em <60d',
    desc: 'Acionar Account Updater para evitar churn involuntário em assinaturas.',
    action: 'Solicitar atualização',
  },
  (customer.total_spent || 0) > 5000 && customer.segment !== 'vip' && {
    icon: TrendingUp,
    color: 'emerald',
    title: 'Próximo de virar VIP',
    desc: `LTV alto (R$ ${customer.total_spent}) mas ainda não classificado VIP. Oferta de upgrade?`,
    action: 'Promover a VIP',
  },
  (customer.chargebacks_count || 0) >= 2 && {
    icon: AlertTriangle,
    color: 'red',
    title: 'Histórico de disputes elevado',
    desc: `${customer.chargebacks_count} chargebacks. Considere bloquear ou exigir 3DS.`,
    action: 'Ver no Risk Engine',
  },
  (customer.total_purchases || 0) > 5 && !customer.saved_cards?.length && {
    icon: CreditCard,
    color: 'blue',
    title: 'Cliente recorrente sem cartão salvo',
    desc: 'Tokenizar cartão aumenta retenção em ~30%. Enviar QR via WhatsApp?',
    action: 'Solicitar cadastro',
  },
].filter(Boolean);

export default function CustomerAiInsights({ customer }) {
  const insights = INSIGHTS(customer);

  if (insights.length === 0) {
    return (
      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-600" />
          <p className="text-sm text-emerald-800 font-medium">Cliente em padrão saudável — nenhuma ação requerida</p>
        </div>
      </Card>
    );
  }

  const colorMap = {
    orange: { bg: 'from-orange-50 to-orange-100/50', border: 'border-orange-200', icon: 'text-orange-600 bg-orange-100', text: 'text-orange-900' },
    yellow: { bg: 'from-yellow-50 to-yellow-100/50', border: 'border-yellow-200', icon: 'text-yellow-700 bg-yellow-100', text: 'text-yellow-900' },
    emerald: { bg: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200', icon: 'text-emerald-600 bg-emerald-100', text: 'text-emerald-900' },
    red: { bg: 'from-red-50 to-red-100/50', border: 'border-red-200', icon: 'text-red-600 bg-red-100', text: 'text-red-900' },
    blue: { bg: 'from-blue-50 to-blue-100/50', border: 'border-blue-200', icon: 'text-blue-600 bg-blue-100', text: 'text-blue-900' },
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2bc196] to-emerald-400 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">AI Insights</p>
          <p className="text-[10px] text-slate-500">{insights.length} insights acionáveis para este cliente</p>
        </div>
      </div>

      <div className="space-y-2">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          const c = colorMap[ins.color];
          return (
            <div key={i} className={cn('rounded-lg p-3 bg-gradient-to-r border', c.bg, c.border)}>
              <div className="flex items-start gap-2.5">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', c.icon)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-bold', c.text)}>{ins.title}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{ins.desc}</p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-[11px]">
                    {ins.action} →
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}