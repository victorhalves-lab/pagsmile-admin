import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, GitCompareArrows, Download, Layers, Heart, Activity, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/common/PageHeader';
import ProjectKPIBar from '@/components/mentor/projects/ProjectKPIBar';
import ProjectCreateDrawer from '@/components/mentor/projects/ProjectCreateDrawer';
import { MOCK_PROJECTS, PROJECT_STATUSES, PROJECT_TYPES, REGULATORY_REGIONS } from '@/components/mentor/mocks/projectsMock';
import { toast } from 'sonner';

const fmt = (v) => v >= 1_000_000_000 ? `R$ ${(v / 1_000_000_000).toFixed(1)}bi` : v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(0)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function AdminIntProjects() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...MOCK_PROJECTS];
    if (search) list = list.filter((p) => p.project_name.toLowerCase().includes(search.toLowerCase()) || p.trade.toLowerCase().includes(search.toLowerCase()));
    if (filters.status && filters.status !== 'all') list = list.filter((p) => p.status === filters.status);
    if (filters.type && filters.type !== 'all') list = list.filter((p) => p.project_type === filters.type);
    if (filters.region && filters.region !== 'all') list = list.filter((p) => p.region === filters.region);
    list.sort((a, b) => (b.monthly_tpv || 0) - (a.monthly_tpv || 0));
    return list;
  }, [search, filters]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Projetos · Multi-tenancy"
        subtitle="Cada projeto isola operações com sua infraestrutura técnica, comercial e regulatória própria"
        icon={Layers}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Estrutura' }, { label: 'Projetos' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Mapa global multi-país')}><Globe className="w-4 h-4 mr-2" />Mapa global</Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('AdminIntProjectsConsolidatedDashboard'))}><Activity className="w-4 h-4 mr-2" />Dashboard consolidado</Button>
            <Button variant="outline" onClick={() => toast.info('Comparar projetos lado a lado')}><GitCompareArrows className="w-4 h-4 mr-2" />Comparar</Button>
            <Button variant="outline" onClick={() => toast.success('Export iniciado')}><Download className="w-4 h-4 mr-2" />Exportar</Button>
            <Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />Novo projeto</Button>
          </div>
        }
      />

      <ProjectKPIBar projects={filtered} />

      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Buscar projeto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={filters.status || 'all'} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(PROJECT_STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.type || 'all'} onValueChange={(v) => setFilters({ ...filters, type: v })}>
            <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              {Object.entries(PROJECT_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.region || 'all'} onValueChange={(v) => setFilters({ ...filters, region: v })}>
            <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Região regulatória" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas regiões</SelectItem>
              {Object.entries(REGULATORY_REGIONS).map(([k, v]) => <SelectItem key={k} value={k}>{v.flag} {v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((p) => {
          const type = PROJECT_TYPES[p.project_type];
          const status = PROJECT_STATUSES[p.status];
          const region = REGULATORY_REGIONS[p.region];
          return (
            <Card key={p.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(createPageUrl('AdminIntProjectDetail') + `?id=${p.id}`)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{p.trade}</CardTitle>
                    <p className="text-xs text-slate-500">{p.project_name} · {p.company_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`text-[10px] ${status?.color}`}>{status?.label}</Badge>
                    <Badge className={`text-[10px] ${type?.color}`}>{type?.label}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span>{region?.flag} {region?.label}</span>
                  <span>·</span>
                  <span>{p.age_years} anos</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-slate-500 text-[10px]">TPV/mês</p><p className="font-bold text-emerald-600 text-base">{fmt(p.monthly_tpv)}</p></div>
                  <div><p className="text-slate-500 text-[10px]">Receita</p><p className="font-bold text-blue-600 text-base">{fmt(p.monthly_revenue)}</p></div>
                  <div><p className="text-slate-500 text-[10px]">Empresas</p><p className="font-bold">{p.companies_count}</p></div>
                  <div><p className="text-slate-500 text-[10px]">Lojistas</p><p className="font-bold">{p.merchants_count.toLocaleString('pt-BR')}</p></div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Heart className={`w-4 h-4 ${p.health_score >= 85 ? 'text-emerald-500' : p.health_score >= 60 ? 'text-amber-500' : 'text-red-500'}`} />
                  <span className="text-xs">Saúde: <strong className={p.health_score >= 85 ? 'text-emerald-600' : 'text-amber-600'}>{p.health_score}</strong></span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs">Aprovação: <strong>{p.approval_rate.toFixed(1)}%</strong></span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs">CB: <strong className={p.chargeback_rate > 1 ? 'text-red-600' : 'text-emerald-600'}>{p.chargeback_rate.toFixed(2)}%</strong></span>
                </div>
                {p.regulatory_programs?.length > 0 && (
                  <div className="flex gap-1 flex-wrap pt-1">
                    {p.regulatory_programs.map((prog) => <Badge key={prog} variant="outline" className="text-[9px]">{prog}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProjectCreateDrawer open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}