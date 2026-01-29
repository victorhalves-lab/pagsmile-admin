import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet,
  TrendingUp,
  TrendingDown,
  QrCode,
  Hash,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatCompactCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value || 0);
};

export default function PixFlowCards({ transactions = [] }) {
  // Calculate PIX metrics
  const metrics = React.useMemo(() => {
    const pixTx = transactions.filter(t => t.method === 'pix');
    const pixIn = pixTx.filter(t => t.pix_transaction_type === 'in' || !t.pix_transaction_type);
    const pixOut = pixTx.filter(t => t.pix_transaction_type === 'out');

    const pixInApproved = pixIn.filter(t => t.status === 'approved');
    const pixOutApproved = pixOut.filter(t => t.status === 'approved');

    const pixInVolume = pixInApproved.reduce((sum, t) => sum + (t.amount || 0), 0);
    const pixOutVolume = pixOutApproved.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Mock previous period values
    const prevPixInVolume = pixInVolume * 0.92;
    const prevPixOutVolume = pixOutVolume * 1.05;

    return {
      pixInCount: pixIn.length,
      pixInApprovedCount: pixInApproved.length,
      pixInVolume,
      pixInConversion: pixIn.length > 0 ? (pixInApproved.length / pixIn.length) * 100 : 0,
      pixInTrend: ((pixInVolume - prevPixInVolume) / prevPixInVolume) * 100,

      pixOutCount: pixOut.length,
      pixOutApprovedCount: pixOutApproved.length,
      pixOutVolume,
      pixOutConversion: pixOut.length > 0 ? (pixOutApproved.length / pixOut.length) * 100 : 0,
      pixOutTrend: ((pixOutVolume - prevPixOutVolume) / prevPixOutVolume) * 100,

      netBalance: pixInVolume - pixOutVolume,
      netBalanceTrend: (((pixInVolume - pixOutVolume) - (prevPixInVolume - prevPixOutVolume)) / (prevPixInVolume - prevPixOutVolume)) * 100
    };
  }, [transactions]);

  // Mock chart data
  const chartData = [
    { name: 'Seg', entrada: 125000, saida: 15000 },
    { name: 'Ter', entrada: 145000, saida: 12000 },
    { name: 'Qua', entrada: 135000, saida: 18000 },
    { name: 'Qui', entrada: 155000, saida: 10000 },
    { name: 'Sex', entrada: 175000, saida: 22000 },
    { name: 'Sáb', entrada: 95000, saida: 8000 },
    { name: 'Dom', entrada: 65000, saida: 5000 },
  ];

  return (
    <div className="space-y-6">
      {/* PIX Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PIX Entrada */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
                  <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">PIX Entrada</p>
                  <p className="text-xs text-emerald-600">Recebimentos</p>
                </div>
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                metrics.pixInTrend >= 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-red-100 text-red-700'
              )}>
                {metrics.pixInTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metrics.pixInTrend).toFixed(1)}%
              </div>
            </div>

            <p className="text-3xl font-bold text-emerald-900 mb-3">{formatCurrency(metrics.pixInVolume)}</p>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-emerald-800">{metrics.pixInApprovedCount}</p>
                <p className="text-[10px] text-emerald-600 uppercase">Pagos</p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-emerald-800">{metrics.pixInCount}</p>
                <p className="text-[10px] text-emerald-600 uppercase">Total</p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-emerald-800">{metrics.pixInConversion.toFixed(1)}%</p>
                <p className="text-[10px] text-emerald-600 uppercase">Conv.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PIX Saída */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shadow-sm">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800">PIX Saída</p>
                  <p className="text-xs text-red-600">Envios / Devoluções</p>
                </div>
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                metrics.pixOutTrend <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-200 text-red-800'
              )}>
                {metrics.pixOutTrend <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(metrics.pixOutTrend).toFixed(1)}%
              </div>
            </div>

            <p className="text-3xl font-bold text-red-900 mb-3">{formatCurrency(metrics.pixOutVolume)}</p>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-800">{metrics.pixOutApprovedCount}</p>
                <p className="text-[10px] text-red-600 uppercase">Enviados</p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-800">{metrics.pixOutCount}</p>
                <p className="text-[10px] text-red-600 uppercase">Total</p>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-800">{metrics.pixOutConversion.toFixed(1)}%</p>
                <p className="text-[10px] text-red-600 uppercase">Conv.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saldo Líquido */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">Saldo Líquido PIX</p>
                  <p className="text-xs text-blue-600">Entrada - Saída</p>
                </div>
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                metrics.netBalanceTrend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              )}>
                {metrics.netBalanceTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metrics.netBalanceTrend).toFixed(1)}%
              </div>
            </div>

            <p className={cn(
              "text-3xl font-bold mb-3",
              metrics.netBalance >= 0 ? "text-blue-900" : "text-red-900"
            )}>
              {formatCurrency(metrics.netBalance)}
            </p>

            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Entrada</span>
                </div>
                <span className="font-medium text-emerald-700">{formatCompactCurrency(metrics.pixInVolume)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-600">Saída</span>
                </div>
                <span className="font-medium text-red-700">-{formatCompactCurrency(metrics.pixOutVolume)}</span>
              </div>
              <div className="border-t border-blue-200 mt-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-800">Líquido</span>
                  <span className={cn(
                    "font-bold",
                    metrics.netBalance >= 0 ? "text-blue-800" : "text-red-800"
                  )}>
                    {formatCompactCurrency(metrics.netBalance)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PIX Flow Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-500" />
            Fluxo PIX - Últimos 7 Dias
          </CardTitle>
          <CardDescription>Comparativo de entradas e saídas de PIX</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => formatCompactCurrency(v)} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="entrada" name="PIX Entrada" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saida" name="PIX Saída" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}