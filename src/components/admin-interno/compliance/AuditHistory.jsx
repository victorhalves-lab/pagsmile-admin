import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search, Filter, Download, Eye, FileText, User, Sparkles, 
  CheckCircle2, XCircle, Clock, AlertTriangle, MessageSquare,
  ChevronLeft, ChevronRight, Calendar, Building2
} from 'lucide-react';

// Mock audit logs
const mockAuditLogs = [
  {
    id: 'LOG001',
    action: 'helena_approved',
    actor: 'HELENA_AI',
    actor_type: 'helena_ai',
    submission_id: 'SUB002',
    business_name: 'Comércio Digital ME',
    details: { score: 85, recommendation: 'Aprovação automática - todos os critérios atendidos' },
    created_date: '2024-01-28T14:30:05'
  },
  {
    id: 'LOG002',
    action: 'helena_manual_review',
    actor: 'HELENA_AI',
    actor_type: 'helena_ai',
    submission_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    details: { score: 45, reason: 'Score abaixo do threshold (45 < 60)', red_flags: ['Endereço inconsistente', 'Sócio com restrição'] },
    created_date: '2024-01-28T14:30:02'
  },
  {
    id: 'LOG003',
    action: 'assigned_to_analyst',
    actor: 'sistema@pagsmile.com',
    actor_type: 'system',
    submission_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    details: { analyst: 'maria.silva@pagsmile.com' },
    created_date: '2024-01-28T14:35:00'
  },
  {
    id: 'LOG004',
    action: 'document_approved',
    actor: 'maria.silva@pagsmile.com',
    actor_type: 'user',
    submission_id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    details: { document: 'Contrato Social', status: 'approved' },
    created_date: '2024-01-28T15:30:00'
  },
  {
    id: 'LOG005',
    action: 'helena_rejected',
    actor: 'HELENA_AI',
    actor_type: 'helena_ai',
    submission_id: 'SUB003',
    business_name: 'Loja Virtual Express',
    details: { score: 22, reason: 'Múltiplas inconsistências críticas detectadas', red_flags: ['CNPJ irregular', 'Documento adulterado'] },
    created_date: '2024-01-26T16:45:02'
  },
  {
    id: 'LOG006',
    action: 'documents_requested',
    actor: 'ana.costa@pagsmile.com',
    actor_type: 'user',
    submission_id: 'SUB005',
    business_name: 'E-commerce Plus LTDA',
    details: { documents: ['Comprovante de endereço atualizado', 'Declaração de faturamento'] },
    created_date: '2024-01-24T14:20:00'
  },
  {
    id: 'LOG007',
    action: 'note_added',
    actor: 'carlos.oliveira@pagsmile.com',
    actor_type: 'user',
    submission_id: 'SUB004',
    business_name: 'Startup Inovação SA',
    details: { note: 'Validados extratos bancários. Faturamento compatível com declarado.' },
    created_date: '2024-01-25T14:25:00'
  },
  {
    id: 'LOG008',
    action: 'analyst_approved',
    actor: 'carlos.oliveira@pagsmile.com',
    actor_type: 'user',
    submission_id: 'SUB004',
    business_name: 'Startup Inovação SA',
    details: { decision: 'approved', notes: 'Aprovado após validação de extratos bancários' },
    created_date: '2024-01-25T14:30:00'
  },
  {
    id: 'LOG009',
    action: 'notification_sent',
    actor: 'sistema@pagsmile.com',
    actor_type: 'system',
    submission_id: 'SUB004',
    business_name: 'Startup Inovação SA',
    details: { type: 'email', template: 'approval_notification', recipient: 'contato@startup.com' },
    created_date: '2024-01-25T14:30:05'
  },
  {
    id: 'LOG010',
    action: 'feedback_provided',
    actor: 'maria.silva@pagsmile.com',
    actor_type: 'user',
    submission_id: 'SUB002',
    business_name: 'Comércio Digital ME',
    details: { feedback_type: 'correct_decision', comment: 'Helena acertou na aprovação automática' },
    created_date: '2024-01-28T16:00:00'
  },
];

