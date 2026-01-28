/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccountCreationStep1 from './pages/AccountCreationStep1';
import AccountCreationStep3 from './pages/AccountCreationStep3';
import AdminIntActivation from './pages/AdminIntActivation';
import AdminIntAiAgents from './pages/AdminIntAiAgents';
import AdminIntAnticipation from './pages/AdminIntAnticipation';
import AdminIntAntifraud from './pages/AdminIntAntifraud';
import AdminIntAudit from './pages/AdminIntAudit';
import AdminIntBlockages from './pages/AdminIntBlockages';
import AdminIntCentralLinks from './pages/AdminIntCentralLinks';
import AdminIntChargebacks from './pages/AdminIntChargebacks';
import AdminIntComercial from './pages/AdminIntComercial';
import AdminIntCommercialInsights from './pages/AdminIntCommercialInsights';
import AdminIntCreateProposal from './pages/AdminIntCreateProposal';
import AdminIntDashboard from './pages/AdminIntDashboard';
import AdminIntDocs from './pages/AdminIntDocs';
import AdminIntFeePlanDetail from './pages/AdminIntFeePlanDetail';
import AdminIntFeePlans from './pages/AdminIntFeePlans';
import AdminIntFinancialHealth from './pages/AdminIntFinancialHealth';
import AdminIntGlobalParams from './pages/AdminIntGlobalParams';
import AdminIntGoalsPerformance from './pages/AdminIntGoalsPerformance';
import AdminIntIntegrationDetail from './pages/AdminIntIntegrationDetail';
import AdminIntIntegrations from './pages/AdminIntIntegrations';
import AdminIntKYC from './pages/AdminIntKYC';
import AdminIntKYCQueue from './pages/AdminIntKYCQueue';
import AdminIntKycAnalysis from './pages/AdminIntKycAnalysis';
import AdminIntLeadProfile from './pages/AdminIntLeadProfile';
import AdminIntLeads from './pages/AdminIntLeads';
import AdminIntMCCDetail from './pages/AdminIntMCCDetail';
import AdminIntMCCs from './pages/AdminIntMCCs';
import AdminIntMccIrregularities from './pages/AdminIntMccIrregularities';
import AdminIntMerchantProfile from './pages/AdminIntMerchantProfile';
import AdminIntMerchants from './pages/AdminIntMerchants';
import AdminIntMerchantsList from './pages/AdminIntMerchantsList';
import AdminIntNewMerchant from './pages/AdminIntNewMerchant';
import AdminIntOnboardingDash from './pages/AdminIntOnboardingDash';
import AdminIntOnboardingQueue from './pages/AdminIntOnboardingQueue';
import AdminIntPLD from './pages/AdminIntPLD';
import AdminIntPartnerDetail from './pages/AdminIntPartnerDetail';
import AdminIntPartners from './pages/AdminIntPartners';
import AdminIntPipeline from './pages/AdminIntPipeline';
import AdminIntPreChargebacks from './pages/AdminIntPreChargebacks';
import AdminIntPriceSimulator from './pages/AdminIntPriceSimulator';
import AdminIntProfiles from './pages/AdminIntProfiles';
import AdminIntProposalDetails from './pages/AdminIntProposalDetails';
import AdminIntProposals from './pages/AdminIntProposals';
import AdminIntQuestionnaires from './pages/AdminIntQuestionnaires';
import AdminIntReconciliation from './pages/AdminIntReconciliation';
import AdminIntReports from './pages/AdminIntReports';
import AdminIntRetention from './pages/AdminIntRetention';
import AdminIntRisk from './pages/AdminIntRisk';
import AdminIntRollingReserve from './pages/AdminIntRollingReserve';
import AdminIntSelfService from './pages/AdminIntSelfService';
import AdminIntSettings from './pages/AdminIntSettings';
import AdminIntSettlement from './pages/AdminIntSettlement';
import AdminIntSubaccountDetail from './pages/AdminIntSubaccountDetail';
import AdminIntSubaccounts from './pages/AdminIntSubaccounts';
import AdminIntSupport from './pages/AdminIntSupport';
import AdminIntSystemLogs from './pages/AdminIntSystemLogs';
import AdminIntTransactionDetail from './pages/AdminIntTransactionDetail';
import AdminIntTransactions from './pages/AdminIntTransactions';
import AdminIntTransactionsDashboard from './pages/AdminIntTransactionsDashboard';
import AdminIntTransactionsList from './pages/AdminIntTransactionsList';
import AdminIntUserDetail from './pages/AdminIntUserDetail';
import AdminIntUsers from './pages/AdminIntUsers';
import AdminIntWebhooks from './pages/AdminIntWebhooks';
import Anticipation from './pages/Anticipation';
import ApiKeys from './pages/ApiKeys';
import CardTransactions from './pages/CardTransactions';
import Chargebacks from './pages/Chargebacks';
import CheckoutAnalytics from './pages/CheckoutAnalytics';
import CheckoutBuilder from './pages/CheckoutBuilder';
import CheckoutTemplates from './pages/CheckoutTemplates';
import Checkouts from './pages/Checkouts';
import ComplianceFullKYC from './pages/ComplianceFullKYC';
import ComplianceOnboardingStart from './pages/ComplianceOnboardingStart';
import CompliancePixOnly from './pages/CompliancePixOnly';
import ConverterAgent from './pages/ConverterAgent';
import CustomDashboards from './pages/CustomDashboards';
import CustomerDetail from './pages/CustomerDetail';
import Customers from './pages/Customers';
import DIACopilot from './pages/DIACopilot';
import Dashboard from './pages/Dashboard';
import DeclineAnalysis from './pages/DeclineAnalysis';
import DisputeAgentSettings from './pages/DisputeAgentSettings';
import DisputeContestation from './pages/DisputeContestation';
import DisputeDashboard from './pages/DisputeDashboard';
import DisputeManager from './pages/DisputeManager';
import Disputes from './pages/Disputes';
import DocumentUploadFull from './pages/DocumentUploadFull';
import DocumentUploadPix from './pages/DocumentUploadPix';
import DunningSettings from './pages/DunningSettings';
import Fees from './pages/Fees';
import FeesAnalysis from './pages/FeesAnalysis';
import Financial from './pages/Financial';
import FinancialOverview from './pages/FinancialOverview';
import FinancialStatement from './pages/FinancialStatement';
import IBExtract from './pages/IBExtract';
import IBHome from './pages/IBHome';
import IBPixKeys from './pages/IBPixKeys';
import IBPixLimits from './pages/IBPixLimits';
import IBPixReceive from './pages/IBPixReceive';
import IBPixSend from './pages/IBPixSend';
import IBProofs from './pages/IBProofs';
import IBSettings from './pages/IBSettings';
import IBSettingsAccess from './pages/IBSettingsAccess';
import IBSettingsAccount from './pages/IBSettingsAccount';
import IBSettingsNotifications from './pages/IBSettingsNotifications';
import IBSettingsSecurity from './pages/IBSettingsSecurity';
import LandingPage from './pages/LandingPage';
import LivenessFacematchStep from './pages/LivenessFacematchStep';
import LivenessSimulation from './pages/LivenessSimulation';
import MEDDashboard from './pages/MEDDashboard';
import OriginationAgent from './pages/OriginationAgent';
import OriginationAgentSettings from './pages/OriginationAgentSettings';
import PaymentLinkCreate from './pages/PaymentLinkCreate';
import PaymentLinks from './pages/PaymentLinks';
import PixTransactions from './pages/PixTransactions';
import PlanSelection from './pages/PlanSelection';
import Plugins from './pages/Plugins';
import PreChargebacks from './pages/PreChargebacks';
import ReceivablesAgenda from './pages/ReceivablesAgenda';
import RecoveryAgent from './pages/RecoveryAgent';
import Recurrence from './pages/Recurrence';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import SplitManagement from './pages/SplitManagement';
import SubaccountOnboarding from './pages/SubaccountOnboarding';
import Subaccounts from './pages/Subaccounts';
import SubaccountsDashboard from './pages/SubaccountsDashboard';
import SubaccountsList from './pages/SubaccountsList';
import SubscriptionAnalytics from './pages/SubscriptionAnalytics';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Subscriptions from './pages/Subscriptions';
import Support from './pages/Support';
import TransactionDetail from './pages/TransactionDetail';
import Transactions from './pages/Transactions';
import Webhooks from './pages/Webhooks';
import Withdrawals from './pages/Withdrawals';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccountCreationStep1": AccountCreationStep1,
    "AccountCreationStep3": AccountCreationStep3,
    "AdminIntActivation": AdminIntActivation,
    "AdminIntAiAgents": AdminIntAiAgents,
    "AdminIntAnticipation": AdminIntAnticipation,
    "AdminIntAntifraud": AdminIntAntifraud,
    "AdminIntAudit": AdminIntAudit,
    "AdminIntBlockages": AdminIntBlockages,
    "AdminIntCentralLinks": AdminIntCentralLinks,
    "AdminIntChargebacks": AdminIntChargebacks,
    "AdminIntComercial": AdminIntComercial,
    "AdminIntCommercialInsights": AdminIntCommercialInsights,
    "AdminIntCreateProposal": AdminIntCreateProposal,
    "AdminIntDashboard": AdminIntDashboard,
    "AdminIntDocs": AdminIntDocs,
    "AdminIntFeePlanDetail": AdminIntFeePlanDetail,
    "AdminIntFeePlans": AdminIntFeePlans,
    "AdminIntFinancialHealth": AdminIntFinancialHealth,
    "AdminIntGlobalParams": AdminIntGlobalParams,
    "AdminIntGoalsPerformance": AdminIntGoalsPerformance,
    "AdminIntIntegrationDetail": AdminIntIntegrationDetail,
    "AdminIntIntegrations": AdminIntIntegrations,
    "AdminIntKYC": AdminIntKYC,
    "AdminIntKYCQueue": AdminIntKYCQueue,
    "AdminIntKycAnalysis": AdminIntKycAnalysis,
    "AdminIntLeadProfile": AdminIntLeadProfile,
    "AdminIntLeads": AdminIntLeads,
    "AdminIntMCCDetail": AdminIntMCCDetail,
    "AdminIntMCCs": AdminIntMCCs,
    "AdminIntMccIrregularities": AdminIntMccIrregularities,
    "AdminIntMerchantProfile": AdminIntMerchantProfile,
    "AdminIntMerchants": AdminIntMerchants,
    "AdminIntMerchantsList": AdminIntMerchantsList,
    "AdminIntNewMerchant": AdminIntNewMerchant,
    "AdminIntOnboardingDash": AdminIntOnboardingDash,
    "AdminIntOnboardingQueue": AdminIntOnboardingQueue,
    "AdminIntPLD": AdminIntPLD,
    "AdminIntPartnerDetail": AdminIntPartnerDetail,
    "AdminIntPartners": AdminIntPartners,
    "AdminIntPipeline": AdminIntPipeline,
    "AdminIntPreChargebacks": AdminIntPreChargebacks,
    "AdminIntPriceSimulator": AdminIntPriceSimulator,
    "AdminIntProfiles": AdminIntProfiles,
    "AdminIntProposalDetails": AdminIntProposalDetails,
    "AdminIntProposals": AdminIntProposals,
    "AdminIntQuestionnaires": AdminIntQuestionnaires,
    "AdminIntReconciliation": AdminIntReconciliation,
    "AdminIntReports": AdminIntReports,
    "AdminIntRetention": AdminIntRetention,
    "AdminIntRisk": AdminIntRisk,
    "AdminIntRollingReserve": AdminIntRollingReserve,
    "AdminIntSelfService": AdminIntSelfService,
    "AdminIntSettings": AdminIntSettings,
    "AdminIntSettlement": AdminIntSettlement,
    "AdminIntSubaccountDetail": AdminIntSubaccountDetail,
    "AdminIntSubaccounts": AdminIntSubaccounts,
    "AdminIntSupport": AdminIntSupport,
    "AdminIntSystemLogs": AdminIntSystemLogs,
    "AdminIntTransactionDetail": AdminIntTransactionDetail,
    "AdminIntTransactions": AdminIntTransactions,
    "AdminIntTransactionsDashboard": AdminIntTransactionsDashboard,
    "AdminIntTransactionsList": AdminIntTransactionsList,
    "AdminIntUserDetail": AdminIntUserDetail,
    "AdminIntUsers": AdminIntUsers,
    "AdminIntWebhooks": AdminIntWebhooks,
    "Anticipation": Anticipation,
    "ApiKeys": ApiKeys,
    "CardTransactions": CardTransactions,
    "Chargebacks": Chargebacks,
    "CheckoutAnalytics": CheckoutAnalytics,
    "CheckoutBuilder": CheckoutBuilder,
    "CheckoutTemplates": CheckoutTemplates,
    "Checkouts": Checkouts,
    "ComplianceFullKYC": ComplianceFullKYC,
    "ComplianceOnboardingStart": ComplianceOnboardingStart,
    "CompliancePixOnly": CompliancePixOnly,
    "ConverterAgent": ConverterAgent,
    "CustomDashboards": CustomDashboards,
    "CustomerDetail": CustomerDetail,
    "Customers": Customers,
    "DIACopilot": DIACopilot,
    "Dashboard": Dashboard,
    "DeclineAnalysis": DeclineAnalysis,
    "DisputeAgentSettings": DisputeAgentSettings,
    "DisputeContestation": DisputeContestation,
    "DisputeDashboard": DisputeDashboard,
    "DisputeManager": DisputeManager,
    "Disputes": Disputes,
    "DocumentUploadFull": DocumentUploadFull,
    "DocumentUploadPix": DocumentUploadPix,
    "DunningSettings": DunningSettings,
    "Fees": Fees,
    "FeesAnalysis": FeesAnalysis,
    "Financial": Financial,
    "FinancialOverview": FinancialOverview,
    "FinancialStatement": FinancialStatement,
    "IBExtract": IBExtract,
    "IBHome": IBHome,
    "IBPixKeys": IBPixKeys,
    "IBPixLimits": IBPixLimits,
    "IBPixReceive": IBPixReceive,
    "IBPixSend": IBPixSend,
    "IBProofs": IBProofs,
    "IBSettings": IBSettings,
    "IBSettingsAccess": IBSettingsAccess,
    "IBSettingsAccount": IBSettingsAccount,
    "IBSettingsNotifications": IBSettingsNotifications,
    "IBSettingsSecurity": IBSettingsSecurity,
    "LandingPage": LandingPage,
    "LivenessFacematchStep": LivenessFacematchStep,
    "LivenessSimulation": LivenessSimulation,
    "MEDDashboard": MEDDashboard,
    "OriginationAgent": OriginationAgent,
    "OriginationAgentSettings": OriginationAgentSettings,
    "PaymentLinkCreate": PaymentLinkCreate,
    "PaymentLinks": PaymentLinks,
    "PixTransactions": PixTransactions,
    "PlanSelection": PlanSelection,
    "Plugins": Plugins,
    "PreChargebacks": PreChargebacks,
    "ReceivablesAgenda": ReceivablesAgenda,
    "RecoveryAgent": RecoveryAgent,
    "Recurrence": Recurrence,
    "Reports": Reports,
    "SettingsPage": SettingsPage,
    "SplitManagement": SplitManagement,
    "SubaccountOnboarding": SubaccountOnboarding,
    "Subaccounts": Subaccounts,
    "SubaccountsDashboard": SubaccountsDashboard,
    "SubaccountsList": SubaccountsList,
    "SubscriptionAnalytics": SubscriptionAnalytics,
    "SubscriptionPlans": SubscriptionPlans,
    "Subscriptions": Subscriptions,
    "Support": Support,
    "TransactionDetail": TransactionDetail,
    "Transactions": Transactions,
    "Webhooks": Webhooks,
    "Withdrawals": Withdrawals,
}

export const pagesConfig = {
    mainPage: "LandingPage",
    Pages: PAGES,
    Layout: __Layout,
};