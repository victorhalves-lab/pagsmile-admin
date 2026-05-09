import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Search, Download, Filter, GitCompare } from 'lucide-react';
import {
  mockReconciliationKPIs,
  mockReconciliationFiles,
  mockDivergences,
} from '@/components/mentor/mocks/splitReconciliationMock';
import MentorReconciliationKPIBar from '@/components/mentor/split/MentorReconciliationKPIBar';
import MentorReconciliationFilesTable from '@/components/mentor/split/MentorReconciliationFilesTable';
import MentorReconciliationDivergenceCard from '@/components/mentor/split/MentorReconciliationDivergenceCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SEVERITY_FILTERS = [
  { key: 'all', label: 'Todas', color: 'bg-slate-100 text-slate-700' },
  { key: 'high', label: 'Alta', color: 'bg-red-100 text-red-700' },
  { key: 'medium', label: 'Média', color: 'bg-amber-100 text-amber-700' },
  { key: 'low', label: 'Baixa', color: 'bg-blue-100 text-blue-700' },
];

export default function SplitReconciliationCenter() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockDivergences.filter((d) => {
      if (severityFilter !== 'all' && d.severity !== severityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          d.transaction_id.toLowerCase().includes(q) ||
          d.merchant.toLowerCase().includes(q) ||
          d.split_id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [severityFilter, search]);

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Reconciliação · Splits"
        subtitle="Conciliação automática Mentor entre splits configurados e splits executados"
        icon={GitCompare}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Reconciliação' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <Sparkles className="w-3 h-3" /> Mentor · Wave H.9
            </Badge>
            <Button size="sm" variant="outline" onClick={() => toast.success('Relatório de divergências exportado')}>
              <Download className="w-3.5 h-3.5 mr-1" /> Exportar divergências
            </Button>
          </div>
        }
      />

      <MentorReconciliationKPIBar kpis={mockReconciliationKPIs} />

      <Tabs defaultValue="divergences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="divergences">Divergências ({mockDivergences.length})</TabsTrigger>
          <TabsTrigger value="files">Arquivos recebidos</TabsTrigger>
        </TabsList>

        <TabsContent value="divergences" className="space-y-3">
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] uppercase font-bold text-slate-500">Severidade:</span>
                {SEVERITY_FILTERS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSeverityFilter(s.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-semibold transition border',
                      severityFilter === s.key ? `${s.color} border-current shadow-sm` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Buscar por txn, merchant ou split…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500">{filtered.length} divergência(s)</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((d) => (
              <MentorReconciliationDivergenceCard
                key={d.divergence_id}
                divergence={d}
                onAccept={(div) => toast.success(`${div.divergence_id} aceito como tolerância`)}
                onReverse={(div) => toast.success(`Estorno iniciado para ${div.divergence_id}`)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="files">
          <MentorReconciliationFilesTable files={mockReconciliationFiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}