import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs mês anterior',
  icon: Icon,
  iconBg = 'bg-[#00D26A]/10',
  iconColor = 'text-[#00D26A]',
  format = 'number',
  loading = false,
  className
}) {
  const formatValue = (val) => {
    if (loading) return '---';
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 2
      }).format(val || 0);
    }
    if (format === 'percentage') {
      return `${(val || 0).toFixed(2)}%`;
    }
    if (format === 'number') {
      return new Intl.NumberFormat('pt-BR').format(val || 0);
    }
    return val;
  };

  const getChangeColor = () => {
    if (!change || change === 0) return 'text-gray-500';
    return change > 0 ? 'text-emerald-600' : 'text-red-500';
  };

  const getChangeIcon = () => {
    if (!change || change === 0) return <Minus className="w-3 h-3" />;
    return change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className={cn("flex items-center gap-1 text-sm font-medium", getChangeColor())}>
            {getChangeIcon()}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}