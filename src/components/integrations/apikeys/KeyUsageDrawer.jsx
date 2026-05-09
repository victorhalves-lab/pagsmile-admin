import React from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Activity, Clock, Globe, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const usageData = Array.from({ length: 7 }, (_, i) => ({
  day: `D-${6 - i}`,
  requests: 800 + Math.round(Math.random() * 500),
  errors: Math.round(Math.random() * 30),
}));

const recentIps = [
  { ip: '200.150.20.10', country: '🇧🇷 BR', city: 'São Paulo', count: 1240, last: '2min atrás' },
  { ip: '34.198.5.42', country: '🇺🇸 US', city: 'Virginia', count: 580, last: '15min atrás' },
  { ip: '192.168.1.1', country: '🌐 Internal', city: 'AWS VPC', count: 320, last: '1h atrás' },
];

export default function KeyUsageDrawer({ open, onOpenChange, apiKey }) {
  if (!apiKey) return null;

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Analytics: ${apiKey.name}`}
      description="Uso, erros, IPs e geolocalização desta chave"
      icon={Activity}
      size="lg"
    >
      <div className="space-y-5">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Requests (7d)</p>
            <p className="text-xl font-bold mt-0.5">7.4k</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">+12%</p>
          </div>
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Error Rate</p>
            <p className="text-xl font-bold mt-0.5 text-amber-600">2.1%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">158 erros</p>
          </div>
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Latência p99</p>
            <p className="text-xl font-bold mt-0.5">280ms</p>
            <p className="text-[10px] text-slate-500 mt-0.5">p50: 88ms</p>
          </div>
        </div>

        {/* Usage chart */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Requests vs Erros (últimos 7 dias)
            </h4>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={usageData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#2bc196" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent IPs / Geo */}
        <div className="rounded-lg border">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold">IPs Recentes</h4>
            <Badge variant="outline" className="ml-auto text-[10px]">Top 3</Badge>
          </div>
          <div className="divide-y">
            {recentIps.map((ip) => (
              <div key={ip.ip} className="px-4 py-3 flex items-center gap-3 text-sm">
                <code className="text-xs font-mono">{ip.ip}</code>
                <span className="text-xs">{ip.country}</span>
                <span className="text-xs text-slate-500 flex-1">{ip.city}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ip.last}
                </span>
                <Badge variant="secondary" className="text-[10px]">{ip.count}x</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly alert */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-800">Anomalia detectada</p>
            <p className="text-amber-700 mt-0.5">Esta chave teve 3% de erro 401 nas últimas 24h — possível invalidation no client.</p>
          </div>
        </div>

        {/* Audit */}
        <div className="rounded-lg border">
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" /> Audit Log
            </h4>
          </div>
          <div className="divide-y text-xs">
            <div className="px-4 py-2 flex items-center justify-between">
              <span>Chave criada por joao@pagsmile.com</span>
              <span className="text-slate-500">há 90 dias</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between">
              <span>Permissões alteradas para Restricted (write_payments)</span>
              <span className="text-slate-500">há 30 dias</span>
            </div>
            <div className="px-4 py-2 flex items-center justify-between">
              <span>IP allowlist atualizado (+1 IP)</span>
              <span className="text-slate-500">há 12 dias</span>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}