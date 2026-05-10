import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Landmark, Fingerprint, Repeat, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OF_BANK_HEALTH, OF_LIVE_JOURNEYS } from '@/components/transactions/pix/pixFlowMockData';

const healthMap = {
  healthy: { label: 'Saudável', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  degraded: { label: 'Degradado', cls: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  incident: { label: 'Incidente', cls: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

const stepMap = {
  consent: { label: 'Consentimento', icon: Loader2, cls: 'text-blue-600' },
  authorizing: { label: 'Autorizando', icon: Loader2, cls: 'text-amber-600' },
  paid: { label: 'Pago', icon: CheckCircle, cls: 'text-emerald-600' },
  failed: { label: 'Falhou', icon: AlertCircle, cls: 'text-rose-600' },
};

export default function OpenFinanceLiveMap() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-xs uppercase text-emerald-700">Jornadas Ativas</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{OF_LIVE_JOURNEYS.length}</p>
            <p className="text-xs text-emerald-600 mt-1">Em tempo real · atualizado agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span className="text-xs uppercase text-gray-500">Bancos Online</span>
            </div>
            <p className="text-2xl font-bold">{OF_BANK_HEALTH.filter(b => b.status === 'healthy').length}/{OF_BANK_HEALTH.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-violet-600" />
              <span className="text-xs uppercase text-gray-500">Biometria (hoje)</span>
            </div>
            <p className="text-2xl font-bold">1.842</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              <span className="text-xs uppercase text-gray-500">PIX Auto (hoje)</span>
            </div>
            <p className="text-2xl font-bold">512</p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Health Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saúde das Conexões Open Finance</CardTitle>
          <p className="text-xs text-gray-500">Roteamento e fallback automático configurados por banco</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {OF_BANK_HEALTH.map(b => (
              <div key={b.code} className={cn('rounded-lg p-3 border', healthMap[b.status].cls)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{b.bank}</span>
                  <span className={cn('w-2 h-2 rounded-full animate-pulse', healthMap[b.status].dot)} />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between"><span className="opacity-70">Uptime</span><span className="font-medium">{b.uptime}%</span></div>
                  <div className="flex justify-between"><span className="opacity-70">Latência</span><span className="font-medium">{b.avg_latency_ms}ms</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Journeys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Jornadas em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {OF_LIVE_JOURNEYS.map(j => {
              const step = stepMap[j.step];
              const StepIcon = step.icon;
              const elapsed = Math.floor((j.started_ms_ago + tick * 2000) / 1000);
              return (
                <div key={j.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50">
                  <StepIcon className={cn('w-5 h-5', step.cls, (j.step === 'consent' || j.step === 'authorizing') && 'animate-spin')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{j.customer}</p>
                    <p className="text-xs text-gray-500">{j.bank} · {j.flow === 'biometric' ? 'Biometria 👆' : 'Automático 🔁'}</p>
                  </div>
                  <Badge variant="outline" className={cn('border-0', step.cls.replace('text-', 'bg-').replace('-600', '-100'))}>
                    {step.label}
                  </Badge>
                  <span className="text-xs text-gray-500 tabular-nums w-12 text-right">{elapsed}s</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}