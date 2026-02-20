import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { mockMerchants } from '@/components/mockData/adminInternoMocks';
import MerchantHeader from '@/components/admin-interno/merchant-profile/MerchantHeader';
import TabResumo from '@/components/admin-interno/merchant-profile/tabs/TabResumo';
import TabDadosCadastrais from '@/components/admin-interno/merchant-profile/tabs/TabDadosCadastrais';
import TabTaxas from '@/components/admin-interno/merchant-profile/tabs/TabTaxas';
import TabConfiguracoes from '@/components/admin-interno/merchant-profile/tabs/TabConfiguracoes';
import TabMetodosPagamento from '@/components/admin-interno/merchant-profile/tabs/TabMetodosPagamento';
import TabCredenciaisAPI from '@/components/admin-interno/merchant-profile/tabs/TabCredenciaisAPI';
import TabTransacoes from '@/components/admin-interno/merchant-profile/tabs/TabTransacoes';
import TabFinanceiro from '@/components/admin-interno/merchant-profile/tabs/TabFinanceiro';
import TabSaques from '@/components/admin-interno/merchant-profile/tabs/TabSaques';
import TabAntecipacao from '@/components/admin-interno/merchant-profile/tabs/TabAntecipacao';
import TabRisco from '@/components/admin-interno/merchant-profile/tabs/TabRisco';
import TabChargebacks from '@/components/admin-interno/merchant-profile/tabs/TabChargebacks';
import TabMEDs from '@/components/admin-interno/merchant-profile/tabs/TabMEDs';
import TabDocumentos from '@/components/admin-interno/merchant-profile/tabs/TabDocumentos';
import TabKYC from '@/components/admin-interno/merchant-profile/tabs/TabKYC';
import TabNotas from '@/components/admin-interno/merchant-profile/tabs/TabNotas';
import TabComunicacoes from '@/components/admin-interno/merchant-profile/tabs/TabComunicacoes';
import TabAuditoria from '@/components/admin-interno/merchant-profile/tabs/TabAuditoria';
import TabUsuarios from '@/components/admin-interno/merchant-profile/tabs/TabUsuarios';
import TabWebhooks from '@/components/admin-interno/merchant-profile/tabs/TabWebhooks';
import TabSplit from '@/components/admin-interno/merchant-profile/tabs/TabSplit';
import TabRecorrencia from '@/components/admin-interno/merchant-profile/tabs/TabRecorrencia';
import TabClientUsers from '@/components/admin-interno/merchant-profile/tabs/TabClientUsers';
import TabSubSellers from '@/components/admin-interno/merchant-profile/tabs/TabSubSellers';
import TabPerformance from '@/components/admin-interno/merchant-profile/tabs/TabPerformance';
import {
  LayoutDashboard, BarChart3, FileText, Settings, Percent, CreditCard,
  KeyRound, ArrowLeftRight, Landmark, ArrowUpFromLine, TrendingUp,
  AlertTriangle, ShieldAlert, Banknote, FolderOpen, ShieldCheck,
  StickyNote, MessageSquare, ClipboardList, Users, Webhook, Split,
  Repeat, UserCircle, Store
} from 'lucide-react';

// Tab groups for organization and highlighting
const primaryTabs = [
  { value: 'resumo', label: 'Resumo', icon: LayoutDashboard },
  { value: 'dados', label: 'Dados', icon: FileText, highlight: true },
  { value: 'config', label: 'Config', icon: Settings, highlight: true },
  { value: 'taxas', label: 'Taxas', icon: Percent, highlight: true },
  { value: 'metodos', label: 'Métodos', icon: CreditCard, highlight: true },
  { value: 'antecipacao', label: 'Antecipação', icon: TrendingUp, highlight: true },
  { value: 'kyc', label: 'KYC', icon: ShieldCheck, highlight: true },
  { value: 'documentos', label: 'Documentos', icon: FolderOpen, highlight: true },
];

const secondaryTabs = [
  { value: 'performance', label: 'Performance', icon: BarChart3 },
  { value: 'transacoes', label: 'Transações', icon: ArrowLeftRight },
  { value: 'financeiro', label: 'Financeiro', icon: Landmark },
  { value: 'saques', label: 'Saques', icon: ArrowUpFromLine },
  { value: 'risco', label: 'Risco', icon: AlertTriangle },
  { value: 'chargebacks', label: 'Chargebacks', icon: ShieldAlert },
  { value: 'meds', label: 'MEDs', icon: Banknote },
];

