import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTranslation } from 'react-i18next';
import '@/components/i18n/config';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  QrCode,
  Link2,
  Repeat,
  ShieldAlert,
  Wallet,
  DollarSign,
  ArrowUpFromLine,
  Users,
  UserCircle,
  BarChart3,
  Plug,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Building2,
  FileText,
  Key,
  Webhook,
  Store,
  PanelLeftClose,
  PanelLeft,
  Home,
  Receipt,
  Send,
  KeyRound,
  Gauge,
  Check,
  Landmark,
  Briefcase,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Menu items for Admin Sub module - using translation keys
const getAdminSubMenuItems = (t) => [
  {
    id: 'dashboard',
    label: t('menu.dashboard'),
    icon: LayoutDashboard,
    page: 'Dashboard',
  },
  {
    id: 'transactions',
    label: t('menu.transactions'),
    icon: ArrowLeftRight,
    page: 'Transactions',
    badge: '24',
    submenu: [
      { label: t('menu.all_transactions'), page: 'Transactions' },
      { label: t('menu.card'), page: 'CardTransactions' },
      { label: t('menu.pix'), page: 'PixTransactions' },
      { label: t('menu.decline_analysis'), page: 'DeclineAnalysis' },
    ]
  },
  {
    id: 'checkout',
    label: t('menu.checkout'),
    icon: CreditCard,
    page: 'CheckoutBuilder',
    submenu: [
      { label: t('menu.builder'), page: 'CheckoutBuilder' },
      { label: t('menu.my_checkouts'), page: 'Checkouts' },
      { label: t('menu.templates'), page: 'CheckoutTemplates' },
      { label: t('menu.analytics'), page: 'CheckoutAnalytics' },
      { label: t('menu.converter_agent'), page: 'ConverterAgent' },
    ]
  },
  {
    id: 'links',
    label: t('menu.payment_links'),
    icon: Link2,
    page: 'PaymentLinks',
    badge: '12',
  },
  {
    id: 'subscriptions',
    label: t('menu.subscriptions'),
    icon: Repeat,
    page: 'Subscriptions',
    submenu: [
      { label: t('menu.subscriptions'), page: 'Subscriptions' },
      { label: t('menu.plans'), page: 'SubscriptionPlans' },
      { label: t('menu.recurrence'), page: 'Recurrence' },
      { label: t('menu.dunning'), page: 'DunningSettings' },
      { label: t('menu.analytics'), page: 'SubscriptionAnalytics' },
    ]
  },
  {
    id: 'disputes',
    label: t('menu.disputes'),
    icon: ShieldAlert,
    page: 'DisputeDashboard',
    badge: '3',
    badgeVariant: 'destructive',
    submenu: [
      { label: t('menu.dashboard'), page: 'DisputeDashboard' },
      { label: t('menu.pre_chargebacks'), page: 'PreChargebacks' },
      { label: t('menu.chargebacks'), page: 'Chargebacks' },
      { label: t('menu.meds'), page: 'MEDDashboard' },
    ]
  },
  {
    id: 'financial',
    label: t('menu.financial'),
    icon: Wallet,
    page: 'FinancialOverview',
    submenu: [
      { label: t('menu.overview'), page: 'FinancialOverview' },
      { label: t('menu.statement'), page: 'FinancialStatement' },
      { label: t('menu.receivables'), page: 'ReceivablesAgenda' },
      { label: t('menu.fees'), page: 'Fees' },
      { label: t('menu.tariffs'), page: 'FeesAnalysis' },
      { label: t('menu.anticipation'), page: 'Anticipation' },
      { label: t('menu.split'), page: 'SplitManagement' },
    ]
  },
  {
    id: 'withdrawals',
    label: t('menu.withdrawals'),
    icon: ArrowUpFromLine,
    page: 'Withdrawals',
  },
  {
    id: 'subaccounts',
    label: t('menu.subaccounts'),
    icon: Building2,
    page: 'SubaccountsDashboard',
    submenu: [
      { label: t('menu.dashboard'), page: 'SubaccountsDashboard' },
      { label: t('menu.subaccounts'), page: 'SubaccountsList' },
      { label: t('menu.onboarding'), page: 'SubaccountOnboarding' },
    ]
  },
  {
    id: 'customers',
    label: t('menu.customers'),
    icon: UserCircle,
    page: 'Customers',
  },
  {
    id: 'analytics',
    label: t('menu.analytics'),
    icon: BarChart3,
    page: 'Reports',
    submenu: [
      { label: t('menu.reports'), page: 'Reports' },
      { label: t('menu.custom_dashboards'), page: 'CustomDashboards' },
    ]
  },
  {
    id: 'integrations',
    label: t('menu.integrations'),
    icon: Plug,
    page: 'ApiKeys',
    submenu: [
      { label: t('menu.api_keys'), page: 'ApiKeys' },
      { label: t('menu.webhooks'), page: 'Webhooks' },
      { label: t('menu.plugins'), page: 'Plugins' },
    ]
  },
  {
    id: 'settings',
    label: t('common.settings'),
    icon: Settings,
    page: 'SettingsPage',
  },
  {
    id: 'support',
    label: t('menu.support'),
    icon: HelpCircle,
    page: 'Support',
  },
];

