import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatCompact = (value) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
  return formatCurrency(value);
};

export default function ReceivablesCalendar({ receivables = [], onDayClick, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group receivables by date
  const receivablesByDate = receivables.reduce((acc, rec) => {
    const dateKey = rec.settlement_date;
    if (!acc[dateKey]) {
      acc[dateKey] = { total: 0, count: 0 };
    }
    acc[dateKey].total += rec.net_amount || 0;
    acc[dateKey].count += 1;
    return acc;
  }, {});

  // Find max value for intensity calculation
  const maxValue = Math.max(...Object.values(receivablesByDate).map(d => d.total), 1);

  const getIntensityClass = (value) => {
    const ratio = value / maxValue;
    if (ratio > 0.75) return 'bg-green-500 text-white';
    if (ratio > 0.5) return 'bg-green-400 text-white';
    if (ratio > 0.25) return 'bg-green-300 text-green-900';
    if (ratio > 0) return 'bg-green-100 text-green-800';
    return '';
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate first day offset
  const firstDayOfWeek = monthStart.getDay();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendário de Recebíveis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {[...Array(firstDayOfWeek)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = receivablesByDate[dateKey];
            const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
            const isPast = day < new Date() && !isToday(day);

            return (
              <button
                key={dateKey}
                onClick={() => onDayClick?.(dateKey)}
                className={cn(
                  "aspect-square p-1 rounded-lg text-sm flex flex-col items-center justify-center transition-all",
                  "hover:ring-2 hover:ring-green-500 hover:ring-offset-1",
                  isToday(day) && "ring-2 ring-blue-500",
                  isSelected && "ring-2 ring-green-600 ring-offset-2",
                  isPast && "opacity-50",
                  dayData ? getIntensityClass(dayData.total) : "hover:bg-gray-50"
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  isToday(day) && !dayData && "text-blue-600"
                )}>
                  {format(day, 'd')}
                </span>
                {dayData && (
                  <span className="text-[10px] font-semibold truncate max-w-full">
                    {formatCompact(dayData.total)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Menor</span>
            <div className="flex gap-0.5">
              <div className="w-4 h-4 rounded bg-green-100" />
              <div className="w-4 h-4 rounded bg-green-300" />
              <div className="w-4 h-4 rounded bg-green-400" />
              <div className="w-4 h-4 rounded bg-green-500" />
            </div>
            <span>Maior</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}