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
import { AdminIntFinancialCoreDoc } from './docs/adminInterno/AdminIntFinancialCore';
import { AdminIntFinancialOpsDoc } from './docs/adminInterno/AdminIntFinancialOps';
import { AdminIntSubaccountsDetailDoc } from './docs/adminInterno/AdminIntSubaccountsDetail';
import { AdminIntReportsDoc } from './docs/adminInterno/AdminIntReports';
import { AdminIntCommunicationDoc } from './docs/adminInterno/AdminIntCommunication';
import { AdminIntAdministrationCoreDoc } from './docs/adminInterno/AdminIntAdministrationCore';
import { AdminIntAdministrationAdvancedDoc } from './docs/adminInterno/AdminIntAdministrationAdvanced';

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
        { id: 'AdminIntFinancialDashboard', label: 'Dashboard Financeiro (5 KPIs gradient + AreaChart TPV 6m + Receita por Produto + Agenda 5 dias + 4 alertas)', route: '/AdminIntFinancialDashboard', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntFinancialResults', label: 'Resultados Financeiros (P&L COM SDK REAL: 5 KPIs + Composição 10 receitas + 10 custos + ROI Pré-CB +1107% + Tendência 6m + DataTable)', route: '/AdminIntFinancialResults', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntClientProfitability', label: 'Splits e Ganhos por Cliente (4 SDK queries + spread/margem por cliente + BarChart Top10 + DataTable 8-col com 2 navegações)', route: '/AdminIntClientProfitability', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntConciliation', label: 'Conciliação (4 KPIs + 4 Tabs Overview/Methods/Cycles D+0-D+30/Divergent 5 tipos + Atualizar fake setTimeout)', route: '/AdminIntConciliation', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntPaymentAgenda', label: 'Agenda de Pagamentos (6 KPIs + 3 Tabs Overview BarChart/Calendar shadcn ptBR/List + suporte valores negativos)', route: '/AdminIntPaymentAgenda', content: AdminIntFinancialCoreDoc },
        { id: 'AdminIntSettlements', label: 'Liquidações (3 Tabs Agenda/Execute/History + Checkbox seletivo só pending + DropdownMenu condicional + Batch bar)', route: '/AdminIntSettlements', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntWithdrawals', label: 'Saques (5 stats + tabela 8-col + 2 SideDrawers Detail size=lg c/ 4 validações green hardcoded + Reject c/ 5 motivos)', route: '/AdminIntWithdrawals', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntWithdrawalApprovals', label: 'Aprovação de Saques (ÚNICO COM PERSISTÊNCIA REAL: SDK + Mutation + 9-col Table + SideDrawer Review c/ Risk Flags)', route: '/AdminIntWithdrawalApprovals', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntAnticipations', label: 'Antecipações (5 stats + 3 Tabs Requests/Agenda placeholder/History + Check/X toast fake)', route: '/AdminIntAnticipations', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntStatements', label: 'Extratos (Selector merchant decorativo + Card hardcoded "Loja do João" + 4 summary + tabela 4-col com saldo running)', route: '/AdminIntStatements', content: AdminIntFinancialOpsDoc },
        { id: 'AdminIntBalanceManagement', label: 'Gestão de Saldos (5 stats c/ Negativo + tabela 6-col + 2 Dialogs Adjust c/ radio Crédito/Débito + Block c/ 5 motivos)', route: '/AdminIntBalanceManagement', content: AdminIntFinancialOpsDoc },
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
      label: 'Relatórios — 6 páginas (ordem do menu layout.jsx)',
      pages: [
        { id: 'AdminIntReportsHub', label: 'Hub de Relatórios (Search + Favoritos 3 + Recentes 3 + Catálogo 13 c/ 4 Tabs + Agendados 3 + 2 Dialogs)', route: '/AdminIntReportsHub', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsOperational', label: 'Operacionais (4 Tabs: Summary 7-col / TPV BarChart stack 4 séries / Conversion funil divs / Methods PieChart)', route: '/AdminIntReportsOperational', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsFinancial', label: 'Financeiros (3 Tabs: Settlement 9-col / Receivables 6-col / DRE P&L desenhado c/ cálculo runtime totalRev-totalCost)', route: '/AdminIntReportsFinancial', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsRisk', label: 'Risco (3 Tabs: Chargebacks 2-cards / CB Ratio c/ row red crítica / Fraud BarChart 2 séries)', route: '/AdminIntReportsRisk', content: AdminIntReportsDoc },
        { id: 'AdminIntReportsCustom', label: 'Customizados (Construtor visual: Source 6/Fields/Filters 7-ops/Group+Order — drag&drop FAKE + PageHeader prop errado)', route: '/AdminIntReportsCustom', content: AdminIntReportsDoc },
        { id: 'AdminIntAnalytics', label: 'Analytics & BI (5 Tabs MAS apenas overview populada — AreaChart 12m + PieChart + Top10 + BarChart approval + Risk indicators + Predictions Sparkles purple)', route: '/AdminIntAnalytics', content: AdminIntReportsDoc },
      ],
    },
    {
      id: 'communication',
      label: 'Comunicação — 6 páginas (ordem do menu layout.jsx)',
      pages: [
        { id: 'AdminIntCommDashboard', label: 'Dashboard (5 KPIs c/ isNegative invertido / LineChart Volume / 5 barras CUSTOM Distribuição / Top 5 Templates / 3 Problemas / Top Automações Table 5-col)', route: '/AdminIntCommDashboard', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommAutomations', label: 'Régua de E-mails (Stats grid-5 + 4 categorias 11 automações + Modal 4-tab Info/Trigger SelectGroup hack/Template/Config + 2 checkboxes default)', route: '/AdminIntCommAutomations', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommTemplates', label: 'Templates (12 hardcoded + filtragem REAL + Editor 4-tab Visual/HTML + Variables 12 mustache c/ clipboard REAL + Preview vazio)', route: '/AdminIntCommTemplates', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommSMTP', label: 'Configuração SMTP (Status Card + 5 providers selecionáveis MAS form hardcoded SES + Secret hardcoded em código + 4 checkboxes tracking + Test 2s)', route: '/AdminIntCommSMTP', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommSenders', label: 'Remetentes (4 senders + 2 domains + 3 DNS records SPF/DKIM/DMARC c/ clipboard REAL + StatusIcon helper + 2 modais)', route: '/AdminIntCommSenders', content: AdminIntCommunicationDoc },
        { id: 'AdminIntCommLogs', label: 'Logs (5 filtros decorativos + 6 mocks 5 status + Cards verticais c/ hover actions + Pagination 100% fake + Detail Modal 3-tab Info/Content vazio/Timeline)', route: '/AdminIntCommLogs', content: AdminIntCommunicationDoc },
      ],
    },
    {
      id: 'administration',
      label: 'Administração — 13 páginas (ordem do menu layout.jsx linhas 349-361)',
      pages: [
        { id: 'AdminIntSettings', label: 'Configurações Gerais (5 Sections inline c/ onEdit + Dialog único reutilizado c/ ternário aninhado no title)', route: '/AdminIntSettings', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntUsers', label: 'Usuários (5 hardcoded + 5 stats calculados + filtros + Modal 3-grupos c/ radio nativo + ações condicionais por status)', route: '/AdminIntUsers', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntProfiles', label: 'Perfis & Permissões (5 SystemProfiles + permissionsData 6 módulos / 51 perms — viewModal SEMPRE mostra analyst BUG)', route: '/AdminIntProfiles', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntGlobalRates', label: 'Taxas Globais (7 cards: Crédito Table 5-bandeiras + Débito + PIX + Boleto + Antec + Saque + Liquid — 6/7 hardcoded no JSX)', route: '/AdminIntGlobalRates', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntRiskParams', label: 'Parâmetros de Risco (4 cards: CB Thresholds 4 colored / Antifraude / Limites / Monitoramento c/ Switches sem state)', route: '/AdminIntRiskParams', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntIntegrations', label: 'Integrações (4 categorias: Acquirers/Antifraude/Banking/Notif + IntegrationCard inline + 2 SideDrawers — única usando SideDrawer)', route: '/AdminIntIntegrations', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntTemplates', label: 'Templates (4 Tabs c/ 15 templates — DUPLICA AdminIntCommTemplates 12 templates / Edit + Preview Dialog)', route: '/AdminIntTemplates', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntSystemLogs', label: 'Logs do Sistema (4 Tabs Audit/System terminal/API table/Errors PLACEHOLDER + filtros decorativos + Pagination fake)', route: '/AdminIntSystemLogs', content: AdminIntAdministrationCoreDoc },
        { id: 'AdminIntMCCs', label: 'MCCs (Catálogo c/ KPICard external + Insights c/ Link órfão / Table 5 MCCs / Modal Novo c/ 4 fields)', route: '/AdminIntMCCs', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntMCCsAnalysis', label: 'Análise de MCCs (ÚNICA REAL c/ useQuery Subaccount filter status=active limit 500 + KPIs computados useMemo + Detail Modal 5 seções condicionais)', route: '/AdminIntMCCsAnalysis', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntPartners', label: 'Parceiros & Custos (DataTable c/ 5 partners — BUG: Status sempre Badge "Ativo" hardcoded ignora data + Link sem ID p/ Detail órfã)', route: '/AdminIntPartners', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntFeePlans', label: 'Planos de Taxa (4 cards Starter→Enterprise / SideDrawer 7 fields / 2 Links órfãs Simulador+Detail)', route: '/AdminIntFeePlans', content: AdminIntAdministrationAdvancedDoc },
        { id: 'AdminIntAiAgents', label: 'Configuração de Agentes IA (Showcase 100% estático / 3 AgentCards PRISCILA+HELENA+DIA / Configurar+Logs SEM onClick / não linka para páginas reais dos agentes)', route: '/AdminIntAiAgents', content: AdminIntAdministrationAdvancedDoc },
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