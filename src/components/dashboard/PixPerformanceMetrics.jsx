import React from 'react';
import { cn } from '@/lib/utils';
import { QrCode, Clock, CheckCircle, XCircle, Timer, TrendingUp, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function PixPerformanceMetrics({ transactions = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value || 0);
  };

  // Filter Pix transactions
  const pixTx = transactions.filter(t => t.type === 'pix');
  const pixPaid = pixTx.filter(t => t.status === 'approved');
  const pixPending = pixTx.filter(t => t.status === 'pending');
  
  // Mock data for expired (in real app, track this)
  const pixExpired = Math.floor(pixTx.length * 0.15);
  const qrGenerated = pixTx.length + pixExpired;
  
  const conversionRate = qrGenerated > 0 ? (pixPaid.length / qrGenerated) * 100 : 0;
  const totalValue = pixPaid.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Mock timing data (in real app, calculate from timestamps)
  const timingData = {
    under1min: Math.floor(pixPaid.length * 0.45),
    between1and5: Math.floor(pixPaid.length * 0.35),
    between5and15: Math.floor(pixPaid.length * 0.15),
    over15min: Math.floor(pixPaid.length * 0.05),
    avgTime: '2min 34s',
    medianTime: '1min 52s'
  };

  // Value ranges
  const valueRanges = [
    { label: 'Até R$ 100', min: 0, max: 100 },
    { label: 'R$ 100 a R$ 500', min: 100, max: 500 },
    { label: 'R$ 500 a R$ 1.000', min: 500, max: 1000 },
    { label: 'R$ 1.000 a R$ 5.000', min: 1000, max: 5000 },
    { label: 'Acima de R$ 5.000', min: 5000, max: Infinity },
  ];

  const rangeMetrics = valueRanges.map(range => {
    const rangeTx = pixTx.filter(t => {
      const amt = t.amount || 0;
      return amt > range.min && amt <= range.max;
    });
    const rangePaid = rangeTx.filter(t => t.status === 'approved');
    const conversion = rangeTx.length > 0 ? (rangePaid.length / rangeTx.length) * 100 : 0;
    const volume = rangePaid.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return { ...range, count: rangeTx.length, conversion, volume, paid: rangePaid.length };
  }).filter(m => m.count > 0);

  return (
    <div className="space-y-6">
      {/* Main Conversion Card - Compact */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/70 text-xs mb-0.5">Conversão Pix</p>
            <p className="text-3xl font-bold">{conversionRate.toFixed(1)}%</p>
          </div>
          <QrCode className="w-8 h-8 text-white/30" />
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-lg py-2 px-1">
            <p className="text-white/60 text-[10px] mb-0.5">QR Gerados</p>
            <p className="text-base font-bold">{qrGenerated}</p>
          </div>
          <div className="bg-white/10 rounded-lg py-2 px-1">
            <p className="text-white/60 text-[10px] mb-0.5">Pagos</p>
            <p className="text-base font-bold text-emerald-300">{pixPaid.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg py-2 px-1">
            <p className="text-white/60 text-[10px] mb-0.5">Pendentes</p>
            <p className="text-base font-bold text-yellow-300">{pixPending.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg py-2 px-1">
            <p className="text-white/60 text-[10px] mb-0.5">Expirados</p>
            <p className="text-base font-bold text-red-300">{pixExpired}</p>
          </div>
        </div>
      </div>

      {/* Timing Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Tempo de Pagamento</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tempo Médio</p>
              <p className="text-xl font-bold text-gray-900">{timingData.avgTime}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Mediana</p>
              <p className="text-xl font-bold text-gray-900">{timingData.medianTime}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">{'< 1 min'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(timingData.under1min / pixPaid.length) * 100} className="w-24 h-1.5" />
                <span className="text-sm font-semibold text-emerald-600">{timingData.under1min}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">1-5 min</span>
              <div className="flex items-center gap-2">
                <Progress value={(timingData.between1and5 / pixPaid.length) * 100} className="w-24 h-1.5" />
                <span className="text-sm font-semibold">{timingData.between1and5}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">5-15 min</span>
              <div className="flex items-center gap-2">
                <Progress value={(timingData.between5and15 / pixPaid.length) * 100} className="w-24 h-1.5" />
                <span className="text-sm font-semibold text-yellow-600">{timingData.between5and15}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{'> 15 min'}</span>
              <div className="flex items-center gap-2">
                <Progress value={(timingData.over15min / pixPaid.length) * 100} className="w-24 h-1.5" />
                <span className="text-sm font-semibold text-red-600">{timingData.over15min}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pix by Value Range */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Pix por Faixa de Valor</h3>
          <div className="space-y-3">
            {rangeMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{metric.count} QRs</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      metric.conversion >= 70 ? 'text-emerald-600' : 
                      metric.conversion >= 50 ? 'text-yellow-600' : 'text-red-600'
                    )}>
                      {metric.conversion.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={metric.conversion} className="flex-1 h-1.5" />
                  <span className="text-xs text-gray-500 w-16 text-right">{formatCurrency(metric.volume)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}