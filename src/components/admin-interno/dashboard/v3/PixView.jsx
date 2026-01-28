import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, TrendingUp, TrendingDown, CheckCircle, Clock, 
  AlertTriangle, RefreshCw, Zap
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock PIX data
const pixKPIs = {
  tpv: 3125000,
  transactions: 41667,
  ticketMedio: 75,
  taxaSucesso: 99.1,
  tempoMedioPagamento: '2m 15s',
  taxaExpiracao: 12.5,
  medRatio: 0.08
};

const pixTypePerformance = [
  { type: 'QR Dinâmico', tpv: 2500000, share: 80, sucesso: 99.3, tempoMedio: '2m 15s', count: 33333 },
  { type: 'Copia e Cola', tpv: 468750, share: 15, sucesso: 98.8, tempoMedio: '3m 45s', count: 6250 },
  { type: 'QR Estático', tpv: 125000, share: 4, sucesso: 98.5, tempoMedio: '1m 30s', count: 1667 },
  { type: 'PIX Cobrança', tpv: 31250, share: 1, sucesso: 97.2, tempoMedio: '—', count: 417 }
];

const pspPerformance = [
  { name: 'PSP A (Itaú)', share: 70, sucesso: 99.2, latencia: 856, erro: 0.01 },
  { name: 'PSP B (Bradesco)', share: 30, sucesso: 98.9, latencia: 923, erro: 0.03 }
];

const devolucoes = {
  voluntarias: { count: 234, value: 45600, reasons: [
    { reason: 'Cancelamento de pedido', percent: 45 },
    { reason: 'Erro de valor', percent: 30 },
    { reason: 'Duplicidade', percent: 15 },
    { reason: 'Outros', percent: 10 }
  ]},
  meds: { count: 33, value: 12500, status: [
    { status: 'Bloqueio Cautelar', count: 5 },
    { status: 'Em Análise', count: 12 },
    { status: 'Devolvido', count: 10 },
    { status: 'Encerrado', count: 6 }
  ]}
};

const hourlyTrend = [
  { hour: '00h', tpv: 85000, count: 1133 },
  { hour: '06h', tpv: 120000, count: 1600 },
  { hour: '09h', tpv: 280000, count: 3733 },
  { hour: '12h', tpv: 420000, count: 5600 },
  { hour: '15h', tpv: 380000, count: 5067 },
  { hour: '18h', tpv: 450000, count: 6000 },
  { hour: '21h', tpv: 320000, count: 4267 }
];

const PIX_COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

function PixKPICard({ title, value, format, icon: Icon, trend, trendValue, subtitle, variant = 'default' }) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percent' 
      ? `${value.toFixed(1)}%` 
      : value.toLocaleString ? value.toLocaleString('pt-BR') : value;

  const variants = {
    default: 'bg-white',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200'
  };

  return (
    <Card className={variants[variant]}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{formattedValue}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-green-100">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PixView() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <PixKPICard title="TPV PIX" value={pixKPIs.tpv} format="currency" icon={QrCode} trend="up" trendValue="+18.2%" />
        <PixKPICard title="Transações" value={pixKPIs.transactions} format="number" icon={Zap} trend="up" trendValue="+15.6%" />
        <PixKPICard title="Ticket Médio" value={pixKPIs.ticketMedio} format="currency" icon={QrCode} />
        <PixKPICard title="Taxa de Sucesso" value={pixKPIs.taxaSucesso} format="percent" icon={CheckCircle} trend="up" trendValue="+0.3pp" variant="success" />
        <PixKPICard title="Tempo Médio" value={pixKPIs.tempoMedioPagamento} format="text" icon={Clock} subtitle="até pagamento" />
        <PixKPICard title="Taxa Expiração" value={pixKPIs.taxaExpiracao} format="percent" icon={Clock} trend="down" trendValue="-2.1pp" />
        <PixKPICard title="MED Ratio" value={pixKPIs.medRatio} format="percent" icon={AlertTriangle} subtitle="Limite: 0.20%" variant={pixKPIs.medRatio < 0.10 ? 'success' : 'warning'} />
      </div>

      {/* Type Performance + PSP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIX Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Tipo de PIX</CardTitle>
            <CardDescription>Comparativo de sucesso e tempo médio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pixTypePerformance} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="type" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="sucesso" name="Taxa de Sucesso" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {pixTypePerformance.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{item.share}%</span>
                    <span className="text-slate-500">|</span>
                    <span>{formatCurrency(item.tpv)}</span>
                    <span className="text-slate-500">|</span>
                    <span>{item.tempoMedio}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PSP Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance do PSP</CardTitle>
            <CardDescription>Sucesso, latência e share por PSP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[150px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pspPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="share"
                    label={({ name, share }) => `${name.split(' ')[0]} ${share}%`}
                  >
                    {pspPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIX_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pspPerformance.map((psp) => (
                <div key={psp.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{psp.name}</p>
                    <p className="text-xs text-slate-500">{psp.share}% do volume</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-green-600">{psp.sucesso}%</p>
                      <p className="text-xs text-slate-500">Sucesso</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{psp.latencia}ms</p>
                      <p className="text-xs text-slate-500">Latência</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{psp.erro}%</p>
                      <p className="text-xs text-slate-500">Erro</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devoluções + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devoluções Voluntárias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Devoluções Voluntárias
            </CardTitle>
            <CardDescription>{devolucoes.voluntarias.count} devoluções • {formatCurrency(devolucoes.voluntarias.value)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devolucoes.voluntarias.reasons.map((item) => (
                <div key={item.reason} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.reason}</span>
                    <span className="font-medium">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MEDs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              MEDs (Mecanismo Especial de Devolução)
            </CardTitle>
            <CardDescription>{devolucoes.meds.count} MEDs • {formatCurrency(devolucoes.meds.value)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devolucoes.meds.status.map((item) => (
                <div key={item.status} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm">{item.status}</span>
                  <Badge variant={
                    item.status === 'Bloqueio Cautelar' ? 'destructive' :
                    item.status === 'Em Análise' ? 'secondary' :
                    item.status === 'Devolvido' ? 'default' : 'outline'
                  }>
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Horário</CardTitle>
            <CardDescription>Volume ao longo do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyTrend}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="tpv" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}