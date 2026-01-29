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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search, Filter, Eye, FileText, Building2, Calendar, Clock, 
  CheckCircle2, XCircle, AlertTriangle, Sparkles, Download,
  ChevronLeft, ChevronRight, MoreHorizontal, Flag, User
} from 'lucide-react';

// Mock data for all submissions
const allSubmissions = [
  {
    id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    document: '12.345.678/0001-90',
    submission_date: '2024-01-28T14:30:00',
    questionnaire_type: 'kyc_full',
    status: 'manual_review',
    helena_score: 45,
    helena_status: 'manual_review',
    helena_recommendation: 'Requer verificação de endereço e validação de sócios',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
A submissão apresenta pontos de atenção que requerem revisão manual antes da aprovação.

### Pontos de Atenção Identificados:
1. **Endereço Comercial**: O CEP informado não corresponde ao município declarado
2. **Sócios**: Um dos sócios possui CPF com restrições no SERASA
3. **Atividade**: MCC declarado (5999) não é compatível com a descrição do negócio

### Documentos Analisados:
- Contrato Social: ✅ Válido
- Comprovante de Endereço: ⚠️ Requer verificação
- RG dos Sócios: ✅ Válidos
- CNPJ: ✅ Ativo na Receita Federal

### Recomendação:
Solicitar comprovante de endereço atualizado e esclarecimentos sobre a atividade exercida.`,
    helena_red_flags: ['Endereço inconsistente', 'Sócio com restrição', 'MCC incompatível'],
    analyst: null,
    decision_date: null,
    questionnaire_data: {
      razao_social: 'Tech Solutions LTDA',
      nome_fantasia: 'TechSol',
      cnpj: '12.345.678/0001-90',
      data_abertura: '2020-05-15',
      capital_social: 100000,
      faturamento_mensal: 250000,
      tipo_empresa: 'LTDA',
      atividade_principal: 'Desenvolvimento de software',
      mcc: '5999',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      socios: [
        { nome: 'João Silva', cpf: '123.456.789-00', participacao: 60 },
        { nome: 'Maria Santos', cpf: '987.654.321-00', participacao: 40 }
      ]
    },
    documents: [
      { name: 'Contrato Social', status: 'approved', url: '#', uploaded_at: '2024-01-28T14:25:00' },
      { name: 'Comprovante Endereço', status: 'pending', url: '#', uploaded_at: '2024-01-28T14:26:00' },
      { name: 'RG Sócio 1', status: 'approved', url: '#', uploaded_at: '2024-01-28T14:27:00' },
      { name: 'RG Sócio 2', status: 'approved', url: '#', uploaded_at: '2024-01-28T14:28:00' },
    ]
  },
  {
    id: 'SUB002',
    business_name: 'Comércio Digital ME',
    document: '98.765.432/0001-10',
    submission_date: '2024-01-27T10:15:00',
    questionnaire_type: 'kyc_pix',
    status: 'approved',
    helena_score: 85,
    helena_status: 'approved',
    helena_recommendation: 'Aprovação automática - todos os critérios atendidos',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Submissão aprovada automaticamente. Todos os critérios de compliance foram atendidos satisfatoriamente.

### Validações Realizadas:
1. ✅ CNPJ ativo na Receita Federal
2. ✅ Endereço validado
3. ✅ Sócios sem restrições
4. ✅ Documentação completa e válida
5. ✅ Atividade compatível com MCC

### Score Detalhado:
- Cadastral: 90/100
- Documental: 85/100
- Financeiro: 80/100

### Decisão: APROVADO AUTOMATICAMENTE`,
    helena_red_flags: [],
    analyst: null,
    decision_date: '2024-01-27T10:15:03',
    questionnaire_data: {
      razao_social: 'Comércio Digital ME',
      cnpj: '98.765.432/0001-10',
    },
    documents: [
      { name: 'Contrato Social', status: 'approved', url: '#', uploaded_at: '2024-01-27T10:10:00' },
    ]
  },
  {
    id: 'SUB003',
    business_name: 'Loja Virtual Express',
    document: '11.222.333/0001-44',
    submission_date: '2024-01-26T16:45:00',
    questionnaire_type: 'kyc_full',
    status: 'rejected',
    helena_score: 22,
    helena_status: 'rejected',
    helena_recommendation: 'Rejeição automática - múltiplas inconsistências críticas',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Submissão REJEITADA automaticamente devido a múltiplas inconsistências críticas identificadas.

### Motivos da Rejeição:
1. ❌ CNPJ com situação cadastral irregular na Receita Federal
2. ❌ Sócio principal identificado em listas restritivas
3. ❌ Documentos apresentados com sinais de adulteração
4. ❌ Endereço coincide com empresa anteriormente bloqueada por fraude

### Score Detalhado:
- Cadastral: 15/100
- Documental: 20/100
- Risco: 95/100 (CRÍTICO)

### Decisão: REJEITADO AUTOMATICAMENTE
### Ação Recomendada: Bloqueio preventivo`,
    helena_red_flags: ['CNPJ irregular', 'Lista restritiva', 'Documento adulterado', 'Endereço suspeito'],
    analyst: null,
    decision_date: '2024-01-26T16:45:02',
    questionnaire_data: {
      razao_social: 'Loja Virtual Express',
      cnpj: '11.222.333/0001-44',
    },
    documents: [
      { name: 'Contrato Social', status: 'rejected', url: '#', uploaded_at: '2024-01-26T16:40:00' },
    ]
  },
  {
    id: 'SUB004',
    business_name: 'Startup Inovação SA',
    document: '55.666.777/0001-88',
    submission_date: '2024-01-25T09:00:00',
    questionnaire_type: 'kyc_full',
    status: 'approved',
    helena_score: 72,
    helena_status: 'manual_review',
    helena_recommendation: 'Aprovado após análise manual',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Submissão encaminhada para análise manual devido ao score intermediário. Após revisão humana, foi APROVADA.

### Pontos de Atenção Iniciais:
1. ⚠️ Empresa com menos de 1 ano de operação
2. ⚠️ Faturamento declarado alto para o porte

### Resolução:
Analista validou extratos bancários que confirmam o faturamento declarado. Aprovação concedida.`,
    helena_red_flags: ['Empresa recente'],
    analyst: 'carlos.oliveira@pagsmile.com',
    decision_date: '2024-01-25T14:30:00',
    questionnaire_data: {
      razao_social: 'Startup Inovação SA',
      cnpj: '55.666.777/0001-88',
    },
    documents: [
      { name: 'Contrato Social', status: 'approved', url: '#', uploaded_at: '2024-01-25T08:55:00' },
      { name: 'Extratos Bancários', status: 'approved', url: '#', uploaded_at: '2024-01-25T12:00:00' },
    ]
  },
  {
    id: 'SUB005',
    business_name: 'E-commerce Plus LTDA',
    document: '33.444.555/0001-66',
    submission_date: '2024-01-24T11:20:00',
    questionnaire_type: 'kyc_pix',
    status: 'documents_requested',
    helena_score: 58,
    helena_status: 'manual_review',
    helena_recommendation: 'Aguardando documentos adicionais',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Análise pendente - documentos adicionais solicitados ao cliente.

### Documentos Pendentes:
1. Comprovante de endereço atualizado (últimos 90 dias)
2. Declaração de faturamento assinada

### Status: AGUARDANDO CLIENTE`,
    helena_red_flags: ['Documentação incompleta'],
    analyst: 'ana.costa@pagsmile.com',
    decision_date: null,
    questionnaire_data: {
      razao_social: 'E-commerce Plus LTDA',
      cnpj: '33.444.555/0001-66',
    },
    documents: [
      { name: 'Contrato Social', status: 'approved', url: '#', uploaded_at: '2024-01-24T11:15:00' },
    ]
  },
];

