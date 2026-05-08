import React, { useState, useMemo } from 'react';
import { FileText, FileSpreadsheet, Receipt, ScrollText, ArrowUpFromLine, ShieldAlert, ShoppingBag, Download, Search, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/common/PageHeader';
import QuickFilters from '@/components/common/QuickFilters';
import BulkActionsBar from '@/components/common/BulkActionsBar';
import EmptyStateRich from '@/components/common/EmptyStateRich';
import ExportButton from '@/components/common/ExportButton';
import { documents } from '@/components/mockData/futureAdminMocks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

const TYPE_CONFIG = {
  receipt: { Icon: Receipt, label: 'Recibo' },
  statement: { Icon: ScrollText, label: 'Extrato' },
  withdrawal: { Icon: ArrowUpFromLine, label: 'Saque' },
  invoice: { Icon: FileSpreadsheet, label: 'Fatura' },
  evidence: { Icon: ShieldAlert, label: 'Evidência' },
  contract: { Icon: FileText, label: 'Contrato' },
  report: { Icon: FileText, label: 'Relatório' },
  tax: { Icon: ShoppingBag, label: 'Fiscal' },
};

export default function Documents() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [type, setType] = useState(null);
  const [selected, setSelected] = useState([]);

  const counts = useMemo(() => {
    const c = {};
    documents.forEach((d) => (c[d.type] = (c[d.type] || 0) + 1));
    return c;
  }, []);

  const visible = useMemo(() => documents.filter((d) => {
    if (type && d.type !== type) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, type]);

  const toggleAll = () => setSelected(selected.length === visible.length ? [] : visible.map((d) => d.id));

  const filterOptions = Object.entries(TYPE_CONFIG).map(([k, v]) => ({
    value: k, label: v.label + 's', icon: v.Icon, count: counts[k] || 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Centro de documentos" subtitle="Todos os PDFs gerados pela plataforma" icon={FolderOpen}
        actions={<ExportButton filename="documents-list" label="Exportar lista" />} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <QuickFilters options={filterOptions} value={type} onChange={setType} />

      {visible.length === 0 ? (
        <EmptyStateRich icon={FolderOpen} title="Nenhum documento encontrado"
          description="Ajuste os filtros ou tente outra busca."
          primaryAction={{ label: 'Limpar filtros', onClick: () => { setSearch(''); setType(null); } }} />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={selected.length === visible.length && visible.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((d) => {
                const cfg = TYPE_CONFIG[d.type];
                const Icon = cfg.Icon;
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Checkbox checked={selected.includes(d.id)}
                        onCheckedChange={() => setSelected((s) => s.includes(d.id) ? s.filter(x => x !== d.id) : [...s, d.id])} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#2bc196]/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#2bc196]" />
                        </div>
                        <span className="font-medium">{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-slate-500">{d.module}</span></TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{cfg.label}</Badge></TableCell>
                    <TableCell className="text-sm text-slate-500">{format(d.date, "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="text-sm text-slate-500">{d.size} <Badge variant="secondary" className="ml-1 text-[10px]">{d.format}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Download iniciado', description: d.name })}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <BulkActionsBar count={selected.length}
        actions={[{ label: 'Baixar (ZIP)', icon: Download, onClick: () => toast({ title: 'Gerando ZIP', description: `${selected.length} arquivos` }) }]}
        onClear={() => setSelected([])} />
    </div>
  );
}