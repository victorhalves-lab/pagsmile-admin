import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Key, Webhook as WebhookIcon, Plug, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Kpi = ({ icon: Icon, label, value, sub, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20',
    red: 'bg-red-100 text-red-600 dark:bg-red-500/20',
  };
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold mt-0.5 truncate">{value}</p>
            {sub && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function IntegrationsKpiBar({
  apiCallsToday = 142_580,
  apiSuccessRate = 99.7,
  webhookSuccessRate = 98.4,
  webhookPending = 23,
  pluginsActive = 4,
  pluginsTotal = 42,
  errors24h = 12,
  uptime = 99.97,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Kpi icon={Activity} label="API Calls (24h)" value={apiCallsToday.toLocaleString('pt-BR')} sub={`${apiSuccessRate}% sucesso`} color="emerald" />
      <Kpi icon={WebhookIcon} label="Webhooks Sucesso" value={`${webhookSuccessRate}%`} sub={`${webhookPending} pendentes`} color="blue" />
      <Kpi icon={Plug} label="Plugins Ativos" value={`${pluginsActive}/${pluginsTotal}`} sub="4 saudáveis · 0 erros" color="violet" />
      <Kpi icon={Key} label="API Keys" value="8" sub="6 prod · 2 sandbox" color="amber" />
      <Kpi icon={AlertTriangle} label="Erros (24h)" value={errors24h} sub="-3 vs ontem" color={errors24h > 20 ? 'red' : 'amber'} />
      <Kpi icon={CheckCircle2} label="Uptime (30d)" value={`${uptime}%`} sub="SLA: 99.95%" color="emerald" />
    </div>
  );
}