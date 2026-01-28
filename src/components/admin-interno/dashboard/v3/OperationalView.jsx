import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, Zap, Clock, AlertCircle, CheckCircle, XCircle, 
  CreditCard, QrCode, FileText, Eye, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

// Mock real-time data
const generateTPSData = () => {
  return Array.from({ length: 60 }, (_, i) => ({
    time: `${59 - i}s`,
    tps: Math.random() * 50 + 30
  })).reverse();
};

const mockLiveFeed = [
  { id: 'TXN-001', method: 'cartao', merchant: 'Loja ABC', value: 1500, status: 'approved', time: '14:32:45' },
  { id: 'PIX-002', method: 'pix', merchant: 'Store XYZ', value: 89.90, status: 'paid', time: '14:32:43' },
  { id: 'TXN-003', method: 'cartao', merchant: 'Tech Corp', value: 2500, status: 'denied', time: '14:32:40' },
  { id: 'BOL-004', method: 'boleto', merchant: 'Empresa 123', value: 5000, status: 'pending', time: '14:32:38' },
  { id: 'PIX-005', method: 'pix', merchant: 'Fashion Store', value: 450, status: 'paid', time: '14:32:35' },
  { id: 'TXN-006', method: 'cartao', merchant: 'Loja ABC', value: 320, status: 'approved', time: '14:32:32' },
  { id: 'PIX-007', method: 'pix', merchant: 'Store XYZ', value: 1200, status: 'paid', time: '14:32:30' },
  { id: 'TXN-008', method: 'cartao', merchant: 'Tech Corp', value: 890, status: 'approved', time: '14:32:28' }
];

const latencyData = [
  { time: '14:00', adyen: 198, stone: 234, rede: 345 },
  { time: '14:05', adyen: 210, stone: 245, rede: 312 },
  { time: '14:10', adyen: 185, stone: 220, rede: 380 },
  { time: '14:15', adyen: 195, stone: 230, rede: 345 },
  { time: '14:20', adyen: 202, stone: 240, rede: 356 },
  { time: '14:25', adyen: 188, stone: 225, rede: 340 },
  { time: '14:30', adyen: 192, stone: 238, rede: 348 }
];

function RealtimeKPI({ title, value, unit, status, icon: Icon }) {
  const statusColors = {
    excellent: 'bg-green-100 text-green-700 border-green-200',
    normal: 'bg-blue-100 text-blue-700 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    critical: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <Card className={`border-2 ${statusColors[status]}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">{value}</span>
              <span className="text-sm opacity-75">{unit}</span>
            </div>
          </div>
          <Icon className="w-8 h-8 opacity-50" />
        </div>
      </CardContent>
    </Card>
  );
}

function LiveFeedItem({ transaction }) {
  const methodIcons = {
    cartao: <CreditCard className="w-4 h-4 text-blue-500" />,
    pix: <QrCode className="w-4 h-4 text-green-500" />,
    boleto: <FileText className="w-4 h-4 text-amber-500" />
  };

  const statusConfig = {
    approved: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50', label: 'Aprovada' },
    paid: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50', label: 'Pago' },
    denied: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'Negada' },
    pending: { icon: <Clock className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50', label: 'Pendente' }
  };

  const status = statusConfig[transaction.status];

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors animate-in fade-in-50 duration-300">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 font-mono w-16">{transaction.time}</span>
        {methodIcons[transaction.method]}
        <div>
          <p className="text-sm font-medium">{transaction.id}</p>
          <p className="text-xs text-slate-500">{transaction.merchant}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">{formatCurrency(transaction.value)}</span>
        <Badge className={status.color}>
          {status.icon}
          <span className="ml-1">{status.label}</span>
        </Badge>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function OperationalView() {
  const [tpsData, setTpsData] = useState(generateTPSData());
  const [currentTPS, setCurrentTPS] = useState(42.5);
  const [latency, setLatency] = useState(245);
  const [errorRate, setErrorRate] = useState(0.12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTPS(prev => Math.max(0, prev + (Math.random() - 0.5) * 10));
      setLatency(prev => Math.max(100, prev + (Math.random() - 0.5) * 50));
      setErrorRate(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
      setTpsData(prev => {
        const newData = [...prev.slice(1), { time: 'now', tps: Math.random() * 50 + 30 }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLatencyStatus = (ms) => {
    if (ms < 300) return 'excellent';
    if (ms < 500) return 'normal';
    if (ms < 1000) return 'warning';
    return 'critical';
  };

  const getErrorStatus = (rate) => {
    if (rate < 0.1) return 'excellent';
    if (rate < 0.3) return 'normal';
    if (rate < 0.5) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-6">
      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RealtimeKPI 
          title="TPS Atual" 
          value={currentTPS.toFixed(1)} 
          unit="tx/s"
          status={currentTPS > 100 ? 'warning' : 'normal'}
          icon={Zap}
        />
        <RealtimeKPI 
          title="Latência Média" 
          value={Math.round(latency)} 
          unit="ms"
          status={getLatencyStatus(latency)}
          icon={Clock}
        />
        <RealtimeKPI 
          title="Taxa de Erro" 
          value={errorRate.toFixed(2)} 
          unit="%"
          status={getErrorStatus(errorRate)}
          icon={AlertCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TPS Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              TPS em Tempo Real
            </CardTitle>
            <CardDescription>Transações por segundo (últimos 60s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tpsData}>
                  <defs>
                    <linearGradient id="colorTPS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="tps" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTPS)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latency by Acquirer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Latência por Adquirente
            </CardTitle>
            <CardDescription>Últimos 30 minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 500]} tick={{ fontSize: 12 }} unit="ms" />
                  <Tooltip formatter={(v) => `${v}ms`} />
                  <Line type="monotone" dataKey="adyen" name="Adyen" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stone" name="Stone" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rede" name="Rede" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-600">Adyen</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-600">Stone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-600">Rede</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500 animate-pulse" />
              Live Feed de Transações
            </CardTitle>
            <CardDescription>Transações em tempo real</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Pausar
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {mockLiveFeed.map((tx) => (
              <LiveFeedItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}