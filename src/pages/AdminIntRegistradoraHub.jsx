import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, ArrowLeft, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { registradorasStatus } from '@/components/mentor/mocks/spotAnticipationMock';
import { toast } from 'sonner';

const statusBadge = (status) => {
  if (status === 'operational') return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Operacional</Badge>;
  if (status === 'degraded') return <Badge className="bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3 mr-1" /> Degradada</Badge>;
  return <Badge className="bg-red-100 text-red-700">Offline</Badge>;
};

export default function AdminIntRegistradoraHub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registradoras de Recebíveis"
        subtitle="Integração com registradoras homologadas pelo BCB (Resolução 4.734/2019)"
        breadcrumbs={[
          { label: 'Financeiro' },
          { label: 'Antecipações', page: 'AdminIntAnticipations' },
          { label: 'Registradoras' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <Sparkles className="w-3 h-3" /> Mentor
            </Badge>
            <Link to={createPageUrl('AdminIntAnticipations')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="border-l-4 border-l-violet-500">
        <CardContent className="p-4 flex items-start gap-3">
          <Database className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
          <div className="text-sm">
            <p className="font-medium mb-1">Registro obrigatório de recebíveis antecipados</p>
            <p className="text-slate-600">
              Toda antecipação criada na PagSmile é automaticamente registrada em uma registradora homologada (CIP, B3, TAG ou CERC) para garantir publicidade
              regulatória e evitar duplicidade. Em caso de falha de registro, antecipação fica em status pendente até resolução.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cards das registradoras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {registradorasStatus.map(reg => (
          <Card key={reg.code} className={reg.status === 'degraded' ? 'border-amber-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{reg.name}</CardTitle>
                {statusBadge(reg.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-slate-500">Hoje</p>
                  <p className="text-xl font-bold text-green-600">{reg.registered_today}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pendentes</p>
                  <p className={`text-xl font-bold ${reg.pending > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{reg.pending}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Falhas</p>
                  <p className={`text-xl font-bold ${reg.failed_today > 0 ? 'text-red-600' : 'text-slate-400'}`}>{reg.failed_today}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t">
                <span>Última sync: {new Date(reg.last_sync).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`Sincronização ${reg.name} forçada`)}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Sync
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Activity className="w-3 h-3 mr-1" /> Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de antecipações com problema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Antecipações com Registro Pendente ou Falhado</CardTitle>
          <CardDescription>Demanda tratativa imediata — antecipação não pode prosseguir sem registro válido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="text-left p-3">ID Antecipação</th>
                  <th className="text-left p-3">Lojista</th>
                  <th className="text-right p-3">Valor</th>
                  <th className="text-left p-3">Registradora</th>
                  <th className="text-left p-3">Problema</th>
                  <th className="text-center p-3">Tentativas</th>
                  <th className="text-right p-3">Próxima retentativa</th>
                  <th className="text-right p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'SPOT-2026-001231', merchant: 'Loja X', value: 'R$ 45.000', registry: 'TAG', issue: 'Timeout na comunicação', attempts: 3, next: '5 min' },
                  { id: 'SPOT-2026-001229', merchant: 'Mega Lojas', value: 'R$ 120.000', registry: 'TAG', issue: 'Resposta inválida', attempts: 2, next: '15 min' },
                  { id: 'SPOT-2026-001227', merchant: 'PetShop+', value: 'R$ 8.500', registry: 'CIP', issue: 'Pendente — fila normal', attempts: 0, next: '2 min' },
                ].map((item, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{item.id}</td>
                    <td className="p-3">{item.merchant}</td>
                    <td className="p-3 text-right">{item.value}</td>
                    <td className="p-3"><Badge variant="outline">{item.registry}</Badge></td>
                    <td className="p-3 text-xs">{item.issue}</td>
                    <td className="p-3 text-center">{item.attempts}/5</td>
                    <td className="p-3 text-right text-xs">{item.next}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.success('Retentativa forçada')}>
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conciliação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conciliação Sistema PagSmile vs Registradoras</CardTitle>
          <CardDescription>Verificação cruzada para garantir consistência regulatória</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">Antecipações no PagSmile</p>
              <p className="text-2xl font-bold">1.234</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">Registros nas Registradoras</p>
              <p className="text-2xl font-bold">1.226</p>
            </div>
            <div className="border rounded-lg p-3 text-center bg-amber-50">
              <p className="text-xs text-slate-500">Divergências</p>
              <p className="text-2xl font-bold text-amber-600">8</p>
            </div>
            <div className="border rounded-lg p-3 text-center bg-green-50">
              <p className="text-xs text-slate-500">Taxa de Conformidade</p>
              <p className="text-2xl font-bold text-green-600">99,4%</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Investigar Divergências</Button>
            <Button size="sm">Forçar Reconciliação</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}