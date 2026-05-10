import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Star, Share2, Bell, Download } from 'lucide-react';

export default function TPVFiltersBar({ period, onPeriodChange, granularity, onGranularityChange, onExport }) {
  return (
    <Card className="p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs uppercase tracking-wide font-bold text-slate-500 px-2">Período:</div>
          {[
            { v: 'today', l: 'Hoje' },
            { v: '7d', l: '7 dias' },
            { v: '30d', l: '30 dias' },
            { v: 'mtd', l: 'Mês' },
            { v: 'qtd', l: 'Trim.' },
            { v: 'ytd', l: 'Ano' },
            { v: '12m', l: '12 meses' },
          ].map(p => (
            <Button
              key={p.v}
              size="sm"
              variant={period === p.v ? 'default' : 'outline'}
              onClick={() => onPeriodChange(p.v)}
            >
              {p.l}
            </Button>
          ))}
          <Button size="sm" variant="outline" className="gap-1">
            <Calendar className="w-4 h-4" /> Custom
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={granularity} onValueChange={onGranularityChange}>
            <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Por Hora</SelectItem>
              <SelectItem value="day">Por Dia</SelectItem>
              <SelectItem value="week">Por Semana</SelectItem>
              <SelectItem value="month">Por Mês</SelectItem>
              <SelectItem value="quarter">Por Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1"><Star className="w-4 h-4" /> Visões</Button>
          <Button variant="outline" size="sm" className="gap-1"><Share2 className="w-4 h-4" /> Compartilhar</Button>
          <Button variant="outline" size="sm" className="gap-1"><Bell className="w-4 h-4" /> Alertas</Button>
          <Button onClick={onExport} className="gap-1"><Download className="w-4 h-4" /> Exportar</Button>
        </div>
      </div>
    </Card>
  );
}