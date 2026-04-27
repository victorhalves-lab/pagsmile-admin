// Documentação microscópica — Módulo ADMIN INTERNO (PagSmile back-office)
// Painel interno usado pela equipe da PagSmile para gerir merchants, compliance,
// risco, financeiro, comunicação e configurações globais.

import { AdminIntDashboardDoc } from './docs/adminInterno/AdminIntDashboard';
import { AdminIntDashboardViewsComplementaresDoc } from './docs/adminInterno/AdminIntDashboardViewsComplementares';
import { AdminIntComplianceDoc } from './docs/adminInterno/AdminIntCompliance';
import { AdminIntComplianceComponentsDoc } from './docs/adminInterno/AdminIntComplianceComponents';
import { AdminIntMerchantsDoc } from './docs/adminInterno/AdminIntMerchants';
import { AdminIntMerchantProfileDoc } from './docs/adminInterno/AdminIntMerchantProfile';
import { AdminIntMerchantsExtrasDoc } from './docs/adminInterno/AdminIntMerchantsExtras';
import { AdminIntRiskCoreDoc } from './docs/adminInterno/AdminIntRiskCore';
import { AdminIntDisputesAndBlockagesDoc } from './docs/adminInterno/AdminIntDisputesAndBlockages';
import { AdminIntTransactionsCoreDoc } from './docs/adminInterno/AdminIntTransactionsCore';
import { AdminIntTransactionsOpsDoc } from './docs/adminInterno/AdminIntTransactionsOps';