// Menu items for Admin Interno module - using translation keys
const getAdminInternoMenuItems = (t) => [
  {
    id: 'dashboard',
    label: t('menu.dashboard'),
    icon: LayoutDashboard,
    page: 'AdminIntDashboard',
  },
  {
    id: 'compliance',
    label: t('menu_admin.compliance'),
    icon: ShieldCheck,
    page: 'AdminIntCompliance',
    submenu: [
      { label: t('menu.dashboard'), page: 'AdminIntCompliance' },
      { label: t('menu_admin.compliance_queue'), page: 'AdminIntComplianceQueue' },
      { label: t('menu_admin.manual_analysis'), page: 'AdminIntComplianceReview' },
      { label: t('menu_admin.submissions'), page: 'AdminIntComplianceSubmissions' },
      { label: t('menu_admin.form_management'), page: 'AdminIntComplianceForms' },
      { label: t('menu_admin.documents'), page: 'AdminIntComplianceDocs' },
      { label: t('menu_admin.rules_workflows'), page: 'AdminIntComplianceRules' },
      { label: t('menu_admin.audit'), page: 'AdminIntComplianceAudit' },
      { label: t('menu_admin.helena_ai'), page: 'AdminIntComplianceHelena' },
      { label: t('menu_admin.form_link'), page: 'AdminIntComplianceFormLink' },
    ]
  },
  {
    id: 'merchants',
    label: t('menu_admin.merchants'),
    icon: Store,
    page: 'AdminIntMerchants',
    submenu: [
      { label: t('menu.dashboard'), page: 'AdminIntMerchants' },
      { label: t('menu_admin.merchant_list'), page: 'AdminIntMerchantsList' },
      { label: t('menu_admin.profile_360'), page: 'AdminIntMerchantProfile' },
      { label: t('menu.subaccounts'), page: 'AdminIntSubaccounts' },
      { label: t('menu_admin.limit_requests'), page: 'AdminIntLimitRequests' },
      { label: t('menu_admin.groups'), page: 'AdminIntMerchantGroups' },
      { label: t('menu_admin.tags'), page: 'AdminIntMerchantTags' },
      { label: t('menu.reports'), page: 'AdminIntMerchantReports' },
    ]
  },
  {
    id: 'transactions',
    label: t('menu.transactions'),
    icon: ArrowLeftRight,
    page: 'AdminIntTransactionsDashboard',
    submenu: [
      { label: t('menu.dashboard'), page: 'AdminIntTransactionsDashboard' },
      { label: t('menu_admin.transaction_list'), page: 'AdminIntTransactionsList' },
      { label: t('menu_admin.orchestration'), page: 'AdminIntOrchestration' },
      { label: t('menu_admin.bin_analysis'), page: 'AdminIntBINAnalysis' },
      { label: t('menu_admin.retry_intelligence'), page: 'AdminIntRetryIntelligence' },
      { label: t('menu_admin.batch_processing'), page: 'AdminIntBatchProcessing' },
      { label: t('menu_admin.reconciliation'), page: 'AdminIntReconciliation' },
      { label: t('menu.reports'), page: 'AdminIntTransactionReports' },
    ]
  },
  {
    id: 'financial',
    label: t('menu.financial'),
    icon: DollarSign,
    page: 'AdminIntFinancialDashboard',
    submenu: [
      { label: t('menu.dashboard'), page: 'AdminIntFinancialDashboard' },
      { label: t('menu_admin.financial_results'), page: 'AdminIntFinancialResults' },
      { label: t('menu_admin.client_profitability'), page: 'AdminIntClientProfitability' },
      { label: t('menu_admin.reconciliation'), page: 'AdminIntConciliation' },
      { label: t('menu_admin.payment_agenda'), page: 'AdminIntPaymentAgenda' },
      { label: t('menu_admin.settlements'), page: 'AdminIntSettlements' },
      { label: t('menu.withdrawals'), page: 'AdminIntWithdrawals' },
      { label: t('menu.anticipation'), page: 'AdminIntAnticipations' },
      { label: t('menu_admin.statements'), page: 'AdminIntStatements' },
      { label: t('menu_admin.balance_management'), page: 'AdminIntBalanceManagement' },
    ]
  },
  {
    id: 'risk',
    label: t('menu_admin.risk'),
    icon: AlertTriangle,
    page: 'AdminIntRiskDashboard',
    submenu: [
      { label: t('menu_admin.risk_dashboard'), page: 'AdminIntRiskDashboard' },
      { label: t('menu_admin.fraud_monitoring'), page: 'AdminIntFraudMonitoring' },
      { label: t('menu.chargebacks'), page: 'AdminIntChargebacksList' },
      { label: t('menu.meds'), page: 'AdminIntMEDsList' },
      { label: t('menu_admin.risk_rules'), page: 'AdminIntRiskRules' },
      { label: t('menu_admin.control_lists'), page: 'AdminIntControlLists' },
      { label: t('menu_admin.alerts'), page: 'AdminIntRiskAlerts' },
      { label: t('menu_admin.compliance'), page: 'AdminIntCompliance' },
    ]
  },
  {
    id: 'reports',
    label: t('menu.reports'),
    icon: BarChart3,
    page: 'AdminIntReportsHub',
    submenu: [
      { label: t('menu_admin.reports_hub'), page: 'AdminIntReportsHub' },
      { label: t('menu_admin.operational'), page: 'AdminIntReportsOperational' },
      { label: t('menu.financial'), page: 'AdminIntReportsFinancial' },
      { label: t('menu_admin.risk'), page: 'AdminIntReportsRisk' },
      { label: t('menu_admin.custom'), page: 'AdminIntReportsCustom' },
      { label: t('menu_admin.analytics_bi'), page: 'AdminIntAnalytics' },
    ]
  },
  {
    id: 'communication',
    label: t('menu_admin.communication'),
    icon: Mail,
    page: 'AdminIntCommDashboard',
    submenu: [
      { label: t('menu.dashboard'), page: 'AdminIntCommDashboard' },
      { label: t('menu_admin.email_automation'), page: 'AdminIntCommAutomations' },
      { label: t('menu.templates'), page: 'AdminIntCommTemplates' },
      { label: t('menu_admin.smtp_config'), page: 'AdminIntCommSMTP' },
      { label: t('menu_admin.senders'), page: 'AdminIntCommSenders' },
      { label: t('menu_admin.logs'), page: 'AdminIntCommLogs' },
    ]
  },
  {
    id: 'admin',
    label: t('menu_admin.administration'),
    icon: Settings,
    page: 'AdminIntSettings',
    submenu: [
      { label: t('menu_admin.general_settings'), page: 'AdminIntSettings' },
      { label: t('menu_admin.users'), page: 'AdminIntUsers' },
      { label: t('menu_admin.profiles_permissions'), page: 'AdminIntProfiles' },
      { label: t('menu_admin.global_rates'), page: 'AdminIntGlobalRates' },
      { label: t('menu_admin.risk_params'), page: 'AdminIntRiskParams' },
      { label: t('menu.integrations'), page: 'AdminIntIntegrations' },
      { label: t('menu.templates'), page: 'AdminIntTemplates' },
      { label: t('menu_admin.system_logs'), page: 'AdminIntSystemLogs' },
      { label: t('menu_admin.mccs'), page: 'AdminIntMCCs' },
      { label: t('menu_admin.mcc_analysis'), page: 'AdminIntMCCsAnalysis' },
      { label: t('menu_admin.partners_costs'), page: 'AdminIntPartners' },
      { label: t('menu_admin.rate_plans'), page: 'AdminIntFeePlans' },
      { label: t('menu_admin.ai_agents'), page: 'AdminIntAiAgents' },
    ]
  }
];

