import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShieldCheck, AlertTriangle, FileText, User, Building2, 
  CheckCircle, XCircle, Clock, Eye, Download, ExternalLink
} from 'lucide-react';
import { mockMerchants } from '@/components/mockData/adminInternoMocks';

const InsightBanner = ({ merchant }) => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
        <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-1">
          💡 Análise HELENA - Score: {merchant?.kyc_score || '-'}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Recomendação: <span className="font-semibold">{merchant?.kyc_decision === 'manual_review' ? 'Revisão Manual Necessária' : merchant?.kyc_decision}</span>
          </p>
          {merchant?.ai_red_flags?.length > 0 && (
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Red Flags: {merchant.ai_red_flags.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const DocumentViewer = ({ doc }) => (
  <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-500" />
        <span className="font-medium">{doc.name}</span>
      </div>
      <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}>
        {doc.status === 'approved' ? 'Aprovado' : doc.status === 'pending' ? 'Pendente' : 'Rejeitado'}
      </Badge>
    </div>
    <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-slate-400">
      <Eye className="w-8 h-8" />
      <span className="ml-2">Preview do Documento</span>
    </div>
    <div className="flex gap-2 mt-3">
      <Button variant="outline" size="sm" className="flex-1">
        <Download className="w-4 h-4 mr-2" /> Baixar
      </Button>
      <Button variant="outline" size="sm">
        <ExternalLink className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default function AdminIntKycAnalysis() {
  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('summary');
  const [decision, setDecision] = useState('');
  const [justification, setJustification] = useState('');
  const [conditions, setConditions] = useState([]);

  // Find merchant from mock data
  const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[1]; // Default to second one (pending)

  const handleApprove = () => {
    alert('KYC Aprovado! (Mock)');
  };

  const handleReject = () => {
    alert('KYC Rejeitado! (Mock)');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Análise KYC - ${merchant?.business_name || 'Empresa'}`}
        subtitle={`CNPJ: ${merchant?.document || '-'}`}
        breadcrumbs={[
          { label: 'KYC & Compliance', page: 'AdminIntKYC' },
          { label: 'Fila de Análise', page: 'AdminIntKYCQueue' },
          { label: 'Análise', page: 'AdminIntKycAnalysis' }
        ]}
        actions={
          <div className="flex gap-2">
            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + merchant?.id}>
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-2" /> Ver Perfil Completo
              </Button>
            </Link>
          </div>
        }
      />

      <InsightBanner merchant={merchant} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="summary">Resumo</TabsTrigger>
              <TabsTrigger value="partners">Sócios</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="decision">Decisão</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Dados da Empresa</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500">Razão Social</Label>
                      <p className="font-medium">{merchant?.legal_name || merchant?.business_name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">CNPJ</Label>
                      <p className="font-medium">{merchant?.document}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">MCC</Label>
                      <p className="font-medium">{merchant?.mcc} - {merchant?.mcc_description}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Categoria</Label>
                      <p className="font-medium">{merchant?.category}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">TPV Estimado</Label>
                      <p className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant?.tpv_month || 0)}/mês</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Vendedor</Label>
                      <p className="font-medium">{merchant?.commercial_agent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {merchant?.ai_red_flags?.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader><CardTitle className="text-red-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Red Flags Identificadas</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {merchant.ai_red_flags.map((flag, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-red-700 dark:text-red-400">
                          <XCircle className="w-4 h-4" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>Justificativa da IA</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    {merchant?.ai_compliance_justification || 'Nenhuma justificativa disponível.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Quadro Societário</CardTitle></CardHeader>
                <CardContent>
                  {merchant?.partners?.length > 0 ? (
                    <div className="space-y-4">
                      {merchant.partners.map((partner, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium">{partner.name}</p>
                              <p className="text-sm text-slate-500">CPF: {partner.cpf} • {partner.share}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {partner.pep && <Badge variant="destructive">PEP</Badge>}
                            {partner.sanctions && <Badge variant="destructive">Sanções</Badge>}
                            {!partner.pep && !partner.sanctions && <Badge variant="outline" className="text-green-600">Limpo</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">Nenhum sócio cadastrado.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {merchant?.documents?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {merchant.documents.map((doc, idx) => (
                    <DocumentViewer key={idx} doc={doc} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhum documento enviado ainda.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="decision" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Decisão Final</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={decision} onValueChange={setDecision}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20">
                      <RadioGroupItem value="approve" id="approve" />
                      <Label htmlFor="approve" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Aprovar KYC</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Cliente apto para operar normalmente</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20">
                      <RadioGroupItem value="request_docs" id="request_docs" />
                      <Label htmlFor="request_docs" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="font-medium">Solicitar Documentos</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Necessário documentação adicional</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
                      <RadioGroupItem value="reject" id="reject" />
                      <Label htmlFor="reject" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-medium">Rejeitar KYC</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Cliente não apto para operar</p>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div>
                    <Label>Justificativa</Label>
                    <Textarea 
                      placeholder="Descreva o motivo da sua decisão..."
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  {decision === 'approve' && (
                    <div className="space-y-3">
                      <Label>Condições Especiais</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cond1" onCheckedChange={(c) => c ? setConditions([...conditions, 'monitoring']) : setConditions(conditions.filter(x => x !== 'monitoring'))} />
                          <Label htmlFor="cond1">Monitoramento intensivo (30 dias)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cond2" onCheckedChange={(c) => c ? setConditions([...conditions, 'limit']) : setConditions(conditions.filter(x => x !== 'limit'))} />
                          <Label htmlFor="cond2">Limite de TPV reduzido inicialmente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cond3" onCheckedChange={(c) => c ? setConditions([...conditions, 'reserve']) : setConditions(conditions.filter(x => x !== 'reserve'))} />
                          <Label htmlFor="cond3">Rolling reserve aumentada (20%)</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {decision === 'approve' && (
                      <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Aprovação
                      </Button>
                    )}
                    {decision === 'reject' && (
                      <Button onClick={handleReject} variant="destructive" className="flex-1">
                        <XCircle className="w-4 h-4 mr-2" /> Confirmar Rejeição
                      </Button>
                    )}
                    {decision === 'request_docs' && (
                      <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                        <FileText className="w-4 h-4 mr-2" /> Enviar Solicitação
                      </Button>
                    )}
                    {!decision && (
                      <p className="text-slate-500 text-sm">Selecione uma decisão acima</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Score HELENA</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                  merchant?.kyc_score >= 80 ? 'bg-green-100 text-green-600' :
                  merchant?.kyc_score >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {merchant?.kyc_score || '-'}
                </div>
                <p className="mt-3 font-medium">
                  {merchant?.kyc_score >= 80 ? 'Baixo Risco' :
                   merchant?.kyc_score >= 50 ? 'Risco Moderado' : 'Alto Risco'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">CNPJ validado na Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Endereço confere</span>
              </div>
              <div className="flex items-center gap-2">
                {merchant?.partners?.some(p => p.pep) ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm">Verificação PEP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Sem sanções internacionais</span>
              </div>
              <div className="flex items-center gap-2">
                {merchant?.documents?.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-sm">Documentos enviados</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Histórico</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-slate-500">Criado em</p>
                <p className="font-medium">{new Date(merchant?.created_at || Date.now()).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-500">Última atualização</p>
                <p className="font-medium">Hoje às 14:30</p>
              </div>
              <div className="text-sm">
                <p className="text-slate-500">Analista anterior</p>
                <p className="font-medium">-</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}