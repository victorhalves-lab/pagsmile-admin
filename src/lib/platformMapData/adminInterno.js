// Documentação microscópica — Módulo ADMIN INTERNO (PagSmile back-office)
// Painel interno usado pela equipe da PagSmile para gerir merchants, compliance,
// risco, financeiro, comunicação e configurações globais.

import { AdminIntDashboardDoc } from './docs/adminInterno/v2/AdminIntDashboard';
import { AdminIntDashboardViewsComplementaresDoc } from './docs/adminInterno/AdminIntDashboardViewsComplementares';
import { AdminIntComplianceDoc } from './docs/adminInterno/AdminIntCompliance';
import { AdminIntComplianceComponentsDoc } from './docs/adminInterno/AdminIntComplianceComponents';
import { AdminIntMerchantsDoc } from './docs/adminInterno/AdminIntMerchants';
import { AdminIntMerchantsOverviewDoc } from './docs/adminInterno/v2/AdminIntMerchantsOverview';
import { AdminIntComplianceQueueDoc } from './docs/adminInterno/v2/AdminIntComplianceQueue';
import { AdminIntMerchantProfileDoc } from './docs/adminInterno/AdminIntMerchantProfile';
import { AdminIntMerchantsExtrasDoc } from './docs/adminInterno/AdminIntMerchantsExtras';
import { AdminIntRiskCoreDoc } from './docs/adminInterno/AdminIntRiskCore';
import { AdminIntDisputesAndBlockagesDoc } from './docs/adminInterno/AdminIntDisputesAndBlockages';
import { AdminIntTransactionsCoreDoc } from './docs/adminInterno/AdminIntTransactionsCore';
import { AdminIntTransactionsOpsDoc } from './docs/adminInterno/AdminIntTransactionsOps';
import { AdminIntFinancialCoreDoc } from './docs/adminInterno/AdminIntFinancialCore';
import { AdminIntFinancialOpsDoc } from './docs/adminInterno/AdminIntFinancialOps';
import { AdminIntSubaccountsDetailDoc } from './docs/adminInterno/AdminIntSubaccountsDetail';
import { AdminIntReportsDoc } from './docs/adminInterno/AdminIntReports';
import { AdminIntCommunicationDoc } from './docs/adminInterno/AdminIntCommunication';
import { AdminIntAdministrationCoreDoc } from './docs/adminInterno/AdminIntAdministrationCore';
import { AdminIntAdministrationAdvancedDoc } from './docs/adminInterno/AdminIntAdministrationAdvanced';
import { AdminIntAgentsPart1Doc } from './docs/adminInterno/AdminIntAgentsPart1';
import { AdminIntDisputeManagerDoc } from './docs/adminInterno/AdminIntDisputeManager';
import { AdminIntIdentityOnboarderDoc } from './docs/adminInterno/AdminIntIdentityOnboarder';

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
        { id: 'AdminIntDashboard', label: 'Dashboard Interno', route: '/AdminIntDashboard', content: AdminIntDashboardDoc },
        { id: 'AdminIntDashboardViewsComplementares', label: 'Dashboard — Views Complementares', route: '/AdminIntDashboard?view=complementar', content: AdminIntDashboardViewsComplementaresDoc },
      ],
    },
    {
      id: 'compliance',
      label: 'Compliance',
      pages: [
        { id: 'AdminIntCompliance', label: 'Hub de Compliance', route: '/AdminIntCompliance', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceQueue', label: 'Fila de Compliance', route: '/AdminIntComplianceQueue', content: AdminIntComplianceQueueDoc },
        { id: 'AdminIntComplianceReview', label: 'Análise Manual', route: '/AdminIntComplianceReview', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceSubmissions', label: 'Submissões', route: '/AdminIntComplianceSubmissions', content: AdminIntComplianceDoc },
        { id: 'AdminIntComplianceForms', label: 'Gestão de Formulários', route: '/AdminIntComplianceForms', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceDocs', label: 'Repositório de Documentos', route: '/AdminIntComplianceDocs', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceRules', label: 'Regras e Workflows', route: '/AdminIntComplianceRules', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceAudit', label: 'Auditoria de Compliance', route: '/AdminIntComplianceAudit', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceHelena', label: 'Helena IA — Treinamento', route: '/AdminIntComplianceHelena', content: AdminIntComplianceComponentsDoc },
        { id: 'AdminIntComplianceFormLink', label: 'Gerador de Link de Formulário', route: '/AdminIntComplianceFormLink', content: AdminIntComplianceComponentsDoc },
      ],
    },
    {
      id: 'merchants',
      label: 'Merchants',
      pages: [
        { id: 'AdminIntMerchantsOverview', label: 'Gestão Comerciantes & Subcontas', route: '/AdminIntMerchantsOverview', content: AdminIntMerchantsOverviewDoc },
        { id: 'AdminIntMerchants', label: 'Dashboard de Merchants', route: '/AdminIntMerchants', content: AdminIntMerchantsDoc },
        { id: 'AdminIntMerchantsList', label: 'Lista de Merchants', route: '/AdminIntMerchantsList', content: AdminIntMerchantsDoc },
        { id: 'AdminIntMerchantProfile', label: 'Perfil 360° do Merchant', route: '/AdminIntMerchantProfile', content: AdminIntMerchantProfileDoc },
        { id: 'AdminIntSubaccounts', label: 'Subcontas & Marketplaces', route: '/AdminIntSubaccounts', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntLimitRequests', label: 'Solicitações de Limite', route: '/AdminIntLimitRequests', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantGroups', label: 'Grupos de Merchants', route: '/AdminIntMerchantGroups', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantTags', label: 'Tags de Merchants', route: '/AdminIntMerchantTags', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntMerchantReports', label: 'Relatórios de Merchants', route: '/AdminIntMerchantReports', content: AdminIntMerchantsExtrasDoc },
        { id: 'AdminIntNewMerchant', label: 'Novo Merchant (Wizard)', route: '/AdminIntNewMerchant', content: AdminIntMerchantsExtrasDoc },
      ],
    },
    {
      id: 'merchant-profile-tabs',
      label: 'Perfil 360° — 25 Abas',
      pages: [
        { id: 'TabResumo', label: 'Aba: Resumo', route: '/AdminIntMerchantProfile?tab=resumo', content: AdminIntMerchantProfileDoc },
        { id: 'TabDadosCadastrais', label: 'Aba: Dados Cadastrais', route: '/AdminIntMerchantProfile?tab=dados', content: AdminIntMerchantProfileDoc },
        { id: 'TabKYC', label: 'Aba: KYC/KYB', route: '/AdminIntMerchantProfile?tab=kyc', content: AdminIntMerchantProfileDoc },
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
        { id: 'AdminIntTransactionsDashboard', label: 'Dashboard de Transações', route: '/AdminIntTransactionsDashboard', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntTransactionsList', label: 'Lista de Transações', route: '/AdminIntTransactionsList', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntTransactionDetail', label: 'Detalhe da Transação', route: '/AdminIntTransactionDetail', content: AdminIntTransactionsCoreDoc },
        { id: 'AdminIntOrchestration', label: 'Orquestração', route: '/AdminIntOrchestration', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntBINAnalysis', label: 'Análise BIN', route: '/AdminIntBINAnalysis', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntRetryIntelligence', label: 'Retry Intelligence', route: '/AdminIntRetryIntelligence', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntBatchProcessing', label: 'Batch Processing', route: '/AdminIntBatchProcessing', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntReconciliation', label: 'Reconciliação', route: '/AdminIntReconciliation', content: AdminIntTransactionsOpsDoc },
        { id: 'AdminIntTransactionReports', label: 'Relatórios de Transações', route: '/AdminIntTransactionReports', content: AdminIntTransactionsOpsDoc },
      ],
    },
    {
      id: 'financial',
      label: 'Financeiro',
      pages: [
        { id: 'AdminIntFinancialDashboard', label: 'Dashboard Financeiro', route: '/AdminIntFinancialDashboard', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntFinancialResults', label: 'Resultados Financeiros (P&L)', route: '/AdminIntFinancialResults', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntClientProfitability', label: 'Splits e Ganhos por Cliente', route: '/AdminIntClientProfitability', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntConciliation', label: 'Conciliação', route: '/AdminIntConciliation', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntPaymentAgenda', label: 'Agenda de Pagamentos', route: '/AdminIntPaymentAgenda', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntSettlements', label: 'Liquidações', route: '/AdminIntSettlements', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntWithdrawals', label: 'Saques', route: '/AdminIntWithdrawals', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntWithdrawalApprovals', label: 'Aprovação de Saques', route: '/AdminIntWithdrawalApprovals', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntAnticipations', label: 'Antecipações', route: '/AdminIntAnticipations', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntStatements', label: 'Extratos', route: '/AdminIntStatements', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntBalanceManagement', label: 'Gestão de Saldos', route: '/AdminIntBalanceManagement', content: AdminIntFinancialOpsDoc },
      ],
    },
    {
      id: 'risk',
      label: 'Risco',
      pages: [
        { id: 'AdminIntRiskDashboard', label: 'Dashboard de Risco', route: '/AdminIntRiskDashboard', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntFraudMonitoring', label: 'Monitoramento de Fraude', route: '/AdminIntFraudMonitoring', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntChargebacksList', label: 'Chargebacks', route: '/AdminIntChargebacksList', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntPreChargebacks', label: 'Pré-Chargebacks', route: '/AdminIntPreChargebacks', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntMEDsList', label: 'MEDs (PIX BACEN)', route: '/AdminIntMEDsList', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntRiskRules', label: 'Regras de Risco', route: '/AdminIntRiskRules', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntControlLists', label: 'Listas de Controle', route: '/AdminIntControlLists', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntRiskAlerts', label: 'Alertas de Risco', route: '/AdminIntRiskAlerts', content: AdminIntRiskCoreDoc },
        { id: 'AdminIntBlockages', label: 'Bloqueios', route: '/AdminIntBlockages', content: AdminIntDisputesAndBlockagesDoc },
        { id: 'AdminIntAntifraud', label: 'Antifraude', route: '/AdminIntAntifraud', content: AdminIntRiskCoreDoc },
      ],
    },
    {
      id: 'reports',
      label: 'Relatórios',
      pages: [
        { id: 'AdminIntReportsHub', label: 'Hub de Relatórios', route: '/AdminIntReportsHub', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsOperational', label: 'Relatórios Operacionais', route: '/AdminIntReportsOperational', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsFinancial', label: 'Relatórios Financeiros', route: '/AdminIntReportsFinancial', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsRisk', label: 'Relatórios de Risco', route: '/AdminIntReportsRisk', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsCustom', label: 'Relatórios Customizados', route: '/AdminIntReportsCustom', content: AdminIntReportsDoc },
        { id: 'AdminIntAnalytics', label: 'Analytics & BI', route: '/AdminIntAnalytics', content: AdminIntReportsDoc },
      ],
    },
    {
      id: 'communication',
      label: 'Comunicação',
      pages: [
        { id: 'AdminIntCommDashboard', label: 'Dashboard de Comunicação', route: '/AdminIntCommDashboard', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommAutomations', label: 'Régua de E-mails', route: '/AdminIntCommAutomations', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommTemplates', label: 'Templates de E-mail', route: '/AdminIntCommTemplates', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommSMTP', label: 'Configuração SMTP', route: '/AdminIntCommSMTP', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommSenders', label: 'Remetentes', route: '/AdminIntCommSenders', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommLogs', label: 'Logs de E-mail', route: '/AdminIntCommLogs', content: AdminIntCommunicationDoc },
      ],
    },
    {
      id: 'administration',
      label: 'Administração',
      pages: [
        { id: 'AdminIntSettings', label: 'Configurações Gerais', route: '/AdminIntSettings', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntUsers', label: 'Usuários', route: '/AdminIntUsers', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntProfiles', label: 'Perfis & Permissões', route: '/AdminIntProfiles', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntGlobalRates', label: 'Taxas Globais', route: '/AdminIntGlobalRates', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntRiskParams', label: 'Parâmetros de Risco', route: '/AdminIntRiskParams', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntIntegrations', label: 'Integrações', route: '/AdminIntIntegrations', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntTemplates', label: 'Templates', route: '/AdminIntTemplates', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntSystemLogs', label: 'Logs do Sistema', route: '/AdminIntSystemLogs', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntMCCs', label: 'MCCs (Catálogo)', route: '/AdminIntMCCs', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntMCCsAnalysis', label: 'Análise de MCCs', route: '/AdminIntMCCsAnalysis', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntPartners', label: 'Parceiros & Custos', route: '/AdminIntPartners', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntFeePlans', label: 'Planos de Taxa', route: '/AdminIntFeePlans', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntAiAgents', label: 'Configuração de Agentes IA', route: '/AdminIntAiAgents', content: AdminIntAdministrationAdvancedDoc },
      ],
    },
    {
      id: 'ai-agents',
      label: 'Agentes IA Internos',
      pages: [
        { id: 'AdminIntPagSmileCopilot', label: 'PagSmile Copilot — Hub', route: '/AdminIntPagSmileCopilot', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntPagSmileCopilotSettings', label: 'PagSmile Copilot — Settings', route: '/AdminIntPagSmileCopilotSettings', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntRecoveryAgent', label: 'Recovery Agent — Hub', route: '/AdminIntRecoveryAgent', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntRecoveryAgentSettings', label: 'Recovery Agent — Settings', route: '/AdminIntRecoveryAgentSettings', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntConverterAgent', label: 'Converter Agent — Hub', route: '/AdminIntConverterAgent', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntConverterAgentSettings', label: 'Converter Agent — Settings', route: '/AdminIntConverterAgentSettings', content: AdminIntAgentsPart1Doc },
        { id: 'AdminIntDisputeManager', label: 'Dispute Manager — Hub', route: '/AdminIntDisputeManager', content: AdminIntDisputeManagerDoc },
        { id: 'AdminIntDisputeManagerSettings', label: 'Dispute Manager — Settings', route: '/AdminIntDisputeManagerSettings', content: AdminIntDisputeManagerDoc },
        { id: 'AdminIntIdentityOnboarder', label: 'Identity Onboarder — Hub', route: '/AdminIntIdentityOnboarder', content: AdminIntIdentityOnboarderDoc },
        { id: 'AdminIntIdentityOnboarderSettings', label: 'Identity Onboarder — Settings', route: '/AdminIntIdentityOnboarderSettings', content: AdminIntIdentityOnboarderDoc },
      ],
    },
  ],
};