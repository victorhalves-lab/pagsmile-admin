import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Webhook, RotateCcw, CheckCircle2, XCircle, Clock, Play, Filter } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const FAILED_WEBHOOKS = [
  { id: 'wh_001', merchant: 'Loja Premium', event: 'payment.captured', url: 'https://api.lojapremium.com/webhook', attempts: 5, lastError: '500 Internal Server Error', lastAttempt: '2026-05-09T14:22:00', payload: { transactionId: 'tx_8ab7cd' } },
  { id: 'wh_002', merchant: 'Eletro Hub', event: 'subscription.charge_failed', url: 'https://api.eletrohub.com.br/hooks', attempts: 3, lastError: 'Connection timeout', lastAttempt: '2026-05-09T13:45:00', payload: { subscriptionId: 'sub_001' } },
  { id: 'wh_003', merchant: 'Moda Fast', event: 'dispute.opened', url: 'https://moda-fast.io/hooks/disputes', attempts: 7, lastError: 'SSL certificate expired', lastAttempt: '2026-05-09T12:10:00', payload: { disputeId: 'dp_ff42' } },
  { id: 'wh_004', merchant: 'Casa Decoração', event: 'refund.processed', url: 'https://casadecoracao.com/api/webhook', attempts: 2, lastError: '404 Not Found', lastAttempt: '2026-05-09T11:30:00', payload: { refundId: 'rfd_abc' } },
];

export default function AdminIntWebhookReplay() {
  const [replayed, setReplayed] = useState([]);

  const replay = (id) => {
    setReplayed([...replayed, id]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhook Replay & Recovery"
        subtitle="Reenvie webhooks que falharam e investigue erros · Importante para SLAs com tenants"
        icon={Webhook}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Integrações' }]}
        actions={
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Falhas (24h)</p><p className="text-3xl font-bold text-red-600">{FAILED_WEBHOOKS.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Tentativas Total</p><p className="text-3xl font-bold">{FAILED_WEBHOOKS.reduce((s, w) => s + w.attempts, 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Replay Hoje</p><p className="text-3xl font-bold text-blue-600">{replayed.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Sucesso Replay</p><p className="text-3xl font-bold text-emerald-600">94%</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {FAILED_WEBHOOKS.map((wh) => {
          const isReplayed = replayed.includes(wh.id);
          return (
            <Card key={wh.id} className={isReplayed ? 'border-l-4 border-l-emerald-500 bg-emerald-50/30' : 'border-l-4 border-l-red-500'}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 ${isReplayed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {isReplayed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm">{wh.merchant}</p>
                      <Badge variant="outline" className="text-[10px]">{wh.event}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{wh.attempts} tentativas</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-1 truncate">{wh.url}</p>
                    <p className="text-xs text-red-600 mb-2">⚠ {wh.lastError}</p>
                    <p className="text-[11px] text-slate-500">
                      Última tentativa: {new Date(wh.lastAttempt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isReplayed ? (
                      <Badge className="bg-emerald-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Reenviado
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => replay(wh.id)}>
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Replay
                      </Button>
                    )}
                    <Button size="sm" variant="outline">Ver payload</Button>
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