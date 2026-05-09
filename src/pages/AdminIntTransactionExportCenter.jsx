import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus, Sparkles, ArrowLeft, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import ExportJobsTable from '@/components/mentor/transactions/export/ExportJobsTable';
import { EXPORT_JOBS } from '@/components/mentor/mocks/transactionMentorMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntTransactionExportCenter() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');

  const filtered = EXPORT_JOBS.filter((j) => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (formatFilter !== 'all' && j.format !== formatFilter) return false;
    return true;
  });

  const ready = EXPORT_JOBS.filter((j) => j.status === 'ready').length;
  const processing = EXPORT_JOBS.filter((j) => j.status === 'processing').length;
  const totalRows = EXPORT_JOBS.reduce((acc, j) => acc + j.total_rows, 0);

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntTransactionsList')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para transações
        </Link>
      </Button>

      <PageHeader
        title="Export Center"
        subtitle="Exportações assíncronas de transações · processamento em background · trilha auditável completa · mascaramento PCI/LGPD configurável"
        icon={Download}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Transações', page: 'AdminIntTransactionsList' },
          { label: 'Export Center', page: 'AdminIntTransactionExportCenter' },
        ]}
        actions={
          <Button onClick={() => toast.info('Wizard de exportação · filtros + formato + mascaramento + destino + OTP + justificativa')}>
            <Plus className="w-4 h-4 mr-2" />Nova exportação
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Prontas para download</p><FileText className="w-4 h-4 text-emerald-600" /></div><p className="text-2xl font-bold text-emerald-600 mt-0.5">{ready}</p></CardContent></Card>
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Processando agora</p><Download className="w-4 h-4 text-blue-600" /></div><p className="text-2xl font-bold text-blue-600 mt-0.5">{processing}</p></CardContent></Card>
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Linhas totais</p><Sparkles className="w-4 h-4 text-violet-600" /></div><p className="text-2xl font-bold text-violet-600 mt-0.5">{(totalRows / 1_000_000).toFixed(1)}M</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200"><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-amber-700 font-bold">Compliance alertado</p><Shield className="w-4 h-4 text-amber-700" /></div><p className="text-2xl font-bold text-amber-700 mt-0.5">2</p><p className="text-[10px] text-amber-600">volumes &gt; 1M ou alto mascaramento</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Filtros:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ready">Pronto</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="queued">Em fila</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos formatos</SelectItem>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="XML">XML</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[10px] text-slate-500 ml-auto">{filtered.length} job(s)</span>
        </CardContent>
      </Card>

      <ExportJobsTable jobs={filtered} />
    </div>
  );
}