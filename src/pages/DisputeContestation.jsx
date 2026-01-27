import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createPageUrl } from '@/utils';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Bot,
  Sparkles,
  Send,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  Shield,
  CreditCard,
  User,
  Calendar,
  DollarSign,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// Evidence requirements by reason code category
const evidenceRequirements = {
  fraud: {
    required: ['ip_address', 'device_fingerprint', 'avs_cvv', '3ds_result'],
    optional: ['customer_history', 'delivery_proof', 'communications']
  },
  consumer: {
    required: ['delivery_proof', 'product_description', 'terms_accepted'],
    optional: ['communications', 'refund_policy', 'tracking_info']
  },
  authorization: {
    required: ['authorization_code', 'transaction_log'],
    optional: ['3ds_result']
  },
  processing: {
    required: ['correct_amount_proof', 'transaction_log'],
    optional: ['refund_proof']
  }
};

const evidenceLabels = {
  ip_address: 'Endereço IP da Transação',
  device_fingerprint: 'Device Fingerprint',
  avs_cvv: 'Resultado AVS/CVV',
  '3ds_result': 'Resultado 3D Secure',
  customer_history: 'Histórico do Cliente',
  delivery_proof: 'Comprovante de Entrega',
  communications: 'Comunicações com Cliente',
  product_description: 'Descrição do Produto/Serviço',
  terms_accepted: 'Termos Aceitos pelo Cliente',
  refund_policy: 'Política de Reembolso',
  tracking_info: 'Informações de Rastreio',
  authorization_code: 'Código de Autorização',
  transaction_log: 'Log da Transação',
  correct_amount_proof: 'Comprovante do Valor Correto',
  refund_proof: 'Comprovante de Reembolso'
};

