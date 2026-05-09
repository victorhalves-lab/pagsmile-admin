import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid3x3, Search, Filter, AlertTriangle, CheckCircle2, XCircle, Clock, Download } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockMerchantCoverageMatrix } from '@/components/orchestration/mockData';
import { cn } from '@/lib/utils';

const SERVICE_COLUMNS = [
  { id: 'pix_69', label: 'PIX V4', subId: '69', type: 'pix' },
  { id: 'pix_71', label: 'PIX V4', subId: '71', type: 'pix' },
  { id: 'pix_86', label: 'PIX V4', subId: '86', type: 'pix' },
  { id: 'pix_88', label: 'PIX V4', subId: '88', type: 'pix' },
  { id: 'pix_93', label: 'PIX V4', subId: '93', type: 'pix' },
  { id: 'pix_101', label: 'PIX V4', subId: '101', type: 'pix' },
  { id: 'card_41', label: 'Cartão', subId: '41', type: 'card' },
  { id: 'card_63', label: 'Cartão', subId: '63', type: 'card' },
];

const STATUS_CONFIG = {
  active: { label: 'Ativo', color: 'bg-emerald-500', icon: CheckCircle2, text: 'text-emerald-700' },
  pending: { label: 'Pendente', color: 'bg-amber-500', icon: Clock, text: 'text-amber-700' },
  inactive: { label: 'Inativo', color: 'bg-slate-300', icon: XCircle, text: 'text-slate-600' },
  rejected: { label: 'Rejeitado', color: 'bg-red-500', icon: XCircle, text: 'text-red-700' },
};

export default function AdminIntMerchantCoverageMatrix() {
  const [search, setSearch] = useState('');

  const filtered = mockMerchantCoverageMatrix.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.document.includes(search) ||
    m.tenant.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalCells = filtered.length * SERVICE_COLUMNS.length;
  const stats = {
    active: filtered.reduce((sum, m) => sum + Object.values(m.services).filter(s => s === 'active').length, 0),
    pending: filtered.reduce((sum, m) => sum + Object.values(m.services).filter(s => s === 'pending').length, 0),
    inactive: filtered.reduce((sum, m) => sum + Object.values(m.services).filter(s => s === 'inactive').length, 0),
    rejected: filtered.reduce((sum, m) => sum + Object.values(m.services).filter(s => s === 'rejected').length, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Merchant Coverage Matrix"
        subtitle="Cobertura de serviços de Split por sub-lojista · Tuna conexões IDs 69/71/86/88/93/101 + 41/63"
        icon={Grid3x3}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Marketplace' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Ativos</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
            <p className="text-xs text-slate-500 mt-1">{((stats.active/totalCells)*100).toFixed(0)}% das conexões</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-slate-500 mt-1">aguardando análise KYC</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Inativos</p>
            <p className="text-3xl font-bold text-slate-600">{stats.inactive}</p>
            <p className="text-xs text-slate-500 mt-1">não habilitados</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Rejeitados</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs text-slate-500 mt-1">requerem ação</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome, CNPJ ou tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coverage Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Matriz de Cobertura · {filtered.length} sub-lojistas</span>
            <div className="flex items-center gap-3 text-xs">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded', cfg.color)} />
                  <span className="text-slate-600">{cfg.label}</span>
                </div>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
              <tr>
                <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300 min-w-[280px]">
                  Sub-Lojista
                </th>
                <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300 min-w-[120px]">
                  Tenant
                </th>
                {SERVICE_COLUMNS.map(col => (
                  <th key={col.id} className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex flex-col items-center gap-0.5">
                      <Badge variant="outline" className={cn('text-[10px]', col.type === 'pix' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700')}>
                        {col.label}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-500">ID {col.subId}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">
                  Saúde
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((merchant) => {
                const services = merchant.services;
                const activeCount = Object.values(services).filter(s => s === 'active').length;
                const totalCount = SERVICE_COLUMNS.length;
                const healthPct = (activeCount / totalCount) * 100;

                return (
                  <tr key={merchant.merchantId} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{merchant.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{merchant.document}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-[10px]">{merchant.tenant}</Badge>
                    </td>
                    {SERVICE_COLUMNS.map(col => {
                      const status = services[col.id];
                      const cfg = STATUS_CONFIG[status];
                      const Icon = cfg.icon;
                      return (
                        <td key={col.id} className="p-3 text-center">
                          <div
                            className={cn('inline-flex items-center justify-center w-8 h-8 rounded-lg', cfg.color, 'text-white shadow-sm cursor-pointer hover:scale-110 transition-transform')}
                            title={cfg.label}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn('text-sm font-bold', healthPct >= 75 ? 'text-emerald-600' : healthPct >= 50 ? 'text-amber-600' : 'text-red-600')}>
                          {healthPct.toFixed(0)}%
                        </span>
                        <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full', healthPct >= 75 ? 'bg-emerald-500' : healthPct >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                            style={{ width: `${healthPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Insight Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
              Ação direcional sugerida
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              <strong>Loja Eletronica BR Ltda</strong> tem PIX habilitado mas Cartão pendente em conexão 63 — converse com o tenant para acelerar análise.
            </p>
          </div>
          <Button size="sm" variant="outline" className="bg-white">
            Ver merchants similares
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}