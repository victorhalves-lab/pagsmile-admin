import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Smartphone, Wifi, WifiOff, ShoppingCart, Globe, CreditCard, MoreVertical, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Aba "Capacidade Transacional" — Mentor F0218–F0223, F0260.
 * Terminais físicos (POS) com status online/offline e MIDs por adquirente.
 * Canais habilitados (e-commerce, link de pagamento, presencial, recorrência).
 */
export default function TabCapacidadeTransacional({ merchant }) {
  // Mock
  const terminals = [
    { id: 'POS-12345', model: 'Stone S920', acquirer: 'Stone', mid: '901234567', tid: 'AB123456', status: 'online', last_heartbeat: '30s atrás', last_tx: '2026-05-09 14:32', tx_today: 47, value_today: 12450 },
    { id: 'POS-12346', model: 'Cielo LIO', acquirer: 'Cielo', mid: '551234567', tid: 'CD789012', status: 'online', last_heartbeat: '2min atrás', last_tx: '2026-05-09 13:55', tx_today: 32, value_today: 8200 },
    { id: 'POS-12347', model: 'Rede Smart 2', acquirer: 'Rede', mid: '781234567', tid: 'EF345678', status: 'offline', last_heartbeat: '4h atrás', last_tx: '2026-05-09 09:15', tx_today: 12, value_today: 3100 },
    { id: 'POS-12348', model: 'PagBank Moderninha X', acquirer: 'PagBank', mid: '331234567', tid: 'GH901234', status: 'online', last_heartbeat: '1min atrás', last_tx: '2026-05-09 14:28', tx_today: 21, value_today: 5670 },
  ];

  const channels = [
    { key: 'ecommerce', label: 'E-commerce', icon: Globe, enabled: true, vol_30d: 1234500 },
    { key: 'paylink', label: 'Link de Pagamento', icon: CreditCard, enabled: true, vol_30d: 320000 },
    { key: 'pos', label: 'Presencial (POS)', icon: ShoppingCart, enabled: true, vol_30d: 890000 },
    { key: 'recurring', label: 'Recorrência', icon: Activity, enabled: false, vol_30d: 0 },
  ];

  const acquirers = [
    { name: 'Stone', logo: null, color: 'bg-emerald-500', mid_count: 1, status: 'active', mdr: 1.99, methods: ['credit', 'debit', 'pix'] },
    { name: 'Cielo', logo: null, color: 'bg-blue-500', mid_count: 1, status: 'active', mdr: 2.15, methods: ['credit', 'debit'] },
    { name: 'Rede', logo: null, color: 'bg-red-500', mid_count: 1, status: 'active', mdr: 2.10, methods: ['credit', 'debit'] },
    { name: 'PagBank', logo: null, color: 'bg-cyan-500', mid_count: 1, status: 'active', mdr: 1.95, methods: ['credit', 'debit', 'pix'] },
  ];

  return (
    <div className="space-y-6">
      {/* Canais habilitados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Canais Habilitados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.key}
                  className={cn(
                    'p-4 rounded-xl border',
                    c.enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={cn('w-5 h-5', c.enabled ? 'text-emerald-600' : 'text-slate-400')} />
                    <Badge variant={c.enabled ? 'default' : 'secondary'} className="text-[10px]">
                      {c.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{c.label}</p>
                  {c.enabled && c.vol_30d > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      30d: <strong>R$ {(c.vol_30d / 1000).toFixed(0)}k</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Adquirentes vinculados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adquirentes Vinculados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {acquirers.map((a) => (
              <div key={a.name} className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-white font-black', a.color)}>
                      {a.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{a.name}</p>
                      <p className="text-[11px] text-slate-500">{a.mid_count} MID · MDR {a.mdr}%</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Ativo</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {a.methods.map((m) => (
                    <span key={m} className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terminais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Terminais POS ({terminals.length})
            </CardTitle>
            <Button variant="outline" size="sm">Vincular novo terminal</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {terminals.map((t) => {
              const StatusIcon = t.status === 'online' ? Wifi : WifiOff;
              return (
                <div key={t.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center',
                        t.status === 'online' ? 'bg-emerald-100' : 'bg-slate-100'
                      )}>
                        <StatusIcon className={cn('w-4 h-4', t.status === 'online' ? 'text-emerald-600' : 'text-slate-400')} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm text-slate-900">{t.model}</p>
                          <code className="text-[10px] text-slate-500">{t.id}</code>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {t.acquirer} · MID {t.mid} · TID {t.tid} · Heartbeat: {t.last_heartbeat}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{t.tx_today} txns</p>
                        <p className="text-slate-500">R$ {t.value_today.toLocaleString('pt-BR')} hoje</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}