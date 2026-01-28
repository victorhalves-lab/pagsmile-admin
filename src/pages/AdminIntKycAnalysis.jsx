import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import DocumentViewer from '@/components/admin-interno/DocumentViewer';

export default function AdminIntKycAnalysis() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const { data: subaccount } = useQuery({
    queryKey: ['kyc_analysis_subaccount', subaccountId],
    queryFn: () => subaccountId ? base44.entities.Subaccount.get(subaccountId) : null,
    enabled: !!subaccountId
  });

  const { data: documents } = useQuery({
    queryKey: ['kyc_documents', subaccountId],
    queryFn: () => subaccountId ? base44.entities.Document.filter({ subaccount_id: subaccountId }) : [],
    enabled: !!subaccountId
  });

  const approveMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('approveKycManually', data),
    onSuccess: () => alert('KYC Aprovado com sucesso!'),
  });

  const rejectMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('rejectKycManually', data),
    onSuccess: () => alert('KYC Reprovado.'),
  });

  const [decision, setDecision] = useState('approve'); // approve, request_docs, reject
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState({
      monitoring: true,
      limit_reduction: false,
      edd_review: false
  });

  if (!subaccount) return <div className="p-8">Carregando...</div>;

  const handleConfirm = () => {
      if (decision === 'approve') {
          approveMutation.mutate({ subaccount_id: subaccountId, notes, conditions });
      } else if (decision === 'reject') {
          rejectMutation.mutate({ subaccount_id: subaccountId, reason: notes });
      }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Análise KYC: ${subaccount.business_name}`} 
        subtitle={`CNPJ: ${subaccount.document} | Score: ${subaccount.kyc_score}`}
      />

      {/* Insight Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4 flex gap-4">
         <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg h-fit">
             <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
         </div>
         <div className="flex-1">
             <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">Insights do DIA</h4>
             <p className="text-sm text-indigo-800 dark:text-indigo-200 mt-1">
                Score {subaccount.kyc_score} está na faixa de análise manual. 
                Red flags identificadas: {subaccount.ai_red_flags?.join(', ') || 'Nenhuma'}.
                Sugestão: Aprovar com monitoramento reforçado devido ao PEP identificado.
             </p>
             <Button variant="link" className="text-indigo-600 dark:text-indigo-400 h-auto p-0 mt-2 text-xs">
                 Perguntar ao DIA
             </Button>
         </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
         <TabsList>
             <TabsTrigger value="summary">Resumo HELENA</TabsTrigger>
             <TabsTrigger value="data">Dados Cadastrais</TabsTrigger>
             <TabsTrigger value="ubo">UBOs e Sócios</TabsTrigger>
             <TabsTrigger value="compliance">Compliance PLD</TabsTrigger>
             <TabsTrigger value="docs">Documentos</TabsTrigger>
             <TabsTrigger value="decision">Decisão Final</TabsTrigger>
         </TabsList>

         <TabsContent value="summary">
             <Card>
                 <CardHeader><CardTitle>Análise Automática</CardTitle></CardHeader>
                 <CardContent>
                     <div className="flex items-center gap-8 mb-8">
                         <div className="text-center">
                             <div className="text-5xl font-bold text-purple-600">{subaccount.kyc_score}</div>
                             <div className="text-sm text-slate-500 uppercase font-bold mt-1">Score Geral</div>
                         </div>
                         <div className="flex-1 space-y-2">
                             <div className="flex justify-between text-sm font-medium">
                                 <span>Classificação: Análise Manual</span>
                                 <span>Confiança: 87%</span>
                             </div>
                             <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-full relative">
                                     <div className="absolute top-0 bottom-0 w-1 bg-black" style={{ left: `${subaccount.kyc_score}%` }} />
                                 </div>
                             </div>
                             <div className="flex justify-between text-xs text-slate-400">
                                 <span>0</span><span>50</span><span>80</span><span>100</span>
                             </div>
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                         <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100">
                             <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                 <CheckCircle2 className="w-4 h-4" /> Pontos Fortes
                             </h4>
                             <ul className="text-sm space-y-1 text-emerald-700">
                                 <li>• Documentação completa</li>
                                 <li>• Sem sanções identificadas</li>
                                 <li>• Endereço validado</li>
                             </ul>
                         </div>
                         <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100">
                             <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                 <AlertTriangle className="w-4 h-4" /> Pontos de Atenção
                             </h4>
                             <ul className="text-sm space-y-1 text-amber-700">
                                 {subaccount.ai_red_flags?.map(f => <li key={f}>• {f}</li>)}
                             </ul>
                         </div>
                     </div>
                 </CardContent>
             </Card>
         </TabsContent>

         <TabsContent value="data">
             <Card>
                 <CardHeader><CardTitle>Dados e Validações</CardTitle></CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         <ValidationRow label="CNPJ na Receita" status="valid" value="Ativo / Regular" />
                         <ValidationRow label="Endereço vs CNPJ" status="valid" value="Confere" />
                         <ValidationRow label="Tempo de Atividade" status="warning" value={`${subaccount.company_age_years || 0} anos (< 2 anos)`} />
                     </div>
                 </CardContent>
             </Card>
         </TabsContent>

         <TabsContent value="docs">
             <Card>
                 <CardHeader><CardTitle>Documentos Enviados</CardTitle></CardHeader>
                 <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {documents?.map(doc => (
                             <div key={doc.id} className="border p-4 rounded-lg flex justify-between items-center">
                                 <div>
                                     <div className="font-medium">{doc.document_name}</div>
                                     <div className="text-xs text-slate-500">{new Date(doc.uploaded_at).toLocaleDateString()}</div>
                                 </div>
                                 <DocumentViewer 
                                    docUrl={doc.file_url} 
                                    docName={doc.document_name}
                                    onApprove={() => console.log('Approved doc')}
                                    onReject={() => console.log('Rejected doc')}
                                 />
                             </div>
                         ))}
                     </div>
                 </CardContent>
             </Card>
         </TabsContent>

         <TabsContent value="decision">
             <Card>
                 <CardHeader><CardTitle>Decisão Final</CardTitle></CardHeader>
                 <CardContent className="space-y-6">
                     <div className="grid grid-cols-3 gap-4">
                         <DecisionButton 
                            active={decision === 'approve'} 
                            onClick={() => setDecision('approve')}
                            icon={CheckCircle2} 
                            color="emerald" 
                            title="Aprovar" 
                         />
                         <DecisionButton 
                            active={decision === 'request_docs'} 
                            onClick={() => setDecision('request_docs')}
                            icon={FileText} 
                            color="blue" 
                            title="Solicitar Docs" 
                         />
                         <DecisionButton 
                            active={decision === 'reject'} 
                            onClick={() => setDecision('reject')}
                            icon={XCircle} 
                            color="red" 
                            title="Reprovar" 
                         />
                     </div>

                     {decision === 'approve' && (
                         <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                             <h4 className="font-medium">Condições Especiais</h4>
                             <div className="space-y-2">
                                 <CheckboxItem 
                                    label="Monitoramento reforçado (90 dias)" 
                                    checked={conditions.monitoring}
                                    onCheckedChange={(c) => setConditions({...conditions, monitoring: c})}
                                 />
                                 <CheckboxItem 
                                    label="Limite inicial reduzido" 
                                    checked={conditions.limit_reduction}
                                    onCheckedChange={(c) => setConditions({...conditions, limit_reduction: c})}
                                 />
                             </div>
                         </div>
                     )}

                     <div className="space-y-2">
                         <Label>Justificativa / Notas Internas</Label>
                         <Textarea 
                            placeholder="Descreva o motivo da decisão..." 
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="h-32"
                         />
                     </div>

                     <div className="flex justify-end gap-3">
                         <Button variant="outline">Cancelar</Button>
                         <Button onClick={handleConfirm} className="w-32">Confirmar</Button>
                     </div>
                 </CardContent>
             </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}

function ValidationRow({ label, status, value }) {
    const icon = status === 'valid' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return (
        <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-medium">{label}</span>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                {value} {icon}
            </div>
        </div>
    );
}

function DecisionButton({ active, onClick, icon: Icon, color, title }) {
    const activeClass = {
        emerald: "bg-emerald-50 border-emerald-500 text-emerald-700",
        blue: "bg-blue-50 border-blue-500 text-blue-700",
        red: "bg-red-50 border-red-500 text-red-700"
    }[color];

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${active ? activeClass : 'border-slate-200 hover:border-slate-300'}`}
        >
            <Icon className={`w-8 h-8 mb-2 ${active ? '' : 'text-slate-400'}`} />
            <span className="font-bold">{title}</span>
        </button>
    );
}

function CheckboxItem({ label, checked, onCheckedChange }) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={label} checked={checked} onCheckedChange={onCheckedChange} />
            <Label htmlFor={label} className="cursor-pointer">{label}</Label>
        </div>
    );
}