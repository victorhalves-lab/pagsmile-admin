import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Repeat, CreditCard, CheckCircle2, AlertCircle, Pause, Play, X, Calendar } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

/**
 * MIT / Card-on-File Subscription Visualizer
 * 100% baseado em campos REAIS da doc Tuna oficial:
 *  - §13.1 Payment/Init: campos `isMerchantInitiated`, `cardOnFile`, `saveCard`
 *  - §17 Subscription API: ciclos, statusId (1=active, 2=paused, 3=cancelled, 4=ended), invoices
 *  - §14 Token API: tokens prefixados com "ct_" para card-on-file
 *
 * Mostra a anatomia real de uma cobrança recorrente Tuna.
 */

const SUBSCRIPTIONS = [
  {
    subscriptionKey: 'sub_134D946015A08C9',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    description: 'Plano Premium Mensal',
    statusId: 1,
    statusName: 'active',
    interval: { intervalType: 'month', intervalQuantity: 1 },
    cyclesCompleted: 8,
    totalCharged: 240.00,
    nextChargeDate: '2026-06-09',
    cardOnFileToken: 'ct_NjJmZTQ4MzU2YjM4',
    cardBrand: 'Visa',
    cardLast4: '4242',
    isMerchantInitiated: true,
    lastInvoice: { status: 'paid', amount: 30.00, date: '2026-05-09' },
  },
  {
    subscriptionKey: 'sub_OGM4MjQ5MTcyZWU0',
    customerName: 'Maria Oliveira',
    customerEmail: 'maria@email.com',
    description: 'Plano Premium Anual',
    statusId: 1,
    statusName: 'active',
    interval: { intervalType: 'year', intervalQuantity: 1 },
    cyclesCompleted: 1,
    totalCharged: 299.00,
    nextChargeDate: '2027-03-09',
    cardOnFileToken: 'ct_MTJlOWY3YjQ5MDcy',
    cardBrand: 'Mastercard',
    cardLast4: '8888',
    isMerchantInitiated: true,
    lastInvoice: { status: 'paid', amount: 299.00, date: '2026-03-09' },
  },
  {
    subscriptionKey: 'sub_NDU2MjEzNzg5YWJj',
    customerName: 'Carlos Souza',
    customerEmail: 'carlos@email.com',
    description: 'Plano Básico Mensal',
    statusId: 2,
    statusName: 'paused',
    interval: { intervalType: 'month', intervalQuantity: 1 },
    cyclesCompleted: 3,
    totalCharged: 45.00,
    nextChargeDate: null,
    cardOnFileToken: 'ct_OGM4MjQ5MTcyZWU0',
    cardBrand: 'Elo',
    cardLast4: '3344',
    isMerchantInitiated: true,
    lastInvoice: { status: 'failed', amount: 15.00, date: '2026-04-09' },
  },
];

const STATUS_BADGE = {
  1: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  2: { label: 'Paused', color: 'bg-amber-100 text-amber-700', icon: Pause },
  3: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: X },
  4: { label: 'Ended', color: 'bg-slate-100 text-slate-600', icon: X },
};

