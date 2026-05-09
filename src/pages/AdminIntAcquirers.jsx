import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Search, Download, GitCompare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ACQUIRERS, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { full_acquirer: 'Full Acquirer', sub_acquirer: 'Sub-acquirer' };

export default function AdminIntAcquirers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = useMemo(() => {
    return ACQUIRERS.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  const totals = useMemo(() => ({
    count: filtered.length,
    tpv: filtered.reduce((s, a) => s + a.tpv_monthly, 0),
    revenue: filtered.reduce((s, a) => s + a.revenue_monthly, 0),
    merchants: filtered.reduce((s, a) => s + a.merchants_linked, 0),
    contractsAlert: filtered.filter(a => a.contract.alert).length,
  }), [filtered]);

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adquirentes"
        subtitle="Catálogo de adquirentes homologados — capacidades técnicas, contratos e métricas operacionais"
        icon={Building}
        breadcrumbs={[{ label: 'Catálogos', page: 'AdminIntAcquirers' }, { label: 'Adquirentes', page: 'AdminIntAcquirers' }]}
        actions={
          <>
            {selectedIds.length >= 2 && (
              <Button variant="outline" className="gap-2"><GitCompare className="w-4 h-4" />Comparar ({selectedIds.length})</Button>
            )}
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Exportar</Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricChip label="Adquirentes" value={totals.count} sublabel="no resultado" color="blue" />
        <MetricChip label="TPV agregado/mês" value={fmtMoney(totals.tpv)} color="emerald" />
        <MetricChip label="Receita PagSmile/mês" value={fmtMoney(totals.revenue)} color="purple" />
        <MetricChip label="Lojistas vinculados" value={fmtNumber(totals.merchants)} color="slate" />
        <MetricChip label="Contratos vencendo" value={totals.contractsAlert} sublabel="próximos 90 dias" color={totals.contractsAlert > 0 ? 'amber' : 'slate'} icon={AlertTriangle} />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar adquirente por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="homologation">Em homologação</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="full_acquirer">Full Acquirer</SelectItem>
              <SelectItem value="sub_acquirer">Sub-acquirer</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 text-left w-10"><input type="checkbox" /></th>
                <th className="p-3 text-left font-semibold">Adquirente</th>
                <th className="p-3 text-left font-semibold">Tipo</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Bandeiras</th>
                <th className="p-3 text-left font-semibold">Canais</th>
                <th className="p-3 text-right font-semibold">TPV/mês</th>
                <th className="p-3 text-right font-semibold">Lojistas</th>
                <th className="p-3 text-right font-semibold">Aprovação</th>
                <th className="p-3 text-right font-semibold">Chargeback</th>
                <th className="p-3 text-center font-semibold">Contrato</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                  </td>
                  <td className="p-3">
                    <Link to={createPageUrl('AdminIntAcquirerDetail') + '?id=' + a.id} className="flex items-center gap-3 hover:text-[#2bc196]">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={a.logo} alt={a.name} className="max-w-full max-h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{a.id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3">
                    <Badge variant={a.type === 'full_acquirer' ? 'default' : 'secondary'} className="text-[10px]">{TYPE_LABEL[a.type]}</Badge>
                  </td>
                  <td className="p-3"><CatalogStatusBadge status={a.status} size="sm" /></td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {a.brands.slice(0, 4).map(b => <Badge key={b} variant="outline" className="text-[9px] capitalize">{b}</Badge>)}
                      {a.brands.length > 4 && <Badge variant="outline" className="text-[9px]">+{a.brands.length - 4}</Badge>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[100px]">
                      {a.channels.map(c => <Badge key={c} variant="secondary" className="text-[9px] uppercase">{c}</Badge>)}
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono">{fmtMoney(a.tpv_monthly)}</td>
                  <td className="p-3 text-right font-mono">{fmtNumber(a.merchants_linked)}</td>
                  <td className="p-3 text-right">
                    {a.approval_rate !== null ? (
                      <span className={a.approval_rate >= 95 ? 'text-emerald-600 font-semibold' : a.approval_rate >= 90 ? 'text-amber-600' : 'text-red-600'}>{fmtPct(a.approval_rate, 1)}</span>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="p-3 text-right">
                    {a.chargeback_rate !== null ? (
                      <span className={a.chargeback_rate <= 0.2 ? 'text-emerald-600' : a.chargeback_rate <= 0.5 ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'}>{fmtPct(a.chargeback_rate, 2)}</span>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="p-3 text-center">
                    {a.contract.alert ? <Badge variant="destructive" className="text-[10px] gap-1"><AlertTriangle className="w-3 h-3" />Vencendo</Badge> : <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}