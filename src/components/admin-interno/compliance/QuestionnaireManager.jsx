import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Edit, Trash2, Copy, Eye, FileText, Settings, ChevronDown, 
  ChevronUp, GripVertical, Save, Archive, CheckCircle2, AlertCircle
} from 'lucide-react';

// Mock questionnaires
const mockQuestionnaires = [
  {
    id: 'Q001',
    name: 'KYC Completo',
    description: 'Questionário completo para clientes com cartão de crédito',
    type: 'kyc_full',
    version: '2.1',
    status: 'active',
    sections: 12,
    fields: 78,
    usage_count: 1247,
    last_modified: '2024-01-20',
    last_modified_by: 'admin@pagsmile.com'
  },
  {
    id: 'Q002',
    name: 'KYC PIX',
    description: 'Questionário simplificado para clientes apenas PIX',
    type: 'kyc_pix',
    version: '1.5',
    status: 'active',
    sections: 8,
    fields: 45,
    usage_count: 892,
    last_modified: '2024-01-15',
    last_modified_by: 'compliance@pagsmile.com'
  },
  {
    id: 'Q003',
    name: 'KYB Enterprise',
    description: 'Questionário avançado para grandes empresas',
    type: 'kyb_enterprise',
    version: '1.0',
    status: 'draft',
    sections: 15,
    fields: 120,
    usage_count: 0,
    last_modified: '2024-01-25',
    last_modified_by: 'admin@pagsmile.com'
  },
];

const fieldTypes = [
  { value: 'text', label: 'Texto curto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção única' },
  { value: 'multiselect', label: 'Seleção múltipla' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'file', label: 'Upload de arquivo' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
];

export default function QuestionnaireManager() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questionnaires, setQuestionnaires] = useState(mockQuestionnaires);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'Ativo', class: 'bg-green-100 text-green-700' },
      draft: { label: 'Rascunho', class: 'bg-amber-100 text-amber-700' },
      inactive: { label: 'Inativo', class: 'bg-slate-100 text-slate-700' },
      archived: { label: 'Arquivado', class: 'bg-red-100 text-red-700' },
    };
    return <Badge className={`${statusMap[status]?.class || 'bg-slate-100'} border-0`}>{statusMap[status]?.label || status}</Badge>;
  };

  const openEditor = (questionnaire = null) => {
    setSelectedQuestionnaire(questionnaire);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Questionários de Compliance</h3>
          <p className="text-sm text-slate-500">Gerencie os questionários KYC/KYB</p>
        </div>
        <Button onClick={() => openEditor()} className="bg-[#2bc196] hover:bg-[#239b7a]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Questionário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{questionnaires.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {questionnaires.filter(q => q.status === 'active').length}
              </p>
              <p className="text-xs text-slate-500">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {questionnaires.filter(q => q.status === 'draft').length}
              </p>
              <p className="text-xs text-slate-500">Rascunhos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {questionnaires.reduce((acc, q) => acc + q.usage_count, 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Usos Totais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questionnaires Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questionnaires.map((q) => (
          <Card key={q.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {q.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">{q.description}</CardDescription>
                </div>
                {getStatusBadge(q.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold">{q.sections}</p>
                    <p className="text-xs text-slate-500">Seções</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold">{q.fields}</p>
                    <p className="text-xs text-slate-500">Campos</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold">v{q.version}</p>
                    <p className="text-xs text-slate-500">Versão</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{q.usage_count.toLocaleString()} usos</span>
                  <span>Atualizado: {new Date(q.last_modified).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditor(q)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedQuestionnaire(q); setIsPreviewOpen(true); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedQuestionnaire ? `Editar: ${selectedQuestionnaire.name}` : 'Novo Questionário'}
            </DialogTitle>
            <DialogDescription>
              Configure as seções e campos do questionário
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="sections">Seções e Campos</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="risk">Regras de Risco</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="general" className="mt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Questionário</label>
                    <Input 
                      placeholder="Ex: KYC Completo"
                      defaultValue={selectedQuestionnaire?.name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select defaultValue={selectedQuestionnaire?.type || 'kyc_full'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyc_full">KYC Completo</SelectItem>
                        <SelectItem value="kyc_pix">KYC PIX</SelectItem>
                        <SelectItem value="kyc_card">KYC Cartão</SelectItem>
                        <SelectItem value="kyb_enterprise">KYB Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea 
                    placeholder="Descrição do questionário..."
                    defaultValue={selectedQuestionnaire?.description || ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Versão</label>
                    <Input 
                      placeholder="1.0"
                      defaultValue={selectedQuestionnaire?.version || '1.0'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select defaultValue={selectedQuestionnaire?.status || 'draft'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Arraste para reordenar as seções</p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nova Seção
                  </Button>
                </div>

                {/* Mock sections */}
                {['Dados Cadastrais', 'Endereço', 'Sócios e UBOs', 'Atividade Comercial', 'PLD/FT'].map((section, idx) => (
                  <Card key={idx} className="border-l-4 border-l-[#2bc196]">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                          <span className="font-medium">{section}</span>
                          <Badge variant="outline" className="text-xs">{3 + idx} campos</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="documents" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Configure os documentos obrigatórios</p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Novo Documento
                  </Button>
                </div>

                {['Contrato Social', 'Comprovante de Endereço', 'RG dos Sócios', 'CNPJ'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium">{doc}</p>
                        <p className="text-xs text-slate-500">Obrigatório</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="risk" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thresholds de Score (Helena)</CardTitle>
                    <CardDescription>
                      Configure os limites para aprovação automática e encaminhamento manual
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Aprovar automaticamente acima de:</label>
                        <Input type="number" defaultValue="80" />
                        <p className="text-xs text-slate-500">Score ≥ este valor será aprovado pela Helena</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rejeitar automaticamente abaixo de:</label>
                        <Input type="number" defaultValue="30" />
                        <p className="text-xs text-slate-500">Score ≤ este valor será rejeitado pela Helena</p>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Faixa de Análise Manual</span>
                      </div>
                      <p className="text-sm text-amber-700">
                        Submissões com score entre 30 e 80 serão encaminhadas para análise manual.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Save className="w-4 h-4 mr-2" />
              Salvar Questionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pré-visualização: {selectedQuestionnaire?.name}</DialogTitle>
            <DialogDescription>
              Veja como o questionário aparece para o cliente
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-slate-500">
              Pré-visualização do questionário será exibida aqui
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}