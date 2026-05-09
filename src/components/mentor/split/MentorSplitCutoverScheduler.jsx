import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Agendador de cutover · Mentor F2918-F2920.
 * Permite aplicar a mudança imediatamente ou em data/hora futura.
 */
export default function MentorSplitCutoverScheduler({ value = {}, onChange, minDate }) {
  const update = (field, val) => onChange({ ...value, [field]: val });

  const today = new Date().toISOString().slice(0, 10);
  const isImmediate = value.mode === 'immediate';

  // Sugestões rápidas (datas)
  const suggestions = [];
  if (minDate) {
    const md = new Date(minDate);
    suggestions.push({ label: `+${Math.ceil((md - new Date()) / (1000 * 60 * 60 * 24))}d (mínimo aviso)`, date: md.toISOString().slice(0, 10) });
  }
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  suggestions.push({ label: 'Início do próximo mês', date: nextMonth.toISOString().slice(0, 10) });
  const nextQuarter = new Date();
  nextQuarter.setMonth(nextQuarter.getMonth() + 3);
  nextQuarter.setDate(1);
  suggestions.push({ label: 'Daqui a 3 meses', date: nextQuarter.toISOString().slice(0, 10) });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-600" />
          Cutover · Quando aplicar a mudança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Modo */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update('mode', 'immediate')}
            className={`text-left rounded-lg border-2 p-3 transition ${
              isImmediate ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300' : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <Zap className={`w-5 h-5 mb-1 ${isImmediate ? 'text-amber-600' : 'text-slate-400'}`} />
            <p className="font-bold text-sm">Imediato</p>
            <p className="text-[10px] text-slate-500">Aplica agora · use apenas em mudanças sem aviso prévio</p>
          </button>
          <button
            type="button"
            onClick={() => update('mode', 'scheduled')}
            className={`text-left rounded-lg border-2 p-3 transition ${
              !isImmediate ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300' : 'border-slate-200 bg-white hover:border-emerald-300'
            }`}
          >
            <CalendarIcon className={`w-5 h-5 mb-1 ${!isImmediate ? 'text-emerald-600' : 'text-slate-400'}`} />
            <p className="font-bold text-sm">Agendado (recomendado)</p>
            <p className="text-[10px] text-slate-500">Programa a entrada em vigor para data futura</p>
          </button>
        </div>

        {/* Configuração agendada */}
        {!isImmediate && (
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Data de entrada em vigor</Label>
                <Input
                  type="date"
                  min={today}
                  value={value.effective_date || ''}
                  onChange={(e) => update('effective_date', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Horário</Label>
                <Select value={value.effective_time || '00:00'} onValueChange={(v) => update('effective_time', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:00">00:00 — virada do dia</SelectItem>
                    <SelectItem value="03:00">03:00 — janela noturna (recomendado)</SelectItem>
                    <SelectItem value="06:00">06:00 — antes do horário comercial</SelectItem>
                    <SelectItem value="09:00">09:00 — abertura comercial</SelectItem>
                    <SelectItem value="12:00">12:00 — meio-dia</SelectItem>
                    <SelectItem value="18:00">18:00 — fim do horário comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sugestões rápidas */}
            <div>
              <Label className="text-xs text-slate-500">Sugestões rápidas</Label>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {suggestions.map((s) => (
                  <Button
                    key={s.date}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => update('effective_date', s.date)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notificação prévia */}
            <div className="bg-white rounded p-2 border border-emerald-100">
              <Label className="text-xs flex items-center gap-1">
                <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">opcional</Badge>
                Notificar beneficiários antes do cutover
              </Label>
              <Select
                value={value.notify_advance_days?.toString() || '7'}
                onValueChange={(v) => update('notify_advance_days', parseInt(v))}
              >
                <SelectTrigger className="mt-1 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não notificar</SelectItem>
                  <SelectItem value="1">1 dia antes</SelectItem>
                  <SelectItem value="3">3 dias antes</SelectItem>
                  <SelectItem value="7">7 dias antes</SelectItem>
                  <SelectItem value="15">15 dias antes</SelectItem>
                  <SelectItem value="30">30 dias antes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Aviso modo imediato */}
        {isImmediate && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-800">
            ⚠️ Modo imediato cancela qualquer aviso prévio contratual. Confirme que esta mudança não exige notificação.
          </div>
        )}
      </CardContent>
    </Card>
  );
}