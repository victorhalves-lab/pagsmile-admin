import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/components/utils';
import { format } from 'date-fns';
import {
  Building2, Mail, Phone, Globe, MapPin, CreditCard, Users,
  DollarSign, Shield, Calendar, FileText, AlertTriangle, CheckCircle2
} from 'lucide-react';

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

const riskConfig = {
  low: { label: 'Baixo', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Médio', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'Alto', color: 'bg-red-100 text-red-700' },
  critical: { label: 'Crítico', color: 'bg-red-200 text-red-800' },
};

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value || '-'}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3 mt-4 first:mt-0">{children}</h4>;
}

export default function SubaccountDetailModal({ open, onOpenChange, subaccount }) {
  if (!subaccount) return null;

  const s = subaccount;
  const status = statusConfig[s.status] || statusConfig.draft;
  const risk = riskConfig[s.risk_level] || riskConfig.low;
  const addr = s.address || {};
  const bank = s.bank_account || {};
  const limits = s.limits || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{s.business_name}</DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">{s.document} • {s.subaccount_id || s.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={status.color}>{status.label}</Badge>
              {s.risk_level && <Badge className={risk.color}>Risco: {risk.label}</Badge>}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="geral" className="px-6 pb-6">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="bancario">Bancário</TabsTrigger>
            <TabsTrigger value="limites">Limites</TabsTrigger>
            <TabsTrigger value="socios">Sócios</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh]">
            {/* Tab Geral */}
            <TabsContent value="geral" className="mt-0">
              <SectionTitle>Dados Cadastrais</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow icon={Building2} label="Razão Social" value={s.legal_name} />
                <InfoRow icon={Building2} label="Nome Fantasia" value={s.business_name} />
                <InfoRow icon={FileText} label="CNPJ/CPF" value={s.document} />
                <InfoRow icon={Mail} label="E-mail" value={s.email} />
                <InfoRow icon={Phone} label="Telefone" value={s.phone} />
                <InfoRow icon={Globe} label="Website" value={s.website} />
                <InfoRow icon={Calendar} label="Data de Abertura" value={s.opening_date} />
                <InfoRow icon={Shield} label="MCC" value={s.mcc ? `${s.mcc} - ${s.mcc_description || ''}` : '-'} />
                <InfoRow icon={FileText} label="Plano" value={s.plan_name || s.selected_plan || '-'} />
                <InfoRow icon={Calendar} label="Cadastro" value={s.created_date ? format(new Date(s.created_date), 'dd/MM/yyyy HH:mm') : '-'} />
              </div>

              <SectionTitle>Endereço</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow icon={MapPin} label="Logradouro" value={addr.street ? `${addr.street}, ${addr.number || 'S/N'}${addr.complement ? ` - ${addr.complement}` : ''}` : '-'} />
                <InfoRow label="Bairro" value={addr.neighborhood} />
                <InfoRow label="Cidade / UF" value={addr.city ? `${addr.city} / ${addr.state}` : '-'} />
                <InfoRow label="CEP" value={addr.zip_code} />
              </div>

              <SectionTitle>Compliance</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow icon={Shield} label="Status Compliance" value={s.compliance_status} />
                <InfoRow label="Score IA" value={s.ai_compliance_score != null ? `${s.ai_compliance_score}/100` : '-'} />
                <InfoRow label="Status IA" value={s.ai_compliance_status} />
                <InfoRow label="Onboarding Completo" value={s.onboarding_completed ? 'Sim' : 'Não'} />
              </div>
              {s.ai_compliance_red_flags?.length > 0 && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg">
                  <p className="text-xs font-semibold text-red-700 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3" /> Red Flags
                  </p>
                  <ul className="text-xs text-red-600 list-disc list-inside">
                    {s.ai_compliance_red_flags.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </TabsContent>

            {/* Tab Financeiro */}
            <TabsContent value="financeiro" className="mt-0">
              <SectionTitle>Métricas Financeiras</SectionTitle>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'GMV Total (TPV)', value: formatCurrency(s.total_volume || s.total_lifetime_tpv), icon: DollarSign, bg: 'bg-blue-50', ic: 'text-blue-600' },
                  { label: 'Receita Mês Atual', value: formatCurrency(s.revenue_current_month), icon: DollarSign, bg: 'bg-green-50', ic: 'text-green-600' },
                  { label: 'Total Transações', value: s.total_transactions || s.total_transactions_count || 0, icon: CreditCard, bg: 'bg-purple-50', ic: 'text-purple-600' },
                  { label: 'Taxa Aprovação Média', value: s.avg_approval_rate ? `${s.avg_approval_rate}%` : '-', icon: CheckCircle2, bg: 'bg-emerald-50', ic: 'text-emerald-600' },
                ].map((m, i) => (
                  <div key={i} className={`p-4 rounded-lg ${m.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <m.icon className={`w-4 h-4 ${m.ic}`} />
                      <span className="text-xs text-gray-500">{m.label}</span>
                    </div>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              <SectionTitle>Saldos</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow label="Saldo Disponível" value={formatCurrency(s.available_balance || s.balance_available)} />
                <InfoRow label="Saldo Pendente" value={formatCurrency(s.pending_balance || s.balance_pending_release)} />
                <InfoRow label="Saldo Bloqueado" value={formatCurrency(s.blocked_balance || s.balance_blocked)} />
                <InfoRow label="Rolling Reserve" value={formatCurrency(s.balance_retained_rr)} />
              </div>

              <SectionTitle>Taxas Configuradas</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow label="MDR Cartão" value={s.mdr_card != null ? `${s.mdr_card}%` : '-'} />
                <InfoRow label="MDR PIX" value={s.mdr_pix != null ? `${s.mdr_pix}%` : '-'} />
                <InfoRow label="Split Percentual" value={s.split_percentage != null ? `${s.split_percentage}%` : '-'} />
                <InfoRow label="Split Fixo" value={s.split_fixed != null ? formatCurrency(s.split_fixed) : '-'} />
              </div>
            </TabsContent>

            {/* Tab Bancário */}
            <TabsContent value="bancario" className="mt-0">
              <SectionTitle>Conta Bancária Principal</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <InfoRow icon={CreditCard} label="Banco" value={bank.bank_name ? `${bank.bank_code || ''} - ${bank.bank_name}` : '-'} />
                <InfoRow label="Tipo de Conta" value={bank.account_type === 'checking' ? 'Conta Corrente' : bank.account_type === 'savings' ? 'Conta Poupança' : bank.account_type || '-'} />
                <InfoRow label="Agência" value={bank.agency} />
                <InfoRow label="Conta" value={bank.account_number} />
                <InfoRow label="Chave PIX" value={bank.pix_key} />
                <InfoRow label="Tipo Chave PIX" value={bank.pix_key_type} />
              </div>

              {s.bank_accounts?.length > 1 && (
                <>
                  <SectionTitle>Outras Contas</SectionTitle>
                  {s.bank_accounts.slice(1).map((ba, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
                      <p className="text-sm font-medium">{ba.bank_name || 'Conta'} - Ag: {ba.agency} / Cc: {ba.account_number}</p>
                      {ba.pix_key && <p className="text-xs text-gray-500">PIX: {ba.pix_key}</p>}
                    </div>
                  ))}
                </>
              )}
            </TabsContent>

            {/* Tab Limites */}
            <TabsContent value="limites" className="mt-0">
              <SectionTitle>Limites Transacionais</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Limite por Transação', value: s.limit_per_transaction || limits.per_transaction },
                  { label: 'Limite Diário', value: s.limit_daily || limits.daily },
                  { label: 'Limite Mensal', value: s.limit_monthly || limits.monthly },
                  { label: 'PIX por Transação', value: limits.pix_per_transaction },
                  { label: 'PIX Diário', value: limits.pix_daily },
                ].map((l, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{l.label}</p>
                    <p className="text-base font-bold">{l.value != null ? formatCurrency(l.value) : 'Não definido'}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab Sócios */}
            <TabsContent value="socios" className="mt-0">
              <SectionTitle>Sócios e Administradores</SectionTitle>
              {s.partners?.length > 0 ? (
                <div className="space-y-3">
                  {s.partners.map((p, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name || `Sócio ${i + 1}`}</p>
                          <p className="text-xs text-gray-500">{p.cpf || p.document || '-'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{p.ownership_percentage || 0}%</Badge>
                        {p.is_legal_representative && (
                          <p className="text-xs text-blue-600 mt-1">Representante Legal</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">Nenhum sócio cadastrado</p>
              )}

              <SectionTitle>Contatos</SectionTitle>
              {s.contacts?.length > 0 ? (
                <div className="space-y-2">
                  {s.contacts.map((c, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm">{c.name} {c.is_primary && <Badge className="ml-2 bg-blue-100 text-blue-700 text-[10px]">Principal</Badge>}</p>
                      <p className="text-xs text-gray-500">{c.email} • {c.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">Nenhum contato adicional cadastrado</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}