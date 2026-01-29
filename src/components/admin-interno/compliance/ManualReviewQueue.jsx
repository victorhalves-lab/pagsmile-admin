import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Filter, Brain, AlertTriangle, Clock, CheckCircle2, XCircle,
  Eye, FileText, Building2, User, Calendar, ChevronRight, Sparkles,
  Flag, MessageSquare, Send, Download, ExternalLink, Shield
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data
const mockSubmissions = [
  {
    id: 'SUB001',
    business_name: 'Tech Solutions LTDA',
    document: '12.345.678/0001-90',
    submission_date: '2024-01-28T14:30:00',
    questionnaire_type: 'kyc_full',
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

### Score de Risco Detalhado:
- Cadastral: 60/100
- Documental: 45/100
- Financeiro: 50/100
- Histórico: N/A (novo cliente)

### Recomendação:
Solicitar comprovante de endereço atualizado e esclarecimentos sobre a atividade exercida.`,
    helena_red_flags: ['Endereço inconsistente', 'Sócio com restrição', 'MCC incompatível'],
    manual_review_reason: 'Score abaixo do threshold (45 < 60)',
    time_in_queue: 4.5,
    assigned_analyst: null,
    documents: [
      { name: 'Contrato Social', status: 'approved', type: 'contract' },
      { name: 'Comprovante Endereço', status: 'pending', type: 'address' },
      { name: 'RG Sócio 1', status: 'approved', type: 'id' },
      { name: 'RG Sócio 2', status: 'approved', type: 'id' },
    ]
  },
  {
    id: 'SUB002',
    business_name: 'Comércio Digital ME',
    document: '98.765.432/0001-10',
    submission_date: '2024-01-28T10:15:00',
    questionnaire_type: 'kyc_pix',
    helena_score: 52,
    helena_status: 'manual_review',
    helena_recommendation: 'Verificar faturamento declarado vs. porte da empresa',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Inconsistência detectada entre o faturamento declarado e o porte empresarial.

### Pontos de Atenção:
1. **Faturamento**: Declarado R$ 5M/mês para empresa MEI
2. **Tempo de Mercado**: Empresa aberta há apenas 3 meses

### Recomendação:
Solicitar extratos bancários dos últimos 3 meses para validação.`,
    helena_red_flags: ['Faturamento incompatível', 'Empresa recente'],
    manual_review_reason: 'Red flag detectado',
    time_in_queue: 8.2,
    assigned_analyst: 'maria.silva@pagsmile.com',
    documents: [
      { name: 'Contrato Social', status: 'approved', type: 'contract' },
      { name: 'CNPJ', status: 'approved', type: 'cnpj' },
    ]
  },
  {
    id: 'SUB003',
    business_name: 'Loja Virtual Express',
    document: '11.222.333/0001-44',
    submission_date: '2024-01-27T16:45:00',
    questionnaire_type: 'kyc_full',
    helena_score: 38,
    helena_status: 'manual_review',
    helena_recommendation: 'Alto risco - múltiplas inconsistências detectadas',
    helena_justification: `## Análise Completa da Helena

### Resumo Executivo
Múltiplas inconsistências graves detectadas. Recomenda-se análise criteriosa.

### Pontos Críticos:
1. **PEP**: Sócio identificado como Pessoa Exposta Politicamente
2. **Endereço**: Mesmo endereço de outra empresa já bloqueada
3. **Atividade**: Histórico de chargebacks em empresa anterior do sócio

### Recomendação:
Rejeição recomendada. Caso aprovação seja necessária, exigir garantias adicionais.`,
    helena_red_flags: ['PEP detectado', 'Endereço compartilhado suspeito', 'Histórico negativo'],
    manual_review_reason: 'Múltiplos red flags críticos',
    time_in_queue: 26.5,
    assigned_analyst: null,
    documents: [
      { name: 'Contrato Social', status: 'pending', type: 'contract' },
      { name: 'Comprovante Endereço', status: 'rejected', type: 'address' },
    ]
  },
];

