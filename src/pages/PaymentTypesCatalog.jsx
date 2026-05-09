import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layers, Search, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { mockPaymentTypes } from '@/components/mentor/mocks/settlementGovernanceMock';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(n);

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#94a3b8'];

export default function PaymentTypesCatalog() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockPaymentTypes.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.type_id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter]);

  const totalVolume = filtered.filter(t => t.status === 'active').reduce((s, t) => s + t.volume_30d, 0);
  const lowActivity = filtered.filter(t => t.status === 'active' && t.count_30d < 100);

  const chartData = filtered.filter(t => t.status === 'active' && t.volume_30d > 0).map((t, i) => ({
    name: t.name.split(' ')[0],
    volume: t.volume_30d,
    count: t.count_30d,
  }));

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Catálogo · Tipos de Pagamento"
        subtitle="Configurações estruturais: prazos, métodos, contas contábeis, regras fiscais"
        icon={Layers}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Catálogos' },
          { label: 'Tipos de Pagamento' },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Exportar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Tipos ativos</p><p className="text-2xl font-black">{filtered.filter(t => t.status === 'active').length}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Volume 30d agregado</p><p className="text-xl font-black text-emerald-700">{fmt(totalVolume)}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Pagamentos 30d</p><p className="text-xl font-black">{fmtNum(filtered.reduce((s, t) => s + t.count_30d, 0))}</p></CardContent></Card>
        <Card className={lowActivity.length > 0 ? 'border-amber-200' : ''}><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Baixa atividade</p><p className={cn('text-2xl font-black', lowActivity.length > 0 ? 'text-amber-700' : 'text-emerald-700')}>{lowActivity.length}</p></CardContent></Card>
      </div>

      {/* Pareto */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição Pareto · Volume por tipo</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt(v)} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="volume">
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Buscar por nome ou identificador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>
          <div className="flex gap-1">
            {[
              { k: 'all', l: 'Todos' },
              { k: 'active', l: 'Ativos' },
              { k: 'discontinued', l: 'Descontinuados' },
              { k: 'in_homologation', l: 'Homologação' },
            ].map((f) => (
              <button key={f.k} onClick={() => setStatusFilter(f.k)}
                className={cn('px-2 py-1 rounded text-[11px] font-semibold border',
                  statusFilter === f.k ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>
                {f.l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista detalhada */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-2 font-bold text-slate-600">Tipo</th>
                <th className="text-left p-2 font-bold text-slate-600">Status</th>
                <th className="text-left p-2 font-bold text-slate-600">Prazo</th>
                <th className="text-left p-2 font-bold text-slate-600">Método</th>
                <th className="text-left p-2 font-bold text-slate-600">Conta contábil</th>
                <th className="text-right p-2 font-bold text-slate-600">Pagamentos 30d</th>
                <th className="text-right p-2 font-bold text-slate-600">Volume 30d</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.type_id} className="border-b last:border-0 hover:bg-violet-50/30">
                  <td className="p-2">
                    <p className="font-bold text-slate-800">{t.name}</p>
                    <code className="text-[10px] text-slate-500 font-mono">{t.type_id}</code>
                  </td>
                  <td className="p-2">
                    <Badge className={t.status === 'active' ? 'bg-emerald-100 text-emerald-700 text-[10px]' : 'bg-slate-100 text-slate-600 text-[10px]'}>
                      {t.status === 'active' ? 'Ativo' : t.status === 'discontinued' ? 'Descontinuado' : 'Homologação'}
                    </Badge>
                  </td>
                  <td className="p-2"><Badge variant="outline" className="text-[10px]">{t.settlement_term}</Badge></td>
                  <td className="p-2 text-slate-600">{t.method}</td>
                  <td className="p-2 font-mono text-[10px] text-slate-500">{t.accounting}</td>
                  <td className="p-2 text-right font-semibold">{fmtNum(t.count_30d)}</td>
                  <td className="p-2 text-right font-semibold text-emerald-700">{fmt(t.volume_30d)}</td>
                  <td className="p-2">
                    <Link to={createPageUrl('AdminIntSettlements')}>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                        <ExternalLink className="w-3 h-3 mr-1" /> Ver pagamentos
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {lowActivity.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-900">Sugestão</p>
              <p className="text-amber-800">{lowActivity.length} tipo(s) ativos com baixa atividade ({lowActivity.map(t => t.name).join(', ')}) — candidatos a descontinuação para reduzir complexidade do portfólio.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}