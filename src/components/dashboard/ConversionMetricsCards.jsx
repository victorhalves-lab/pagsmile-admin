import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Percent,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const ConversionCard = ({ 
  title, 
  rate, 
  previousRate, 
  approved, 
  total, 
  icon: Icon, 
  color = 'blue',
  benchmark
}) => {
  const trend = rate - previousRate;
  const isPositive = trend >= 0;
  const isAboveBenchmark = benchmark ? rate >= benchmark : true;

  const colors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600', bar: 'bg-blue-500', text: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600', bar: 'bg-amber-500', text: 'text-amber-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600', bar: 'bg-purple-500', text: 'text-purple-700' }
  };

  const c = colors[color];

  return (
    <Card className={cn('border', c.border, c.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-5 h-5 flex-shrink-0", c.text)} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
              <p className="text-xs text-slate-400">{approved.toLocaleString('pt-BR')} / {total.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <p className={cn('text-3xl font-bold', c.text)}>{rate.toFixed(1)}%</p>
          {benchmark && (
            <Badge 
              variant={isAboveBenchmark ? 'default' : 'destructive'} 
              className="text-[10px]"
            >
              Bench: {benchmark}%
            </Badge>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={cn('h-full rounded-full transition-all duration-500', c.bar)}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function ConversionMetricsCards({ transactions = [] }) {
  // Calculate conversion metrics
  const metrics = React.useMemo(() => {
    const cardTx = transactions.filter(t => t.method === 'credit_card' || t.method === 'debit_card');
    const pixTx = transactions.filter(t => t.method === 'pix');
    const boletoTx = transactions.filter(t => t.method === 'boleto');

    const calcConversion = (txs) => {
      const approved = txs.filter(t => t.status === 'approved').length;
      return { approved, total: txs.length, rate: txs.length > 0 ? (approved / txs.length) * 100 : 0 };
    };

    const allMetrics = calcConversion(transactions);
    const cardMetrics = calcConversion(cardTx);
    const pixMetrics = calcConversion(pixTx);
    const boletoMetrics = calcConversion(boletoTx);

    // Mock previous period (in production, calculate from actual data)
    return {
      all: { ...allMetrics, previousRate: allMetrics.rate - 1.2 },
      card: { ...cardMetrics, previousRate: cardMetrics.rate - 0.8, benchmark: 75 },
      pix: { ...pixMetrics, previousRate: pixMetrics.rate + 0.5, benchmark: 90 },
      boleto: { ...boletoMetrics, previousRate: boletoMetrics.rate - 2.1, benchmark: 50 }
    };
  }, [transactions]);

  // Conversion trend data (mock)
  const trendData = [
    { name: 'Sem 1', cartao: 72, pix: 93, boleto: 46, geral: 76 },
    { name: 'Sem 2', cartao: 74, pix: 94, boleto: 48, geral: 78 },
    { name: 'Sem 3', cartao: 71, pix: 95, boleto: 44, geral: 75 },
    { name: 'Sem 4', cartao: 73, pix: 94, boleto: 47, geral: 77 },
  ];

  // Volume by method (mock)
  const volumeData = [
    { name: 'Cartão', value: 1250000, color: '#6366f1' },
    { name: 'PIX', value: 890000, color: '#10b981' },
    { name: 'Boleto', value: 320000, color: '#f59e0b' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ConversionCard
          title="Conversão Geral"
          rate={metrics.all.rate}
          previousRate={metrics.all.previousRate}
          approved={metrics.all.approved}
          total={metrics.all.total}
          icon={Target}
          color="purple"
        />
        <ConversionCard
          title="Conversão Cartão"
          rate={metrics.card.rate}
          previousRate={metrics.card.previousRate}
          approved={metrics.card.approved}
          total={metrics.card.total}
          icon={CreditCard}
          color="blue"
          benchmark={metrics.card.benchmark}
        />
        <ConversionCard
          title="Conversão PIX"
          rate={metrics.pix.rate}
          previousRate={metrics.pix.previousRate}
          approved={metrics.pix.approved}
          total={metrics.pix.total}
          icon={QrCode}
          color="emerald"
          benchmark={metrics.pix.benchmark}
        />
        <ConversionCard
          title="Conversão Boleto"
          rate={metrics.boleto.rate}
          previousRate={metrics.boleto.previousRate}
          approved={metrics.boleto.approved}
          total={metrics.boleto.total}
          icon={FileText}
          color="amber"
          benchmark={metrics.boleto.benchmark}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Tendência de Conversão
            </CardTitle>
            <CardDescription>Evolução das taxas por método nas últimas semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCartao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPix" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBoleto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="cartao" name="Cartão" stroke="#6366f1" fill="url(#colorCartao)" strokeWidth={2} />
                <Area type="monotone" dataKey="pix" name="PIX" stroke="#10b981" fill="url(#colorPix)" strokeWidth={2} />
                <Area type="monotone" dataKey="boleto" name="Boleto" stroke="#f59e0b" fill="url(#colorBoleto)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volume Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-500" />
              Distribuição de Volume
            </CardTitle>
            <CardDescription>Volume transacionado por método de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={volumeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {volumeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}: {formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}