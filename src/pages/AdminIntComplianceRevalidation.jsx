import React, { useState, useMemo } from 'react';
import { CalendarClock, AlertTriangle, RefreshCw, Plus, Calendar, TrendingDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockRevalidations } from '@/components/admin-interno/compliance/v4/mocks/escalationsBdcMock';

const REVAL_TYPE_CONFIG = {
  periodic: { label: 'Periódica' },
  triggered: { label: 'Por Trigger' },
  regulatory: { label: 'Regulatória' },
  post_incident: { label: 'Pós-Incidente' },
  ongoing_monitoring: { label: 'Monitoramento' },
};

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700',
  due_soon: 'bg-amber-100 text-amber-700',
  overdue: 'bg-red-100 text-red-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function AdminIntComplianceRevalidation() {
  const [activeTab, setActiveTab] = useState('all');

  const stats = useMemo(() => ({
    total: mockRevalidations.length,
    overdue: mockRevalidations.filter((r) => r.status === 'overdue').length,
    dueSoon: mockRevalidations.filter((r) => r.status === 'due_soon').length,
    autoEnabled: mockRevalidations.filter((r) => r.auto_revalidate).length,
    triggered: mockRevalidations.filter((r) => r.revalidation_type === 'triggered' || r.revalidation_type === 'post_incident').length,
  }), []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return mockRevalidations;
    if (activeTab === 'overdue') return mockRevalidations.filter((r) => r.status === 'overdue');
    if (activeTab === 'due_soon') return mockRevalidations.filter((r) => r.status === 'due_soon');
    return mockRevalidations.filter((r) => r.revalidation_type === activeTab);
  }, [activeTab]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Revalidações Periódicas"
        subtitle="Agenda de revalidações e monitoramento contínuo de risco"
        icon={CalendarClock}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Revalidações' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Calendar className="w-4 h-4 mr-1" /> Calendário</Button>
            <Button><Plus className="w-4 h-4 mr-1" /> Agendar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <V4KpiCard icon={CalendarClock} label="Agendadas" value={stats.total} accent="blue" />
        <V4KpiCard icon={AlertTriangle} label="Atrasadas" value={stats.overdue} accent="red" highlight />
        <V4KpiCard icon={RefreshCw} label="Vencendo" value={stats.dueSoon} accent="amber" />
        <V4KpiCard icon={Zap} label="Auto-revalidação" value={stats.autoEnabled} accent="emerald" />
        <V4KpiCard icon={TrendingDown} label="Por Trigger" value={stats.triggered} accent="violet" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
            <TabsTrigger value="overdue">Atrasadas ({stats.overdue})</TabsTrigger>
            <TabsTrigger value="due_soon">Vencendo ({stats.dueSoon})</TabsTrigger>
            <TabsTrigger value="periodic">Periódicas</TabsTrigger>
            <TabsTrigger value="triggered">Triggered</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatórias</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-5 space-y-2">
          {filtered.map((r) => {
            const typeCfg = REVAL_TYPE_CONFIG[r.revalidation_type] || { label: r.revalidation_type };
            return (
              <div key={r.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                <CalendarClock className="w-5 h-5 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{r.merchant_name}</span>
                    <Badge variant="outline" className="text-[10px]">{typeCfg.label}</Badge>
                    {r.frequency && <Badge variant="outline" className="text-[10px]">{r.frequency}</Badge>}
                    {r.priority === 'critical' && <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">CRITICAL</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">
                    Próxima: <strong className="text-slate-700 dark:text-slate-200">{new Date(r.next_revalidation_at).toLocaleDateString('pt-BR')}</strong>
                    {r.last_score && <> · Score atual: <strong>{r.last_score}</strong></>}
                    {r.score_delta != null && (
                      <span className={r.score_delta < 0 ? ' text-red-600 font-bold' : ' text-emerald-600 font-bold'}>
                        {' '}({r.score_delta > 0 ? '+' : ''}{r.score_delta})
                      </span>
                    )}
                  </p>
                  {r.trigger_reason && <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">⚡ {r.trigger_reason}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase">Auto</span>
                  <Switch checked={r.auto_revalidate} />
                </div>
                <Badge className={`${STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-700'} border-0`}>
                  {r.status}
                </Badge>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}