import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, 
  XCircle, PauseCircle, Save, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

// --- Components ---

const InsightBanner = ({ score, redFlags }) => (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between">
          <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-600 rounded-lg p-1.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Insights do DIA para esta Análise</h3>
              </div>
              <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200 ml-8 list-disc">
                  <li>Score {score} está na faixa de análise manual (50-79).</li>
                  <li>{redFlags?.length || 0} red flags identificados.</li>
                  <li>Documentação completa e validada.</li>
                  <li><strong>Sugestão:</strong> Aprovar com monitoramento reforçado nos primeiros 90 dias.</li>
              </ul>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Perguntar ao DIA
          </Button>
      </div>
    </div>
);

const DocumentViewer = ({ doc }) => (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">{doc.name}</h4>
            <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Reprovar</Button>
                <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-200 hover:bg-emerald-50">Aprovar</Button>
            </div>
        </div>
        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400">
            [Visualização do PDF/Imagem]
        </div>
    </div>
);

// --- Page ---

import { mockMerchants } from '@/src/mockData/adminInternoMocks';
import { useSearchParams } from 'react-router-dom';

export default function AdminIntKycAnalysis() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id') || 'sub_mock_002'; // Default to one with manual review for demo
    
    // Find mock subaccount
    const subaccount = mockMerchants.find(m => m.id === id) || mockMerchants[1];

    const [decision, setDecision] = useState('');
    const [justification, setJustification] = useState('');
    const [conditions, setConditions] = useState([]);

    const handleApprove = async () => {
        try {
            await base44.functions.invoke('approveKycManually', { 
                subaccount_id: subaccount.subaccount_id,
                notes: justification,
                conditions: conditions
            });
            toast.success('KYC Aprovado com sucesso!');
        } catch (e) {
            toast.error('Erro ao aprovar KYC');
        }
    };

    const handleReject = async () => {
         try {
            await base44.functions.invoke('rejectKycManually', { 
                subaccount_id: subaccount.subaccount_id,
                reason: justification
            });
            toast.success('KYC Reprovado.');
        } catch (e) {
            toast.error('Erro ao reprovar KYC');
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={`Análise KYC - ${subaccount.business_name}`}
                subtitle={`CNPJ: ${subaccount.document} | Score: ${subaccount.kyc_score}`}
                breadcrumbs={[
                    { label: 'Admin Interno', page: 'AdminIntDashboard' },
                    { label: 'Fila de Análise', page: 'AdminIntKYCQueue' },
                    { label: 'Análise', page: '#' }
                ]}
            />

            <InsightBanner score={subaccount.kyc_score} redFlags={subaccount.ai_red_flags} />

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 bg-transparent rounded-none h-auto p-0 gap-4 overflow-x-auto">
                    <TabsTrigger value="summary" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent">Resumo HELENA</TabsTrigger>
                    <TabsTrigger value="registration" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent">Cadastrais</TabsTrigger>
                    <TabsTrigger value="partners" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent">Sócios/UBOs</TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent">Documentos</TabsTrigger>
                    <TabsTrigger value="validations" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent">Validações</TabsTrigger>
                    <TabsTrigger value="decision" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-4 py-3 bg-transparent font-bold text-indigo-600">Decisão</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="summary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Análise HELENA</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-full border-8 border-amber-400 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {subaccount.kyc_score}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-amber-600">ANÁLISE MANUAL</h3>
                                            <p className="text-sm text-slate-500">Faixa 50-79: Requer revisão humana</p>
                                            <p className="text-sm text-slate-500">Confiança: 87%</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Justificativa da IA</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {subaccount.ai_compliance_justification}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Red Flags ({subaccount.ai_red_flags.length})</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {subaccount.ai_red_flags.map((flag, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                <span className="text-sm font-medium text-red-700 dark:text-red-300">{flag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="partners">
                        <Card>
                            <CardHeader><CardTitle>Estrutura Societária</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: 'João da Silva', cpf: '123.456.789-00', share: '60%', pep: true, sanctions: false },
                                        { name: 'Maria Santos', cpf: '987.654.321-00', share: '40%', pep: false, sanctions: false },
                                    ].map((partner, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                            <div>
                                                <p className="font-medium">{partner.name}</p>
                                                <p className="text-sm text-slate-500">CPF: {partner.cpf} • Participação: {partner.share}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {partner.pep && <Badge variant="destructive">PEP</Badge>}
                                                {!partner.sanctions && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Sanções: OK</Badge>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1">
                                <CardHeader><CardTitle>Lista de Documentos</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    {['Cartão CNPJ', 'Contrato Social', 'RG João da Silva', 'Selfie João c/ Doc'].map((doc, idx) => (
                                        <Button key={idx} variant="ghost" className="w-full justify-start text-left font-normal">
                                            <FileText className="w-4 h-4 mr-2 text-slate-400" />
                                            {doc}
                                            <Badge className="ml-auto" variant="success">OK</Badge>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-1">
                                <CardHeader><CardTitle>Visualização</CardTitle></CardHeader>
                                <CardContent>
                                    <DocumentViewer doc={{ name: 'Contrato Social' }} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="decision">
                        <Card className="border-indigo-200 dark:border-indigo-900 shadow-lg">
                            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-indigo-700 dark:text-indigo-400">Decisão Final</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Selecione a Decisão:</Label>
                                    <RadioGroup value={decision} onValueChange={setDecision} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer ${decision === 'approve' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200'}`}>
                                            <RadioGroupItem value="approve" id="r1" />
                                            <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer font-medium">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Aprovar
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer ${decision === 'reject' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200'}`}>
                                            <RadioGroupItem value="reject" id="r2" />
                                            <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer font-medium">
                                                <XCircle className="w-5 h-5 text-red-600" /> Reprovar
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer ${decision === 'docs' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200'}`}>
                                            <RadioGroupItem value="docs" id="r3" />
                                            <Label htmlFor="r3" className="flex items-center gap-2 cursor-pointer font-medium">
                                                <PauseCircle className="w-5 h-5 text-amber-600" /> Solicitar Documentos
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {decision === 'approve' && (
                                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                        <Label className="font-semibold">Condições Especiais:</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="c1" onCheckedChange={(c) => c ? setConditions([...conditions, 'monitoramento']) : setConditions(conditions.filter(i => i !== 'monitoramento'))} />
                                                <Label htmlFor="c1">Monitoramento reforçado (90 dias)</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="c2" />
                                                <Label htmlFor="c2">Limite inicial reduzido</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="c3" />
                                                <Label htmlFor="c3">Revisão EDD em 6 meses</Label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="font-semibold">Justificativa (Obrigatória):</Label>
                                    <Textarea 
                                        placeholder="Descreva o motivo da decisão..." 
                                        className="h-32"
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button variant="ghost">Cancelar</Button>
                                    <Button 
                                        onClick={decision === 'approve' ? handleApprove : handleReject}
                                        disabled={!decision || !justification}
                                        className={decision === 'approve' ? "bg-emerald-600 hover:bg-emerald-700" : decision === 'reject' ? "bg-red-600 hover:bg-red-700" : ""}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Confirmar Decisão
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}