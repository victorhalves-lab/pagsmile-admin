import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, CheckCircle2, Clock, Send } from 'lucide-react';

const COMMUNICATIONS = [
  { stage: 'D-30', label: 'Aviso prévio (30 dias antes)', sent: true, sent_at: '2026-04-15T10:00:00', recipients: 1247, opens: 1120, clicks: 89 },
  { stage: 'D-15', label: 'Lembrete (15 dias antes)', sent: true, sent_at: '2026-04-30T10:00:00', recipients: 1247, opens: 1185, clicks: 102 },
  { stage: 'D-7', label: 'Aviso final (7 dias antes)', sent: false, scheduled: '2026-05-08T10:00:00', recipients: 1247 },
  { stage: 'D-1', label: 'Confirmação (1 dia antes)', sent: false, scheduled: '2026-05-14T10:00:00', recipients: 1247 },
  { stage: 'D+0', label: 'Plano em vigor (D-day)', sent: false, scheduled: '2026-05-15T00:00:00', recipients: 1247 },
];

export default function SalesPlanCutoverTab({ plan }) {
  const cutoverDate = plan?.cutover_date || plan?.effective_from;
  const daysToCutover = cutoverDate ? Math.ceil((new Date(cutoverDate).getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="space-y-4">
      <Card className={`${daysToCutover !== null && daysToCutover <= 7 ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' : daysToCutover !== null && daysToCutover <= 30 ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">D-Day do plano</p>
              <p className="text-3xl font-black mt-1">
                {cutoverDate ? new Date(cutoverDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
              </p>
              {daysToCutover !== null && (
                <Badge className={`mt-2 ${daysToCutover <= 7 ? 'bg-amber-100 text-amber-700' : daysToCutover <= 30 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {daysToCutover === 0 ? 'HOJE' : daysToCutover < 0 ? `há ${Math.abs(daysToCutover)} dias` : `em ${daysToCutover} dias`}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-slate-500">Estabelecimentos afetados</p>
              <p className="text-2xl font-bold">{plan?.terminal_count?.toLocaleString('pt-BR') || 0}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">TPV impactado: R$ {((plan?.monthly_tpv || 0) / 1_000_000).toFixed(1)}M/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" />Cronograma de comunicações</span>
            <Button size="sm" variant="outline">
              <Send className="w-3 h-3 mr-1" />Enviar agora
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {COMMUNICATIONS.map((c, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg border ${c.sent ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200' : 'bg-slate-50 dark:bg-slate-900 border-slate-200'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${c.sent ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  {c.sent ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{c.stage} — {c.label}</p>
                  <p className="text-[10px] text-slate-500">
                    {c.sent
                      ? `Enviado em ${new Date(c.sent_at).toLocaleString('pt-BR')} · ${c.recipients} destinatários · ${c.opens} aberturas · ${c.clicks} cliques`
                      : `Agendado para ${new Date(c.scheduled).toLocaleString('pt-BR')} · ${c.recipients} destinatários`
                    }
                  </p>
                </div>
                <Badge className={`text-[9px] ${c.sent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {c.sent ? 'Enviada' : 'Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}