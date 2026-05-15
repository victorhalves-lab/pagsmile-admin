import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity, Search, ChevronDown, ChevronRight, Webhook, AlertCircle,
  CheckCircle2, Info, AlertTriangle, Copy, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Eventos & Logs — feed completo de eventos internos, webhooks disparados,
 * tentativas e erros, com filtros e payloads expansíveis.
 */
export default function EventsLogsCard({ transaction }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  const baseTime = new Date(transaction.created_date || Date.now()).getTime();
  const t = (offset) => new Date(baseTime + offset).toISOString();

  const events = [
    { id: 'evt_001', type: 'system', level: 'info', code: 'transaction.created', message: 'Transação criada via API', timestamp: t(0), payload: { source: 'api', merchant_id: transaction.merchant_id, idempotency_key: 'idem_abc123' } },
    { id: 'evt_002', type: 'antifraud', level: 'info', code: 'antifraud.evaluated', message: 'Análise antifraude concluída', timestamp: t(850), payload: { provider: 'Konduto', score: 18, recommendation: 'approve', rules_triggered: [] } },
    { id: 'evt_003', type: 'system', level: 'info', code: 'three_ds.requested', message: '3DS 2.0 solicitado ao emissor', timestamp: t(1100), payload: { version: '2.2.0', acs_url: 'https://acs.bank.com/auth' } },
    { id: 'evt_004', type: 'system', level: 'success', code: 'three_ds.authenticated', message: '3DS autenticado (ECI 05)', timestamp: t(1400), payload: { eci: '05', cavv: 'jJ81HADVRtXfCBATEp01CJUAAAA=', xid: '00000000000000000505' } },
    { id: 'evt_005', type: 'acquirer', level: 'success', code: 'acquirer.authorized', message: 'Autorizado pelo emissor', timestamp: t(2100), payload: { acquirer: 'Cielo', auth_code: '123456', nsu: '789456123', return_code: '00' } },
    { id: 'evt_006', type: 'webhook', level: 'success', code: 'webhook.delivered', message: 'POST /webhooks/payment.approved → 200', timestamp: t(2600), payload: { url: 'https://merchant.com/webhooks/payment', http_status: 200, attempt: 1, response_time_ms: 120 } },
    { id: 'evt_007', type: 'system', level: 'info', code: 'settlement.scheduled', message: 'Liquidação agendada', timestamp: t(3000), payload: { expected_date: 'D+30', amount_cents: Math.round((transaction.amount || 100) * 100 * 0.9651) } },
  ];

  const filteredEvents = events.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !`${e.code} ${e.message}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const levelConfig = {
    info: { icon: Info, cn: 'text-blue-600 bg-blue-50 border-blue-200' },
    success: { icon: CheckCircle2, cn: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    warning: { icon: AlertTriangle, cn: 'text-amber-600 bg-amber-50 border-amber-200' },
    error: { icon: AlertCircle, cn: 'text-red-600 bg-red-50 border-red-200' },
  };

  const typeConfig = {
    system: { label: 'Sistema', cn: 'bg-slate-100 text-slate-700' },
    antifraud: { label: 'Antifraude', cn: 'bg-violet-100 text-violet-700' },
    acquirer: { label: 'Adquirente', cn: 'bg-indigo-100 text-indigo-700' },
    webhook: { label: 'Webhook', cn: 'bg-cyan-100 text-cyan-700' },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            Eventos & Logs
            <Badge variant="outline" className="text-[10px]">{events.length} eventos</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-44 pl-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 pt-2 flex-wrap">
          <Filter className="w-3 h-3 text-slate-400 mr-1" />
          {[
            { id: 'all', label: 'Todos' },
            { id: 'system', label: 'Sistema' },
            { id: 'antifraud', label: 'Antifraude' },
            { id: 'acquirer', label: 'Adquirente' },
            { id: 'webhook', label: 'Webhooks' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'text-[11px] px-2 py-1 rounded-md font-medium transition',
                filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="max-h-[480px] pr-2">
          <div className="space-y-2">
            {filteredEvents.map((event) => {
              const LevelIcon = levelConfig[event.level].icon;
              const isOpen = expanded[event.id];
              return (
                <div key={event.id} className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition">
                  <button
                    onClick={() => setExpanded(prev => ({ ...prev, [event.id]: !prev[event.id] }))}
                    className="w-full text-left p-3 hover:bg-slate-50 transition flex items-center gap-3"
                  >
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center border', levelConfig[event.level].cn)}>
                      <LevelIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('text-[9px] py-0 px-1.5 h-4 border-0', typeConfig[event.type].cn)}>
                          {typeConfig[event.type].label}
                        </Badge>
                        <code className="text-[11px] font-mono text-slate-500">{event.code}</code>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5 truncate">{event.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                        {new Date(event.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">Payload</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2));
                            toast.success('Payload copiado');
                          }}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Copiar
                        </Button>
                      </div>
                      <pre className="text-[11px] font-mono bg-slate-900 text-emerald-300 p-3 rounded overflow-auto max-h-60">
{JSON.stringify(event.payload, null, 2)}
                      </pre>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">{event.timestamp}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-400">
                Nenhum evento corresponde aos filtros aplicados.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}