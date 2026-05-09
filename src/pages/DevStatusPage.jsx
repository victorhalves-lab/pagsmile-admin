import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import IntegrationStatusBanner from '@/components/integrations/shared/IntegrationStatusBanner';
import { Activity, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const services = [
  { name: 'API REST', status: 'operational', uptime: 99.99 },
  { name: 'Webhooks', status: 'operational', uptime: 99.95 },
  { name: 'Pix Processing', status: 'operational', uptime: 99.98 },
  { name: 'Card Authorization', status: 'operational', uptime: 99.96 },
  { name: 'Dashboard', status: 'operational', uptime: 99.99 },
  { name: 'Compliance Service', status: 'degraded', uptime: 98.50 },
  { name: 'Settlement Engine', status: 'operational', uptime: 99.97 },
];

const incidents = [
  {
    id: 1,
    title: 'Latência elevada em Compliance Service',
    status: 'investigating',
    severity: 'minor',
    time: '2026-05-08 14:30',
    updates: ['Investigando aumento de latência (p99 > 2s)', 'Identificada causa raiz: índice de DB'],
  },
  {
    id: 2,
    title: 'Resolução: Webhook delivery atrasado',
    status: 'resolved',
    severity: 'minor',
    time: '2026-05-07 09:15',
    updates: ['Issue resolvido às 10:30 · queue normalizada'],
  },
];

const maintenance = [
  { title: 'Manutenção programada: rotação de certificados TLS', date: '2026-05-15 02:00 → 04:00 BRT', impact: 'Sem impacto esperado' },
];

const StatusIcon = ({ status }) => {
  if (status === 'operational') return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  if (status === 'degraded') return <AlertTriangle className="w-4 h-4 text-amber-600" />;
  return <XCircle className="w-4 h-4 text-red-600" />;
};

export default function DevStatusPage() {
  const overallStatus = services.some((s) => s.status === 'outage') ? 'outage' : services.some((s) => s.status === 'degraded') ? 'degraded' : 'operational';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Status Page"
        subtitle="Transparência total · status.pagsmile.com"
        icon={Activity}
        breadcrumbs={[{ label: 'Developer Hub', page: 'Developers' }, { label: 'Status' }]}
        actions={
          <Button variant="outline" size="sm" onClick={() => window.open('https://status.pagsmile.com', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-1" /> status.pagsmile.com
          </Button>
        }
      />

      <IntegrationStatusBanner status={overallStatus} />

      {/* Services */}
      <Card>
        <div className="px-5 py-3 border-b">
          <h3 className="text-sm font-bold uppercase tracking-wide">Componentes (uptime últimos 90 dias)</h3>
        </div>
        <div className="divide-y">
          {services.map((s) => (
            <div key={s.name} className="px-5 py-3 flex items-center gap-3">
              <StatusIcon status={s.status} />
              <span className="text-sm font-medium flex-1">{s.name}</span>
              {/* Uptime sparkline mock - 90 dias = 90 squares */}
              <div className="flex gap-0.5">
                {Array.from({ length: 90 }).map((_, i) => {
                  const isOk = !(s.status === 'degraded' && i > 85);
                  return (
                    <div
                      key={i}
                      className={cn('w-1 h-6 rounded-sm', isOk ? 'bg-emerald-500' : 'bg-amber-400')}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-mono text-slate-500 w-14 text-right">{s.uptime}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Incidents */}
      <Card>
        <div className="px-5 py-3 border-b">
          <h3 className="text-sm font-bold uppercase tracking-wide">Incidentes recentes</h3>
        </div>
        <div className="divide-y">
          {incidents.map((inc) => (
            <div key={inc.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <Badge className={cn('flex-shrink-0', inc.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                  {inc.status === 'resolved' ? 'Resolvido' : 'Investigando'}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{inc.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{inc.time}</p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1">
                    {inc.updates.map((u, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400">•</span> {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scheduled Maintenance */}
      <Card>
        <div className="px-5 py-3 border-b">
          <h3 className="text-sm font-bold uppercase tracking-wide">Manutenção programada</h3>
        </div>
        <div className="px-5 py-4">
          {maintenance.map((m, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.date}</p>
                <Badge variant="outline" className="text-[10px] mt-2">{m.impact}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscribe */}
      <Card className="bg-gradient-to-br from-[#2bc196]/5 to-blue-50 dark:from-[#2bc196]/10 dark:to-blue-500/10 border-[#2bc196]/30">
        <div className="p-5 flex items-center gap-4">
          <div className="text-3xl">📬</div>
          <div className="flex-1">
            <p className="text-sm font-bold">Assine para receber updates</p>
            <p className="text-xs text-slate-500 mt-0.5">Receba email/SMS quando houver incidentes ou manutenção</p>
          </div>
          <Button className="bg-[#2bc196] hover:bg-[#239b7a]">Inscrever</Button>
        </div>
      </Card>
    </div>
  );
}