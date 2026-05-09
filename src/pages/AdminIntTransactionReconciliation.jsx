import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Upload, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import ReconciliationKPIBar from '@/components/mentor/transactions/reconciliation/ReconciliationKPIBar';
import ReconciliationFilesTable from '@/components/mentor/transactions/reconciliation/ReconciliationFilesTable';
import DivergencesTable from '@/components/mentor/transactions/reconciliation/DivergencesTable';
import { RECONCILIATION_FILES, DIVERGENCES, ACQUIRERS } from '@/components/mentor/mocks/transactionMentorMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntTransactionReconciliation() {
  const [acquirerFilter, setAcquirerFilter] = useState('all');
  const [tab, setTab] = useState('files');

  const filteredFiles = RECONCILIATION_FILES.filter((f) => acquirerFilter === 'all' || f.acquirer_id === acquirerFilter);
  const filteredDivergences = DIVERGENCES.filter((d) => acquirerFilter === 'all' || d.acquirer === acquirerFilter);

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntTransactionsList')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para transações
        </Link>
      </Button>

      <PageHeader
        title="Reconciliação Adquirente"
        subtitle="Conciliação cruzada PagSmile vs adquirente · arquivos CNAB processados · divergências detectadas · transações fantasmas"
        icon={FileCheck}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Transações', page: 'AdminIntTransactionsList' },
          { label: 'Reconciliação', page: 'AdminIntTransactionReconciliation' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info('Reprocessamento de todos arquivos do dia agendado')}>
              <RefreshCw className="w-4 h-4 mr-2" />Reprocessar dia
            </Button>
            <Button onClick={() => toast.info('Wizard de upload manual · valida formato CNAB antes de processar')}>
              <Upload className="w-4 h-4 mr-2" />Upload manual
            </Button>
          </div>
        }
      />

      <ReconciliationKPIBar files={RECONCILIATION_FILES} divergences={DIVERGENCES} />

      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Filtrar por adquirente:</span>
          <Select value={acquirerFilter} onValueChange={setAcquirerFilter}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos adquirentes</SelectItem>
              {ACQUIRERS.map((a) => <SelectItem key={a.id} value={a.id}>{a.logo} {a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-[10px] text-slate-500 ml-auto">
            {filteredFiles.length} arquivo(s) · {filteredDivergences.length} divergência(s)
          </span>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="files" className="text-xs">Arquivos processados ({filteredFiles.length})</TabsTrigger>
          <TabsTrigger value="divergences" className="text-xs">Divergências ({filteredDivergences.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="mt-3">
          <ReconciliationFilesTable files={filteredFiles} onViewDivergences={() => setTab('divergences')} />
        </TabsContent>
        <TabsContent value="divergences" className="mt-3">
          <DivergencesTable divergences={filteredDivergences} />
        </TabsContent>
      </Tabs>
    </div>
  );
}