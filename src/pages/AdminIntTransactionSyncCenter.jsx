import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Play, ArrowLeft, Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import AcquirerHealthGrid from '@/components/mentor/transactions/sync/AcquirerHealthGrid';
import SyncJobsTable from '@/components/mentor/transactions/sync/SyncJobsTable';
import { SYNC_JOBS } from '@/components/mentor/mocks/transactionMentorMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntTransactionSyncCenter() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = SYNC_JOBS.filter((j) => statusFilter === 'all' || j.status === statusFilter);

  const completed = SYNC_JOBS.filter((j) => j.status === 'completed').length;
  const running = SYNC_JOBS.filter((j) => j.status === 'running').length;
  const failed = SYNC_JOBS.filter((j) => j.status === 'failed').length;
  const totalDivergences = SYNC_JOBS.reduce((acc, j) => acc + (j.divergences || 0), 0);

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntTransactionsList')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para transações
        </Link>
      </Button>

      <PageHeader
        title="Sync Center"
        subtitle="Sincronização ativa com adquirentes · validação on-demand vs aguardar arquivo · troubleshoot dirigido por transação/conjunto/período"
        icon={RefreshCw}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Transações', page: 'AdminIntTransactionsList' },
          { label: 'Sync Center', page: 'AdminIntTransactionSyncCenter' },
        ]}
        actions={
          <Button onClick={() => toast.info('Wizard de novo sync · escolha escopo (transação/conjunto/período) · OTP obrigatório')}>
            <Play className="w-4 h-4 mr-2" />Novo sync ativo
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Jobs concluídos</p><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div><p className="text-2xl font-bold text-emerald-600 mt-0.5">{completed}</p></CardContent></Card>
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Em execução</p><Clock className="w-4 h-4 text-blue-600" /></div><p className="text-2xl font-bold text-blue-600 mt-0.5">{running}</p></CardContent></Card>
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Falhas</p><AlertTriangle className="w-4 h-4 text-red-600" /></div><p className="text-2xl font-bold text-red-600 mt-0.5">{failed}</p></CardContent></Card>
        <Card><CardContent className="p-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase text-slate-500 font-bold">Divergências encontradas</p><Activity className="w-4 h-4 text-amber-600" /></div><p className="text-2xl font-bold text-amber-600 mt-0.5">{totalDivergences}</p></CardContent></Card>
      </div>

      <AcquirerHealthGrid />

      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="running">Em execução</SelectItem>
              <SelectItem value="queued">Em fila</SelectItem>
              <SelectItem value="failed">Falhas</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[10px] text-slate-500 ml-auto">{filtered.length} job(s)</span>
        </CardContent>
      </Card>

      <SyncJobsTable jobs={filtered} />
    </div>
  );
}