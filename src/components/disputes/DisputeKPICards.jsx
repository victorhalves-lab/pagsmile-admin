import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertCircle,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    notation: value >= 10000 ? 'compact' : 'standard'
  }).format(value || 0);
};

const formatPercent = (value) => {
  return `${(value || 0).toFixed(1)}%`;
};

function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'blue',
  isLoading = false 
}) {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    gray: { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-100' }
  };

  const colors = colorClasses[color];

  return (
    <Card className={cn("border", colors.border)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
              {isLoading ? '---' : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{subtitle}</p>
            )}
            {trend && trendValue !== undefined && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs",
                trend === 'up' ? 'text-red-600' : 'text-green-600'
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <Icon className={cn("w-5 h-5 flex-shrink-0", colors.icon)} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DisputeKPICards({ data = {}, isLoading = false }) {
  const volumeKPIs = [
    {
      title: 'Total em Disputa',
      value: data.totalOpenDisputes || 0,
      subtitle: formatCurrency(data.totalOpenValue),
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Pré-CBs Ativos',
      value: data.activePreChargebacks || 0,
      subtitle: `Prazo médio: ${data.avgPreCBDeadline || '-'} dias`,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Em Contestação',
      value: data.inContestationCount || 0,
      subtitle: formatCurrency(data.inContestationValue),
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Provisão para CBs',
      value: formatCurrency(data.provisionAmount),
      subtitle: `${formatPercent(data.provisionPercentGMV)} do GMV`,
      icon: DollarSign,
      color: 'gray'
    }
  ];

  const performanceKPIs = [
    {
      title: 'Win Rate',
      value: formatPercent(data.winRate),
      icon: CheckCircle2,
      color: 'green',
      trend: data.winRateTrend,
      trendValue: data.winRateTrendValue
    },
    {
      title: 'Taxa de Prevenção',
      value: formatPercent(data.preventionRate),
      subtitle: 'Pré-CBs evitados',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Tempo Médio Resposta',
      value: `${data.avgResponseTime || '-'} dias`,
      subtitle: `Meta: <5 dias`,
      icon: Clock,
      color: data.avgResponseTime > 5 ? 'red' : 'green'
    },
    {
      title: 'Valor Recuperado',
      value: formatCurrency(data.recoveredValue),
      subtitle: `Perdido: ${formatCurrency(data.lostValue)}`,
      icon: DollarSign,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Volume de Disputas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {volumeKPIs.map((kpi, idx) => (
            <KPICard key={idx} {...kpi} isLoading={isLoading} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance de Disputas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceKPIs.map((kpi, idx) => (
            <KPICard key={idx} {...kpi} isLoading={isLoading} />
          ))}
        </div>
      </div>
    </div>
  );
}