import React from 'react';
import { Code2, Activity, Zap, Webhook, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { developerMetrics } from '@/components/mockData/futureAdminMocks';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const trafficData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}h`,
  requests: 6000 + Math.round(Math.sin(i / 3) * 2000 + Math.random() * 1500),
}));

const latencyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}h`,
  p50: 88 + Math.round(Math.random() * 30),
  p95: 220 + Math.round(Math.random() * 80),
  p99: 480 + Math.round(Math.random() * 120),
}));

const Kpi = ({ icon: Icon, label, value, subtext, color, bg }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg || 'bg-[#2bc196]/10')}>
      <Icon className={cn('w-5 h-5', color || 'text-[#2bc196]')} />
    </div>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-0.5">{value}</p>
    {subtext && <p className="text-[11px] text-slate-500 mt-1">{subtext}</p>}
  </div>
);

const StatusPill = ({ status }) => {
  const cls = status >= 500 ? 'bg-red-500/10 text-red-600' : status >= 400 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600';
  return <span className={cn('font-mono text-[11px] font-bold px-2 py-0.5 rounded', cls)}>{status}</span>;
};

export default function Developers() {
  const m = developerMetrics;

  return (
    <div className="space-y-6">
      <PageHeader title="Developer Hub" subtitle="Saúde da sua integração em tempo real" icon={Code2} sparkles
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Code2 className="w-4 h-4" /> Docs</Button>
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#25a880] gap-2"><ArrowUpRight className="w-4 h-4" /> Status page</Button>
          </div>
        } />

      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Todos os serviços operacionais</p>
          <p className="text-xs text-emerald-600/70">Sem incidentes nas últimas 24h · uptime 99.97%</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Operacional</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={Activity} label="Uptime (30d)" value={`${m.uptime}%`} subtext="SLA: 99.95%" />
        <Kpi icon={Zap} label="Latência média" value={`${m.avgLatency}ms`} subtext="p95: 280ms · p99: 520ms" color="text-blue-600" bg="bg-blue-500/10" />
        <Kpi icon={Activity} label="Requests (24h)" value={m.totalRequests24h.toLocaleString('pt-BR')} subtext={`Erro: ${m.errorRate}%`} color="text-violet-600" bg="bg-violet-500/10" />
        <Kpi icon={Webhook} label="Webhooks entregues" value={`${m.webhookSuccessRate}%`} subtext={`${m.webhookPending} pendentes`} color="text-amber-600" bg="bg-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-semibold mb-4">Tráfego (últimas 24h)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2bc196" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2bc196" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#2bc196" strokeWidth={2} fill="url(#reqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-semibold mb-4">Latência (p50/p95/p99)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={latencyData}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="logs">Logs recentes</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        <TabsContent value="endpoints" className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Endpoint</th>
                  <th className="text-right px-4 py-3 font-medium">Chamadas (24h)</th>
                  <th className="text-right px-4 py-3 font-medium">Latência</th>
                  <th className="text-right px-4 py-3 font-medium">Erro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {m.topEndpoints.map((ep) => (
                  <tr key={ep.path}>
                    <td className="px-4 py-3 font-mono text-xs">{ep.path}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{ep.count.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500">{ep.avgLatency}ms</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={cn('text-xs font-medium', ep.errorRate > 0.1 ? 'text-amber-600' : 'text-emerald-600')}>
                        {ep.errorRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="logs" className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
            {m.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3 text-sm font-mono">
                <span className="text-xs text-slate-400 w-24 flex-shrink-0">{formatDistanceToNow(log.time, { addSuffix: false, locale: ptBR })} atrás</span>
                <Badge variant="outline" className="text-[10px] font-mono w-14 justify-center">{log.method}</Badge>
                <code className="text-xs flex-1 truncate">{log.path}</code>
                <StatusPill status={log.status} />
                <span className={cn('text-xs tabular-nums w-16 text-right', log.latency > 1000 ? 'text-red-600' : 'text-slate-500')}>{log.latency}ms</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="webhooks" className="mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 grid grid-cols-3 gap-4">
            <div><p className="text-xs text-slate-500">Sucesso (7d)</p><p className="text-2xl font-bold text-emerald-600">99.4%</p></div>
            <div><p className="text-xs text-slate-500">Pendentes</p><p className="text-2xl font-bold text-amber-600">23</p></div>
            <div><p className="text-xs text-slate-500">Falhas (24h)</p><p className="text-2xl font-bold text-red-600">8</p></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}