export default function DisputeContestation() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const disputeId = urlParams.get('id');

  const [currentStep, setCurrentStep] = useState(0);
  const [decision, setDecision] = useState(null);
  const [evidenceChecklist, setEvidenceChecklist] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [narrative, setNarrative] = useState('');
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

  const { data: dispute, isLoading } = useQuery({
    queryKey: ['dispute', disputeId],
    queryFn: async () => {
      const disputes = await base44.entities.Dispute.filter({ id: disputeId });
      return disputes[0];
    },
    enabled: !!disputeId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Dispute.update(disputeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute', disputeId] });
    }
  });

  const steps = [
    { id: 'analysis', label: 'Análise', icon: Search },
    { id: 'decision', label: 'Decisão', icon: Shield },
    { id: 'evidence', label: 'Evidências', icon: FileText },
    { id: 'narrative', label: 'Narrativa', icon: Bot },
    { id: 'submit', label: 'Envio', icon: Send }
  ];

  const requirements = dispute?.reason_category 
    ? evidenceRequirements[dispute.reason_category] 
    : evidenceRequirements.consumer;

  const handleDecision = (dec) => {
    setDecision(dec);
    if (dec === 'accept') {
      updateMutation.mutate({ status: 'accepted' });
    } else {
      updateMutation.mutate({ status: 'in_analysis' });
      setCurrentStep(2);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedFiles(prev => [...prev, { name: file.name, url: file_url }]);
    }
  };

  const generateNarrative = async () => {
    setIsGeneratingNarrative(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere uma narrativa de contestação de chargeback profissional e persuasiva para o seguinte caso:

Reason Code: ${dispute?.reason_code}
Categoria: ${dispute?.reason_category}
Descrição do Motivo: ${dispute?.reason_description}
Valor: ${formatCurrency(dispute?.amount)}
Data da Transação: ${dispute?.opened_date}
Cliente: ${dispute?.customer_name}

Evidências disponíveis:
${Object.entries(evidenceChecklist)
  .filter(([_, checked]) => checked)
  .map(([key]) => `- ${evidenceLabels[key]}`)
  .join('\n')}

A narrativa deve:
1. Ser formal e objetiva
2. Apresentar os fatos cronologicamente
3. Mencionar as evidências disponíveis
4. Argumentar contra a alegação do chargeback
5. Ter no máximo 2000 caracteres
6. Estar em português do Brasil

Formato da bandeira: ${dispute?.card_brand === 'visa' ? 'Visa' : 'Mastercard'}`,
        response_json_schema: {
          type: "object",
          properties: {
            narrative: { type: "string" }
          }
        }
      });
      setNarrative(result.narrative);
    } catch (error) {
      console.error('Error generating narrative:', error);
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({
      status: 'in_contestation',
      narrative_text: narrative,
      evidence_files: uploadedFiles.map(f => f.url),
      evidence_checklist: evidenceChecklist,
      evidence_submitted: true,
      submission_date: new Date().toISOString(),
      submission_protocol_id: `PROT-${Date.now()}`
    });
    setCurrentStep(4);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Disputa não encontrada</p>
        <Link to={createPageUrl('Chargebacks')}>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Chargebacks
          </Button>
        </Link>
      </div>
    );
  }

  const daysLeft = dispute.deadline_date 
    ? differenceInDays(new Date(dispute.deadline_date), new Date())
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contestação de Chargeback"
        subtitle={`ID: ${dispute.dispute_id}`}
        breadcrumbs={[
          { label: 'Disputas', page: 'DisputeDashboard' },
          { label: 'Chargebacks', page: 'Chargebacks' },
          { label: 'Contestação' }
        ]}
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        {steps.map((step, idx) => (
          <div 
            key={step.id}
            className={cn(
              "flex items-center",
              idx < steps.length - 1 && "flex-1"
            )}
          >
            <div 
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                idx <= currentStep 
                  ? "bg-purple-600 border-purple-600 text-white" 
                  : "bg-gray-100 border-gray-300 text-gray-400"
              )}
            >
              {idx < currentStep ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span className={cn(
              "ml-2 text-sm font-medium hidden sm:block",
              idx <= currentStep ? "text-purple-600" : "text-gray-400"
            )}>
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                idx < currentStep ? "bg-purple-600" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Deadline Alert */}
      {daysLeft !== null && daysLeft <= 7 && (
        <Alert className={cn(
          daysLeft <= 3 ? "border-red-300 bg-red-50" : "border-yellow-300 bg-yellow-50"
        )}>
          <Clock className={cn("w-4 h-4", daysLeft <= 3 ? "text-red-600" : "text-yellow-600")} />
          <AlertDescription className={daysLeft <= 3 ? "text-red-800" : "text-yellow-800"}>
            <strong>Prazo de contestação:</strong> {daysLeft} dias restantes até {format(new Date(dispute.deadline_date), 'dd/MM/yyyy')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 0: Analysis */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Análise do Caso</CardTitle>
                <CardDescription>Revise os dados do chargeback antes de decidir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs">Valor Disputado</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(dispute.amount)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Prazo</span>
                    </div>
                    <p className="text-2xl font-bold">{daysLeft || '-'} dias</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-gray-500">Reason Code</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-700">{dispute.reason_code}</Badge>
                    <span className="text-sm">{dispute.reason_description}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-gray-500">Cliente</Label>
                  <p className="font-medium">{dispute.customer_name}</p>
                  <p className="text-sm text-gray-500">{dispute.customer_email}</p>
                </div>

                {dispute.win_probability !== undefined && (
                  <div className="border-t pt-4">
                    <Label className="text-gray-500">Probabilidade de Ganho (IA)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Progress value={dispute.win_probability} className="flex-1 h-3" />
                      <span className={cn(
                        "text-lg font-bold",
                        dispute.win_probability >= 60 ? "text-green-600" :
                        dispute.win_probability >= 30 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {dispute.win_probability}%
                      </span>
                    </div>
                    {dispute.ai_recommendation_reason && (
                      <p className="text-sm text-gray-500 mt-2">{dispute.ai_recommendation_reason}</p>
                    )}
                  </div>
                )}

                <Button onClick={() => setCurrentStep(1)} className="w-full">
                  Prosseguir para Decisão
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Decision */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Decisão</CardTitle>
                <CardDescription>Escolha se deseja contestar ou aceitar o chargeback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className={cn(
                      "h-auto p-6 flex-col items-center gap-2 border-2",
                      decision === 'contest' && "border-green-500 bg-green-50"
                    )}
                    onClick={() => handleDecision('contest')}
                  >
                    <Shield className="w-8 h-8 text-green-600" />
                    <span className="font-semibold">Contestar</span>
                    <span className="text-xs text-gray-500 text-center">
                      Preparar dossiê e enviar contestação
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-auto p-6 flex-col items-center gap-2 border-2",
                      decision === 'accept' && "border-gray-500 bg-gray-50"
                    )}
                    onClick={() => handleDecision('accept')}
                  >
                    <XCircle className="w-8 h-8 text-gray-600" />
                    <span className="font-semibold">Aceitar</span>
                    <span className="text-xs text-gray-500 text-center">
                      Não contestar, aceitar a perda
                    </span>
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Evidence */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Coleta de Evidências</CardTitle>
                <CardDescription>Reúna as evidências necessárias para a contestação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-red-600 mb-2">Evidências Obrigatórias</h4>
                  <div className="space-y-2">
                    {requirements?.required.map((key) => (
                      <div key={key} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <Checkbox
                          checked={evidenceChecklist[key] || false}
                          onCheckedChange={(checked) => setEvidenceChecklist(prev => ({ ...prev, [key]: checked }))}
                        />
                        <span className="text-sm">{evidenceLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Evidências Opcionais</h4>
                  <div className="space-y-2">
                    {requirements?.optional.map((key) => (
                      <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                          checked={evidenceChecklist[key] || false}
                          onCheckedChange={(checked) => setEvidenceChecklist(prev => ({ ...prev, [key]: checked }))}
                        />
                        <span className="text-sm">{evidenceLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Upload de Arquivos</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Clique para fazer upload ou arraste arquivos</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG até 10MB</p>
                    </label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm flex-1">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="flex-1">
                    Prosseguir para Narrativa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Narrative */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Narrativa de Contestação</CardTitle>
                <CardDescription>Escreva ou gere automaticamente a narrativa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={generateNarrative}
                  disabled={isGeneratingNarrative}
                  className="w-full"
                >
                  {isGeneratingNarrative ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Gerar Narrativa com IA
                </Button>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Texto da Contestação</Label>
                    <span className={cn(
                      "text-xs",
                      narrative.length > 2000 ? "text-red-600" : "text-gray-500"
                    )}>
                      {narrative.length}/2000 caracteres
                    </span>
                  </div>
                  <Textarea
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Escreva a narrativa de contestação..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!narrative || narrative.length > 2000}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Enviar Contestação
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">Contestação Enviada!</h2>
                <p className="text-green-700 mb-4">
                  Sua contestação foi enviada com sucesso. Acompanhe o status na lista de chargebacks.
                </p>
                <p className="text-sm text-green-600 mb-6">
                  Protocolo: <span className="font-mono">{dispute.submission_protocol_id || `PROT-${Date.now()}`}</span>
                </p>
                <Link to={createPageUrl('Chargebacks')}>
                  <Button>
                    Voltar para Chargebacks
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Dispute Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resumo da Disputa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-mono">{dispute.dispute_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor</span>
                <span className="font-semibold">{formatCurrency(dispute.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bandeira</span>
                <Badge variant="outline">{dispute.card_brand}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge>{dispute.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prazo</span>
                <span className={cn(
                  "font-medium",
                  daysLeft <= 3 ? "text-red-600" : daysLeft <= 7 ? "text-yellow-600" : ""
                )}>
                  {daysLeft} dias
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          {dispute.ai_recommendation && (
            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <CardTitle className="text-sm">Recomendação IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Badge className={cn(
                  dispute.ai_recommendation === 'contest' 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                )}>
                  {dispute.ai_recommendation === 'contest' ? 'Contestar' : 'Aceitar'}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">
                  {dispute.ai_recommendation_reason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Guia de Reason Codes
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Search(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}