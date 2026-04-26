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
        { id: 'CheckoutAnalytics', label: 'Analytics do Checkout', route: '/CheckoutAnalytics', content: null },
        { id: 'ConverterAgent', label: 'Converter Agent', route: '/ConverterAgent', content: null },
      ],
    },
    {
      id: 'payment-links',
      label: 'Links de Pagamento',
      pages: [
        { id: 'PaymentLinks', label: 'Lista de Links', route: '/PaymentLinks', content: null },
        { id: 'PaymentLinkCreate', label: 'Criar Link', route: '/PaymentLinkCreate', content: null },
      ],
    },
    {
      id: 'coupons',
      label: 'Cupons e Descontos',
      pages: [
        { id: 'CouponsOverview', label: 'Dashboard de Cupons', route: '/CouponsOverview', content: null },
        { id: 'CouponList', label: 'Lista de Cupons', route: '/CouponList', content: null },
        { id: 'CouponForm', label: 'Criar/Editar Cupom', route: '/CouponForm', content: null },
        { id: 'CouponDetail', label: 'Detalhe do Cupom', route: '/CouponDetail', content: null },
      ],
    },
    {
      id: 'subscriptions',
      label: 'Assinaturas',
      pages: [
        { id: 'Subscriptions', label: 'Lista de Assinaturas', route: '/Subscriptions', content: null },
        { id: 'SubscriptionPlans', label: 'Planos', route: '/SubscriptionPlans', content: null },
        { id: 'Recurrence', label: 'Recorrência', route: '/Recurrence', content: null },
        { id: 'DunningSettings', label: 'Configuração de Dunning', route: '/DunningSettings', content: null },
        { id: 'SubscriptionAnalytics', label: 'Analytics de Assinaturas', route: '/SubscriptionAnalytics', content: null },
      ],
    },
    {
      id: 'disputes',
      label: 'Disputas',
      pages: [
        { id: 'DisputeDashboard', label: 'Dashboard de Disputas', route: '/DisputeDashboard', content: null },
        { id: 'PreChargebacks', label: 'Pré-Chargebacks', route: '/PreChargebacks', content: null },
        { id: 'Chargebacks', label: 'Chargebacks', route: '/Chargebacks', content: null },
        { id: 'MEDDashboard', label: 'MEDs', route: '/MEDDashboard', content: null },
        { id: 'DisputeContestation', label: 'Contestação de Disputa', route: '/DisputeContestation', content: null },
        { id: 'DisputeManager', label: 'Dispute Manager (Agente IA)', route: '/DisputeManager', content: null },
        { id: 'DisputeManagerSettings', label: 'Configurações Dispute Manager', route: '/DisputeManagerSettings', content: null },
      ],
    },
    {
      id: 'financial',
      label: 'Financeiro',
      pages: [
        { id: 'FinancialOverview', label: 'Visão Geral', route: '/FinancialOverview', content: null },
        { id: 'FinancialStatement', label: 'Extrato', route: '/FinancialStatement', content: null },
        { id: 'ReceivablesAgenda', label: 'Agenda de Recebíveis', route: '/ReceivablesAgenda', content: null },
        { id: 'Fees', label: 'Taxas', route: '/Fees', content: null },
        { id: 'FeesAnalysis', label: 'Análise de Taxas', route: '/FeesAnalysis', content: null },
        { id: 'Anticipation', label: 'Antecipação', route: '/Anticipation', content: null },
        { id: 'SplitManagement', label: 'Gestão de Split', route: '/SplitManagement', content: null },
        { id: 'Withdrawals', label: 'Saques', route: '/Withdrawals', content: null },
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
        { id: 'ConverterAgentDuplicate', label: 'Converter Agent (Settings)', route: '/ConverterAgentSettings', content: null },
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