export default function MITSubscriptionVisualizer() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="MIT & Card-on-File Subscriptions"
        subtitle="Recorrências com Merchant-Initiated Transactions · Tuna Subscription API §17 + Token API §14"
        icon={Repeat}
        breadcrumbs={[{ label: 'Recorrências' }]}
      />

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4">
          <p className="font-semibold text-blue-900 text-sm">Como Tuna entrega recorrência</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-blue-200">
              <p className="font-bold text-blue-900 mb-1">1. Token salvo</p>
              <p className="text-slate-600">Cliente autoriza com <code className="font-mono">saveCard: true</code> · Tuna devolve <code className="font-mono">ct_...</code></p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-blue-200">
              <p className="font-bold text-blue-900 mb-1">2. Subscription criada</p>
              <p className="text-slate-600">POST /api/subscriptions com <code className="font-mono">interval</code> + <code className="font-mono">period</code></p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-blue-200">
              <p className="font-bold text-blue-900 mb-1">3. Cobrança automática</p>
              <p className="text-slate-600">Tuna executa Init com <code className="font-mono">isMerchantInitiated: true</code> + <code className="font-mono">cardOnFile: true</code></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Subscriptions ativas</p><p className="text-3xl font-bold text-emerald-600">{SUBSCRIPTIONS.filter(s => s.statusId === 1).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Pausadas</p><p className="text-3xl font-bold text-amber-600">{SUBSCRIPTIONS.filter(s => s.statusId === 2).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">MRR estimado</p><p className="text-3xl font-bold">R$ {SUBSCRIPTIONS.filter(s => s.statusId === 1 && s.interval.intervalType === 'month').reduce((sum, s) => sum + (s.lastInvoice?.amount || 0), 0).toLocaleString('pt-BR')}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Total recebido</p><p className="text-3xl font-bold">R$ {SUBSCRIPTIONS.reduce((sum, s) => sum + s.totalCharged, 0).toLocaleString('pt-BR')}</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {SUBSCRIPTIONS.map((sub) => {
          const StatusIcon = STATUS_BADGE[sub.statusId].icon;
          return (
            <Card key={sub.subscriptionKey} className={sub.lastInvoice?.status === 'failed' ? 'border-l-4 border-l-red-500' : ''}>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Cliente + descrição */}
                  <div className="lg:col-span-3">
                    <p className="font-bold text-base">{sub.customerName}</p>
                    <p className="text-xs text-slate-500">{sub.customerEmail}</p>
                    <p className="text-sm text-slate-700 mt-2">{sub.description}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{sub.subscriptionKey}</p>
                  </div>

                  {/* Status + ciclo */}
                  <div className="lg:col-span-2">
                    <Badge className={STATUS_BADGE[sub.statusId].color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {STATUS_BADGE[sub.statusId].label}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-2">Ciclo</p>
                    <p className="text-sm font-bold">{sub.cyclesCompleted}º {sub.interval.intervalType === 'month' ? 'mês' : 'ano'}</p>
                  </div>

                  {/* Card-on-File real */}
                  <div className="lg:col-span-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      Card-on-File (Tuna token)
                    </p>
                    <Badge variant="outline" className="font-mono text-[10px]">{sub.cardOnFileToken}</Badge>
                    <p className="text-sm mt-2">
                      <strong>{sub.cardBrand}</strong> **** {sub.cardLast4}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge className="bg-blue-100 text-blue-700 text-[9px] font-mono">
                        isMerchantInitiated: true
                      </Badge>
                    </div>
                  </div>

                  {/* Próxima cobrança */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      Próxima cobrança
                    </p>
                    <p className="text-sm font-bold">
                      {sub.nextChargeDate ? new Date(sub.nextChargeDate).toLocaleDateString('pt-BR') : '—'}
                    </p>
                    {sub.lastInvoice?.status === 'failed' && (
                      <Badge className="bg-red-100 text-red-700 text-[10px] mt-2">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Última cobrança falhou
                      </Badge>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="lg:col-span-2 flex flex-col gap-1">
                    {sub.statusId === 1 && (
                      <>
                        <Button size="sm" variant="outline" title="POST /api/subscriptions/{key}/pause">
                          <Pause className="w-3 h-3 mr-1" /> Pausar
                        </Button>
                        <Button size="sm" variant="outline" title="POST /api/subscriptions/{key}/cancel">
                          <X className="w-3 h-3 mr-1" /> Cancelar
                        </Button>
                      </>
                    )}
                    {sub.statusId === 2 && (
                      <Button size="sm" title="POST /api/subscriptions/{key}/resume">
                        <Play className="w-3 h-3 mr-1" /> Retomar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}