export default function ManualReviewQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [analystNotes, setAnalystNotes] = useState('');

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-700 border-0">Baixo Risco ({score})</Badge>;
    if (score >= 60) return <Badge className="bg-amber-100 text-amber-700 border-0">Médio ({score})</Badge>;
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-700 border-0">Alto ({score})</Badge>;
    return <Badge className="bg-red-100 text-red-700 border-0">Crítico ({score})</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendente', class: 'bg-slate-100 text-slate-700' },
      approved: { label: 'Aprovado', class: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rejeitado', class: 'bg-red-100 text-red-700' },
    };
    return <Badge className={`${statusMap[status]?.class || 'bg-slate-100'} border-0`}>{statusMap[status]?.label || status}</Badge>;
  };

  const filteredSubmissions = mockSubmissions.filter(sub => {
    const matchesSearch = sub.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.document.includes(searchTerm);
    const matchesScore = filterScore === 'all' ||
                        (filterScore === 'critical' && sub.helena_score < 40) ||
                        (filterScore === 'high' && sub.helena_score >= 40 && sub.helena_score < 60) ||
                        (filterScore === 'medium' && sub.helena_score >= 60 && sub.helena_score < 80);
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterScore} onValueChange={setFilterScore}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os riscos</SelectItem>
                <SelectItem value="critical">Crítico (0-39)</SelectItem>
                <SelectItem value="high">Alto (40-59)</SelectItem>
                <SelectItem value="medium">Médio (60-79)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Mais filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubmissions.length}</p>
                <p className="text-xs text-slate-500">Na fila</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.helena_score < 40).length}</p>
                <p className="text-xs text-slate-500">Risco Crítico</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubmissions.filter(s => s.assigned_analyst).length}</p>
                <p className="text-xs text-slate-500">Com analista</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(mockSubmissions.reduce((acc, s) => acc + s.time_in_queue, 0) / mockSubmissions.length).toFixed(1)}h
                </p>
                <p className="text-xs text-slate-500">Tempo médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fila de Análise Manual</CardTitle>
          <CardDescription>Submissões aguardando revisão humana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800">
                  <th className="text-left py-3 px-4 font-medium">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium">CNPJ</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Score Helena</th>
                  <th className="text-left py-3 px-4 font-medium">Recomendação Helena</th>
                  <th className="text-left py-3 px-4 font-medium">Tempo na Fila</th>
                  <th className="text-left py-3 px-4 font-medium">Analista</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{sub.business_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">{sub.document}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {sub.questionnaire_type === 'kyc_full' ? 'KYC Completo' : 'KYC PIX'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{getScoreBadge(sub.helena_score)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2 max-w-xs">
                        <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {sub.helena_recommendation}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className={sub.time_in_queue > 24 ? 'text-red-600 font-medium' : ''}>
                          {sub.time_in_queue}h
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {sub.assigned_analyst ? (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                          {sub.assigned_analyst.split('@')[0]}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Não atribuído</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedSubmission(sub)}
                        className="bg-[#2bc196] hover:bg-[#239b7a]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Analisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {selectedSubmission?.business_name}
              <Badge variant="outline" className="ml-2">{selectedSubmission?.document}</Badge>
            </DialogTitle>
            <DialogDescription>
              Análise detalhada de compliance
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="helena" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="helena">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Parecer Helena
                </TabsTrigger>
                <TabsTrigger value="data">
                  <FileText className="w-4 h-4 mr-2" />
                  Dados do Cliente
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="w-4 h-4 mr-2" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-4">
                <TabsContent value="helena" className="mt-0 space-y-4">
                  {/* Helena Score Card */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 border-purple-200">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-sm text-slate-500 mb-1">Score de Risco</p>
                          <p className="text-4xl font-bold text-purple-600">{selectedSubmission?.helena_score}</p>
                          {getScoreBadge(selectedSubmission?.helena_score || 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="col-span-2">
                      <CardContent className="pt-4">
                        <p className="text-sm text-slate-500 mb-2">Red Flags Identificados</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSubmission?.helena_red_flags.map((flag, idx) => (
                            <Badge key={idx} className="bg-red-100 text-red-700 border-0">
                              <Flag className="w-3 h-3 mr-1" />
                              {flag}
                            </Badge>
                          ))}
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
                      <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {selectedSubmission?.helena_justification}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analyst Notes */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Notas do Analista
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Adicione suas observações sobre esta análise..."
                        value={analystNotes}
                        onChange={(e) => setAnalystNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-slate-500 text-center py-8">
                        Dados do questionário serão exibidos aqui
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {selectedSubmission?.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-slate-400" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-slate-500">{doc.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(doc.status)}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-slate-500 text-center py-8">
                        Histórico de ações será exibido aqui
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Cancelar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50">
                  <Send className="w-4 h-4 mr-2" />
                  Solicitar Documentos
                </Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reprovar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}