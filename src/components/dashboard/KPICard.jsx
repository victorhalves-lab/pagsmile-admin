import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs mês anterior',
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
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

  const isPositive = change > 0;
  const isNeutral = !change || change === 0;

  return (
    <div className={cn(
      "bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden",
      className
    )}>
      {/* Background Icon Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
          {Icon && <Icon className="w-24 h-24" />}
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</h3>
        {Icon && (
          <div className={cn(
            "p-2.5 rounded-xl shadow-sm transition-transform group-hover:scale-110 duration-300", 
            iconBg
          )}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-2 relative z-10">
          <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div className="relative z-10">
          <div className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            {formatValue(value)}
          </div>
          
          {(change !== undefined && change !== null) && (
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex items-center text-xs font-bold px-2 py-1 rounded-full border",
                isPositive 
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                    : isNeutral 
                        ? "text-slate-600 bg-slate-50 border-slate-100"
                        : "text-red-700 bg-red-50 border-red-100"
              )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : isNeutral ? <Minus className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 font-medium">{changeLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}