import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

import CheckoutsKpiBar from '@/components/checkout/list/CheckoutsKpiBar';
import CheckoutFilters from '@/components/checkout/list/CheckoutFilters';
import CheckoutCardEnhanced from '@/components/checkout/list/CheckoutCardEnhanced';
import CheckoutsBulkBar from '@/components/checkout/list/CheckoutsBulkBar';

const defaultFilters = {
  search: '',
  status: 'all',
  method: 'all',
  type: 'all',
  perf: 'all',
  sort: 'recent',
};

export default function Checkouts() {
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: checkouts = [], isLoading } = useQuery({
    queryKey: ['checkouts'],
    queryFn: () => base44.entities.Checkout.list('-created_date', 50),
  });

  const filtered = useMemo(() => {
    let result = [...checkouts];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s)
      );
    }
    if (filters.status !== 'all') result = result.filter(c => c.status === filters.status);
    if (filters.type !== 'all') result = result.filter(c => c.type === filters.type);
    return result;
  }, [checkouts, filters]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus Checkouts"
        subtitle="Gerencie todos os seus checkouts personalizados"
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }, { label: 'Meus Checkouts' }]}
        actions={
          <Link to={createPageUrl('CheckoutBuilder')}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Novo Checkout
            </Button>
          </Link>
        }
      />

      {/* KPI bar executivo */}
      <CheckoutsKpiBar checkouts={checkouts} />

      {/* Bulk actions sticky */}
      <CheckoutsBulkBar count={selectedIds.length} onClear={() => setSelectedIds([])} />

      {/* Filtros enriquecidos */}
      <CheckoutFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Lista */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-72"><CardContent /></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum checkout encontrado</h3>
            <p className="text-slate-500 mb-4">Crie seu primeiro checkout ou comece com um template</p>
            <div className="flex gap-2 justify-center">
              <Link to={createPageUrl('CheckoutBuilder')}>
                <Button><Plus className="w-4 h-4 mr-2" /> Criar do zero</Button>
              </Link>
              <Link to={createPageUrl('CheckoutTemplates')}>
                <Button variant="outline">Começar com template</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(checkout => (
            <CheckoutCardEnhanced
              key={checkout.id}
              checkout={checkout}
              selected={selectedIds.includes(checkout.id)}
              onToggleSelect={toggleSelect}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Conversão</th>
                  <th className="text-right p-3">Vendas</th>
                  <th className="text-right p-3">Ticket médio</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">{c.status}</span></td>
                    <td className="p-3 text-right font-bold text-emerald-600">{(Math.random() * 18 + 4).toFixed(1)}%</td>
                    <td className="p-3 text-right">{c.total_sales || 0}</td>
                    <td className="p-3 text-right">R$ {(Math.random() * 400 + 80).toFixed(0)}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}