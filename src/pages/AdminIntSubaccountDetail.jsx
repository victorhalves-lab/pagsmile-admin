import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, Phone, Calendar, ArrowLeft, CheckCircle2, AlertTriangle, 
  FileText, Clock, ShieldCheck, CreditCard, History, ChevronRight
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentViewer from '@/components/admin-interno/DocumentViewer';

export default function AdminIntSubaccountDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const { data: subaccount, isLoading } = useQuery({
    queryKey: ['subaccount', subaccountId],
    queryFn: () => subaccountId ? base44.entities.Subaccount.get(subaccountId) : null,
    enabled: !!subaccountId
  });

  const { data: documents } = useQuery({
    queryKey: ['documents', subaccountId],
    queryFn: () => subaccountId ? base44.entities.Document.filter({ subaccount_id: subaccountId }) : [],
    enabled: !!subaccountId
  });

  const { data: events } = useQuery({
    queryKey: ['onboarding_events', subaccountId],
    queryFn: () => subaccountId ? base44.entities.OnboardingEvent.filter({ subaccount_id: subaccountId }) : [],
    enabled: !!subaccountId
  });

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;
  if (!subaccount) return <div className="p-8 text-center">Subconta não encontrada (ID necessário na URL)</div>;

  const calculateProgress = () => {
    const steps = {
      'draft': 10,
      'awaiting_basic_data': 20,
      'awaiting_company_data': 40,
      'awaiting_kyc_start': 50,
      'kyc_in_progress': 60,
      'awaiting_docs': 70,
      'kyc_submitted': 80,
      'kyc_in_analysis': 85,
      'kyc_approved': 95,
      'active': 100
    };
    return steps[subaccount.status] || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{subaccount.business_name || 'Nova Conta'}</h1>
              <StatusBadge status={subaccount.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>CNPJ: {subaccount.document}</span>
              <span>ID: {subaccount.subaccount_id}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" /> Enviar Lembrete
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" /> Registrar Contato
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Ações ▼</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Solicitar Documentos</DropdownMenuItem>
                <DropdownMenuItem>Reenviar Link Liveness</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Cancelar Conta</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Insight Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Insights do DIA</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Cliente criou a conta há 3 dias e parou na etapa de KYC. Sugiro enviar um e-mail reforçando os benefícios do plano {subaccount.plan_chosen}.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progresso do Onboarding</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Cadastro</span>
            <span>Verificação</span>
            <span>Dados Empresa</span>
            <span>KYC</span>
            <span>Ativação</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
          <TabsTrigger value="plan">Plano & Taxas</TabsTrigger>
          <TabsTrigger value="kyc">Status KYC</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Informações do Representante</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoRow label="Nome Completo" value={subaccount.representative_name} />
                <InfoRow label="E-mail" value={subaccount.representative_email} />
                <InfoRow label="Telefone" value={subaccount.representative_phone} />
              </div>
              <div className="space-y-4">
                <InfoRow label="Origem" value={subaccount.onboarding_source} />
                <InfoRow label="Criado em" value={new Date(subaccount.created_date).toLocaleString()} />
                <InfoRow label="User Agent" value="Chrome / Windows" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader><CardTitle>Dados da Pessoa Jurídica</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                <InfoRow label="Razão Social" value={subaccount.business_name} />
                <InfoRow label="Nome Fantasia" value={subaccount.legal_name || subaccount.business_name} />
                <InfoRow label="CNPJ" value={subaccount.document} />
                <InfoRow label="Tipo de Negócio" value={subaccount.business_type || 'E-commerce'} />
               </div>
               <div className="space-y-4">
                 <InfoRow label="Endereço" value={JSON.stringify(subaccount.address) || 'Não informado'} />
                 <InfoRow label="Faturamento Médio" value={subaccount.expected_monthly_volume ? `R$ ${subaccount.expected_monthly_volume}` : 'N/I'} />
                 <InfoRow label="Website" value={subaccount.website} />
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          <Card>
            <CardHeader><CardTitle>Plano Selecionado: {subaccount.plan_chosen}</CardTitle></CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-2">Cartão de Crédito</h4>
                   <ul className="text-sm space-y-1 text-slate-600">
                     <li>MDR Vista: 3.49%</li>
                     <li>MDR 2-6x: 3.99%</li>
                     <li>MDR 7-12x: 4.99%</li>
                   </ul>
                 </div>
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-2">Pix</h4>
                   <ul className="text-sm space-y-1 text-slate-600">
                     <li>Taxa Fixa: 0.99%</li>
                     <li>Liquidação: D+0</li>
                   </ul>
                 </div>
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-2">Geral</h4>
                   <ul className="text-sm space-y-1 text-slate-600">
                     <li>Saque: R$ 3,90</li>
                     <li>Antecipação: 2.99% a.m.</li>
                   </ul>
                 </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader><CardTitle>Status de Compliance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${subaccount.kyc_score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {subaccount.kyc_score || 0}
                </div>
                <div>
                  <div className="font-semibold">Score HELENA</div>
                  <div className="text-sm text-slate-500">Decisão: <span className="capitalize font-medium">{subaccount.kyc_decision?.replace('_', ' ') || 'Pendente'}</span></div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Red Flags Identificadas</h4>
                {subaccount.ai_red_flags && subaccount.ai_red_flags.length > 0 ? (
                  <ul className="space-y-2">
                    {subaccount.ai_red_flags.map((flag, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="w-4 h-4" /> {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Nenhuma red flag detectada
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                   <ShieldCheck className="w-4 h-4" /> Ir para Análise Completa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
           <Card>
             <CardHeader><CardTitle>Documentação</CardTitle></CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {documents && documents.length > 0 ? documents.map((doc) => (
                   <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                     <div className="flex items-center gap-3">
                       <FileText className="w-5 h-5 text-slate-400" />
                       <div>
                         <div className="font-medium">{doc.document_name || doc.document_type}</div>
                         <div className="text-xs text-slate-500">Enviado em {new Date(doc.uploaded_at).toLocaleDateString()}</div>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <StatusBadge status={doc.status} />
                        <DocumentViewer docUrl={doc.file_url} docName={doc.document_name} />
                     </div>
                   </div>
                 )) : (
                   <div className="text-center py-8 text-slate-500">Nenhum documento enviado ainda.</div>
                 )}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader><CardTitle>Histórico de Eventos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                {events && events.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="text-sm font-medium">{event.details}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()} • {event.actor}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-500 uppercase">{label}</div>
      <div className="text-sm mt-0.5">{value || '-'}</div>
    </div>
  );
}