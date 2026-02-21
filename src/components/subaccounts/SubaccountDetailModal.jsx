import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2 } from 'lucide-react';

import TabResumo from './detail-tabs/TabResumo';
import TabDadosCadastrais from './detail-tabs/TabDadosCadastrais';
import TabSocios from './detail-tabs/TabSocios';
import TabDocumentos from './detail-tabs/TabDocumentos';
import TabBancario from './detail-tabs/TabBancario';
import TabKYC from './detail-tabs/TabKYC';
import TabLimites from './detail-tabs/TabLimites';
import TabTaxasReadonly from './detail-tabs/TabTaxasReadonly';
import TabTransacoes from './detail-tabs/TabTransacoes';
import TabUsuarios from './detail-tabs/TabUsuarios';

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  pending_documents: { label: 'Docs Pendentes', color: 'bg-yellow-100 text-yellow-700' },
  pending_compliance: { label: 'Compliance Pendente', color: 'bg-yellow-100 text-yellow-700' },
  under_review: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Ativa', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspensa', color: 'bg-orange-100 text-orange-700' },
  blocked: { label: 'Bloqueada', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-600' },
};

export default function SubaccountDetailModal({ open, onOpenChange, subaccount }) {
  if (!subaccount) return null;

  const s = subaccount;
  const status = statusConfig[s.status] || statusConfig.draft;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{s.business_name}</DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  {s.legal_name && <span>{s.legal_name} • </span>}
                  {s.document} • ID: {s.subaccount_id || s.id?.slice(0, 12)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Badge className={status.color}>{status.label}</Badge>
              {s.risk_level && (
                <Badge className={s.risk_level === 'low' ? 'bg-green-100 text-green-700' : s.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                  Risco: {s.risk_level === 'low' ? 'Baixo' : s.risk_level === 'medium' ? 'Médio' : 'Alto'}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="resumo" className="flex-1 overflow-hidden">
          <div className="px-6 pt-2 border-b bg-gray-50/50">
            <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-0">
              {[
                { value: 'resumo', label: 'Resumo' },
                { value: 'cadastrais', label: 'Dados Cadastrais' },
                { value: 'socios', label: 'Sócios' },
                { value: 'documentos', label: 'Documentos' },
                { value: 'bancario', label: 'Bancário' },
                { value: 'kyc', label: 'Compliance/KYC' },
                { value: 'limites', label: 'Limites' },
                { value: 'taxas', label: 'Taxas' },
                { value: 'transacoes', label: 'Transações' },
                { value: 'usuarios', label: 'Usuários' },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2bc196] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2.5 text-xs font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="h-[58vh] px-6 py-4">
            <TabsContent value="resumo" className="mt-0"><TabResumo subaccount={s} /></TabsContent>
            <TabsContent value="cadastrais" className="mt-0"><TabDadosCadastrais subaccount={s} /></TabsContent>
            <TabsContent value="socios" className="mt-0"><TabSocios subaccount={s} /></TabsContent>
            <TabsContent value="documentos" className="mt-0"><TabDocumentos subaccount={s} /></TabsContent>
            <TabsContent value="bancario" className="mt-0"><TabBancario subaccount={s} /></TabsContent>
            <TabsContent value="kyc" className="mt-0"><TabKYC subaccount={s} /></TabsContent>
            <TabsContent value="limites" className="mt-0"><TabLimites subaccount={s} /></TabsContent>
            <TabsContent value="taxas" className="mt-0"><TabTaxasReadonly subaccount={s} /></TabsContent>
            <TabsContent value="transacoes" className="mt-0"><TabTransacoes subaccount={s} /></TabsContent>
            <TabsContent value="usuarios" className="mt-0"><TabUsuarios subaccount={s} /></TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}