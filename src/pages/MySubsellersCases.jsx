import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Plus, Search, Building2, User, TrendingUp, CheckCircle2,
  Clock, XCircle, FileText, ArrowRight, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import CaseTypeBadge from '@/components/admin-interno/compliance/v4/CaseTypeBadge';
import CaseStatusBadge from '@/components/admin-interno/compliance/v4/CaseStatusBadge';
import RiskBandBadge from '@/components/admin-interno/compliance/v4/RiskBandBadge';
import { myMockSubsellerCases } from '@/components/my-compliance/mocks/mySubsellersMock';

export default function MySubsellersCases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const stats = useMemo(() => ({
    total: myMockSubsellerCases.length,
    pj: myMockSubsellerCases.filter((c) => c.tipo === 'subseller_pj').length,
    pf: myMockSubsellerCases.filter((c) => c.tipo === 'subseller_pf').length,
    active: myMockSubsellerCases.filter((c) => c.is_active).length,
    pending: myMockSubsellerCases.filter((c) => ['queue_auto', 'manual_review', 'docs_requested', 'in_progress'].includes(c.status)).length,
    rejected: myMockSubsellerCases.filter((c) => c.status === 'auto_rejected' || c.status === 'manual_rejected').length,
    monthlyVolume: myMockSubsellerCases.reduce((s, c) => s + (c.monthly_volume || 0), 0),
  }), []);

  const filtered = useMemo(() => {
    let list = [...myMockSubsellerCases];
    if (activeTab === 'active') list = list.filter((c) => c.is_active);
    else if (activeTab === 'pending') list = list.filter((c) => ['queue_auto', 'manual_review', 'docs_requested', 'in_progress'].includes(c.status));
    else if (activeTab === 'rejected') list = list.filter((c) => c.status === 'auto_rejected' || c.status === 'manual_rejected');
    if (tipo !== 'all') list = list.filter((c) => c.tipo === tipo);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.razao_social || '').toLowerCase().includes(q) ||
        (c.nome_completo || '').toLowerCase().includes(q) ||
        (c.cnpj || '').includes(q) ||
        (c.cpf || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [search, tipo, activeTab]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Meus Subsellers"
        subtitle="Gerencie os subsellers que você captou via links de onboarding"
        icon={Users}
        breadcrumbs={[{ label: 'Compliance', page: 'MyComplianceCenter' }, { label: 'Meus Subsellers' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/MyComplianceLinks')}>
              <FileText className="w-4 h-4 mr-1" /> Meus Links
            </Button>
            <Button onClick={() => navigate('/MySubsellerInvite')}>
              <Plus className="w-4 h-4 mr-1" /> Convidar Subseller
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <V4KpiCard icon={Users} label="Total" value={stats.total} accent="violet" />
        <V4KpiCard icon={Building2} label="PJ" value={stats.pj} accent="indigo" />
        <V4KpiCard icon={User} label="PF" value={stats.pf} accent="violet" />
        <V4KpiCard icon={CheckCircle2} label="Ativos" value={stats.active} accent="emerald" />
        <V4KpiCard icon={Clock} label="Pendentes" value={stats.pending} accent="amber" />
        <V4KpiCard icon={XCircle} label="Recusados" value={stats.rejected} accent="red" />
        <V4KpiCard icon={TrendingUp} label="Vol. Mensal" value={`R$ ${(stats.monthlyVolume / 1000).toFixed(0)}k`} accent="emerald" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Ativos ({stats.active})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
              <TabsTrigger value="rejected">Recusados ({stats.rejected})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 w-64" />
            </div>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tipo</SelectItem>
                <SelectItem value="subseller_pj">PJ</SelectItem>
                <SelectItem value="subseller_pf">PF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Nenhum subseller encontrado.
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/MySubsellerInvite')}>
                  <Plus className="w-4 h-4 mr-1" /> Convidar primeiro
                </Button>
              </div>
            </div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/MySubsellerCaseDetail?id=${c.id}`)}
              className="w-full text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                {c.tipo === 'subseller_pj' ? <Building2 className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <CaseTypeBadge tipo={c.tipo} />
                  <CaseStatusBadge status={c.status} />
                  {c.is_active && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Ativo</Badge>}
                  <span className="font-mono text-[11px] text-slate-500">{c.case_id}</span>
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {c.razao_social || c.nome_completo}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-mono">{c.cnpj || c.cpf}</span>
                  {c.email && <span>· {c.email}</span>}
                  {c.monthly_volume && <span>· Vol. mensal R$ {c.monthly_volume.toLocaleString('pt-BR')}</span>}
                </div>
              </div>
              {c.risk_band && <RiskBandBadge band={c.risk_band} score={c.risk_score} />}
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}