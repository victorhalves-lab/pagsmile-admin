import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Globe, Clock, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockPartners, PARTNER_TYPE_CONFIG } from '@/components/admin-interno/compliance/v4/mocks/partnersV4Mock';

export default function AdminIntCompliancePartners() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return mockPartners;
    const q = search.toLowerCase();
    return mockPartners.filter((p) => p.name.toLowerCase().includes(q));
  }, [search]);

  const stats = useMemo(() => ({
    total: mockPartners.length,
    active: mockPartners.filter((p) => p.status === 'active').length,
    activeAssignments: mockPartners.reduce((s, p) => s + (p.active_assignments || 0), 0),
    avgSla: (mockPartners.reduce((s, p) => s + (p.avg_response_hours || 0), 0) / mockPartners.length).toFixed(1),
  }), []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Parceiros de Compliance"
        subtitle="Bancos parceiros, compliance externo, registradoras, auditores"
        icon={Building2}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Parceiros' },
        ]}
        actions={<Button><Plus className="w-4 h-4 mr-1" /> Novo Parceiro</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Building2} label="Parceiros totais" value={stats.total} accent="indigo" />
        <V4KpiCard icon={Globe} label="Ativos" value={stats.active} accent="emerald" />
        <V4KpiCard icon={Users} label="Assignments ativos" value={stats.activeAssignments} accent="violet" />
        <V4KpiCard icon={Clock} label="SLA médio" value={`${stats.avgSla}h`} accent="amber" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <div className="mb-4 flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar parceiros..." className="pl-9 w-72" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const typeCfg = PARTNER_TYPE_CONFIG[p.type] || { label: p.type, icon: '🏢', color: 'slate' };
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/AdminIntCompliancePartnerDetail?id=${p.id}`)}
                className="text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{typeCfg.icon}</div>
                  <Badge className={p.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-700 border-0'}>
                    {p.status}
                  </Badge>
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{typeCfg.label}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <div><p className="text-[10px] text-slate-500 uppercase">Active</p><p className="font-bold">{p.active_assignments || 0}</p></div>
                  <div><p className="text-[10px] text-slate-500 uppercase">Total</p><p className="font-bold">{p.total_assignments || 0}</p></div>
                  <div><p className="text-[10px] text-slate-500 uppercase">SLA</p><p className="font-bold">{p.sla_response_hours}h</p></div>
                  <div><p className="text-[10px] text-slate-500 uppercase">Conclusão</p><p className="font-bold text-emerald-600">{p.completion_rate}%</p></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}