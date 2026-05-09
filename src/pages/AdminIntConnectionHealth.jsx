import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Zap, Filter, RefreshCw, Settings2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockConnections } from '@/components/orchestration/mockData';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', label: 'Saudável' },
  degraded: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200', label: 'Degradado' },
  down: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'Indisponível' },
};

const TYPE_LABEL = {
  acquirer: 'Adquirente',
  gateway: 'Gateway',
  antifraud: 'Antifraude',
  identity: 'Identidade',
};

export default function AdminIntConnectionHealth() {
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filter === 'all' ? mockConnections : mockConnections.filter(c => c.type === filter);
  const stats = {
    total: mockConnections.length,
    healthy: mockConnections.filter(c => c.status === 'healthy').length,
    degraded: mockConnections.filter(c => c.status === 'degraded').length,
    down: mockConnections.filter(c => c.status === 'down').length,
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connection Health Monitor"
        subtitle="Monitoramento em tempo real de adquirentes, gateways, antifraudes e identidade"
        icon={Activity}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Circuit Breakers
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Saudáveis</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.healthy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Degradados</p>
                <p className="text-2xl font-bold text-amber-600">{stats.degraded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Indisponíveis</p>
                <p className="text-2xl font-bold text-red-600">{stats.down}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Todos ({mockConnections.length})</TabsTrigger>
          <TabsTrigger value="acquirer">Adquirentes ({mockConnections.filter(c => c.type === 'acquirer').length})</TabsTrigger>
          <TabsTrigger value="gateway">Gateways ({mockConnections.filter(c => c.type === 'gateway').length})</TabsTrigger>
          <TabsTrigger value="antifraud">Antifraudes ({mockConnections.filter(c => c.type === 'antifraud').length})</TabsTrigger>
          <TabsTrigger value="identity">Identidade ({mockConnections.filter(c => c.type === 'identity').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((conn) => {
              const cfg = STATUS_CONFIG[conn.status];
              const StatusIcon = cfg.icon;
              return (
                <Card key={conn.id} className={cn('hover:shadow-md transition-shadow border-l-4', conn.status === 'healthy' ? 'border-l-emerald-500' : conn.status === 'degraded' ? 'border-l-amber-500' : 'border-l-red-500')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-base">{conn.name}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {TYPE_LABEL[conn.type]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {conn.methods?.map(m => (
                            <Badge key={m} variant="secondary" className="text-[10px] capitalize">{m}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className={cn('gap-1', cfg.bg, cfg.color, 'border-0')}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">P50</p>
                        <p className="text-sm font-bold">{conn.latencyP50}ms</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">P95</p>
                        <p className="text-sm font-bold">{conn.latencyP95}ms</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                        <p className="text-[10px] text-slate-500 uppercase">P99</p>
                        <p className="text-sm font-bold">{conn.latencyP99}ms</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {conn.approvalRate !== null && (
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] text-slate-500">Taxa de aprovação</span>
                            <span className="text-xs font-semibold">{conn.approvalRate}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full', conn.approvalRate >= 90 ? 'bg-emerald-500' : conn.approvalRate >= 80 ? 'bg-amber-500' : 'bg-red-500')}
                              style={{ width: `${conn.approvalRate}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-slate-500">Uptime</span>
                          <span className="text-xs font-semibold">{conn.uptime}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full', conn.uptime >= 99.9 ? 'bg-emerald-500' : conn.uptime >= 99 ? 'bg-amber-500' : 'bg-red-500')}
                            style={{ width: `${conn.uptime}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-slate-500">Error rate</span>
                          <span className={cn('text-xs font-semibold', conn.errorRate > 1 ? 'text-red-600' : 'text-emerald-600')}>
                            {conn.errorRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px]">
                        <Zap className="w-3 h-3 mr-1" />
                        Detalhes
                      </Button>
                      {conn.status !== 'healthy' && (
                        <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] text-amber-700 border-amber-300">
                          Pausar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}