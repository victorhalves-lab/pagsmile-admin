import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, User, CreditCard, ShieldCheck, FileText, Clock, 
  Mail, Phone, AlertTriangle, ArrowRight, CheckCircle2, History
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Components ---

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value || '-'}</span>
  </div>
);

const DocumentItem = ({ doc }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-700 p-2 rounded text-slate-500">
                <FileText className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{doc.document_name || doc.document_type}</p>
                <div className="flex items-center gap-2">
                    <Badge variant={doc.status === 'validated' ? 'success' : 'secondary'} className="text-[10px] h-4 px-1">
                        {doc.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="sm">Ver</Button>
            {doc.status === 'rejected' && <Button variant="outline" size="sm" className="text-red-500">Solicitar Novo</Button>}
        </div>
    </div>
);

const TimelineItem = ({ event }) => (
    <div className="flex gap-4 pb-6 last:pb-0 relative">
        <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mt-2" />
            <div className="w-px h-full bg-slate-200 dark:bg-slate-700 absolute top-4 left-1 -z-10" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{event.event_type.replace('_', ' ').toUpperCase()}</p>
            <p className="text-xs text-slate-500">{event.details}</p>
            <p className="text-[10px] text-slate-400 mt-1">
                {new Date(event.timestamp).toLocaleString()} • {event.actor}
            </p>
        </div>
    </div>
);

// --- Page ---

export default function AdminIntSubaccountDetail() {
  // In real app, get ID from params: const { id } = useParams();
  // Mocking ID for now or assuming passed via some state if not in route params yet
  // For demo, let's fetch the first one or a specific one
  const subaccountId = "mock-id"; 

  const { data: subaccount, isLoading } = useQuery({
    queryKey: ['subaccount_detail', subaccountId],
    queryFn: async () => {
        // Mock fetch details
        const list = await base44.entities.Subaccount.list(1);
        return list[0] || {};
    }
  });

  const { data: documents } = useQuery({
      queryKey: ['subaccount_docs', subaccountId],
      queryFn: async () => {
          // Mock fetch docs
          return [
              { document_type: 'CNPJ Card', document_name: 'Cartão CNPJ', status: 'validated', uploaded_at: new Date().toISOString() },
              { document_type: 'Social Contract', document_name: 'Contrato Social', status: 'pending', uploaded_at: new Date().toISOString() }
          ];
      }
  });

  const { data: timeline } = useQuery({
      queryKey: ['subaccount_timeline', subaccountId],
      queryFn: async () => {
          // Mock fetch timeline
          return [
              { event_type: 'account_created', details: 'Account created via Self-Service', timestamp: new Date(Date.now() - 86400000).toISOString(), actor: 'user' },
              { event_type: 'kyc_started', details: 'KYC Process initiated', timestamp: new Date().toISOString(), actor: 'user' }
          ];
      }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!subaccount) return <div>Not found</div>;

  // Calculate progress
  const steps = [
      { id: 'draft', label: 'Rascunho' },
      { id: 'awaiting_kyc_start', label: 'Aguard. KYC' },
      { id: 'kyc_submitted', label: 'Em Análise' },
      { id: 'active', label: 'Ativo' }
  ];
  const currentStepIdx = steps.findIndex(s => s.id === subaccount.status) !== -1 
    ? steps.findIndex(s => s.id === subaccount.status) 
    : 1; // default to some middle step if not exact match

  return (
    <div className="space-y-6">
      <PageHeader 
        title={subaccount.business_name || "Detalhes da Conta"}
        subtitle={`CNPJ: ${subaccount.document || '-'}`}
        breadcrumbs={[
            { label: 'Contas Self-Service', page: 'AdminIntSelfService' },
            { label: subaccount.business_name || 'Detalhes', page: '#' }
        ]}
        actions={
            <div className="flex gap-2">
                <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" /> Lembrete KYC
                </Button>
                <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" /> Contato
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Ações</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Solicitar Documentos</DropdownMenuItem>
                        <DropdownMenuItem>Alterar Plano</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Cancelar Conta</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        }
      />

      {/* Status & Progress */}
      <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Status atual:</span>
                    <StatusBadge status={subaccount.status} />
                </div>
                <div className="text-sm text-slate-500">
                    Criado em: {new Date(subaccount.created_date).toLocaleDateString()}
                </div>
            </div>
            <div className="relative mb-8 mt-6">
                <Progress value={(currentStepIdx + 1) / steps.length * 100} className="h-2" />
                <div className="flex justify-between absolute top-4 w-full">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full mb-1 ${idx <= currentStepIdx ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            <span className={`text-xs ${idx <= currentStepIdx ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 bg-transparent rounded-none h-auto p-0 gap-6">
          <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 py-3 bg-transparent">Dados Básicos</TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 py-3 bg-transparent">Empresa</TabsTrigger>
          <TabsTrigger value="plan" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 py-3 bg-transparent">Plano</TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 py-3 bg-transparent">KYC & Docs</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 py-3 bg-transparent">Timeline</TabsTrigger>
        </TabsList>

        <div className="mt-6">
            <TabsContent value="basic">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Representante Legal</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Nome Completo" value={subaccount.representative_name} />
                        <InfoRow label="E-mail" value={subaccount.representative_email} />
                        <InfoRow label="Telefone" value={subaccount.representative_phone} />
                        <InfoRow label="IP de Criação" value="192.168.1.1" />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="company">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Dados da Empresa</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Razão Social" value={subaccount.legal_name || subaccount.business_name} />
                        <InfoRow label="Nome Fantasia" value={subaccount.business_name} />
                        <InfoRow label="CNPJ" value={subaccount.document} />
                        <InfoRow label="Endereço" value={typeof subaccount.address === 'object' ? `${subaccount.address.street}, ${subaccount.address.number}` : subaccount.address} />
                        <InfoRow label="Website" value={subaccount.website} />
                        <InfoRow label="Idade da Empresa" value={`${subaccount.company_age_years || 0} anos`} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="plan">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Plano Selecionado</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Plano" value={subaccount.plan_chosen} />
                        <InfoRow label="Tipo de Conta" value={subaccount.account_type === 'both' ? 'Pix + Cartão' : 'Só Pix'} />
                        <InfoRow label="Taxa Pix" value="0.99%" />
                        <InfoRow label="MDR Cartão Crédito" value="3.49% + R$ 0,50" />
                        <InfoRow label="Prazo de Recebimento" value="D+14" />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="kyc">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Status do Compliance</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                                    subaccount.kyc_score >= 80 ? 'bg-emerald-100 text-emerald-600' : 
                                    subaccount.kyc_score >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    <span className="text-3xl font-bold">{subaccount.kyc_score || '-'}</span>
                                </div>
                                <h3 className="font-semibold mb-1">Score HELENA</h3>
                                <p className="text-sm text-slate-500 mb-6">Decisão: <span className="capitalize font-medium">{subaccount.kyc_decision?.replace('_', ' ') || 'Pendente'}</span></p>
                                
                                <Link to={`/AdminIntKycAnalysis`}>
                                    <Button className="w-full">
                                        Ir para Análise Completa <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-lg">Documentos</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {documents?.map((doc, idx) => (
                                <DocumentItem key={idx} doc={doc} />
                            ))}
                            {(!documents || documents.length === 0) && (
                                <p className="text-sm text-slate-500 text-center py-4">Nenhum documento enviado ainda.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="timeline">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Histórico de Eventos</CardTitle></CardHeader>
                    <CardContent className="pl-4">
                        {timeline?.map((event, idx) => (
                            <TimelineItem key={idx} event={event} />
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}