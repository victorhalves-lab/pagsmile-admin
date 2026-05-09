import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

const MOCK_EVENTS = [
  { time: '08:30:12.456', type: 'request_received', icon: Zap, color: 'text-blue-600', label: 'Requisição recebida', detail: 'API gateway · token validado · IP 200.156.78.12' },
  { time: '08:30:12.612', type: 'antifraud_check', icon: AlertTriangle, color: 'text-amber-600', label: 'Antifraude executado', detail: 'Score 124 · regras: 3DS_REQUIRED, BIN_ANALYSIS · ação: passar' },
  { time: '08:30:12.890', type: 'orchestration', icon: Cpu, color: 'text-violet-600', label: 'Orquestração decidiu rota', detail: 'Adquirente Cielo (priority 1) · custo R$0.42 · health 99.8%' },
  { time: '08:30:13.124', type: 'acquirer_request', icon: RefreshCw, color: 'text-blue-600', label: 'Enviado ao adquirente', detail: 'Cielo eCommerce v3 · timeout 8s · retry policy 3x exponential' },
  { time: '08:30:14.567', type: 'acquirer_response', icon: Activity, color: 'text-emerald-600', label: 'Resposta do adquirente', detail: 'HTTP 200 · approved · auth_code: 123456 · NSU: 789456123 · 1.44s' },
  { time: '08:30:14.612', type: 'webhook_dispatched', icon: Zap, color: 'text-blue-600', label: 'Webhook disparado', detail: 'POST https://merchant.com/webhooks · 200 OK · 187ms' },
];

export default function MentorTechnicalEventsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-600" />Eventos Técnicos
          <Badge variant="outline" className="text-[9px] ml-auto">precisão de ms</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {MOCK_EVENTS.map((e, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded border bg-slate-50 dark:bg-slate-900">
              <e.icon className={`w-3.5 h-3.5 mt-0.5 ${e.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold">{e.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{e.time}</p>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}