const tertiaryTabs = [
  { value: 'api', label: 'API', icon: KeyRound },
  { value: 'split', label: 'Split', icon: Split },
  { value: 'recorrencia', label: 'Recorrência', icon: Repeat },
  { value: 'notas', label: 'Notas', icon: StickyNote },
  { value: 'comunicacoes', label: 'Comunicações', icon: MessageSquare },
  { value: 'auditoria', label: 'Auditoria', icon: ClipboardList },
  { value: 'usuarios', label: 'Usuários', icon: Users },
  { value: 'webhooks', label: 'Webhooks', icon: Webhook },
  { value: 'clientusers', label: 'Usuários Cliente', icon: UserCircle },
  { value: 'subsellers', label: 'Sub-sellers', icon: Store },
];

const tabContentMap = {
  resumo: TabResumo,
  performance: TabPerformance,
  dados: TabDadosCadastrais,
  taxas: TabTaxas,
  config: TabConfiguracoes,
  metodos: TabMetodosPagamento,
  api: TabCredenciaisAPI,
  transacoes: TabTransacoes,
  financeiro: TabFinanceiro,
  saques: TabSaques,
  antecipacao: TabAntecipacao,
  risco: TabRisco,
  chargebacks: TabChargebacks,
  meds: TabMEDs,
  documentos: TabDocumentos,
  kyc: TabKYC,
  notas: TabNotas,
  comunicacoes: TabComunicacoes,
  auditoria: TabAuditoria,
  usuarios: TabUsuarios,
  webhooks: TabWebhooks,
  split: TabSplit,
  recorrencia: TabRecorrencia,
  clientusers: TabClientUsers,
  subsellers: TabSubSellers,
};

function TabButton({ tab, activeTab }) {
  const Icon = tab.icon;
  const isActive = activeTab === tab.value;
  return (
    <TabsTrigger
      value={tab.value}
      className={cn(
        "gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
        tab.highlight && !isActive && "font-semibold border border-[#2bc196]/30 bg-[#2bc196]/5 text-[#2bc196] hover:bg-[#2bc196]/10",
        tab.highlight && isActive && "font-bold bg-[#2bc196] text-white shadow-md shadow-[#2bc196]/25",
        !tab.highlight && isActive && "font-semibold bg-slate-800 text-white dark:bg-white dark:text-slate-900",
        !tab.highlight && !isActive && "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {tab.label}
    </TabsTrigger>
  );
}

export default function AdminIntMerchantProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const merchantId = searchParams.get('id');
  const tabParam = searchParams.get('tab') || 'resumo';
  const [activeTab, setActiveTab] = useState(tabParam);

  const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[0];

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ id: merchant.id, tab: value });
  };

  const ActiveTabComponent = tabContentMap[activeTab];

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader 
        title={merchant.business_name}
        subtitle="Perfil 360°"
        breadcrumbs={[
          { label: 'Merchants', page: 'AdminIntMerchants' },
          { label: 'Lista', page: 'AdminIntMerchantsList' },
          { label: merchant.business_name }
        ]}
      />

      <MerchantHeader merchant={merchant} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-3 space-y-3">
          {/* Primary tabs - highlighted */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 hidden lg:block">Principal</span>
            <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-1.5">
              {primaryTabs.map(tab => (
                <TabButton key={tab.value} tab={tab} activeTab={activeTab} />
              ))}
            </TabsList>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* Secondary tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 hidden lg:block">Operações</span>
            <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-1.5">
              {secondaryTabs.map(tab => (
                <TabButton key={tab.value} tab={tab} activeTab={activeTab} />
              ))}
            </TabsList>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* Tertiary tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 hidden lg:block">Mais</span>
            <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-1.5">
              {tertiaryTabs.map(tab => (
                <TabButton key={tab.value} tab={tab} activeTab={activeTab} />
              ))}
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        {Object.entries(tabContentMap).map(([key, Component]) => (
          <TabsContent key={key} value={key}>
            <Component merchant={merchant} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}