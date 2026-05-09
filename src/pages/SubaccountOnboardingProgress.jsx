import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Acompanhamento self-service do próprio onboarding pelo lojista.
 */
const stages = [
  { id: 'data', label: 'Dados cadastrais', status: 'done', completed_at: '2026-05-01 14:30' },
  { id: 'partners', label: 'Sócios e UBO', status: 'done', completed_at: '2026-05-01 14:45' },
  { id: 'docs', label: 'Documentos', status: 'in_progress', sub: '4 de 6 enviados — 2 pendem reenvio' },
  { id: 'kyc_review', label: 'Análise de KYC pelo Compliance', status: 'pending', eta: '2026-05-12' },
  { id: 'acquirer', label: 'Vinculação a adquirentes', status: 'pending' },
  { id: 'activation', label: 'Ativação da conta', status: 'pending' },
];

const STATUS = {
  done: { color: 'bg-emerald-500 text-white', icon: CheckCircle2, label: 'Concluído' },
  in_progress: { color: 'bg-blue-500 text-white', icon: Clock, label: 'Em andamento' },
  pending: { color: 'bg-slate-300 text-slate-600', icon: Clock, label: 'Aguardando' },
  blocked: { color: 'bg-red-500 text-white', icon: AlertTriangle, label: 'Bloqueado' },
};

export default function SubaccountOnboardingProgress() {
  const completed = stages.filter(s => s.status === 'done').length;
  const total = stages.length;
  const pct = (completed / total) * 100;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <PageHeader
        title="Progresso do Onboarding"
        subtitle="Acompanhe o status da sua adesão à plataforma"
        icon={Rocket}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Progresso geral</p>
            <p className="text-sm font-black">{completed}/{total} etapas</p>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">Estimativa de conclusão: <strong>5-7 dias úteis</strong></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Etapas</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-3">
              {stages.map((s, i) => {
                const cfg = STATUS[s.status];
                const Icon = cfg.icon;
                return (
                  <div key={s.id} className="relative pl-14">
                    <div className={cn('absolute left-2 top-1 w-7 h-7 rounded-full flex items-center justify-center', cfg.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className={cn('p-3 rounded-lg border',
                      s.status === 'in_progress' ? 'border-blue-300 bg-blue-50' :
                      s.status === 'done' ? 'border-emerald-200 bg-emerald-50' :
                      'border-slate-200 bg-white'
                    )}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-bold text-sm">{s.label}</p>
                        <Badge className={cfg.color}>{cfg.label}</Badge>
                      </div>
                      {s.sub && <p className="text-xs text-slate-600 mt-1">{s.sub}</p>}
                      {s.completed_at && <p className="text-[11px] text-slate-500 mt-1">Concluído em {s.completed_at}</p>}
                      {s.eta && <p className="text-[11px] text-slate-500 mt-1">Previsão: {s.eta}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}