import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock, Shield, CheckCircle, XCircle, CreditCard, QrCode,
  Send, RotateCcw, AlertTriangle, Zap, FileText, Building, Webhook,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

/**
 * Timeline de Pagamento — etapas vitais com latência e status.
 * Mostra o ciclo completo: criação → antifraude → autorização → captura → liquidação → webhook.
 */
export default function EnhancedTimeline({ transaction }) {
  const isCard = transaction.type === 'card' || transaction.method === 'credit_card' || transaction.method === 'debit_card';
  const isPix = transaction.type === 'pix' || transaction.method === 'pix';

  const baseDate = transaction.created_date ? new Date(transaction.created_date) : new Date();
  const fmt = (d, offsetMs = 0) => {
    if (!d) return '—';
    const date = new Date(new Date(d).getTime() + offsetMs);
    return format(date, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
  };

  // Constrói eventos com latências realistas para o tipo da transação
  const events = [
    {
      icon: FileText,
      color: 'bg-blue-500',
      title: 'Transação Criada',
      desc: `Origem: ${transaction.channel || transaction.capture_method || 'API'}`,
      timestamp: fmt(baseDate),
      latency: '—',
      status: 'success',
    },
    {
      icon: Shield,
      color: transaction.antifraud_status === 'declined' ? 'bg-red-500' : 'bg-violet-500',
      title: 'Análise Antifraude',
      desc: `Score ${transaction.risk_score || transaction.antifraud_data?.score || 18} · ${transaction.antifraud_data?.provider || 'Konduto'}`,
      timestamp: fmt(baseDate, 850),
      latency: '850ms',
      status: transaction.antifraud_status === 'declined' ? 'error' : 'success',
    },
    ...(isCard ? [{
      icon: Shield,
      color: 'bg-indigo-500',
      title: '3D Secure',
      desc: transaction.three_ds_data?.status || transaction.threeds_authenticated ? 'Autenticado (ECI 05)' : 'Frictionless',
      timestamp: fmt(baseDate, 1400),
      latency: '550ms',
      status: 'success',
    }] : []),
    {
      icon: isCard ? CreditCard : QrCode,
      color: transaction.status === 'approved' ? 'bg-emerald-500'
        : transaction.status === 'declined' || transaction.status === 'refused' ? 'bg-red-500'
        : 'bg-amber-500',
      title: transaction.status === 'approved' ? (isCard ? 'Autorizado pelo emissor' : 'PIX Recebido')
        : transaction.status === 'declined' || transaction.status === 'refused' ? 'Recusado'
        : 'Aguardando pagamento',
      desc: transaction.status === 'declined' || transaction.status === 'refused'
        ? (transaction.refusal_reason || transaction.decline_reason || 'Motivo não informado')
        : isCard ? `Auth: ${transaction.acquirer_data?.authorization_code || transaction.authorization_code || '123456'} · NSU ${transaction.acquirer_data?.nsu || '789456'}`
        : `E2EID: ${transaction.pix?.end_to_end_id || 'E18236120202012345678901'}`,
      timestamp: fmt(baseDate, 2100),
      latency: '700ms',
      status: transaction.status === 'approved' ? 'success'
        : transaction.status === 'declined' || transaction.status === 'refused' ? 'error'
        : 'pending',
    },
    ...(isCard && transaction.status === 'approved' ? [{
      icon: CheckCircle,
      color: 'bg-emerald-600',
      title: 'Captura confirmada',
      desc: `Adquirente: ${transaction.acquirer_data?.name || 'Cielo'} · TID ${transaction.acquirer_data?.tid || '1234567890'}`,
      timestamp: fmt(baseDate, 2300),
      latency: '200ms',
      status: 'success',
    }] : []),
    ...(transaction.status === 'approved' ? [{
      icon: Webhook,
      color: 'bg-cyan-500',
      title: 'Webhook enviado',
      desc: 'POST /webhooks/payment.approved · 200 OK',
      timestamp: fmt(baseDate, 2600),
      latency: '120ms',
      status: 'success',
    }] : []),
    ...(transaction.status === 'approved' ? [{
      icon: Building,
      color: 'bg-slate-500',
      title: 'Previsto para liquidação',
      desc: transaction.expected_settle_date
        ? format(new Date(transaction.expected_settle_date), 'dd/MM/yyyy', { locale: ptBR })
        : isPix ? 'Mesmo dia' : 'D+30',
      timestamp: '—',
      latency: '—',
      status: 'scheduled',
    }] : []),
  ];

  const statusBadge = (s) => {
    const map = {
      success: { label: 'OK', cn: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      error: { label: 'Falha', cn: 'bg-red-50 text-red-700 border-red-200' },
      pending: { label: 'Pendente', cn: 'bg-amber-50 text-amber-700 border-amber-200' },
      scheduled: { label: 'Agendado', cn: 'bg-slate-50 text-slate-600 border-slate-200' },
    };
    const cfg = map[s] || map.success;
    return <Badge variant="outline" className={cn('text-[10px] py-0 px-1.5 h-4', cfg.cn)}>{cfg.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Timeline do Pagamento
          <Badge variant="outline" className="ml-auto text-[10px]">{events.length} eventos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-0">
          {events.map((event, idx) => {
            const Icon = event.icon;
            const isLast = idx === events.length - 1;
            return (
              <div key={idx} className="flex gap-3 group">
                <div className="flex flex-col items-center">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shadow-sm ring-4 ring-white', event.color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-200 to-slate-100 my-1 min-h-[20px]" />}
                </div>
                <div className={cn('flex-1 pb-5 -mt-0.5', isLast && 'pb-0')}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-900">{event.title}</p>
                      {statusBadge(event.status)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      {event.latency !== '—' && (
                        <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5 h-4 bg-slate-50">
                          <Zap className="w-2.5 h-2.5 mr-0.5 text-amber-500" />
                          {event.latency}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{event.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}