const actionLabels = {
  submission_created: { label: 'Submissão Criada', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  helena_analysis_started: { label: 'Análise Helena Iniciada', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
  helena_analysis_completed: { label: 'Análise Helena Concluída', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
  helena_approved: { label: 'Aprovado pela Helena', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  helena_rejected: { label: 'Rejeitado pela Helena', icon: XCircle, color: 'bg-red-100 text-red-700' },
  helena_manual_review: { label: 'Encaminhado para Manual', icon: AlertTriangle, color: 'bg-amber-100 text-amber-700' },
  assigned_to_analyst: { label: 'Atribuído a Analista', icon: User, color: 'bg-indigo-100 text-indigo-700' },
  analyst_approved: { label: 'Aprovado pelo Analista', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  analyst_rejected: { label: 'Rejeitado pelo Analista', icon: XCircle, color: 'bg-red-100 text-red-700' },
  documents_requested: { label: 'Documentos Solicitados', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  document_uploaded: { label: 'Documento Enviado', icon: FileText, color: 'bg-slate-100 text-slate-700' },
  document_approved: { label: 'Documento Aprovado', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  document_rejected: { label: 'Documento Rejeitado', icon: XCircle, color: 'bg-red-100 text-red-700' },
  note_added: { label: 'Nota Adicionada', icon: MessageSquare, color: 'bg-slate-100 text-slate-700' },
  notification_sent: { label: 'Notificação Enviada', icon: MessageSquare, color: 'bg-cyan-100 text-cyan-700' },
  feedback_provided: { label: 'Feedback da Helena', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
  status_changed: { label: 'Status Alterado', icon: Clock, color: 'bg-slate-100 text-slate-700' },
};

export default function AuditHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterActor, setFilterActor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getActionBadge = (action) => {
    const config = actionLabels[action] || { label: action, icon: Clock, color: 'bg-slate-100 text-slate-700' };
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getActorBadge = (actor, actorType) => {
    if (actorType === 'helena_ai') {
      return (
        <Badge className="bg-purple-100 text-purple-700 border-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Helena AI
        </Badge>
      );
    }
    if (actorType === 'system') {
      return (
        <Badge className="bg-slate-100 text-slate-700 border-0">Sistema</Badge>
      );
    }
    return <span className="text-sm">{actor.split('@')[0]}</span>;
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.submission_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesActor = filterActor === 'all' || log.actor_type === filterActor;
    return matchesSearch && matchesAction && matchesActor;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
              <p className="text-xs text-slate-500">Total de Registros</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {mockAuditLogs.filter(l => l.actor_type === 'helena_ai').length}
              </p>
              <p className="text-xs text-slate-500">Ações Helena</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {mockAuditLogs.filter(l => l.actor_type === 'user').length}
              </p>
              <p className="text-xs text-slate-500">Ações Usuários</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-600">
                {mockAuditLogs.filter(l => l.actor_type === 'system').length}
              </p>
              <p className="text-xs text-slate-500">Ações Sistema</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por empresa ou ID da submissão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Tipo de ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="helena_approved">Aprovado Helena</SelectItem>
                <SelectItem value="helena_rejected">Rejeitado Helena</SelectItem>
                <SelectItem value="helena_manual_review">Encaminhado Manual</SelectItem>
                <SelectItem value="analyst_approved">Aprovado Analista</SelectItem>
                <SelectItem value="analyst_rejected">Rejeitado Analista</SelectItem>
                <SelectItem value="documents_requested">Docs Solicitados</SelectItem>
                <SelectItem value="document_approved">Doc Aprovado</SelectItem>
                <SelectItem value="notification_sent">Notificação Enviada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterActor} onValueChange={setFilterActor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os atores</SelectItem>
                <SelectItem value="helena_ai">Helena AI</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Período
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log de Auditoria</CardTitle>
          <CardDescription>Histórico completo de todas as ações no módulo de compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800">
                  <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium">Ação</th>
                  <th className="text-left py-3 px-4 font-medium">Ator</th>
                  <th className="text-left py-3 px-4 font-medium">Submissão</th>
                  <th className="text-left py-3 px-4 font-medium">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 text-xs font-mono">{formatDate(log.created_date)}</td>
                    <td className="py-4 px-4">{getActionBadge(log.action)}</td>
                    <td className="py-4 px-4">{getActorBadge(log.actor, log.actor_type)}</td>
                    <td className="py-4 px-4 font-mono text-xs">{log.submission_id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{log.business_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        {log.details.score !== undefined && (
                          <Badge variant="outline" className="mr-1 text-xs">Score: {log.details.score}</Badge>
                        )}
                        {log.details.reason && (
                          <span className="text-xs text-slate-500 line-clamp-1">{log.details.reason}</span>
                        )}
                        {log.details.document && (
                          <span className="text-xs text-slate-500">{log.details.document}</span>
                        )}
                        {log.details.note && (
                          <span className="text-xs text-slate-500 line-clamp-1">{log.details.note}</span>
                        )}
                        {log.details.analyst && (
                          <span className="text-xs text-slate-500">Para: {log.details.analyst.split('@')[0]}</span>
                        )}
                        {log.details.template && (
                          <span className="text-xs text-slate-500">{log.details.template}</span>
                        )}
                        {log.details.red_flags && log.details.red_flags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {log.details.red_flags.slice(0, 2).map((flag, idx) => (
                              <Badge key={idx} className="bg-red-100 text-red-700 border-0 text-[10px]">{flag}</Badge>
                            ))}
                            {log.details.red_flags.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">+{log.details.red_flags.length - 2}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-slate-500">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredLogs.length)} de {filteredLogs.length} registros
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">
                Página {currentPage} de {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}