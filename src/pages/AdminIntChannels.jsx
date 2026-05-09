import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Search, Download, ShieldCheck } from 'lucide-react';
import { CHANNELS, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { presencial: 'Presencial', online: 'Online', instantaneo: 'Instantâneo' };
const TYPE_COLOR = {
  presencial: 'bg-blue-50 text-blue-700 border-blue-200',
  online: 'bg-purple-50 text-purple-700 border-purple-200',
  instantaneo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function AdminIntChannels() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => CHANNELS.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  }), [search, typeFilter]);

  const totals = useMemo(() => ({
    count: filtered.length,
    tpv: filtered.reduce((s, c) => s + c.tpv_monthly, 0),
    transactions: filtered.reduce((s, c) => s + c.transactions_monthly, 0),
    merchants: filtered.reduce((s, c) => s + c.merchants_using, 0),
  }), [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Canais"
        subtitle="Catálogo de canais de captura — POS, e-commerce, online, paylink, PIX QR, recorrência"
        icon={Layers}
        breadcrumbs={[{ label: 'Catálogos', page: 'AdminIntAcquirers' }, { label: 'Canais', page: 'AdminIntChannels' }]}
        actions={<Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Exportar</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricChip label="Canais" value={totals.count} color="blue" />
        <MetricChip label="TPV agregado/mês" value={fmtMoney(totals.tpv)} color="emerald" />
        <MetricChip label="Transações/mês" value={fmtNumber(totals.transactions)} color="purple" />
        <MetricChip label="Lojistas usando" value={fmtNumber(totals.merchants)} color="slate" />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar canal..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="instantaneo">Instantâneo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Cards de canal */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Link key={c.id} to={createPageUrl('AdminIntChannelDetail') + '?id=' + c.id}>
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <Badge variant="outline" className={`text-[10px] mt-1 ${TYPE_COLOR[c.type]}`}>{TYPE_LABEL[c.type]}</Badge>
                  </div>
                  <CatalogStatusBadge status={c.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">TPV/mês</p>
                    <p className="text-sm font-bold">{fmtMoney(c.tpv_monthly)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Transações</p>
                    <p className="text-sm font-bold">{fmtNumber(c.transactions_monthly)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Aprovação</p>
                    <p className={`text-sm font-bold ${c.approval_rate >= 95 ? 'text-emerald-600' : c.approval_rate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>{fmtPct(c.approval_rate, 1)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Chargeback</p>
                    <p className={`text-sm font-bold ${c.chargeback_rate <= 0.2 ? 'text-emerald-600' : c.chargeback_rate <= 0.5 ? 'text-amber-600' : 'text-red-600'}`}>{fmtPct(c.chargeback_rate, 2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">{fmtNumber(c.merchants_using)} lojistas</span>
                  <span className="flex items-center gap-1 text-slate-500"><ShieldCheck className="w-3 h-3" />{c.antifraud_rules} regras AF</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}