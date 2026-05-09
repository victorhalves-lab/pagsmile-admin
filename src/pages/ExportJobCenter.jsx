import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, CheckCircle2, Clock, XCircle, AlertCircle, Mail, HardDrive, Server, ShieldAlert, Plus } from 'lucide-react';
import { mockExportJobs, mockExportKPIs } from '@/components/mentor/mocks/exportJobsMock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmtNum = (n) => new Intl.NumberFormat('pt-BR').format(n);

const STATUS_META = {
  processing: { label: 'Processando', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Concluído', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Falhou', icon: XCircle, color: 'bg-red-100 text-red-700' },
  queued: { label: 'Em fila', icon: Clock, color: 'bg-amber-100 text-amber-700' },
};

const DESTINATION_ICONS = {
  download: { icon: HardDrive, label: 'Download' },
  email: { icon: Mail, label: 'E-mail' },
  sftp: { icon: Server, label: 'SFTP' },
  s3: { icon: Server, label: 'S3' },
};

export default function ExportJobCenter() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockExportJobs.filter((j) => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false;
      if (domainFilter !== 'all' && j.domain !== domainFilter) return false;
      return true;
    });
  }, [statusFilter, domainFilter]);

  const domains = [...new Set(mockExportJobs.map(j => j.domain))];

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Export Job Center"
        subtitle="Centro de exportações assíncronas · trilha auditável + retenção + Compliance"
        icon={Download}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Exportações' },
        ]}
        actions={
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-3.5 h-3.5 mr-1" /> Nova exportação
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Jobs 24h</p><p className="text-2xl font-black">{mockExportKPIs.jobs_24h}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Em processamento</p><p className="text-2xl font-black text-blue-700">{mockExportKPIs.jobs_processing}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Concluídos</p><p className="text-2xl font-black text-emerald-700">{mockExportKPIs.jobs_completed}</p></CardContent></Card>
        <Card className={mockExportKPIs.jobs_failed > 0 ? 'border-red-200' : ''}><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Falharam</p><p className={cn('text-2xl font-black', mockExportKPIs.jobs_failed > 0 ? 'text-red-700' : 'text-slate-700')}>{mockExportKPIs.jobs_failed}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Linhas processadas</p><p className="text-base font-black">{fmtNum(mockExportKPIs.total_volume_processed)}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">T. médio</p><p className="text-base font-black">{mockExportKPIs.avg_processing_time_seconds}s</p></CardContent></Card>
        <Card className="border-amber-200"><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Sensíveis 30d</p><p className="text-2xl font-black text-amber-700 flex items-center gap-1"><ShieldAlert className="w-4 h-4" />{mockExportKPIs.sensitive_exports_30d}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-3">
        <TabsList>
          <TabsTrigger value="jobs">Jobs ({filtered.length})</TabsTrigger>
          <TabsTrigger value="settings">Política de retenção & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-3">
          {/* Filtros */}
          <Card>
            <CardContent className="p-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase font-bold text-slate-500">Status:</span>
              {[
                { k: 'all', l: 'Todos' },
                { k: 'processing', l: 'Processando' },
                { k: 'completed', l: 'Concluídos' },
                { k: 'failed', l: 'Falharam' },
              ].map((f) => (
                <button key={f.k} onClick={() => setStatusFilter(f.k)}
                  className={cn('px-2 py-1 rounded text-[11px] font-semibold border',
                    statusFilter === f.k ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>{f.l}</button>
              ))}
              <div className="w-px h-5 bg-slate-200 mx-2" />
              <span className="text-[11px] uppercase font-bold text-slate-500">Domínio:</span>
              <button onClick={() => setDomainFilter('all')} className={cn('px-2 py-1 rounded text-[11px] font-semibold border', domainFilter === 'all' ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>Todos</button>
              {domains.map(d => (
                <button key={d} onClick={() => setDomainFilter(d)} className={cn('px-2 py-1 rounded text-[11px] font-semibold border', domainFilter === d ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200')}>{d}</button>
              ))}
            </CardContent>
          </Card>

          {/* Jobs list */}
          <div className="space-y-2">
            {filtered.map((j) => {
              const meta = STATUS_META[j.status];
              const StatusIcon = meta.icon;
              const dest = DESTINATION_ICONS[j.destination];
              const DestIcon = dest.icon;
              return (
                <Card key={j.job_id} className={cn(j.sensitive && 'border-amber-200', j.status === 'failed' && 'border-red-200 bg-red-50/30')}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('gap-1 text-[10px]', meta.color)}>
                          <StatusIcon className={cn('w-2.5 h-2.5', j.status === 'processing' && 'animate-spin')} />
                          {meta.label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{j.domain_label}</Badge>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">{j.format}</Badge>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <DestIcon className="w-2.5 h-2.5" /> {dest.label}
                        </Badge>
                        {j.sensitive && (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px] gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" /> Sensível
                          </Badge>
                        )}
                        <code className="text-[10px] font-mono text-slate-500">{j.job_id}</code>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(j.started_at).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                      <div><p className="text-slate-500">Operador</p><p className="font-semibold">{j.operator}</p></div>
                      <div><p className="text-slate-500">Linhas</p><p className="font-semibold">{fmtNum(j.rows_processed)} / {fmtNum(j.rows_total)}</p></div>
                      <div><p className="text-slate-500">Tamanho</p><p className="font-semibold">{j.file_size_mb ? `${j.file_size_mb} MB` : '—'}</p></div>
                      <div><p className="text-slate-500">Expira em</p><p className="font-semibold">{j.expires_at ? new Date(j.expires_at).toLocaleDateString('pt-BR') : '—'}</p></div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">"{j.justification}"</p>

                    {j.status === 'processing' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Progresso</span>
                          <span className="font-bold">{j.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all" style={{ width: `${j.progress}%` }} />
                        </div>
                      </div>
                    )}

                    {j.status === 'failed' && j.error && (
                      <div className="bg-red-100 border border-red-200 rounded p-2 text-[11px] text-red-800 flex items-start gap-1.5">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {j.error}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1 border-t">
                      {j.status === 'completed' && j.destination === 'download' && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success('Download iniciado')}>
                          <Download className="w-3 h-3 mr-1" /> Baixar
                        </Button>
                      )}
                      {j.status === 'failed' && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success('Job reprocessado')}>
                          Tentar novamente
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Política de retenção</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p>📁 Arquivos com retenção padrão de <strong>30 dias</strong> após geração</p>
              <p>🗑️ Após expiração, arquivos são removidos automaticamente do storage</p>
              <p>🔁 Operador pode reexportar usando os mesmos filtros</p>
              <p>🛡️ Em projetos com requisitos regulatórios específicos, retenção pode ser estendida em arquivamento de longo prazo</p>
            </CardContent>
          </Card>
          <Card className="mt-3">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-600" /> Notificação Compliance</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p>Compliance é notificado automaticamente quando:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Volume acima de 100.000 linhas</li>
                <li>Dados altamente sensíveis envolvidos</li>
                <li>Destino externo a sistemas internos PagSmile</li>
                <li>Padrão anômalo detectado (operador exportando volumes muito acima do normal)</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}