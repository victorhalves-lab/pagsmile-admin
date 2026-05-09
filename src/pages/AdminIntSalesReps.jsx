import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Download, Map, GitCompareArrows, Users, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/common/PageHeader';
import SalesRepKPIBar from '@/components/mentor/reps/SalesRepKPIBar';
import SalesRepCreateDrawer from '@/components/mentor/reps/SalesRepCreateDrawer';
import { MOCK_SALES_REPS, REP_STATUSES, REP_TYPES } from '@/components/mentor/mocks/salesRepsMock';
import { toast } from 'sonner';

const fmt = (v) => v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function AdminIntSalesReps() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...MOCK_SALES_REPS];
    if (search) list = list.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase()));
    if (filters.status && filters.status !== 'all') list = list.filter((r) => r.status === filters.status);
    if (filters.type && filters.type !== 'all') list = list.filter((r) => r.type === filters.type);
    if (filters.region && filters.region !== 'all') list = list.filter((r) => r.region === filters.region);
    if (filters.specialty && filters.specialty !== 'all') list = list.filter((r) => r.specialty === filters.specialty);
    if (filters.performance && filters.performance !== 'all') {
      list = list.filter((r) => {
        if (filters.performance === 'growing') return r.growth_12m_pct > 5;
        if (filters.performance === 'stable') return r.growth_12m_pct >= -5 && r.growth_12m_pct <= 5;
        if (filters.performance === 'decreasing') return r.growth_12m_pct < -5;
        return true;
      });
    }
    list.sort((a, b) => (b.monthly_tpv || 0) - (a.monthly_tpv || 0));
    return list;
  }, [search, filters]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Representantes Comerciais"
        subtitle="Equipe comercial com carteira atribuída · interno, externo, autônomo"
        icon={Users}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Estrutura' }, { label: 'Representantes' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Mapa de cobertura geográfica')}><Map className="w-4 h-4 mr-2" />Cobertura</Button>
            <Button variant="outline" onClick={() => toast.info('Comparar performance')}><GitCompareArrows className="w-4 h-4 mr-2" />Comparar</Button>
            <Button variant="outline" onClick={() => toast.success('Export iniciado')}><Download className="w-4 h-4 mr-2" />Exportar</Button>
            <Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />Novo representante</Button>
          </div>
        }
      />

      <SalesRepKPIBar reps={filtered} />

      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={filters.status || 'all'} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(REP_STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.type || 'all'} onValueChange={(v) => setFilters({ ...filters, type: v })}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(REP_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.region || 'all'} onValueChange={(v) => setFilters({ ...filters, region: v })}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Região" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="nacional">Nacional</SelectItem>
              <SelectItem value="sudeste">Sudeste</SelectItem>
              <SelectItem value="sul">Sul</SelectItem>
              <SelectItem value="nordeste">Nordeste</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.specialty || 'all'} onValueChange={(v) => setFilters({ ...filters, specialty: v })}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Especialização" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="varejo">Varejo</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="foodservice">Foodservice</SelectItem>
              <SelectItem value="b2b_saas">B2B SaaS</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.performance || 'all'} onValueChange={(v) => setFilters({ ...filters, performance: v })}>
            <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Performance" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="growing">Em crescimento</SelectItem>
              <SelectItem value="stable">Estável</SelectItem>
              <SelectItem value="decreasing">Em queda</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {filtered.map((r) => {
              const status = REP_STATUSES[r.status];
              const type = REP_TYPES[r.type];
              const isAtRisk = r.growth_12m_pct < 0 || r.losses_12m > r.captures_12m;
              return (
                <Card key={r.id} className={`cursor-pointer hover:shadow-md transition-all ${isAtRisk ? 'border-l-4 border-l-amber-500' : ''}`}
                  onClick={() => navigate(createPageUrl('AdminIntSalesRepDetail') + `?id=${r.id}`)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#101F3E] text-white">{r.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm">{r.name}</CardTitle>
                          <p className="text-[10px] text-slate-500">{r.email}</p>
                        </div>
                      </div>
                      {isAtRisk && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge className={`text-[10px] ${status?.color}`}>{status?.label}</Badge>
                      <Badge className={`text-[10px] ${type?.color}`}>{type?.label}</Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">{r.region}</Badge>
                      {r.specialty && <Badge variant="outline" className="text-[10px] capitalize">{r.specialty.replace('_', ' ')}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><p className="text-slate-500 text-[10px]">Carteira</p><p className="font-bold">{r.accounts_count} contas</p></div>
                      <div><p className="text-slate-500 text-[10px]">TPV/mês</p><p className="font-bold text-emerald-600">{fmt(r.monthly_tpv)}</p></div>
                      <div><p className="text-slate-500 text-[10px]">Comissão/mês</p><p className="font-bold text-violet-600">{fmt(r.monthly_commission)}</p></div>
                      <div><p className="text-slate-500 text-[10px]">Meta</p><p className={`font-bold ${r.quota_target_pct >= 100 ? 'text-emerald-600' : r.quota_target_pct >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{r.quota_target_pct}%</p></div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] pt-2 border-t">
                      {r.growth_12m_pct >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                      <span className={r.growth_12m_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}>{r.growth_12m_pct.toFixed(1)}% YoY</span>
                      <span className="text-slate-400 ml-auto">+{r.captures_12m} captações · -{r.losses_12m} perdas</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <SalesRepCreateDrawer open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}