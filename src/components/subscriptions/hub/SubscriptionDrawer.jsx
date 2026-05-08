import React from 'react';
import { X, ChevronLeft, ChevronRight, CreditCard, Pause, Play, XCircle, Gift, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SubscriptionHealthPill from './SubscriptionHealthPill';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { format } from 'date-fns';

export default function SubscriptionDrawer({ subscription, allSubscriptions, onClose, onNavigate, onAction }) {
  if (!subscription) return null;
  const idx = allSubscriptions.findIndex((s) => s.id === subscription.id);
  const prev = idx > 0 ? allSubscriptions[idx - 1] : null;
  const next = idx < allSubscriptions.length - 1 ? allSubscriptions[idx + 1] : null;

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b z-10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Button size="icon" variant="ghost" className="h-7 w-7" disabled={!prev} onClick={() => prev && onNavigate(prev)}><ChevronLeft className="w-3.5 h-3.5" /></Button>
              <span className="text-[10px] text-slate-500">{idx + 1} / {allSubscriptions.length}</span>
              <Button size="icon" variant="ghost" className="h-7 w-7" disabled={!next} onClick={() => next && onNavigate(next)}><ChevronRight className="w-3.5 h-3.5" /></Button>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}><X className="w-3.5 h-3.5" /></Button>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={subscription.customer_avatar} />
              <AvatarFallback>{subscription.customer_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-base font-bold">{subscription.customer_name}</h3>
              <p className="text-xs text-slate-500">{subscription.customer_email}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{subscription.subscription_id}</Badge>
                <Badge className="text-[10px] bg-blue-100 text-blue-700 border-0">{subscription.plan_name}</Badge>
                <SubscriptionHealthPill subscription={subscription} showScore />
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black">{fmtCurrency(subscription.amount, { precise: true })}</p>
              <p className="text-[10px] text-slate-500">/mês</p>
            </div>
          </div>

          <div className="flex gap-1.5 mt-3 flex-wrap">
            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onAction('discount', subscription)}><Gift className="w-3 h-3 mr-1" /> Desconto</Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onAction('change_card', subscription)}><CreditCard className="w-3 h-3 mr-1" /> Cartão</Button>
            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onAction('account_updater', subscription)}><RefreshCw className="w-3 h-3 mr-1" /> Account Updater</Button>
            {subscription.status === 'active' && <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onAction('pause', subscription)}><Pause className="w-3 h-3 mr-1" /> Pausar</Button>}
            {subscription.status === 'paused' && <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onAction('resume', subscription)}><Play className="w-3 h-3 mr-1" /> Retomar</Button>}
            {subscription.status !== 'cancelled' && <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-600 hover:text-red-700" onClick={() => onAction('cancel', subscription)}><XCircle className="w-3 h-3 mr-1" /> Cancelar</Button>}
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-4">
          <TabsList className="h-8 mb-3">
            <TabsTrigger value="overview" className="text-xs h-6">Visão geral</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs h-6">Cobranças</TabsTrigger>
            <TabsTrigger value="comm" className="text-xs h-6">Comunicações</TabsTrigger>
            <TabsTrigger value="health" className="text-xs h-6">Saúde</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs h-6">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Início</p><p className="font-medium">{subscription.start_date ? format(new Date(subscription.start_date), 'dd/MM/yyyy') : '—'}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Próx. cobrança</p><p className="font-medium">{subscription.next_billing_date ? format(new Date(subscription.next_billing_date), 'dd/MM/yyyy') : '—'}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Ciclo atual</p><p className="font-medium">{subscription.current_cycle}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Total pago</p><p className="font-bold text-emerald-600">{fmtCurrency(subscription.total_paid)}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Método</p><p className="font-medium">{subscription.payment_method === 'card' ? `•••${subscription.card_last_four}` : 'PIX'}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Origem</p><p className="font-medium">{subscription.origin || 'Direto'}</p></div>
            </div>
          </TabsContent>
          <TabsContent value="billing" className="text-xs"><p className="text-slate-500">Histórico de cobranças aparecerá aqui.</p></TabsContent>
          <TabsContent value="comm" className="text-xs"><p className="text-slate-500">Histórico de comunicações enviadas.</p></TabsContent>
          <TabsContent value="health" className="text-xs space-y-2">
            <p className="text-slate-500">Engagement: <span className="font-bold">{subscription.engagement_score || '—'}</span></p>
            <p className="text-slate-500">Falhas: <span className="font-bold">{subscription.failed_attempts || 0}</span></p>
          </TabsContent>
          <TabsContent value="notes" className="text-xs"><p className="text-slate-500">Notas internas...</p></TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}