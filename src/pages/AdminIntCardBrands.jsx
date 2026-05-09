import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Search, Download, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CARD_BRANDS, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { credit: 'Crédito', debit: 'Débito', prepaid: 'Pré-pago', voucher: 'Voucher' };

export default function AdminIntCardBrands() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => CARD_BRANDS.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (typeFilter !== 'all' && b.type !== typeFilter) return false;
    return true;
  }), [search, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    const tpvAll = filtered.reduce((s, b) => s + b.tpv_monthly, 0);
    const inProgram = filtered.filter(b => b.monitoring_programs.length > 0).length;
    const nearThreshold = filtered.filter(b => b.current_chargeback_pct >= b.chargeback_threshold_pct * 0.7 && b.monitoring_programs.length > 0).length;
    return { count: filtered.length, tpv: tpvAll, inProgram, nearThreshold };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bandeiras de Cartão"
        subtitle="Catálogo de bandeiras com programas VAMP/BRAM, intercâmbio e métricas operacionais"
        icon={CreditCard}
        breadcrumbs={[{ label: 'Catálogos', page: 'AdminIntAcquirers' }, { label: 'Bandeiras', page: 'AdminIntCardBrands' }]}
        actions={<Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Exportar</Button>}
      />

      {/* Alerta crítico de bandeiras próximas do threshold */}
      {totals.nearThreshold > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 dark:text-amber-200">{totals.nearThreshold} bandeira(s) próxima(s) do threshold de chargeback</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Revise os programas VAMP/BRAM e ações mitigadoras para evitar penalidades.</p>
            </div>
            <Button variant="outline" size="sm" className="border-amber-400">Ver detalhes</Button>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricChip label="Bandeiras" value={totals.count} color="blue" />
        <MetricChip label="TPV agregado/mês" value={fmtMoney(totals.tpv)} color="emerald" />
        <MetricChip label="Em programa de monitoramento" value={totals.inProgram} sublabel="VAMP / BRAM / outros" color="purple" icon={ShieldAlert} />
        <MetricChip label="Próximas do threshold" value={totals.nearThreshold} color={totals.nearThreshold > 0 ? 'amber' : 'slate'} />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar bandeira..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="homologation">Em homologação</SelectItem>
              <SelectItem value="discontinued">Descontinuadas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="credit">Crédito</SelectItem>
              <SelectItem value="debit">Débito</SelectItem>
              <SelectItem value="prepaid">Pré-pago</SelectItem>
              <SelectItem value="voucher">Voucher</SelectItem>
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
                <th className="p-3 text-left font-semibold">Bandeira</th>
                <th className="p-3 text-left font-semibold">Tipo</th>
                <th className="p-3 text-left font-semibold">Origem</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-right font-semibold">TPV/mês</th>
                <th className="p-3 text-right font-semibold">Transações/mês</th>
                <th className="p-3 text-right font-semibold">Aprovação</th>
                <th className="p-3 text-right font-semibold">Chargeback</th>
                <th className="p-3 text-left font-semibold">Programas</th>
                <th className="p-3 text-center font-semibold">Saúde</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const danger = b.current_chargeback_pct >= b.chargeback_threshold_pct * 0.7;
                return (
                  <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <Link to={createPageUrl('AdminIntCardBrandDetail') + '?id=' + b.id} className="flex items-center gap-3 hover:text-[#2bc196]">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                        <span className="font-semibold">{b.name}</span>
                      </Link>
                    </td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{TYPE_LABEL[b.type]}</Badge></td>
                    <td className="p-3 text-xs text-slate-500">{b.country_origin}</td>
                    <td className="p-3"><CatalogStatusBadge status={b.status} size="sm" /></td>
                    <td className="p-3 text-right font-mono">{fmtMoney(b.tpv_monthly)}</td>
                    <td className="p-3 text-right font-mono">{fmtNumber(b.transactions_monthly)}</td>
                    <td className="p-3 text-right">
                      <span className={b.approval_rate >= 95 ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>{fmtPct(b.approval_rate, 1)}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={danger ? 'text-red-600 font-semibold' : b.current_chargeback_pct <= 0.3 ? 'text-emerald-600' : 'text-amber-600'}>
                        {fmtPct(b.current_chargeback_pct, 2)}
                      </span>
                      {danger && <AlertTriangle className="w-3 h-3 text-red-600 inline ml-1" />}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {b.monitoring_programs.length > 0 ? b.monitoring_programs.map(p => (
                          <Badge key={p} variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-200">{p}</Badge>
                        )) : <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm ${b.health_score >= 90 ? 'bg-emerald-100 text-emerald-700' : b.health_score >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {b.health_score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}