import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function CutoverCalendarView({ events = [] }) {
  // Agrupa por mês
  const byMonth = events.reduce((acc, ev) => {
    const d = new Date(ev.cutover_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { label: `${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`, events: [] };
    acc[key].events.push(ev);
    return acc;
  }, {});

  const sortedKeys = Object.keys(byMonth).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4" />Calendário de transições
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedKeys.map((key) => (
          <div key={key}>
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">{byMonth[key].label}</p>
            <div className="space-y-2">
              {byMonth[key].events.map((ev) => {
                const date = new Date(ev.cutover_date);
                const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
                const urgent = days <= 7 && days >= 0;
                const past = days < 0;
                return (
                  <Link
                    key={ev.id}
                    to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${ev.plan_id}`}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border hover:border-violet-300 transition-colors ${urgent ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : past ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-900'}`}
                  >
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg shrink-0 ${urgent ? 'bg-amber-500 text-white' : past ? 'bg-slate-300 text-slate-600' : 'bg-violet-500 text-white'}`}>
                      <span className="text-[9px] uppercase font-bold">{MONTHS_PT[date.getMonth()].slice(0, 3)}</span>
                      <span className="text-lg font-black leading-none">{date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{ev.plan_name}</p>
                      <p className="text-[10px] text-slate-500">
                        {ev.terminal_count.toLocaleString('pt-BR')} estabelecimentos · TPV impactado R$ {(ev.tpv_impact / 1_000_000).toFixed(0)}M/mês
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-[9px] ${urgent ? 'bg-amber-100 text-amber-700' : past ? 'bg-slate-200 text-slate-700' : 'bg-violet-100 text-violet-700'}`}>
                        {past ? `há ${Math.abs(days)}d` : days === 0 ? 'HOJE' : `em ${days}d`}
                      </Badge>
                      <span className="text-[9px] text-slate-500">
                        {ev.communications_sent}/{ev.communications_total} comm.
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-xs text-slate-500 italic text-center py-6">Nenhuma transição agendada</p>
        )}
      </CardContent>
    </Card>
  );
}