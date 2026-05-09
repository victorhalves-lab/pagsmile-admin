import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, ArrowRightLeft, AlertTriangle, CheckCircle2, Activity, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Mentor F0253–F0276 — Trocar adquirente com cutover programado.
 * Health-check pré-switch + monitoramento de transações em vôo + agendamento.
 */
const ACQUIRERS = [
  { name: 'Stone', mdr: 1.99, latency_ms: 280, approval_rate: 96.2, status: 'healthy' },
  { name: 'Cielo', mdr: 2.15, latency_ms: 310, approval_rate: 95.8, status: 'healthy' },
  { name: 'Rede', mdr: 2.10, latency_ms: 295, approval_rate: 94.7, status: 'degraded' },
  { name: 'PagBank', mdr: 1.95, latency_ms: 250, approval_rate: 96.5, status: 'healthy' },
  { name: 'GetNet', mdr: 2.05, latency_ms: 320, approval_rate: 95.0, status: 'healthy' },
];

export default function AdminIntAcquirerSwitchFlow() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const merchantId = params.get('id') || '12345';
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState('Cielo');
  const [to, setTo] = useState('');
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduleDate, setScheduleDate] = useState('');

  const target = ACQUIRERS.find(a => a.name === to);
  const inFlightCount = 12; // mock: transações em vôo

  const submit = () => {
    toast.success(scheduleType === 'immediate' ? 'Switch aplicado' : `Switch agendado para ${scheduleDate}`);
    navigate(createPageUrl(`AdminIntMerchantProfile?id=${merchantId}&tab=capacidade`));
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Trocar Adquirente"
        subtitle="Cutover programado com health-check e monitoramento de transações em vôo"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Lojista', page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Trocar Adquirente' },
        ]}
        icon={ArrowRightLeft}
      />

      {step === 1 && (
        <>
          <Card>
            <CardHeader><CardTitle>Adquirente atual e destino</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>De *</Label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACQUIRERS.map(a => <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Para *</Label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {ACQUIRERS.filter(a => a.name !== from).map(a => <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {target && (
            <Card>
              <CardHeader><CardTitle>Health-check do destino</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <HealthRow label="Status do adquirente" value={target.status === 'healthy' ? 'Saudável' : 'Degradado'} ok={target.status === 'healthy'} />
                <HealthRow label="Taxa de aprovação 24h" value={`${target.approval_rate}%`} ok={target.approval_rate >= 95} />
                <HealthRow label="Latência média" value={`${target.latency_ms}ms`} ok={target.latency_ms < 350} />
                <HealthRow label="MDR contratada" value={`${target.mdr}%`} ok />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!to}>Continuar <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Card>
            <CardHeader><CardTitle>Transações em vôo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-bold text-sm">{inFlightCount} transações em processamento</p>
                    <p className="text-xs text-slate-600">Permanecem no adquirente atual ({from}) até concluírem</p>
                  </div>
                </div>
                <Badge variant="outline">Drenagem ~5 min</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Agendamento</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setScheduleType('immediate')}
                  className={cn('p-3 rounded-lg border-2 text-left', scheduleType === 'immediate' ? 'border-purple-500 bg-purple-50' : 'border-slate-200')}
                >
                  <p className="font-bold text-sm">Imediato</p>
                  <p className="text-xs text-slate-600 mt-1">Aplicar agora — drena transações em vôo e roteia novas</p>
                </button>
                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={cn('p-3 rounded-lg border-2 text-left', scheduleType === 'scheduled' ? 'border-purple-500 bg-purple-50' : 'border-slate-200')}
                >
                  <p className="font-bold text-sm">Programado</p>
                  <p className="text-xs text-slate-600 mt-1">Agendar para janela de baixo movimento (madrugada)</p>
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <div>
                  <Label>Data e hora *</Label>
                  <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Button>
            <Button onClick={submit} disabled={scheduleType === 'scheduled' && !scheduleDate}>
              <ArrowRightLeft className="w-4 h-4 mr-1" /> {scheduleType === 'immediate' ? 'Aplicar agora' : 'Agendar switch'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function HealthRow({ label, value, ok }) {
  return (
    <div className={cn('flex items-center justify-between p-3 rounded-lg border', ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
      <p className="font-medium text-sm">{label}</p>
      <div className="flex items-center gap-2">
        <span className="font-bold">{value}</span>
        {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
      </div>
    </div>
  );
}