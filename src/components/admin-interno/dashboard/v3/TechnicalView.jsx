import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, Activity, Clock, AlertTriangle, CheckCircle, XCircle,
  Wifi, WifiOff, Zap, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

// Mock technical data
const infraKPIs = {
  disponibilidade: 99.98,
  latenciaMedia: 245,
  latenciaP95: 456,
  latenciaP99: 892,
  taxaErroGlobal: 0.12
};

const providerStatus = [
  { name: 'Adyen', type: 'Adquirente', status: 'ok', latency: 198, errorRate: 0.02, uptime: 100 },
  { name: 'Stone', type: 'Adquirente', status: 'ok', latency: 234, errorRate: 0.05, uptime: 100 },
  { name: 'Rede', type: 'Adquirente', status: 'slow', latency: 456, errorRate: 0.12, uptime: 99.8 },
  { name: 'GetNet', type: 'Adquirente', status: 'ok', latency: 267, errorRate: 0.08, uptime: 100 },
  { name: 'Itaú (PIX)', type: 'PSP', status: 'ok', latency: 856, errorRate: 0.01, uptime: 100 },
  { name: 'Bradesco (PIX)', type: 'PSP', status: 'warn', latency: 1023, errorRate: 0.03, uptime: 99.9 },
  { name: 'SEON', type: 'Antifraude', status: 'ok', latency: 145, errorRate: 0.01, uptime: 100 },
  { name: 'Nethone', type: 'Antifraude', status: 'ok', latency: 178, errorRate: 0.02, uptime: 100 },
  { name: 'Ethoca', type: 'Pré-CB', status: 'ok', latency: 234, errorRate: 0.00, uptime: 100 },
  { name: 'Verifi', type: 'Pré-CB', status: 'ok', latency: 289, errorRate: 0.01, uptime: 100 }
];

const healthChecks = [
  { endpoint: 'API Gateway', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 45 },
  { endpoint: 'Database Primary', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 12 },
  { endpoint: 'Database Replica', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 15 },
  { endpoint: 'Redis Cache', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 3 },
  { endpoint: 'Message Queue', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 8 },
  { endpoint: 'S3 Storage', status: 'ok', lastCheck: '28/01 14:32:45', responseTime: 89 }
];

const webhookStats = {
  enviados: 45678,
  entregues: 45234,
  emRetry: 312,
  falhas: 132,
  taxaEntrega: 99.03
};

const latencyTrend = [
  { time: '14:00', adyen: 198, stone: 234, rede: 345, pix: 856 },
  { time: '14:05', adyen: 210, stone: 245, rede: 412, pix: 923 },
  { time: '14:10', adyen: 185, stone: 220, rede: 380, pix: 878 },
  { time: '14:15', adyen: 195, stone: 230, rede: 456, pix: 912 },
  { time: '14:20', adyen: 202, stone: 240, rede: 398, pix: 845 },
  { time: '14:25', adyen: 188, stone: 225, rede: 367, pix: 889 },
  { time: '14:30', adyen: 192, stone: 238, rede: 423, pix: 901 }
];

const statusConfig = {
  ok: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'OK' },
  warn: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'WARN' },
  slow: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100', label: 'SLOW' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'ERROR' },
  down: { icon: WifiOff, color: 'text-gray-500', bg: 'bg-gray-100', label: 'DOWN' }
};

