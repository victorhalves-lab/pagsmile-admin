// Documentação microscópica — Módulo ADMIN SUB (Portal do Merchant)
// Cada página recebe documentação completa em entregas progressivas.
// Páginas ainda sem documentação ficam com `content: null` (mostram placeholder).

import { DashboardDoc } from './docs/adminSub/Dashboard';
import { TransactionDetailDoc } from './docs/adminSub/TransactionDetail';
import {
  TransactionsDoc,
  CardTransactionsDoc,
  PixTransactionsDoc,
  DeclineAnalysisDoc,
} from './docs/adminSub/Transactions';
import {
  CheckoutBuilderDoc,
  CheckoutsDoc,
  CheckoutTemplatesDoc,
} from './docs/adminSub/Checkout';
import {
  CheckoutAnalyticsDoc,
  ConverterAgentDoc,
  ConverterAgentSettingsDoc,
} from './docs/adminSub/CheckoutAnalyticsAndAgent';
import {
  PaymentLinksDoc,
  PaymentLinkCreateDoc,
} from './docs/adminSub/PaymentLinks';
import {
  CouponsOverviewDoc,
  CouponListDoc,
  CouponFormDoc,
  CouponDetailDoc,
} from './docs/adminSub/Coupons';
import { SubscriptionsDoc } from './docs/adminSub/Subscriptions';
import { SubscriptionPlansDoc } from './docs/adminSub/SubscriptionPlans';
import { RecurrenceDoc } from './docs/adminSub/Recurrence';
import { DunningSettingsDoc } from './docs/adminSub/DunningSettings';
import { SubscriptionAnalyticsDoc } from './docs/adminSub/SubscriptionAnalytics';
import { DisputeDashboardDoc } from './docs/adminSub/DisputeDashboard';
import { PreChargebacksDoc } from './docs/adminSub/PreChargebacks';
import { ChargebacksDoc } from './docs/adminSub/Chargebacks';
import { MEDDashboardDoc } from './docs/adminSub/MEDDashboard';
import { DisputeContestationDoc } from './docs/adminSub/DisputeContestation';
import { DisputeManagerDoc } from './docs/adminSub/DisputeManager';
import { DisputeManagerSettingsDoc } from './docs/adminSub/DisputeManagerSettings';
import { FinancialOverviewDoc } from './docs/adminSub/FinancialOverview';
import { FinancialStatementDoc } from './docs/adminSub/FinancialStatement';
import { ReceivablesAgendaDoc } from './docs/adminSub/ReceivablesAgenda';
import { FeesDoc } from './docs/adminSub/Fees';
import { FeesAnalysisDoc } from './docs/adminSub/FeesAnalysis';
import { AnticipationDoc } from './docs/adminSub/Anticipation';
import { SplitManagementDoc } from './docs/adminSub/SplitManagement';
import { WithdrawalsDoc } from './docs/adminSub/Withdrawals';