// Menu items for Internet Banking module - using translation keys
const getInternetBankingMenuItems = (t) => [
  {
    id: 'ib-home',
    label: t('menu_ib.home'),
    icon: Home,
    page: 'IBHome',
  },
  {
    id: 'ib-extrato',
    label: t('menu_ib.statement'),
    icon: Receipt,
    page: 'IBExtract',
  },
  {
    id: 'ib-pix',
    label: t('menu_ib.pix'),
    icon: QrCode,
    page: 'IBPixSend',
    submenu: [
      { label: t('menu_ib.send_pix'), page: 'IBPixSend', icon: Send },
      { label: t('menu_ib.receive_pix'), page: 'IBPixReceive', icon: QrCode },
      { label: t('menu_ib.my_keys'), page: 'IBPixKeys', icon: KeyRound },
      { label: t('menu_ib.limits'), page: 'IBPixLimits', icon: Gauge },
    ]
  },
  {
    id: 'ib-comprovantes',
    label: t('menu_ib.receipts'),
    icon: FileText,
    page: 'IBProofs',
  },
  {
    id: 'ib-config',
    label: t('menu_ib.settings'),
    icon: Settings,
    page: 'IBSettings',
  },
];

const aiAgents = [
  { id: 'dia', label: 'DIA Copilot', page: 'DIACopilot' },
  { id: 'recovery', label: 'Recovery Agent', page: 'RecoveryAgent' },
  { id: 'converter', label: 'Converter Agent', page: 'ConverterAgent' },
  { id: 'dispute', label: 'Dispute Manager', page: 'DisputeAgentSettings' },
  { id: 'origination', label: 'Origination Agent', page: 'OriginationAgentSettings' },
];

