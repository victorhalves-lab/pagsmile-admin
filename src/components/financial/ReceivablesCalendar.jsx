import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatCompact = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return Math.round(value);
};

export default function ReceivablesCalendar({ receivables = [], onDayClick, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dayDetails, setDayDetails] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group receivables by date
  const receivablesByDate = receivables.reduce((acc, rec) => {
    const dateKey = rec.settlement_date;
    if (!acc[dateKey]) {
      acc[dateKey] = { total: 0, count: 0, items: [] };
    }
    acc[dateKey].total += rec.net_amount || 0;
    acc[dateKey].count += 1;
    acc[dateKey].items.push(rec);
    return acc;
  }, {});

  const handleDateClick = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    onDayClick?.(dateKey);
    
    if (receivablesByDate[dateKey]) {
      setDayDetails({
        date,
        ...receivablesByDate[dateKey]
      });
      setDetailsOpen(true);
    }
  };

  // Find max value for intensity calculation
  const maxValue = Math.max(...Object.values(receivablesByDate).map(d => d.total), 1);

  const getIntensityClass = (value) => {
    const ratio = value / maxValue;
    if (ratio > 0.75) return 'bg-emerald-600 text-white hover:bg-emerald-700';
    if (ratio > 0.5) return 'bg-emerald-500 text-white hover:bg-emerald-600';
    if (ratio > 0.25) return 'bg-emerald-300 text-emerald-900 hover:bg-emerald-400';
    if (ratio > 0) return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
    return '';
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const firstDayOfWeek = monthStart.getDay();

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-sm w-32 text-center capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {selectedDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8" 
                onClick={() => onDayClick(null)}
              >
                Limpar Filtro <X className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] uppercase font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {[...Array(firstDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-[1.2]" />
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
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "aspect-[1.2] p-1 rounded-md flex flex-col items-center justify-between transition-all border border-transparent",
                    dayData ? getIntensityClass(dayData.total) : "hover:bg-gray-50 text-gray-700",
                    isToday(day) && !dayData && "border-emerald-500 border-dashed bg-emerald-50",
                    isSelected && "ring-2 ring-emerald-600 ring-offset-1 z-10",
                    isPast && !dayData && "opacity-40"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-medium leading-none",
                    dayData ? "opacity-90" : "text-gray-500"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayData && (
                    <span className="text-[10px] font-bold leading-tight -tracking-wider">
                      {formatCompact(dayData.total)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Recebíveis de {dayDetails && format(dayDetails.date, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
            <DialogDescription>
              Total a receber: <strong>{dayDetails && formatCurrency(dayDetails.total)}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2 mt-2">
            {dayDetails?.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                <div>
                  <p className="text-xs font-mono font-medium text-slate-700">{item.transaction_id.slice(0, 18)}...</p>
                  <p className="text-[10px] text-slate-500 uppercase">{item.payment_method} • Parcela {item.installment_number || 1}/{item.total_installments || 1}</p>
                </div>
                <span className="font-semibold text-sm text-emerald-600">
                  {formatCurrency(item.net_amount)}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}