export const adminInternoModule = {
  id: 'admin-interno',
  label: 'Admin Interno',
  shortLabel: 'Back-office PagSmile',
  description: 'Painel utilizado pela equipe interna da PagSmile para gestão completa da operação: merchants, compliance, transações, financeiro, risco, relatórios, comunicação e administração da plataforma.',
  color: '#8b5cf6',
  iconName: 'ShieldCheck',
  sections: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      pages: [
        { id: 'AdminIntDashboard', label: 'Dashboard Interno (10 views)', route: '/AdminIntDashboard', content: AdminIntDashboardDoc },
        { id: 'AdminIntDashboardViewsComplementares', label: 'Dashboard — Views Complementares (Card/Pix/Boleto/Tech/Alerts)', route: '/AdminIntDashboard?view=complementar', content: AdminIntDashboardViewsComplementaresDoc },
      ],
    },
    {
      id: 'compliance',
      label: 'Compliance',
      pages: [
        { id: 'AdminIntCompliance', label: 'Hub de Compliance (12 abas)', route: '/AdminIntCompliance', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceQueue', label: 'Fila de Compliance', route: '/AdminIntComplianceQueue', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceReview', label: 'Análise Manual', route: '/AdminIntComplianceReview', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceSubmissions', label: 'Submissões', route: '/AdminIntComplianceSubmissions', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceForms', label: 'Gestão de Formulários (QuestionnaireManager)', route: '/AdminIntComplianceForms', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceDocs', label: 'Repositório de Documentos', route: '/AdminIntComplianceDocs', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceRules', label: 'Regras e Workflows (CRUD + 5 tipos)', route: '/AdminIntComplianceRules', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceAudit', label: 'Auditoria de Compliance', route: '/AdminIntComplianceAudit', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceHelena', label: 'Helena IA (Treinamento ML 96/94/95)', route: '/AdminIntComplianceHelena', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceFormLink', label: 'Gerador de Link de Formulário', route: '/AdminIntComplianceFormLink', content: AdminIntComplianceComponentsDoc },
      ],
    },
    {
      id: 'merchants',
      label: 'Merchants',
      pages: [
        { id: 'AdminIntMerchantsOverview', label: 'Gestão Comerciantes & Subcontas (hierárquico)', route: '/AdminIntMerchantsOverview', content: AdminIntMerchantsDoc },
        { id: 'AdminIntMerchants', label: 'Dashboard de Merchants (6 KPIs + 4 charts)', route: '/AdminIntMerchants', content: AdminIntMerchantsDoc },
        { id: 'AdminIntMerchantsList', label: 'Lista de Merchants (11 col + 12 ações + 4 SideDrawers)', route: '/AdminIntMerchantsList', content: AdminIntMerchantsDoc },
        { id: 'AdminIntMerchantProfile', label: 'Perfil 360° (25 abas + Header c/ 5 Dialogs)', route: '/AdminIntMerchantProfile', content: AdminIntMerchantProfileDoc },
        { id: 'AdminIntSubaccounts', label: 'Subcontas & Marketplaces (4 KPIs + 2 tabelas)', route: '/AdminIntSubaccounts', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntLimitRequests', label: 'Solicitações de Limite (SDK base44 REAL)', route: '/AdminIntLimitRequests', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantGroups', label: 'Grupos (CRUD c/ 8 cores + special rates)', route: '/AdminIntMerchantGroups', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantTags', label: 'Tags (CRUD c/ isSystem lock)', route: '/AdminIntMerchantTags', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantReports', label: 'Relatórios de Merchants (6 templates + histórico)', route: '/AdminIntMerchantReports', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntNewMerchant', label: 'Novo Merchant (Wizard 4-step c/ 24 fields)', route: '/AdminIntNewMerchant', content: AdminIntMerchantsExtrasDoc },
      ],
    },
    {
      id: 'merchant-profile-tabs',
      label: 'Perfil 360° — 25 Abas (3 grupos: Principal/Operações/Mais)',
      pages: [
        { id: 'TabResumo', label: 'Aba: Resumo (5 KPIs+Alerts+QuickInfo+MCC+TPV+Activity)', route: '/AdminIntMerchantProfile?tab=resumo', content: AdminIntMerchantProfileDoc },
        { id: 'TabDadosCadastrais', label: 'Aba: Dados Cadastrais', route: '/AdminIntMerchantProfile?tab=dados', content: AdminIntMerchantProfileDoc },
        { id: 'TabKYC', label: 'Aba: KYC/KYB (KYB + N×KYC + 5 Listas + 6 Ações)', route: '/AdminIntMerchantProfile?tab=kyc', content: AdminIntMerchantProfileDoc },
        { id: 'TabDocumentos', label: 'Aba: Documentos', route: '/AdminIntMerchantProfile?tab=documentos', content: AdminIntMerchantProfileDoc },
        { id: 'TabTaxas', label: 'Aba: Taxas', route: '/AdminIntMerchantProfile?tab=taxas', content: AdminIntMerchantProfileDoc },
        { id: 'TabConfiguracoes', label: 'Aba: Configurações', route: '/AdminIntMerchantProfile?tab=config', content: AdminIntMerchantProfileDoc },
        { id: 'TabFinanceiro', label: 'Aba: Financeiro', route: '/AdminIntMerchantProfile?tab=financeiro', content: AdminIntMerchantProfileDoc },
        { id: 'TabTransacoes', label: 'Aba: Transações', route: '/AdminIntMerchantProfile?tab=transacoes', content: AdminIntMerchantProfileDoc },
        { id: 'TabChargebacks', label: 'Aba: Chargebacks', route: '/AdminIntMerchantProfile?tab=chargebacks', content: AdminIntMerchantProfileDoc },
        { id: 'TabSaques', label: 'Aba: Saques', route: '/AdminIntMerchantProfile?tab=saques', content: AdminIntMerchantProfileDoc },
        { id: 'TabSplit', label: 'Aba: Split', route: '/AdminIntMerchantProfile?tab=split', content: AdminIntMerchantProfileDoc },
        { id: 'TabSubSellers', label: 'Aba: SubSellers', route: '/AdminIntMerchantProfile?tab=subsellers', content: AdminIntMerchantProfileDoc },
        { id: 'TabRecorrencia', label: 'Aba: Recorrência', route: '/AdminIntMerchantProfile?tab=recorrencia', content: AdminIntMerchantProfileDoc },
        { id: 'TabAntecipacao', label: 'Aba: Antecipação', route: '/AdminIntMerchantProfile?tab=antecipacao', content: AdminIntMerchantProfileDoc },
        { id: 'TabNotas', label: 'Aba: Notas Internas', route: '/AdminIntMerchantProfile?tab=notas', content: AdminIntMerchantProfileDoc },
        { id: 'TabComunicacoes', label: 'Aba: Comunicações', route: '/AdminIntMerchantProfile?tab=comunicacoes', content: AdminIntMerchantProfileDoc },
        { id: 'TabUsuarios', label: 'Aba: Usuários', route: '/AdminIntMerchantProfile?tab=usuarios', content: AdminIntMerchantProfileDoc },
        { id: 'TabClientUsers', label: 'Aba: Client Users', route: '/AdminIntMerchantProfile?tab=clientusers', content: AdminIntMerchantProfileDoc },
        { id: 'TabCredenciaisAPI', label: 'Aba: Credenciais API', route: '/AdminIntMerchantProfile?tab=api', content: AdminIntMerchantProfileDoc },
        { id: 'TabWebhooks', label: 'Aba: Webhooks', route: '/AdminIntMerchantProfile?tab=webhooks', content: AdminIntMerchantProfileDoc },
        { id: 'TabMEDs', label: 'Aba: MEDs', route: '/AdminIntMerchantProfile?tab=meds', content: AdminIntMerchantProfileDoc },
        { id: 'TabPerformance', label: 'Aba: Desempenho', route: '/AdminIntMerchantProfile?tab=performance', content: AdminIntMerchantProfileDoc },
        { id: 'TabRisco', label: 'Aba: Risco', route: '/AdminIntMerchantProfile?tab=risco', content: AdminIntMerchantProfileDoc },
        { id: 'TabAuditoria', label: 'Aba: Auditoria', route: '/AdminIntMerchantProfile?tab=auditoria', content: AdminIntMerchantProfileDoc },
        { id: 'TabMetodosPagamento', label: 'Aba: Métodos de Pagamento', route: '/AdminIntMerchantProfile?tab=metodos', content: AdminIntMerchantProfileDoc },
      ],
    },
    {
      id: 'transactions',
      label: 'Transações',
      pages: [
        { id: 'AdminIntTransactionsDashboard', label: 'Dashboard (6 KPIs + Insights AI Banner navy + 4 Tabs Overview/Card/PIX/Declines c/ Recharts)', route: '/AdminIntTransactionsDashboard', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntTransactionsList', label: 'Lista (3 Tabs c/ KPIs dinâmicos + tabela 8-col + paginação numérica)', route: '/AdminIntTransactionsList', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntTransactionDetail', label: 'Detalhe (Header 4-grid + 7 Tabs + Timeline 8 eventos hardcoded + 2 SideDrawers Refund/Reveal)', route: '/AdminIntTransactionDetail', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntOrchestration', label: 'Orquestração (3 Tabs Global/Rules/Merchants + 5 Acquirers c/ GripVertical + 4 Rules + Switches)', route: '/AdminIntOrchestration', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntBINAnalysis', label: 'Análise BIN (3 Tabs BINs/Issuers/Trends + 8 BINs + 6 Issuers + LineChart 4 lines)', route: '/AdminIntBINAnalysis', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntRetryIntelligence', label: 'Retry Intelligence (4 Tabs + 4 RetryRules + Visual Flow Cartão→PIX + AI Insight Banner)', route: '/AdminIntRetryIntelligence', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntBatchProcessing', label: 'Batch Processing (4 OperationCards + Drag&Drop CSV + 4 Templates + Histórico Progress)', route: '/AdminIntBatchProcessing', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntReconciliation', label: 'Reconciliação (5 stats + 3 Tabs c/ apenas Divergent populado + 3 cenários DIV)', route: '/AdminIntReconciliation', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntTransactionReports', label: 'Relatórios (Form 3-fields + 7 tipos + 4 mocks ready/generating)', route: '/AdminIntTransactionReports', content: AdminIntTransactionsOpsDoc },
      ],
    },
    {
      id: 'financial',
      label: 'Financeiro',
      pages: [
        { id: 'AdminIntFinancialDashboard', label: 'Dashboard Financeiro', route: '/AdminIntFinancialDashboard', content: null },
        { id: 'AdminIntFinancialResults', label: 'Resultados Financeiros', route: '/AdminIntFinancialResults', content: null },
        { id: 'AdminIntClientProfitability', label: 'Rentabilidade por Cliente', route: '/AdminIntClientProfitability', content: null },
        { id: 'AdminIntConciliation', label: 'Conciliação', route: '/AdminIntConciliation', content: null },
        { id: 'AdminIntPaymentAgenda', label: 'Agenda de Pagamentos', route: '/AdminIntPaymentAgenda', content: null },
        { id: 'AdminIntSettlements', label: 'Settlements', route: '/AdminIntSettlements', content: null },
        { id: 'AdminIntWithdrawals', label: 'Saques', route: '/AdminIntWithdrawals', content: null },
        { id: 'AdminIntWithdrawalApprovals', label: 'Aprovações de Saque', route: '/AdminIntWithdrawalApprovals', content: null },
        { id: 'AdminIntAnticipations', label: 'Antecipações', route: '/AdminIntAnticipations', content: null },
        { id: 'AdminIntStatements', label: 'Extratos', route: '/AdminIntStatements', content: null },
        { id: 'AdminIntBalanceManagement', label: 'Gestão de Saldos', route: '/AdminIntBalanceManagement', content: null },
      ],
    },
    {
      id: 'risk',
      label: 'Risco',
      pages: [
        { id: 'AdminIntRiskDashboard', label: 'Dashboard de Risco (5 KPIs + LineChart c/ ReferenceLine 1% + 4 cards + Top5)', route: '/AdminIntRiskDashboard', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntFraudMonitoring', label: 'Monitoramento de Fraude (Score+5 fatores+Dialog 3-radio decision)', route: '/AdminIntFraudMonitoring', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntChargebacksList', label: 'Chargebacks (6 stats + 7 filters + native table c/ CSS vars)', route: '/AdminIntChargebacksList', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntPreChargebacks', label: 'Pré-Chargebacks (Ethoca/Verifi 4-10h c/ pulse + SideDrawer 5 ações)', route: '/AdminIntPreChargebacks', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntMEDsList', label: 'MEDs (PIX BACEN 7d c/ 5 stats + 4 status sem awaiting)', route: '/AdminIntMEDsList', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntRiskRules', label: 'Regras de Risco (4 mocks c/ category-priority-action + SideDrawer)', route: '/AdminIntRiskRules', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntControlLists', label: 'Listas de Controle (Tabs Black/White + 6 stats + 5 tipos)', route: '/AdminIntControlLists', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntRiskAlerts', label: 'Alertas de Risco (5 ativos+severity+histórico c/ resolvedBy)', route: '/AdminIntRiskAlerts', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntBlockages', label: 'Bloqueios (DataTable + SideDrawer 5 fields + 5 tipos + Warning)', route: '/AdminIntBlockages', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntAntifraud', label: 'Antifraude (Tabs minúsculo c/ DataTable+Switch)', route: '/AdminIntAntifraud', content: AdminIntRiskCoreDoc },
      ],
    },
    {
      id: 'reports',
      label: 'Relatórios',
      pages: [
        { id: 'AdminIntReportsHub', label: 'Hub de Relatórios', route: '/AdminIntReportsHub', content: null },
        { id: 'AdminIntReportsOperational', label: 'Operacionais', route: '/AdminIntReportsOperational', content: null },
        { id: 'AdminIntReportsFinancial', label: 'Financeiros', route: '/AdminIntReportsFinancial', content: null },
        { id: 'AdminIntReportsRisk', label: 'Risco', route: '/AdminIntReportsRisk', content: null },
        { id: 'AdminIntReportsCustom', label: 'Customizados', route: '/AdminIntReportsCustom', content: null },
        { id: 'AdminIntAnalytics', label: 'Analytics & BI', route: '/AdminIntAnalytics', content: null },
      ],
    },
    {
      id: 'communication',
      label: 'Comunicação',
      pages: [
        { id: 'AdminIntCommDashboard', label: 'Dashboard de Comunicação', route: '/AdminIntCommDashboard', content: null },
        { id: 'AdminIntCommAutomations', label: 'Automações de E-mail', route: '/AdminIntCommAutomations', content: null },
        { id: 'AdminIntCommTemplates', label: 'Templates', route: '/AdminIntCommTemplates', content: null },
        { id: 'AdminIntCommSMTP', label: 'Configuração SMTP', route: '/AdminIntCommSMTP', content: null },
        { id: 'AdminIntCommSenders', label: 'Remetentes', route: '/AdminIntCommSenders', content: null },
        { id: 'AdminIntCommLogs', label: 'Logs', route: '/AdminIntCommLogs', content: null },
      ],
    },
    {
      id: 'administration',
      label: 'Administração',
      pages: [
        { id: 'AdminIntSettings', label: 'Configurações Gerais', route: '/AdminIntSettings', content: null },
        { id: 'AdminIntUsers', label: 'Usuários', route: '/AdminIntUsers', content: null },
        { id: 'AdminIntProfiles', label: 'Perfis & Permissões', route: '/AdminIntProfiles', content: null },
        { id: 'AdminIntGlobalRates', label: 'Taxas Globais', route: '/AdminIntGlobalRates', content: null },
        { id: 'AdminIntRiskParams', label: 'Parâmetros de Risco', route: '/AdminIntRiskParams', content: null },
        { id: 'AdminIntIntegrations', label: 'Integrações', route: '/AdminIntIntegrations', content: null },
        { id: 'AdminIntTemplates', label: 'Templates', route: '/AdminIntTemplates', content: null },
        { id: 'AdminIntSystemLogs', label: 'Logs do Sistema', route: '/AdminIntSystemLogs', content: null },
        { id: 'AdminIntMCCs', label: 'MCCs', route: '/AdminIntMCCs', content: null },
        { id: 'AdminIntMCCsAnalysis', label: 'Análise de MCCs', route: '/AdminIntMCCsAnalysis', content: null },
        { id: 'AdminIntPartners', label: 'Parceiros & Custos', route: '/AdminIntPartners', content: null },
        { id: 'AdminIntFeePlans', label: 'Planos de Taxa', route: '/AdminIntFeePlans', content: null },
        { id: 'AdminIntAiAgents', label: 'Configuração de Agentes IA', route: '/AdminIntAiAgents', content: null },
      ],
    },
    {
      id: 'ai-agents',
      label: 'Agentes IA Internos',
      pages: [
        { id: 'AdminIntPagSmileCopilot', label: 'PagSmile Copilot', route: '/AdminIntPagSmileCopilot', content: null },
        { id: 'AdminIntPagSmileCopilotSettings', label: 'PagSmile Copilot — Settings', route: '/AdminIntPagSmileCopilotSettings', content: null },
        { id: 'AdminIntRecoveryAgent', label: 'Recovery Agent (Interno)', route: '/AdminIntRecoveryAgent', content: null },
        { id: 'AdminIntRecoveryAgentSettings', label: 'Recovery Agent — Settings', route: '/AdminIntRecoveryAgentSettings', content: null },
        { id: 'AdminIntConverterAgent', label: 'Converter Agent (Interno)', route: '/AdminIntConverterAgent', content: null },
        { id: 'AdminIntConverterAgentSettings', label: 'Converter Agent — Settings', route: '/AdminIntConverterAgentSettings', content: null },
        { id: 'AdminIntDisputeManager', label: 'Dispute Manager (Interno)', route: '/AdminIntDisputeManager', content: null },
        { id: 'AdminIntDisputeManagerSettings', label: 'Dispute Manager — Settings', route: '/AdminIntDisputeManagerSettings', content: null },
        { id: 'AdminIntIdentityOnboarder', label: 'Identity Onboarder', route: '/AdminIntIdentityOnboarder', content: null },
        { id: 'AdminIntIdentityOnboarderSettings', label: 'Identity Onboarder — Settings', route: '/AdminIntIdentityOnboarderSettings', content: null },
      ],
    },
  ],
};