// Páginas que não devem ter o layout admin
const noLayoutPages = [
  'LandingPage', 'AccountCreationStep1', 'PlanSelection', 'AccountCreationStep3',
  'ComplianceOnboardingStart', 'CompliancePixOnly', 'ComplianceFullKYC', 
  'LivenessFacematchStep', 'LivenessSimulation', 'DocumentUploadPix', 'DocumentUploadFull'
];

// Internet Banking pages (to auto-detect module)
const internetBankingPages = [
  'IBHome', 'IBExtract', 'IBPixSend', 'IBPixReceive', 'IBPixKeys', 'IBPixLimits',
  'IBProofs', 'IBSettings', 'IBSettingsAccount', 'IBSettingsSecurity', 'IBSettingsNotifications', 'IBSettingsAccess'
];

// Admin Interno pages
const adminInternoPages = [
  'AdminIntDashboard',
  'AdminIntCompliance', 'AdminIntComplianceQueue', 'AdminIntComplianceReview', 'AdminIntComplianceSubmissions',
  'AdminIntComplianceForms', 'AdminIntComplianceDocs', 'AdminIntComplianceRules', 'AdminIntComplianceAudit',
  'AdminIntComplianceHelena', 'AdminIntComplianceFormLink',
  'AdminIntSubaccountDetail', 'AdminIntKYCQueue', 'AdminIntKycAnalysis',
  'AdminIntMerchants', 'AdminIntMerchantProfile', 'AdminIntSubaccounts', 'AdminIntMerchantsList', 'AdminIntNewMerchant', 'AdminIntMerchantGroups', 'AdminIntMerchantTags', 'AdminIntMerchantReports', 'AdminIntLimitRequests',
  'AdminIntTransactions', 'AdminIntSettlement', 'AdminIntReconciliation', 'AdminIntAnticipation', 'AdminIntTransactionsDashboard', 'AdminIntTransactionsList', 'AdminIntTransactionDetail', 'AdminIntBatchProcessing', 'AdminIntTransactionReports', 'AdminIntOrchestration', 'AdminIntBINAnalysis', 'AdminIntRetryIntelligence',
  'AdminIntFinancialDashboard', 'AdminIntFinancialResults', 'AdminIntClientProfitability', 'AdminIntClientSplitDetail', 'AdminIntSettlements', 'AdminIntWithdrawals', 'AdminIntAnticipations', 'AdminIntStatements', 'AdminIntBalanceManagement', 'AdminIntConciliation', 'AdminIntPaymentAgenda',
  'AdminIntRiskDashboard', 'AdminIntFraudMonitoring', 'AdminIntChargebacksList', 'AdminIntMEDsList', 'AdminIntRiskRules', 'AdminIntControlLists', 'AdminIntRiskAlerts', 'AdminIntCompliance',
  'AdminIntSettings', 'AdminIntUsers', 'AdminIntProfiles', 'AdminIntGlobalRates', 'AdminIntRiskParams', 'AdminIntIntegrations', 'AdminIntTemplates', 'AdminIntSystemLogs',
  'AdminIntReportsHub', 'AdminIntReportsOperational', 'AdminIntReportsFinancial', 'AdminIntReportsRisk', 'AdminIntReportsCustom', 'AdminIntAnalytics',
  'AdminIntCommDashboard', 'AdminIntCommAutomations', 'AdminIntCommTemplates', 'AdminIntCommSMTP', 'AdminIntCommSenders', 'AdminIntCommLogs',
  'AdminIntRisk', 'AdminIntPreChargebacks', 'AdminIntChargebacks', 'AdminIntAntifraud',
  'AdminIntMCCs', 'AdminIntMCCsAnalysis', 'AdminIntPartners', 'AdminIntFeePlans', 'AdminIntAiAgents', 'AdminIntSupport', 'AdminIntReports', 'AdminIntSettings'
];

