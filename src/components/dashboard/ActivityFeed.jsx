import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Webhook,
  ArrowDownLeft,
  ShieldAlert,
  Zap,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Activity feed em real-time — padrão Stripe / Adyen.
 * Substitui o `RecentTransactions` estático por stream de eventos vivos.
 */

const eventConfig = {
  payment_approved: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'Aprovada',
  },
  payment_declined: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    label: 'Recusada',
  },
  pix_received: {
    icon: ArrowDownLeft,
    color: 'text-teal-500',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    label: 'PIX recebido',
  },
  chargeback: {
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    label: 'Chargeback',
  },
  webhook_failed: {
    icon: Webhook,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Webhook falhou',
  },
  high_value: {
    icon: Zap,
    color: 'text-violet-500',
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    label: 'Alto valor',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Alerta',
  },
};

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export default function ActivityFeed({ events = [], className }) {
  // Stream mockado para demo (em produção: subscribe nas entidades)
  const defaultEvents = [
    { id: 'e1', type: 'payment_approved',  customer: 'Maria Silva',     amount: 247.90,   time: new Date(Date.now() -    8000), link: 'Transactions' },
    { id: 'e2', type: 'high_value',        customer: 'Tech Solutions',  amount: 12500.00, time: new Date(Date.now() -   45000), link: 'Transactions' },
    { id: 'e3', type: 'pix_received',      customer: 'João Santos',     amount: 89.50,    time: new Date(Date.now() -  120000), link: 'PixTransactions' },
    { id: 'e4', type: 'payment_declined',  customer: 'Carlos Lima',     amount: 1250.00,  time: new Date(Date.now() -  180000), link: 'DeclineAnalysis' },
    { id: 'e5', type: 'webhook_failed',    customer: 'Sistema Principal', time: new Date(Date.now() -  240000), link: 'Webhooks' },
    { id: 'e6', type: 'payment_approved',  customer: 'Ana Costa',       amount: 320.00,   time: new Date(Date.now() -  310000), link: 'Transactions' },
    { id: 'e7', type: 'chargeback',        customer: 'Pedro Almeida',   amount: 580.00,   time: new Date(Date.now() -  720000), link: 'DisputeDashboard' },
    { id: 'e8', type: 'payment_approved',  customer: 'Loja Express',    amount: 178.00,   time: new Date(Date.now() -  890000), link: 'Transactions' },
    { id: 'e9', type: 'pix_received',      customer: 'Fernanda Souza',  amount: 50.00,    time: new Date(Date.now() - 1200000), link: 'PixTransactions' },
    { id: 'e10', type: 'payment_approved', customer: 'Mariana Rocha',   amount: 99.90,    time: new Date(Date.now() - 1500000), link: 'Transactions' },
  ];

  const list = events.length > 0 ? events : defaultEvents;

  return (
    <Card className={cn('border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden', className)}>
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-4 h-4 text-[#2bc196]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2bc196] rounded-full animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Atividade ao vivo</h3>
        </div>
        <Badge variant="outline" className="text-[10px] gap-1 border-emerald-200 text-emerald-600">
          <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
          Live
        </Badge>
      </div>

      <ScrollArea className="h-[420px]">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {list.map((event) => {
            const cfg = eventConfig[event.type] || eventConfig.alert;
            const Icon = cfg.icon;
            return (
              <Link
                key={event.id}
                to={event.link ? createPageUrl(event.link) : '#'}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                  <Icon className={cn('w-4 h-4', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {event.customer}
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] font-medium text-slate-500">{cfg.label}</span>
                  </div>
                  {event.amount !== undefined && (
                    <p className="text-[11px] text-slate-500 truncate">
                      {formatCurrency(event.amount)}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{formatTime(event.time)}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}