function InfraKPICard({ title, value, unit, status, threshold }) {
  const getStatus = () => {
    if (title.includes('Disponibilidade')) return value >= 99.9 ? 'ok' : value >= 99 ? 'warn' : 'error';
    if (title.includes('Latência')) return value < threshold ? 'ok' : value < threshold * 1.5 ? 'warn' : 'error';
    if (title.includes('Erro')) return value < 0.5 ? 'ok' : value < 1 ? 'warn' : 'error';
    return 'ok';
  };

  const statusColors = {
    ok: 'border-green-200 bg-green-50',
    warn: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  const currentStatus = status || getStatus();

  return (
    <Card className={`${statusColors[currentStatus]}`}>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold">{typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 0) : value}</span>
          <span className="text-lg text-slate-500">{unit}</span>
        </div>
        {threshold && (
          <p className="text-xs text-slate-500 mt-2">Meta: &lt; {threshold}{unit}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProviderStatusRow({ provider }) {
  const status = statusConfig[provider.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${status.bg}`}>
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
        </div>
        <div>
          <p className="font-medium">{provider.name}</p>
          <p className="text-xs text-slate-500">{provider.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className={`font-medium ${provider.latency > 500 ? 'text-orange-600' : provider.latency > 300 ? 'text-yellow-600' : 'text-green-600'}`}>
            {provider.latency}ms
          </p>
          <p className="text-xs text-slate-500">Latência</p>
        </div>
        <div className="text-center">
          <p className={`font-medium ${provider.errorRate > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
            {provider.errorRate.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-500">Erro</p>
        </div>
        <div className="text-center">
          <p className={`font-medium ${provider.uptime < 99.9 ? 'text-yellow-600' : 'text-green-600'}`}>
            {provider.uptime}%
          </p>
          <p className="text-xs text-slate-500">Uptime</p>
        </div>
        <Badge className={status.bg + ' ' + status.color}>{status.label}</Badge>
      </div>
    </div>
  );
}

export default function TechnicalView() {
  return (
    <div className="space-y-6">
      {/* Infrastructure KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <InfraKPICard title="Disponibilidade" value={infraKPIs.disponibilidade} unit="%" />
        <InfraKPICard title="Latência Média" value={infraKPIs.latenciaMedia} unit="ms" threshold={500} />
        <InfraKPICard title="Latência P95" value={infraKPIs.latenciaP95} unit="ms" threshold={800} />
        <InfraKPICard title="Latência P99" value={infraKPIs.latenciaP99} unit="ms" threshold={1500} />
        <InfraKPICard title="Taxa de Erro" value={infraKPIs.taxaErroGlobal} unit="%" threshold={0.5} />
      </div>

      {/* Latency Chart + Health Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Latência por Provider
            </CardTitle>
            <CardDescription>Últimos 30 minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyTrend}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 1200]} tick={{ fontSize: 12 }} unit="ms" />
                  <Tooltip formatter={(v) => `${v}ms`} />
                  <Line type="monotone" dataKey="adyen" name="Adyen" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stone" name="Stone" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rede" name="Rede" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pix" name="PIX" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs">Adyen</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs">Stone</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs">Rede</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-xs">PIX</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Health Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-green-500" />
              Health Checks
            </CardTitle>
            <CardDescription>Status dos serviços internos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthChecks.map((check) => {
                const status = statusConfig[check.status];
                const StatusIcon = status.icon;
                return (
                  <div key={check.endpoint} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className="text-sm font-medium">{check.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{check.responseTime}ms</span>
                      <span>{check.lastCheck}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-500" />
            Status dos Providers
          </CardTitle>
          <CardDescription>Adquirentes, PSPs, Antifraude e Pré-Chargeback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {providerStatus.map((provider) => (
              <ProviderStatusRow key={provider.name} provider={provider} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            Webhooks e Callbacks
          </CardTitle>
          <CardDescription>Estatísticas de entrega de notificações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold">{webhookStats.enviados.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-500">Enviados</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{webhookStats.entregues.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-500">Entregues</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{webhookStats.emRetry}</p>
              <p className="text-xs text-slate-500">Em Retry</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{webhookStats.falhas}</p>
              <p className="text-xs text-slate-500">Falhas</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{webhookStats.taxaEntrega}%</p>
              <p className="text-xs text-slate-500">Taxa Entrega</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Política de Retry</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Badge variant="outline">1ª: Imediato</Badge>
              <span>→</span>
              <Badge variant="outline">2ª: 5min</Badge>
              <span>→</span>
              <Badge variant="outline">3ª: 30min</Badge>
              <span>→</span>
              <Badge variant="outline">4ª: 2h</Badge>
              <span>→</span>
              <Badge variant="outline">5ª: 12h</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}