import { Sun, Moon } from 'lucide-react';
import { getLogoUrlByTheme } from '@/components/utils/branding';
// DIAWidget removed as it is now integrated into the header panel

export default function Layout({ children, currentPageName }) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['transactions', 'financial', 'ib-pix']);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [dismissedComplianceAlertForSession, setDismissedComplianceAlertForSession] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Module state - auto-detect from current page
  const [currentModule, setCurrentModule] = useState(() => {
    const savedModule = localStorage.getItem('currentModule');
    return savedModule || 'admin-sub';
  });

  // Get menu items with translations
  const adminSubMenuItems = getAdminSubMenuItems(t);
  const adminInternoMenuItems = getAdminInternoMenuItems(t);
  const internetBankingMenuItems = getInternetBankingMenuItems(t);

  // Auto-detect module based on current page
  useEffect(() => {
    if (internetBankingPages.includes(currentPageName)) {
      setCurrentModule('internet-banking');
      localStorage.setItem('currentModule', 'internet-banking');
    } else if (adminInternoPages.includes(currentPageName)) {
      setCurrentModule('admin-interno');
      localStorage.setItem('currentModule', 'admin-interno');
    } else if (!noLayoutPages.includes(currentPageName) && currentPageName && !currentPageName.startsWith('IB') && !currentPageName.startsWith('AdminInt')) {
      // Only switch to admin-sub if we're on a non-IB page, non-AdminInt page, and not a no-layout page
      if (currentModule !== 'admin-sub') {
        setCurrentModule('admin-sub');
        localStorage.setItem('currentModule', 'admin-sub');
      }
    }
  }, [currentPageName]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleModuleChange = (module) => {
    setCurrentModule(module);
    localStorage.setItem('currentModule', module);
    // Navigate to the default page of the module
    if (module === 'internet-banking') {
      window.location.href = createPageUrl('IBHome');
    } else if (module === 'admin-interno') {
      window.location.href = createPageUrl('AdminIntDashboard');
    } else {
      window.location.href = createPageUrl('Dashboard');
    }
  };

  // Get current menu items based on module
  const menuItems = currentModule === 'internet-banking' 
    ? internetBankingMenuItems 
    : currentModule === 'admin-interno' 
      ? adminInternoMenuItems 
      : adminSubMenuItems;

  // Buscar usuário autenticado e sua subconta para verificar status de compliance
  const { data: user } = useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: subaccounts = [] } = useQuery({
    queryKey: ['userSubaccount', user?.email],
    queryFn: () => base44.entities.Subaccount.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const userSubaccount = subaccounts?.[0];
  const showComplianceAlert = userSubaccount?.status === 'pending_compliance' && !dismissedComplianceAlertForSession;

  // Se for uma página sem layout, renderiza apenas o conteúdo
  if (noLayoutPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isActivePage = (page) => currentPageName === page;
  const isActiveSection = (item) => {
    if (isActivePage(item.page)) return true;
    if (item.submenu) {
      return item.submenu.some(sub => isActivePage(sub.page));
    }
    return false;
  };

  return (
    <div className={cn("min-h-screen font-sans antialiased selection:bg-[#2bc196]/20 selection:text-[#2bc196]", theme)}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101F3E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-[#002443] text-slate-300 transition-all duration-300 shadow-2xl border-r border-slate-800/50 dark:border-slate-700/30",
        sidebarOpen ? "w-64" : "w-20",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo & Module Selector */}
          <div className={cn(
            "flex flex-col border-b border-slate-800/50",
            sidebarOpen ? "p-4" : "p-3"
          )}>
            {/* Logo Row */}
            <div className={cn(
              "flex items-center",
              sidebarOpen ? "justify-between mb-3" : "justify-center"
            )}>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={getLogoUrlByTheme(theme)}
                      alt="PagSmile Logo"
                      className="h-8 w-auto"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white hover:bg-white/10 hidden lg:flex"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <PanelLeftClose className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => setSidebarOpen(true)}
                >
                  <PanelLeft className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Module Selector */}
            {sidebarOpen && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        currentModule === 'internet-banking' 
                          ? "bg-[#2bc196]/20" 
                          : currentModule === 'admin-interno'
                            ? "bg-purple-500/20"
                            : "bg-[#2bc196]/20"
                      )}>
                        {currentModule === 'internet-banking' ? (
                          <Landmark className="w-4 h-4 text-[#2bc196]" />
                        ) : currentModule === 'admin-interno' ? (
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Store className="w-4 h-4 text-[#2bc196]" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {currentModule === 'internet-banking' ? 'Internet Banking' : currentModule === 'admin-interno' ? 'Admin Interno' : 'Admin Sub'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {currentModule === 'internet-banking' ? 'Conta Digital' : currentModule === 'admin-interno' ? 'Gestão Interna' : 'Gestão de Pagamentos'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs text-slate-500 uppercase">{t('modules.admin_sub')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleModuleChange('admin-sub')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Store className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t('modules.admin_sub')}</p>
                        <p className="text-xs text-slate-500">{t('modules.admin_sub_desc')}</p>
                      </div>
                      {currentModule === 'admin-sub' && (
                        <Check className="w-4 h-4 text-[#2bc196]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleModuleChange('internet-banking')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Landmark className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t('modules.internet_banking')}</p>
                        <p className="text-xs text-slate-500">{t('modules.internet_banking_desc')}</p>
                      </div>
                      {currentModule === 'internet-banking' && (
                        <Check className="w-4 h-4 text-[#2bc196]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleModuleChange('admin-interno')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t('modules.admin_interno')}</p>
                        <p className="text-xs text-slate-500">{t('modules.admin_interno_desc')}</p>
                      </div>
                      {currentModule === 'admin-interno' && (
                        <Check className="w-4 h-4 text-[#2bc196]" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                          isActiveSection(item)
                            ? "bg-[#2bc196]/10 text-[#2bc196] shadow-[0_0_20px_rgba(43,193,150,0.15)]"
                            : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                          !sidebarOpen && "justify-center"
                        )}
                      >
                        {isActiveSection(item) && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#2bc196] rounded-r-full" />}
                        <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActiveSection(item) ? "text-[#2bc196]" : "text-slate-500 group-hover:text-slate-300")} />
                        {sidebarOpen && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                variant={item.badgeVariant || "secondary"} 
                                className={cn(
                                  "h-5 px-1.5 text-[10px] rounded-full",
                                  item.badgeVariant === 'destructive' 
                                    ? "bg-red-500/20 text-red-400 border-0" 
                                    : "bg-white/10 text-white border-0"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronDown className={cn(
                              "w-4 h-4 transition-transform duration-200 text-slate-500",
                              expandedMenus.includes(item.id) && "rotate-180 text-[#2bc196]"
                            )} />
                          </>
                        )}
                      </button>
                      {sidebarOpen && expandedMenus.includes(item.id) && (
                        <div className="ml-4 mt-1 pl-4 border-l border-slate-700 space-y-1">
                          {item.submenu.map((sub, idx) => (
                            <Link
                              key={idx}
                              to={createPageUrl(sub.page)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all relative",
                                isActivePage(sub.page)
                                  ? "bg-[#2bc196] text-white font-medium shadow-lg shadow-[#2bc196]/20"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                              )}
                            >
                              {sub.icon && <sub.icon className="w-4 h-4" />}
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={createPageUrl(item.page)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isActivePage(item.page)
                          ? "bg-[#2bc196]/10 text-[#2bc196] shadow-[0_0_20px_rgba(43,193,150,0.15)]"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                        !sidebarOpen && "justify-center"
                      )}
                    >
                      {isActivePage(item.page) && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#2bc196] rounded-r-full" />}
                      <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActivePage(item.page) ? "text-[#2bc196]" : "text-slate-500 group-hover:text-slate-300")} />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badgeVariant || "secondary"} 
                              className={cn(
                                "h-5 px-1.5 text-[10px] rounded-full",
                                item.badgeVariant === 'destructive' 
                                  ? "bg-red-500/20 text-red-400 border-0" 
                                  : "bg-white/10 text-white border-0"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* AI Agents Section - Only for Admin Sub */}
            {sidebarOpen && currentModule === 'admin-sub' && (
              <div className="px-3 mt-8">
                <div className="px-3 mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {t('menu.ai_agents')}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                </div>
                <div className="space-y-1">
                {aiAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    to={createPageUrl(agent.page)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden",
                      isActivePage(agent.page)
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {isActivePage(agent.page) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
                    )}
                    <div className={cn(
                      "relative w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 shadow-lg",
                      isActivePage(agent.page) 
                          ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-primary/25" 
                          : "bg-slate-800/50 text-slate-500 group-hover:bg-primary/20 group-hover:text-primary border border-slate-700/50 group-hover:border-primary/30"
                    )}>
                       <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="relative z-10 font-medium">{agent.label}</span>
                    {isActivePage(agent.page) && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800/50 bg-[#001a33]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-slate-700/50 group">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-slate-700 group-hover:border-primary transition-colors">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback className="bg-primary text-white font-bold">JD</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2bc196] border-2 border-[#001a33] rounded-full"></span>
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">João Silva</p>
                      <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">joao@pagsmile.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('common.my_account')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t('common.profile')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('common.settings')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">{t('common.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#101F3E]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/30 shadow-sm supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#101F3E]/60 transition-colors duration-300">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              {(currentModule === 'admin-sub' || currentModule === 'admin-interno') && (
                <div className="relative hidden sm:block group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <Input
                    placeholder={currentModule === 'admin-interno' ? "Buscar universal... (⌘K)" : "Buscar transações, clientes, (⌘K)"}
                    className="w-64 lg:w-96 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              )}
              {currentModule === 'internet-banking' && (
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#2bc196]" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Internet Banking</span>
                </div>
              )}
              {currentModule === 'admin-interno' && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Admin Interno</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>

              {/* AI Assistant Button - Admin Sub & Admin Interno */}
              {(currentModule === 'admin-sub' || currentModule === 'admin-interno') && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "hidden sm:flex items-center gap-2 shadow-sm",
                    currentModule === 'admin-interno' 
                      ? "border-purple-500/20 text-purple-600 hover:bg-purple-500/5 hover:border-purple-500/40 dark:text-purple-400 dark:bg-purple-500/10"
                      : "border-[#2bc196]/20 text-[#2bc196] hover:bg-[#2bc196]/5 hover:border-[#2bc196]/40 dark:bg-[#2bc196]/10"
                  )}
                  onClick={() => setShowAIPanel(!showAIPanel)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center",
                    currentModule === 'admin-interno'
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                      : "bg-gradient-to-br from-[#2bc196] to-[#5cf7cf]"
                  )}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium">{currentModule === 'admin-interno' ? 'PagSmile Copilot' : 'DIA Copilot'}</span>
                </Button>
              )}

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full w-10 h-10">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>{t('header.notifications')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-sm text-gray-500 text-center">
                    {t('header.no_notifications')}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile User Avatar */}
              <Avatar className="h-8 w-8 lg:hidden">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback className="bg-[#2bc196] text-white text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Compliance Alert */}
        {showComplianceAlert && currentPageName === 'Dashboard' && (
          <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-0">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-semibold">Ação Necessária: Complete seu Compliance!</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-700">
                <span>Sua conta está quase pronta! Complete o processo de Compliance para começar a transacionar.</span>
                <div className="flex gap-2">
                  <Link to={createPageUrl('ComplianceOnboardingStart')}>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                      Completar Compliance
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => setDismissedComplianceAlertForSession(true)} className="text-amber-600 hover:text-amber-800">
                    Depois
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* AI Assistant Panel - Unified for Admin Sub & Admin Interno */}
      {showAIPanel && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                currentModule === 'admin-interno' 
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                  : "bg-gradient-to-br from-[#2bc196] to-[#5cf7cf]"
              )}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm dark:text-white">{currentModule === 'admin-interno' ? 'PagSmile Copilot' : 'DIA Copilot'}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Assistente Inteligente</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowAIPanel(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {currentModule === 'admin-interno' 
                  ? "Olá! Sou o DIA. Estou monitorando todos os merchants e operações. O que você gostaria de analisar?"
                  : "Olá! Sou o DIA, seu assistente financeiro. Como posso ajudar com sua conta hoje?"}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                {currentModule === 'admin-interno' ? "Insights Operacionais" : "Sugestões"}
              </p>
              
              {currentModule === 'admin-interno' ? (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm dark:text-slate-200">
                    ⚠️ 3 merchants com ratio de chargeback alto
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm dark:text-slate-200">
                    🚀 5 novos leads qualificados hoje
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm dark:text-slate-200">
                    📋 12 validações de KYC pendentes
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:bg-[#2bc196]/5 dark:hover:bg-[#2bc196]/10 transition-colors text-sm dark:text-slate-200">
                    📊 Analisar taxa de aprovação do mês
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:bg-[#2bc196]/5 dark:hover:bg-[#2bc196]/10 transition-colors text-sm dark:text-slate-200">
                    💰 Ver oportunidades de recuperação
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:bg-[#2bc196]/5 dark:hover:bg-[#2bc196]/10 transition-colors text-sm dark:text-slate-200">
                    ⚠️ Disputas que precisam de atenção
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <Input 
                placeholder="Digite sua pergunta..." 
                className="pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-offset-0" 
              />
              <Button 
                size="icon" 
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7",
                  currentModule === 'admin-interno'
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-[#2bc196] hover:bg-[#239b7a]"
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
      <style>{`
        :root {
          --primary: #2bc196;
          --primary-foreground: #FFFFFF;
          --radius: 0.75rem;
        }
        .dark {
          --background: #002443;
          --foreground: #F1F5F9;
          --card: #003459;
          --card-foreground: #F1F5F9;
          --popover: #003459;
          --popover-foreground: #F1F5F9;
          --primary: #2bc196;
          --primary-foreground: #FFFFFF;
          --secondary: #004D73;
          --secondary-foreground: #F1F5F9;
          --muted: #004D73;
          --muted-foreground: #94A3B8;
          --accent: #004D73;
          --accent-foreground: #F1F5F9;
          --destructive: #EF4444;
          --destructive-foreground: #F1F5F9;
          --border: #004D73;
          --input: #004D73;
          --ring: #2bc196;
        }
      `}</style>
    </div>
  );
}