export const adminSubModule = {
  id: 'admin-sub',
  label: 'Admin Sub',
  shortLabel: 'Portal Merchant',
  description: 'Painel utilizado pelos merchants (clientes da PagSmile) para gerir pagamentos, conciliação, cobranças, disputas e operação financeira.',
  color: '#2bc196',
  iconName: 'Store',
  sections: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      pages: [
        { id: 'Dashboard', label: 'Dashboard', route: '/Dashboard', content: DashboardDoc },
      ],
    },
    {
      id: 'transactions',
      label: 'Transações',
      pages: [
        { id: 'Transactions', label: 'Todas as Transações', route: '/Transactions', content: TransactionsDoc },
        { id: 'CardTransactions', label: 'Transações Cartão', route: '/CardTransactions', content: CardTransactionsDoc },
        { id: 'PixTransactions', label: 'Transações PIX', route: '/PixTransactions', content: PixTransactionsDoc },
        { id: 'DeclineAnalysis', label: 'Análise de Recusas', route: '/DeclineAnalysis', content: DeclineAnalysisDoc },
        { id: 'TransactionDetail', label: 'Detalhe da Transação', route: '/TransactionDetail', content: TransactionDetailDoc },
      ],
    },
    {
      id: 'checkout',
      label: 'Checkout',
      pages: [
        { id: 'CheckoutBuilder', label: 'Checkout Builder', route: '/CheckoutBuilder', content: CheckoutBuilderDoc },
        { id: 'Checkouts', label: 'Meus Checkouts', route: '/Checkouts', content: CheckoutsDoc },
        { id: 'CheckoutTemplates', label: 'Templates', route: '/CheckoutTemplates', content: CheckoutTemplatesDoc },
        { id: 'CheckoutAnalytics', label: 'Analytics do Checkout', route: '/CheckoutAnalytics', content: CheckoutAnalyticsDoc },
        { id: 'ConverterAgent', label: 'Converter Agent', route: '/ConverterAgent', content: ConverterAgentDoc },
      ],
    },
    {
      id: 'payment-links',
      label: 'Links de Pagamento',
      pages: [
        { id: 'PaymentLinks', label: 'Lista de Links', route: '/PaymentLinks', content: PaymentLinksDoc },
        { id: 'PaymentLinkCreate', label: 'Criar Link', route: '/PaymentLinkCreate', content: PaymentLinkCreateDoc },
      ],
    },
    {
      id: 'coupons',
      label: 'Cupons e Descontos',
      pages: [
        { id: 'CouponsOverview', label: 'Dashboard de Cupons', route: '/CouponsOverview', content: CouponsOverviewDoc },
        { id: 'CouponList', label: 'Lista de Cupons', route: '/CouponList', content: CouponListDoc },
        { id: 'CouponForm', label: 'Criar/Editar Cupom', route: '/CouponForm', content: CouponFormDoc },
        { id: 'CouponDetail', label: 'Detalhe do Cupom', route: '/CouponDetail', content: CouponDetailDoc },
      ],
    },
    {
      id: 'subscriptions',
      label: 'Assinaturas',
      pages: [
        { id: 'Subscriptions', label: 'Lista de Assinaturas', route: '/Subscriptions', content: SubscriptionsDoc },
        { id: 'SubscriptionPlans', label: 'Planos', route: '/SubscriptionPlans', content: SubscriptionPlansDoc },
        { id: 'Recurrence', label: 'Recorrência', route: '/Recurrence', content: RecurrenceDoc },
        { id: 'DunningSettings', label: 'Configuração de Dunning', route: '/DunningSettings', content: DunningSettingsDoc },
        { id: 'SubscriptionAnalytics', label: 'Analytics de Assinaturas', route: '/SubscriptionAnalytics', content: SubscriptionAnalyticsDoc },
      ],
    },
    {
      id: 'disputes',
      label: 'Disputas',
      pages: [
        { id: 'DisputeDashboard', label: 'Dashboard de Disputas', route: '/DisputeDashboard', content: DisputeDashboardDoc },
        { id: 'PreChargebacks', label: 'Pré-Chargebacks', route: '/PreChargebacks', content: PreChargebacksDoc },
        { id: 'Chargebacks', label: 'Chargebacks', route: '/Chargebacks', content: ChargebacksDoc },
        { id: 'MEDDashboard', label: 'MEDs', route: '/MEDDashboard', content: MEDDashboardDoc },
        { id: 'DisputeContestation', label: 'Contestação de Disputa', route: '/DisputeContestation', content: DisputeContestationDoc },
        { id: 'DisputeManager', label: 'Dispute Manager (Agente IA)', route: '/DisputeManager', content: DisputeManagerDoc },
        { id: 'DisputeManagerSettings', label: 'Configurações Dispute Manager', route: '/DisputeManagerSettings', content: DisputeManagerSettingsDoc },
      ],
    },
    {
      id: 'financial',
      label: 'Financeiro',
      pages: [
        { id: 'FinancialOverview', label: 'Visão Geral', route: '/FinancialOverview', content: FinancialOverviewDoc },
        { id: 'FinancialStatement', label: 'Extrato', route: '/FinancialStatement', content: FinancialStatementDoc },
        { id: 'ReceivablesAgenda', label: 'Agenda de Recebíveis', route: '/ReceivablesAgenda', content: ReceivablesAgendaDoc },
        { id: 'Fees', label: 'Taxas', route: '/Fees', content: FeesDoc },
        { id: 'FeesAnalysis', label: 'Análise de Taxas', route: '/FeesAnalysis', content: FeesAnalysisDoc },
        { id: 'Anticipation', label: 'Antecipação', route: '/Anticipation', content: AnticipationDoc },
        { id: 'SplitManagement', label: 'Gestão de Split', route: '/SplitManagement', content: SplitManagementDoc },
        { id: 'Withdrawals', label: 'Saques', route: '/Withdrawals', content: WithdrawalsDoc },
      ],
    },
    {
      id: 'subaccounts',
      label: 'Subcontas',
      pages: [
        { id: 'SubaccountsDashboard', label: 'Dashboard de Subcontas', route: '/SubaccountsDashboard', content: null },
        { id: 'SubaccountsList', label: 'Lista de Subcontas', route: '/SubaccountsList', content: null },
        { id: 'SubaccountOnboarding', label: 'Onboarding de Subconta', route: '/SubaccountOnboarding', content: null },
      ],
    },
    {
      id: 'customers',
      label: 'Clientes',
      pages: [
        { id: 'Customers', label: 'Lista de Clientes', route: '/Customers', content: null },
        { id: 'CustomerDetail', label: 'Detalhe do Cliente', route: '/CustomerDetail', content: null },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      pages: [
        { id: 'Reports', label: 'Relatórios', route: '/Reports', content: null },
        { id: 'CustomDashboards', label: 'Dashboards Customizados', route: '/CustomDashboards', content: null },
      ],
    },
    {
      id: 'integrations',
      label: 'Integrações',
      pages: [
        { id: 'ApiKeys', label: 'API Keys', route: '/ApiKeys', content: null },
        { id: 'Webhooks', label: 'Webhooks', route: '/Webhooks', content: null },
        { id: 'Plugins', label: 'Plugins', route: '/Plugins', content: null },
      ],
    },
    {
      id: 'ai-agents',
      label: 'Agentes IA',
      pages: [
        { id: 'DIACopilot', label: 'DIA Copilot', route: '/DIACopilot', content: null },
        { id: 'RecoveryAgent', label: 'Recovery Agent', route: '/RecoveryAgent', content: null },
        { id: 'ConverterAgentDuplicate', label: 'Converter Agent (Settings)', route: '/ConverterAgentSettings', content: ConverterAgentSettingsDoc },
        { id: 'DisputeAgentSettings', label: 'Dispute Agent Settings', route: '/DisputeAgentSettings', content: null },
      ],
    },
    {
      id: 'settings-support',
      label: 'Configurações & Suporte',
      pages: [
        { id: 'SettingsPage', label: 'Configurações', route: '/SettingsPage', content: null },
        { id: 'Support', label: 'Suporte', route: '/Support', content: null },
      ],
    },
  ],
};