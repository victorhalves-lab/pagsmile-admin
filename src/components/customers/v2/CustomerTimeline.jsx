import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag, RefreshCw, AlertTriangle, Mail, MessageSquare, Phone,
  CreditCard, StickyNote, Tag, Crown, UserPlus, Eye, MousePointerClick,
  Filter, ShieldAlert, Repeat, Pause, X, Bell
} from 'lucide-react';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const eventTypeConfig = {
  // Transaction events
  purchase: { icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  refund: { icon: RefreshCw, color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  chargeback: { icon: ShieldAlert, color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  // Comms
  email: { icon: Mail, color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  whatsapp: { icon: MessageSquare, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  sms: { icon: Phone, color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  push: { icon: Bell, color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  // Card
  card: { icon: CreditCard, color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  // Subscription
  subscription: { icon: Repeat, color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  // Notes / tags / segment
  note: { icon: StickyNote, color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  tag: { icon: Tag, color: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  segment: { icon: Crown, color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  signup: { icon: UserPlus, color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
};

const filterTypes = [
  { id: 'all', label: 'Tudo', icon: null },
  { id: 'purchase', label: 'Compras', icon: ShoppingBag },
  { id: 'refund', label: 'Estornos', icon: RefreshCw },
  { id: 'chargeback', label: 'Disputas', icon: ShieldAlert },
  { id: 'email', label: 'Emails', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'card', label: 'Cartões', icon: CreditCard },
  { id: 'subscription', label: 'Assinaturas', icon: Repeat },
  { id: 'note', label: 'Notas', icon: StickyNote },
];

function buildEvents({ customer, transactions, subscriptions, disputes }) {
  const events = [];

  // Signup
  if (customer.created_date) {
    events.push({
      id: 'signup',
      type: 'signup',
      date: customer.created_date,
      title: 'Cliente cadastrado',
      desc: `Origem: ${customer.preferred_payment_method ? 'Checkout direto' : 'Manual'}`,
    });
  }

  // First purchase milestone
  if (customer.first_purchase_date) {
    events.push({
      id: 'first-purchase',
      type: 'segment',
      date: customer.first_purchase_date,
      title: '🎉 Primeira compra realizada',
      desc: 'Cliente convertido de Lead para Buyer',
    });
  }

  // Transactions
  transactions.forEach((tx) => {
    const isRefund = tx.type === 'refund' || tx.type === 'partial_refund';
    const isChargeback = tx.type === 'chargeback' || tx.status === 'chargeback';
    events.push({
      id: tx.id,
      type: isChargeback ? 'chargeback' : isRefund ? 'refund' : 'purchase',
      date: tx.created_date || tx.created_at,
      title: isChargeback
        ? `Chargeback recebido — ${formatCurrency(tx.amount)}`
        : isRefund
          ? `Estorno processado — ${formatCurrency(tx.amount)}`
          : `Compra ${tx.method?.toUpperCase()} — ${formatCurrency(tx.amount)}`,
      desc: tx.method === 'credit_card'
        ? `Cartão •••${tx.card?.last4 || '????'} · ${tx.installments || 1}x · ${tx.status}`
        : `${tx.method?.toUpperCase()} · ${tx.status}`,
      amount: tx.amount,
      status: tx.status,
      meta: tx,
    });
  });

  // Subscriptions
  subscriptions.forEach((sub) => {
    events.push({
      id: `sub-${sub.id}`,
      type: 'subscription',
      date: sub.start_date || sub.created_date,
      title: `Assinatura ${sub.status === 'active' ? 'iniciada' : sub.status === 'cancelled' ? 'cancelada' : 'modificada'}: ${sub.plan_name}`,
      desc: `${formatCurrency(sub.amount)} / ${sub.billing_cycle || 'mês'}`,
    });
  });

  // Disputes
  disputes.forEach((d) => {
    events.push({
      id: `dispute-${d.id}`,
      type: 'chargeback',
      date: d.opened_date || d.created_date,
      title: `Disputa aberta: ${d.reason_description || d.reason_code}`,
      desc: `${formatCurrency(d.amount)} · Status: ${d.status}`,
    });
  });

  // Simulated comms (in real app would come from CommsLog entity)
  const baseDate = customer.last_purchase_date || customer.created_date;
  if (baseDate) {
    const base = new Date(baseDate);
    events.push({
      id: 'email-recovery',
      type: 'email',
      date: new Date(base.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Email enviado: "Sua compra está quase concluída!"',
      desc: 'Template Recovery · ✓ Aberto · 🖱 Clicou no CTA',
    });
    events.push({
      id: 'whatsapp-confirm',
      type: 'whatsapp',
      date: new Date(base.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'WhatsApp: Confirmação de pedido',
      desc: 'Template Order Confirmation · ✓✓ Entregue',
    });
  }

  // Card events (simulated)
  if (customer.saved_cards?.length > 0) {
    events.push({
      id: 'card-saved',
      type: 'card',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      title: `Cartão tokenizado: •••${customer.saved_cards[0].last_four}`,
      desc: `${customer.saved_cards[0].brand} · VAU ativo`,
    });
  }

  // Segment changes
  if (customer.segment === 'vip') {
    events.push({
      id: 'segment-vip',
      type: 'segment',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      title: '👑 Promovido a VIP',
      desc: 'LTV ultrapassou R$ 5.000 + 5+ compras',
    });
  }

  // Sort desc by date
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function groupByDay(events) {
  const groups = {};
  events.forEach(e => {
    const d = new Date(e.date);
    let key;
    if (isToday(d)) key = 'Hoje';
    else if (isYesterday(d)) key = 'Ontem';
    else {
      const days = differenceInDays(new Date(), d);
      if (days < 7) key = `Há ${days} dias`;
      else key = format(d, "MMMM 'de' yyyy", { locale: ptBR });
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return groups;
}

export default function CustomerTimeline({ customer, transactions = [], subscriptions = [], disputes = [] }) {
  const [filter, setFilter] = useState('all');

  const allEvents = useMemo(() =>
    buildEvents({ customer, transactions, subscriptions, disputes }),
    [customer, transactions, subscriptions, disputes]
  );

  const filteredEvents = filter === 'all'
    ? allEvents
    : allEvents.filter(e => {
      if (filter === 'email') return ['email'].includes(e.type);
      if (filter === 'whatsapp') return ['whatsapp', 'sms'].includes(e.type);
      return e.type === filter;
    });

  const grouped = groupByDay(filteredEvents);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Timeline Unificada</p>
            <p className="text-xs text-slate-500">{filteredEvents.length} eventos cross-channel · ordenados por relevância temporal</p>
          </div>
          <Badge variant="outline" className="text-[10px]">
            <Filter className="w-3 h-3 mr-1" />
            {filter === 'all' ? 'Todos' : filterTypes.find(f => f.id === filter)?.label}
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 mb-6 pb-4 border-b border-slate-100">
          {filterTypes.map(f => {
            const Icon = f.icon;
            return (
              <Button
                key={f.id}
                variant={filter === f.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'h-7 text-xs',
                  filter === f.id && 'bg-[#2bc196] hover:bg-[#239b7a]'
                )}
              >
                {Icon && <Icon className="w-3 h-3 mr-1" />}
                {f.label}
              </Button>
            );
          })}
        </div>

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Eye className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum evento neste filtro</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([groupLabel, events]) => (
              <div key={groupLabel}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 sticky top-0 bg-white py-1">
                  {groupLabel}
                </p>
                <div className="relative pl-6 space-y-3">
                  {/* Vertical line */}
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />

                  {events.map((event) => {
                    const cfg = eventTypeConfig[event.type] || eventTypeConfig.note;
                    const Icon = cfg.icon;
                    const date = new Date(event.date);
                    return (
                      <div key={event.id} className="relative">
                        {/* Dot */}
                        <div className={cn(
                          'absolute -left-[18px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-slate-100',
                          cfg.dot
                        )} />

                        {/* Card */}
                        <div className={cn(
                          'rounded-lg border p-3 hover:shadow-sm transition-all',
                          cfg.color
                        )}>
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.title}</p>
                              {event.desc && <p className="text-xs opacity-80 mt-0.5">{event.desc}</p>}
                              <p className="text-[10px] opacity-60 mt-1">
                                {format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}