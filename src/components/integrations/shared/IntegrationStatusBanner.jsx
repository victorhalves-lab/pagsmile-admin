import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUSES = {
  operational: {
    icon: CheckCircle2,
    title: 'Todos os serviços operacionais',
    sub: 'Sem incidentes nas últimas 24h · uptime 99.97%',
    cls: 'border-emerald-500/30 bg-emerald-500/5',
    iconCls: 'bg-emerald-500/20 text-emerald-600',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    label: 'Operacional',
  },
  degraded: {
    icon: AlertTriangle,
    title: 'Performance degradada em alguns serviços',
    sub: 'API Webhooks com latência elevada · investigando',
    cls: 'border-amber-500/30 bg-amber-500/5',
    iconCls: 'bg-amber-500/20 text-amber-600',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    label: 'Degradado',
  },
  outage: {
    icon: XCircle,
    title: 'Incidente em andamento',
    sub: 'Estamos trabalhando para resolver',
    cls: 'border-red-500/30 bg-red-500/5',
    iconCls: 'bg-red-500/20 text-red-600',
    badge: 'bg-red-500/10 text-red-600 border-red-500/30',
    label: 'Outage',
  },
};

export default function IntegrationStatusBanner({ status = 'operational', onClick }) {
  const cfg = STATUSES[status];
  const Icon = cfg.icon;

  return (
    <div
      className={cn('flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md', cfg.cls)}
      onClick={onClick}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.iconCls)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{cfg.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{cfg.sub}</p>
      </div>
      <Badge className={cn('flex-shrink-0', cfg.badge)}>{cfg.label}</Badge>
    </div>
  );
}