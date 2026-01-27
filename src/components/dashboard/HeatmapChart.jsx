import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function HeatmapChart({ 
  data = {}, 
  type = 'volume', // 'volume' or 'approval'
  colorScheme = 'blue' 
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Generate mock data if not provided
  const generateMockData = () => {
    const mockData = {};
    days.forEach((day, dayIdx) => {
      mockData[dayIdx] = {};
      hours.forEach(hour => {
        if (type === 'volume') {
          // Higher volume during business hours and weekdays
          const isBusinessHour = hour >= 8 && hour <= 22;
          const isWeekday = dayIdx >= 1 && dayIdx <= 5;
          const base = isBusinessHour && isWeekday ? 15000 : 3000;
          mockData[dayIdx][hour] = base + Math.random() * 10000;
        } else {
          // Approval rate variation
          const base = 85 + Math.random() * 10;
          mockData[dayIdx][hour] = base;
        }
      });
    });
    return mockData;
  };

  const heatmapData = Object.keys(data).length > 0 ? data : generateMockData();

  // Find min/max for color scaling
  let minValue = Infinity;
  let maxValue = -Infinity;
  
  Object.values(heatmapData).forEach(dayData => {
    Object.values(dayData).forEach(value => {
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    });
  });

  const getColorIntensity = (value) => {
    if (type === 'approval') {
      // For approval: green scale
      if (value >= 95) return 'bg-emerald-600';
      if (value >= 90) return 'bg-emerald-500';
      if (value >= 85) return 'bg-emerald-400';
      if (value >= 80) return 'bg-yellow-400';
      if (value >= 75) return 'bg-yellow-500';
      if (value >= 70) return 'bg-orange-400';
      return 'bg-red-500';
    } else {
      // For volume: blue scale
      const normalized = (value - minValue) / (maxValue - minValue);
      if (normalized >= 0.8) return 'bg-blue-600';
      if (normalized >= 0.6) return 'bg-blue-500';
      if (normalized >= 0.4) return 'bg-blue-400';
      if (normalized >= 0.2) return 'bg-blue-300';
      return 'bg-blue-200';
    }
  };

  const formatValue = (value) => {
    if (type === 'approval') {
      return `${value.toFixed(1)}%`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {type === 'volume' ? 'Volume por Hora e Dia' : 'Taxa de Aprovação por Hora e Dia'}
          </h3>
          <p className="text-sm text-gray-500">Identifique padrões de comportamento</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {hours.map(hour => (
              <div key={hour} className="w-8 text-center">
                <span className="text-xs text-gray-500">{hour}</span>
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {days.map((day, dayIdx) => (
            <div key={day} className="flex mb-1">
              <div className="w-12 flex items-center">
                <span className="text-xs font-medium text-gray-600">{day}</span>
              </div>
              {hours.map(hour => {
                const value = heatmapData[dayIdx]?.[hour] || 0;
                
                return (
                  <TooltipProvider key={hour}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-8 h-8 rounded cursor-pointer hover:ring-2 hover:ring-gray-900 transition-all",
                            getColorIntensity(value)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-semibold">{day} às {hour}h</p>
                          <p>{formatValue(value)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">
              {type === 'volume' ? 'Menor' : 'Baixo'}
            </span>
            <div className="flex gap-0.5">
              {type === 'approval' ? (
                <>
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <div className="w-4 h-4 bg-orange-400 rounded" />
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <div className="w-4 h-4 bg-emerald-400 rounded" />
                  <div className="w-4 h-4 bg-emerald-500 rounded" />
                  <div className="w-4 h-4 bg-emerald-600 rounded" />
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-blue-200 rounded" />
                  <div className="w-4 h-4 bg-blue-300 rounded" />
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                </>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {type === 'volume' ? 'Maior' : 'Alto'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}