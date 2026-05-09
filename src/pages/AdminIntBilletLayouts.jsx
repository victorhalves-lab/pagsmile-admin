import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, Eye, ExternalLink, Settings, AlertTriangle } from 'lucide-react';
import { mockBilletLayouts } from '@/components/mentor/mocks/billetsBackofficeMock';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#94a3b8', '#ef4444'];

export default function AdminIntBilletLayouts() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockBilletLayouts.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (bankFilter !== 'all' && l.bank !== bankFilter) return false;
      return true;
    });
  }, [statusFilter, bankFilter]);

  const banks = [...new Set(mockBilletLayouts.map(l => l.bank))];
  const lowActivity = mockBilletLayouts.filter(l => l.status === 'active' && l.usage_30d < 100);

  const chartData = mockBilletLayouts.filter(l => l.status === 'active' && l.usage_30d > 0).map(l => ({
    name: l.bank,
    value: l.usage_30d,
  }));

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Catálogo · Layouts de Boleto"
        subtitle="Configurações por banco e carteira · prévia visual e métricas Mentor"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Boletos', page: 'AdminIntBilletsList' },
          { label: 'Layouts' },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave I.11
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição de uso (30 dias)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Layouts ativos</p><p className="text-2xl font-black">{mockBilletLayouts.filter(l => l.status === 'active').length}</p></CardContent></Card>
          <Card className={lowActivity.length > 0 ? 'border-amber-200' : ''}>
            <CardContent className="p-3">
              <p className="text-[10px] uppercase font-bold text-slate-500">Baixa atividade</p>
              <p className={cn('text-2xl font-black', lowActivity.length > 0 ? 'text-amber-700' : 'text-emerald-700')}>{lowActivity.length}</p>
            </CardContent>
          </Card>
          <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Bancos parceiros</p><p className="text-2xl font-black text-blue-700">{banks.length}</p></CardContent></Card>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase font-bold text-slate-500">Status:</span>
          {[
            { k: 'all', l: 'Todos' },
            { k: 'active', l: 'Ativos' },
            { k: 'in_homologation', l: 'Homologação' },
            { k: 'discontinued', l: 'Descontinuados' },
          ].map((f) => (
            <button key={f.k} onClick={() => setStatusFilter(f.k)}
              className={cn('px-2 py-1 rounded text-[11px] font-semibold border',
                statusFilter === f.k ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>{f.l}</button>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-2" />
          <span className="text-[11px] uppercase font-bold text-slate-500">Banco:</span>
          <button onClick={() => setBankFilter('all')} className={cn('px-2 py-1 rounded text-[11px] font-semibold border', bankFilter === 'all' ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>Todos</button>
          {banks.map(b => (
            <button key={b} onClick={() => setBankFilter(b)} className={cn('px-2 py-1 rounded text-[11px] font-semibold border', bankFilter === b ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>{b}</button>
          ))}
        </CardContent>
      </Card>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((l) => (
          <Card key={l.layout_id} className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="text-sm">{l.bank}</CardTitle>
                <Badge className={cn('text-[9px]',
                  l.status === 'active' && 'bg-emerald-100 text-emerald-700',
                  l.status === 'in_homologation' && 'bg-amber-100 text-amber-700',
                  l.status === 'discontinued' && 'bg-slate-100 text-slate-700',
                )}>
                  {l.status === 'active' ? 'Ativo' : l.status === 'in_homologation' ? 'Homologação' : 'Descontinuado'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600">{l.name}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Prévia visual fake do boleto */}
              <div className="bg-gradient-to-br from-slate-50 to-white border rounded p-2 aspect-[5/3] flex flex-col justify-between text-[8px] font-mono text-slate-400 overflow-hidden">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-bold">{l.bank}</span>
                  <span>{l.bank === 'Itaú' ? '341-7' : l.bank === 'Bradesco' ? '237-2' : l.bank === 'Banco do Brasil' ? '001-9' : '033-7'}</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between"><span>Beneficiário</span><span>PagSmile</span></div>
                  <div className="flex justify-between"><span>Pagador</span><span>Empresa Exemplo</span></div>
                  <div className="flex justify-between"><span>Valor</span><span className="font-bold text-slate-700">R$ 1.234,56</span></div>
                  <div className="flex justify-between"><span>Vencto</span><span>30/05/2026</span></div>
                </div>
                <div className="border-t pt-1 text-center">
                  <code>34191.79001 01043.510047 91020.150008 8</code>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <div className="bg-slate-50 rounded p-1.5 text-center">
                  <p className="text-[9px] text-slate-500">Carteira</p>
                  <p className="font-bold">{l.portfolio}</p>
                </div>
                <div className="bg-slate-50 rounded p-1.5 text-center">
                  <p className="text-[9px] text-slate-500">Versão</p>
                  <p className="font-bold">{l.version}</p>
                </div>
                <div className="bg-violet-50 rounded p-1.5 text-center">
                  <p className="text-[9px] text-slate-500">Uso 30d</p>
                  <p className="font-bold text-violet-700">{l.usage_30d}</p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1" onClick={() => toast.success('PDF de exemplo aberto em nova aba')}>
                  <Eye className="w-3 h-3 mr-1" /> Prévia PDF
                </Button>
                <Link to={createPageUrl('AdminIntBilletsList') + `?layout=${l.layout_id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] w-full">
                    <ExternalLink className="w-3 h-3 mr-1" /> Boletos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowActivity.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-900">Sugestão Mentor</p>
              <p className="text-amber-800">{lowActivity.length} layout(s) ativos com baixa atividade — revisar parcerias com bancos pouco usados ({lowActivity.map(l => l.bank).join(', ')}).</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}