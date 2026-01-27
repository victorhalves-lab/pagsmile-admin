import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function CardPerformanceMetrics({ transactions = [] }) {
  // Filter card transactions
  const cardTx = transactions.filter(t => t.type === 'card');
  const cardApproved = cardTx.filter(t => t.status === 'approved');
  const cardDeclined = cardTx.filter(t => t.status === 'declined');

  // Group by brand
  const brands = ['visa', 'mastercard', 'elo', 'amex', 'hipercard'];
  
  const brandMetrics = brands.map(brand => {
    const brandTx = cardTx.filter(t => t.card_brand === brand);
    const brandApproved = brandTx.filter(t => t.status === 'approved');
    const brandDeclined = brandTx.filter(t => t.status === 'declined');
    const totalAttempts = brandApproved.length + brandDeclined.length;
    const approvalRate = totalAttempts > 0 ? (brandApproved.length / totalAttempts) * 100 : 0;
    const volume = brandApproved.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return {
      brand,
      approvalRate,
      count: totalAttempts,
      approved: brandApproved.length,
      declined: brandDeclined.length,
      volume
    };
  }).filter(m => m.count > 0);

  // Group by installments
  const installmentRanges = [
    { label: 'À Vista (1x)', min: 1, max: 1 },
    { label: '2x a 6x', min: 2, max: 6 },
    { label: '7x a 12x', min: 7, max: 12 },
  ];

  const installmentMetrics = installmentRanges.map(range => {
    const rangeTx = cardTx.filter(t => {
      const inst = t.installments || 1;
      return inst >= range.min && inst <= range.max;
    });
    const rangeApproved = rangeTx.filter(t => t.status === 'approved');
    const rangeDeclined = rangeTx.filter(t => t.status === 'declined');
    const totalAttempts = rangeApproved.length + rangeDeclined.length;
    const approvalRate = totalAttempts > 0 ? (rangeApproved.length / totalAttempts) * 100 : 0;
    const volume = rangeApproved.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return {
      ...range,
      approvalRate,
      count: totalAttempts,
      volume,
      percentage: cardTx.length > 0 ? (totalAttempts / cardTx.length) * 100 : 0
    };
  }).filter(m => m.count > 0);

  // Group by value range
  const valueRanges = [
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50 a R$ 200', min: 50, max: 200 },
    { label: 'R$ 200 a R$ 500', min: 200, max: 500 },
    { label: 'R$ 500 a R$ 1.000', min: 500, max: 1000 },
    { label: 'Acima de R$ 1.000', min: 1000, max: Infinity },
  ];

  const valueMetrics = valueRanges.map(range => {
    const rangeTx = cardTx.filter(t => {
      const amt = t.amount || 0;
      return amt > range.min && amt <= range.max;
    });
    const rangeApproved = rangeTx.filter(t => t.status === 'approved');
    const rangeDeclined = rangeTx.filter(t => t.status === 'declined');
    const totalAttempts = rangeApproved.length + rangeDeclined.length;
    const approvalRate = totalAttempts > 0 ? (rangeApproved.length / totalAttempts) * 100 : 0;
    
    return {
      ...range,
      approvalRate,
      count: totalAttempts,
    };
  }).filter(m => m.count > 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value || 0);
  };

  const brandLabels = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    elo: 'Elo',
    amex: 'Amex',
    hipercard: 'Hipercard'
  };

  return (
    <div className="space-y-6">
      {/* Approval by Brand */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Taxa de Aprovação por Bandeira</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Percentual de transações aprovadas vs total de tentativas, segmentado por bandeira do cartão</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-3">
          {brandMetrics.map((metric) => (
            <div key={metric.brand} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{brandLabels[metric.brand]}</span>
                  <span className="text-xs text-gray-500">({metric.count} transações)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    metric.approvalRate >= 85 ? 'text-emerald-600' : 
                    metric.approvalRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {metric.approvalRate.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">{formatCurrency(metric.volume)}</span>
                </div>
              </div>
              <Progress 
                value={metric.approvalRate} 
                className={cn(
                  "h-2",
                  metric.approvalRate >= 85 && "[&>div]:bg-emerald-500",
                  metric.approvalRate >= 75 && metric.approvalRate < 85 && "[&>div]:bg-yellow-500",
                  metric.approvalRate < 75 && "[&>div]:bg-red-500"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Approval by Installments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Por Parcelamento</h3>
          <div className="space-y-4">
            {installmentMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{metric.percentage.toFixed(0)}% do total</Badge>
                    <span className="text-sm font-semibold text-gray-900">
                      {metric.approvalRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{metric.count} transações</span>
                  <span>•</span>
                  <span>{formatCurrency(metric.volume)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval by Value Range */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Por Faixa de Valor</h3>
          <div className="space-y-4">
            {valueMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{metric.label}</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    metric.approvalRate >= 85 ? 'text-emerald-600' : 
                    metric.approvalRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {metric.approvalRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={metric.approvalRate} 
                    className="flex-1 h-1.5"
                  />
                  <span className="text-xs text-gray-500 w-12 text-right">{metric.count}</span>
                </div>
                {(metric.min >= 1000 || metric.max === Infinity) && metric.approvalRate < 75 && (
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <AlertCircle className="w-3 h-3" />
                    Baixa aprovação em alto valor
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}