export default function AllSubmissionsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendente', class: 'bg-slate-100 text-slate-700', icon: Clock },
      ai_analyzing: { label: 'Analisando (IA)', class: 'bg-purple-100 text-purple-700', icon: Sparkles },
      ai_approved: { label: 'Aprovado (IA)', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      ai_rejected: { label: 'Rejeitado (IA)', class: 'bg-red-100 text-red-700', icon: XCircle },
      manual_review: { label: 'Análise Manual', class: 'bg-amber-100 text-amber-700', icon: User },
      approved: { label: 'Aprovado', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      rejected: { label: 'Rejeitado', class: 'bg-red-100 text-red-700', icon: XCircle },
      documents_requested: { label: 'Aguardando Docs', class: 'bg-blue-100 text-blue-700', icon: FileText },
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.class} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-700 border-0">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-amber-100 text-amber-700 border-0">{score}</Badge>;
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-700 border-0">{score}</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-0">{score}</Badge>;
  };

  const filteredSubmissions = allSubmissions.filter(sub => {
    const matchesSearch = sub.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.document.includes(searchTerm) ||
                         sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesType = filterType === 'all' || sub.questionnaire_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{allSubmissions.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {allSubmissions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-xs text-slate-500">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {allSubmissions.filter(s => s.status === 'rejected').length}
              </p>
              <p className="text-xs text-slate-500">Rejeitados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {allSubmissions.filter(s => s.status === 'manual_review').length}
              </p>
              <p className="text-xs text-slate-500">Em Análise</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {allSubmissions.filter(s => s.status === 'documents_requested').length}
              </p>
              <p className="text-xs text-slate-500">Aguardando Docs</p>
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
                placeholder="Buscar por nome, CNPJ ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
                <SelectItem value="manual_review">Em Análise Manual</SelectItem>
                <SelectItem value="documents_requested">Aguardando Docs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de Questionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="kyc_full">KYC Completo</SelectItem>
                <SelectItem value="kyc_pix">KYC PIX</SelectItem>
                <SelectItem value="kyc_card">KYC Cartão</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questionários Respondidos</CardTitle>
          <CardDescription>
            Lista completa de todas as submissões de compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium">CNPJ</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Data Submissão</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Score Helena</th>
                  <th className="text-left py-3 px-4 font-medium">Analista</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 font-mono text-xs">{sub.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{sub.business_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">{sub.document}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {sub.questionnaire_type === 'kyc_full' ? 'KYC Completo' : 
                         sub.questionnaire_type === 'kyc_pix' ? 'KYC PIX' : 'KYC Cartão'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-xs">{formatDate(sub.submission_date)}</td>
                    <td className="py-4 px-4">{getStatusBadge(sub.status)}</td>
                    <td className="py-4 px-4">{getScoreBadge(sub.helena_score)}</td>
                    <td className="py-4 px-4">
                      {sub.analyst ? (
                        <span className="text-xs">{sub.analyst.split('@')[0]}</span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-slate-500">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} de {filteredSubmissions.length} resultados
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

      {/* Detailed View Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {selectedSubmission?.business_name}
              {selectedSubmission && getStatusBadge(selectedSubmission.status)}
            </DialogTitle>
            <DialogDescription>
              ID: {selectedSubmission?.id} | CNPJ: {selectedSubmission?.document}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <Tabs defaultValue="helena" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="helena">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Parecer Helena
                </TabsTrigger>
                <TabsTrigger value="questionnaire">
                  <FileText className="w-4 h-4 mr-2" />
                  Questionário
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="helena" className="mt-4 space-y-4">
                {/* Helena Score */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 border-purple-200">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-500 mb-1">Score de Risco</p>
                        <p className="text-4xl font-bold text-purple-600">{selectedSubmission?.helena_score}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2">
                    <CardContent className="pt-4">
                      <p className="text-sm text-slate-500 mb-2">Red Flags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission?.helena_red_flags.length > 0 ? (
                          selectedSubmission?.helena_red_flags.map((flag, idx) => (
                            <Badge key={idx} className="bg-red-100 text-red-700 border-0">
                              <Flag className="w-3 h-3 mr-1" />
                              {flag}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Nenhum red flag identificado
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Helena Justification */}
                <Card className="border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      Parecer Completo da Helena
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {selectedSubmission?.helena_justification}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questionnaire" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dados do Questionário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSubmission?.questionnaire_data && Object.entries(selectedSubmission.questionnaire_data).map(([key, value]) => (
                        <div key={key} className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="font-medium text-sm">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documentos Enviados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedSubmission?.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-slate-500">
                                Enviado em: {formatDate(doc.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`border-0 ${
                              doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                              doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {doc.status === 'approved' ? 'Aprovado' :
                               doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Questionário submetido</p>
                          <p className="text-sm text-slate-500">{selectedSubmission && formatDate(selectedSubmission.submission_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Análise Helena concluída</p>
                          <p className="text-sm text-slate-500">Score: {selectedSubmission?.helena_score}</p>
                        </div>
                      </div>
                      {selectedSubmission?.decision_date && (
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedSubmission.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {selectedSubmission.status === 'approved' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {selectedSubmission.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                            </p>
                            <p className="text-sm text-slate-500">
                              {formatDate(selectedSubmission.decision_date)}
                              {selectedSubmission.analyst && ` por ${selectedSubmission.analyst.split('@')[0]}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}