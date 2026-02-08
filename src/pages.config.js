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
import AdminIntAiAgents from './pages/AdminIntAiAgents';
import AdminIntAnalytics from './pages/AdminIntAnalytics';
import AdminIntAnticipation from './pages/AdminIntAnticipation';
import AdminIntAnticipations from './pages/AdminIntAnticipations';
import AdminIntAntifraud from './pages/AdminIntAntifraud';
import AdminIntAudit from './pages/AdminIntAudit';
import AdminIntBINAnalysis from './pages/AdminIntBINAnalysis';
import AdminIntBalanceManagement from './pages/AdminIntBalanceManagement';
import AdminIntBatchProcessing from './pages/AdminIntBatchProcessing';
import AdminIntBlockages from './pages/AdminIntBlockages';
import AdminIntCentralLinks from './pages/AdminIntCentralLinks';
import AdminIntChargebacks from './pages/AdminIntChargebacks';
import AdminIntChargebacksList from './pages/AdminIntChargebacksList';
import AdminIntClientProfitability from './pages/AdminIntClientProfitability';
import AdminIntClientSplitDetail from './pages/AdminIntClientSplitDetail';
import AdminIntCommAutomations from './pages/AdminIntCommAutomations';
import AdminIntCommDashboard from './pages/AdminIntCommDashboard';
import AdminIntCommLogs from './pages/AdminIntCommLogs';
import AdminIntCommSMTP from './pages/AdminIntCommSMTP';
import AdminIntCommSenders from './pages/AdminIntCommSenders';
import AdminIntCommTemplates from './pages/AdminIntCommTemplates';
import AdminIntCommercialInsights from './pages/AdminIntCommercialInsights';
import AdminIntCompliance from './pages/AdminIntCompliance';
import AdminIntComplianceAudit from './pages/AdminIntComplianceAudit';
import AdminIntComplianceDocs from './pages/AdminIntComplianceDocs';
import AdminIntComplianceFormLink from './pages/AdminIntComplianceFormLink';
import AdminIntComplianceForms from './pages/AdminIntComplianceForms';
import AdminIntComplianceHelena from './pages/AdminIntComplianceHelena';
import AdminIntComplianceQueue from './pages/AdminIntComplianceQueue';
import AdminIntComplianceReview from './pages/AdminIntComplianceReview';
import AdminIntComplianceRules from './pages/AdminIntComplianceRules';
import AdminIntComplianceSubmissions from './pages/AdminIntComplianceSubmissions';
import AdminIntConciliation from './pages/AdminIntConciliation';
import AdminIntControlLists from './pages/AdminIntControlLists';
import AdminIntConverterAgent from './pages/AdminIntConverterAgent';
import AdminIntConverterAgentSettings from './pages/AdminIntConverterAgentSettings';
import AdminIntCreateProposal from './pages/AdminIntCreateProposal';
import AdminIntDashboard from './pages/AdminIntDashboard';
import AdminIntDisputeManager from './pages/AdminIntDisputeManager';
import AdminIntDisputeManagerSettings from './pages/AdminIntDisputeManagerSettings';
import AdminIntDocs from './pages/AdminIntDocs';
import AdminIntFeePlanDetail from './pages/AdminIntFeePlanDetail';
import AdminIntFeePlans from './pages/AdminIntFeePlans';
import AdminIntFinancialDashboard from './pages/AdminIntFinancialDashboard';
import AdminIntFinancialHealth from './pages/AdminIntFinancialHealth';
import AdminIntFinancialResults from './pages/AdminIntFinancialResults';
import AdminIntFraudMonitoring from './pages/AdminIntFraudMonitoring';
import AdminIntGlobalParams from './pages/AdminIntGlobalParams';
import AdminIntGlobalRates from './pages/AdminIntGlobalRates';
import AdminIntGoalsPerformance from './pages/AdminIntGoalsPerformance';
import AdminIntIdentityOnboarder from './pages/AdminIntIdentityOnboarder';
import AdminIntIdentityOnboarderSettings from './pages/AdminIntIdentityOnboarderSettings';
import AdminIntIntegrationDetail from './pages/AdminIntIntegrationDetail';
import AdminIntIntegrations from './pages/AdminIntIntegrations';
import AdminIntKYCQueue from './pages/AdminIntKYCQueue';
import AdminIntKycAnalysis from './pages/AdminIntKycAnalysis';
import AdminIntLeadProfile from './pages/AdminIntLeadProfile';
import AdminIntLimitRequests from './pages/AdminIntLimitRequests';
import AdminIntMCCDetail from './pages/AdminIntMCCDetail';
import AdminIntMCCs from './pages/AdminIntMCCs';
import AdminIntMCCsAnalysis from './pages/AdminIntMCCsAnalysis';
import AdminIntMEDsList from './pages/AdminIntMEDsList';
import AdminIntMccIrregularities from './pages/AdminIntMccIrregularities';
import AdminIntMerchantGroups from './pages/AdminIntMerchantGroups';
import AdminIntMerchantProfile from './pages/AdminIntMerchantProfile';
import AdminIntMerchantReports from './pages/AdminIntMerchantReports';
import AdminIntMerchantTags from './pages/AdminIntMerchantTags';
import AdminIntMerchants from './pages/AdminIntMerchants';
import AdminIntMerchantsList from './pages/AdminIntMerchantsList';
import AdminIntNewMerchant from './pages/AdminIntNewMerchant';
import AdminIntOrchestration from './pages/AdminIntOrchestration';
import AdminIntPLD from './pages/AdminIntPLD';
import AdminIntPagSmileCopilot from './pages/AdminIntPagSmileCopilot';
import AdminIntPagSmileCopilotSettings from './pages/AdminIntPagSmileCopilotSettings';
import AdminIntPartnerDetail from './pages/AdminIntPartnerDetail';
import AdminIntPartners from './pages/AdminIntPartners';
import AdminIntPaymentAgenda from './pages/AdminIntPaymentAgenda';
import AdminIntPreChargebacks from './pages/AdminIntPreChargebacks';
import AdminIntPriceSimulator from './pages/AdminIntPriceSimulator';
import AdminIntProfiles from './pages/AdminIntProfiles';
import AdminIntProposalDetails from './pages/AdminIntProposalDetails';
import AdminIntReconciliation from './pages/AdminIntReconciliation';
import AdminIntRecoveryAgent from './pages/AdminIntRecoveryAgent';
import AdminIntRecoveryAgentSettings from './pages/AdminIntRecoveryAgentSettings';
import AdminIntReports from './pages/AdminIntReports';
import AdminIntReportsCustom from './pages/AdminIntReportsCustom';
import AdminIntReportsFinancial from './pages/AdminIntReportsFinancial';
import AdminIntReportsHub from './pages/AdminIntReportsHub';
import AdminIntReportsOperational from './pages/AdminIntReportsOperational';
import AdminIntReportsRisk from './pages/AdminIntReportsRisk';
import AdminIntRetention from './pages/AdminIntRetention';
import AdminIntRetryIntelligence from './pages/AdminIntRetryIntelligence';
import AdminIntRisk from './pages/AdminIntRisk';
import AdminIntRiskAlerts from './pages/AdminIntRiskAlerts';
import AdminIntRiskDashboard from './pages/AdminIntRiskDashboard';
import AdminIntRiskParams from './pages/AdminIntRiskParams';
import AdminIntRiskRules from './pages/AdminIntRiskRules';
import AdminIntRollingReserve from './pages/AdminIntRollingReserve';
import AdminIntSettings from './pages/AdminIntSettings';
import AdminIntSettlement from './pages/AdminIntSettlement';
import AdminIntSettlements from './pages/AdminIntSettlements';
import AdminIntStatements from './pages/AdminIntStatements';
import AdminIntSubSellerDetail from './pages/AdminIntSubSellerDetail';
import AdminIntSubaccountDetail from './pages/AdminIntSubaccountDetail';
import AdminIntSubaccounts from './pages/AdminIntSubaccounts';
import AdminIntSupport from './pages/AdminIntSupport';
import AdminIntSystemLogs from './pages/AdminIntSystemLogs';
import AdminIntTemplates from './pages/AdminIntTemplates';
import AdminIntTransactionDetail from './pages/AdminIntTransactionDetail';
import AdminIntTransactionReports from './pages/AdminIntTransactionReports';
import AdminIntTransactions from './pages/AdminIntTransactions';
import AdminIntTransactionsDashboard from './pages/AdminIntTransactionsDashboard';
import AdminIntTransactionsList from './pages/AdminIntTransactionsList';
import AdminIntUserDetail from './pages/AdminIntUserDetail';
import AdminIntUsers from './pages/AdminIntUsers';
import AdminIntWebhooks from './pages/AdminIntWebhooks';
import AdminIntWithdrawalApprovals from './pages/AdminIntWithdrawalApprovals';
import AdminIntWithdrawals from './pages/AdminIntWithdrawals';
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
import ConverterAgentSettings from './pages/ConverterAgentSettings';
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
import DisputeManagerSettings from './pages/DisputeManagerSettings';
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
import OnboardingAgentChat from './pages/OnboardingAgentChat';
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
import AdminIntSubaccountLimits from './pages/AdminIntSubaccountLimits';
import AdminIntSubaccountRates from './pages/AdminIntSubaccountRates';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccountCreationStep1": AccountCreationStep1,
    "AccountCreationStep3": AccountCreationStep3,
    "AdminIntAiAgents": AdminIntAiAgents,
    "AdminIntAnalytics": AdminIntAnalytics,
    "AdminIntAnticipation": AdminIntAnticipation,
    "AdminIntAnticipations": AdminIntAnticipations,
    "AdminIntAntifraud": AdminIntAntifraud,
    "AdminIntAudit": AdminIntAudit,
    "AdminIntBINAnalysis": AdminIntBINAnalysis,
    "AdminIntBalanceManagement": AdminIntBalanceManagement,
    "AdminIntBatchProcessing": AdminIntBatchProcessing,
    "AdminIntBlockages": AdminIntBlockages,
    "AdminIntCentralLinks": AdminIntCentralLinks,
    "AdminIntChargebacks": AdminIntChargebacks,
    "AdminIntChargebacksList": AdminIntChargebacksList,
    "AdminIntClientProfitability": AdminIntClientProfitability,
    "AdminIntClientSplitDetail": AdminIntClientSplitDetail,
    "AdminIntCommAutomations": AdminIntCommAutomations,
    "AdminIntCommDashboard": AdminIntCommDashboard,
    "AdminIntCommLogs": AdminIntCommLogs,
    "AdminIntCommSMTP": AdminIntCommSMTP,
    "AdminIntCommSenders": AdminIntCommSenders,
    "AdminIntCommTemplates": AdminIntCommTemplates,
    "AdminIntCommercialInsights": AdminIntCommercialInsights,
    "AdminIntCompliance": AdminIntCompliance,
    "AdminIntComplianceAudit": AdminIntComplianceAudit,
    "AdminIntComplianceDocs": AdminIntComplianceDocs,
    "AdminIntComplianceFormLink": AdminIntComplianceFormLink,
    "AdminIntComplianceForms": AdminIntComplianceForms,
    "AdminIntComplianceHelena": AdminIntComplianceHelena,
    "AdminIntComplianceQueue": AdminIntComplianceQueue,
    "AdminIntComplianceReview": AdminIntComplianceReview,
    "AdminIntComplianceRules": AdminIntComplianceRules,
    "AdminIntComplianceSubmissions": AdminIntComplianceSubmissions,
    "AdminIntConciliation": AdminIntConciliation,
    "AdminIntControlLists": AdminIntControlLists,
    "AdminIntConverterAgent": AdminIntConverterAgent,
    "AdminIntConverterAgentSettings": AdminIntConverterAgentSettings,
    "AdminIntCreateProposal": AdminIntCreateProposal,
    "AdminIntDashboard": AdminIntDashboard,
    "AdminIntDisputeManager": AdminIntDisputeManager,
    "AdminIntDisputeManagerSettings": AdminIntDisputeManagerSettings,
    "AdminIntDocs": AdminIntDocs,
    "AdminIntFeePlanDetail": AdminIntFeePlanDetail,
    "AdminIntFeePlans": AdminIntFeePlans,
    "AdminIntFinancialDashboard": AdminIntFinancialDashboard,
    "AdminIntFinancialHealth": AdminIntFinancialHealth,
    "AdminIntFinancialResults": AdminIntFinancialResults,
    "AdminIntFraudMonitoring": AdminIntFraudMonitoring,
    "AdminIntGlobalParams": AdminIntGlobalParams,
    "AdminIntGlobalRates": AdminIntGlobalRates,
    "AdminIntGoalsPerformance": AdminIntGoalsPerformance,
    "AdminIntIdentityOnboarder": AdminIntIdentityOnboarder,
    "AdminIntIdentityOnboarderSettings": AdminIntIdentityOnboarderSettings,
    "AdminIntIntegrationDetail": AdminIntIntegrationDetail,
    "AdminIntIntegrations": AdminIntIntegrations,
    "AdminIntKYCQueue": AdminIntKYCQueue,
    "AdminIntKycAnalysis": AdminIntKycAnalysis,
    "AdminIntLeadProfile": AdminIntLeadProfile,
    "AdminIntLimitRequests": AdminIntLimitRequests,
    "AdminIntMCCDetail": AdminIntMCCDetail,
    "AdminIntMCCs": AdminIntMCCs,
    "AdminIntMCCsAnalysis": AdminIntMCCsAnalysis,
    "AdminIntMEDsList": AdminIntMEDsList,
    "AdminIntMccIrregularities": AdminIntMccIrregularities,
    "AdminIntMerchantGroups": AdminIntMerchantGroups,
    "AdminIntMerchantProfile": AdminIntMerchantProfile,
    "AdminIntMerchantReports": AdminIntMerchantReports,
    "AdminIntMerchantTags": AdminIntMerchantTags,
    "AdminIntMerchants": AdminIntMerchants,
    "AdminIntMerchantsList": AdminIntMerchantsList,
    "AdminIntNewMerchant": AdminIntNewMerchant,
    "AdminIntOrchestration": AdminIntOrchestration,
    "AdminIntPLD": AdminIntPLD,
    "AdminIntPagSmileCopilot": AdminIntPagSmileCopilot,
    "AdminIntPagSmileCopilotSettings": AdminIntPagSmileCopilotSettings,
    "AdminIntPartnerDetail": AdminIntPartnerDetail,
    "AdminIntPartners": AdminIntPartners,
    "AdminIntPaymentAgenda": AdminIntPaymentAgenda,
    "AdminIntPreChargebacks": AdminIntPreChargebacks,
    "AdminIntPriceSimulator": AdminIntPriceSimulator,
    "AdminIntProfiles": AdminIntProfiles,
    "AdminIntProposalDetails": AdminIntProposalDetails,
    "AdminIntReconciliation": AdminIntReconciliation,
    "AdminIntRecoveryAgent": AdminIntRecoveryAgent,
    "AdminIntRecoveryAgentSettings": AdminIntRecoveryAgentSettings,
    "AdminIntReports": AdminIntReports,
    "AdminIntReportsCustom": AdminIntReportsCustom,
    "AdminIntReportsFinancial": AdminIntReportsFinancial,
    "AdminIntReportsHub": AdminIntReportsHub,
    "AdminIntReportsOperational": AdminIntReportsOperational,
    "AdminIntReportsRisk": AdminIntReportsRisk,
    "AdminIntRetention": AdminIntRetention,
    "AdminIntRetryIntelligence": AdminIntRetryIntelligence,
    "AdminIntRisk": AdminIntRisk,
    "AdminIntRiskAlerts": AdminIntRiskAlerts,
    "AdminIntRiskDashboard": AdminIntRiskDashboard,
    "AdminIntRiskParams": AdminIntRiskParams,
    "AdminIntRiskRules": AdminIntRiskRules,
    "AdminIntRollingReserve": AdminIntRollingReserve,
    "AdminIntSettings": AdminIntSettings,
    "AdminIntSettlement": AdminIntSettlement,
    "AdminIntSettlements": AdminIntSettlements,
    "AdminIntStatements": AdminIntStatements,
    "AdminIntSubSellerDetail": AdminIntSubSellerDetail,
    "AdminIntSubaccountDetail": AdminIntSubaccountDetail,
    "AdminIntSubaccounts": AdminIntSubaccounts,
    "AdminIntSupport": AdminIntSupport,
    "AdminIntSystemLogs": AdminIntSystemLogs,
    "AdminIntTemplates": AdminIntTemplates,
    "AdminIntTransactionDetail": AdminIntTransactionDetail,
    "AdminIntTransactionReports": AdminIntTransactionReports,
    "AdminIntTransactions": AdminIntTransactions,
    "AdminIntTransactionsDashboard": AdminIntTransactionsDashboard,
    "AdminIntTransactionsList": AdminIntTransactionsList,
    "AdminIntUserDetail": AdminIntUserDetail,
    "AdminIntUsers": AdminIntUsers,
    "AdminIntWebhooks": AdminIntWebhooks,
    "AdminIntWithdrawalApprovals": AdminIntWithdrawalApprovals,
    "AdminIntWithdrawals": AdminIntWithdrawals,
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
    "ConverterAgentSettings": ConverterAgentSettings,
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
    "DisputeManagerSettings": DisputeManagerSettings,
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
    "OnboardingAgentChat": OnboardingAgentChat,
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
    "AdminIntSubaccountLimits": AdminIntSubaccountLimits,
    "AdminIntSubaccountRates": AdminIntSubaccountRates,
}

export const pagesConfig = {
    mainPage: "LandingPage",
    Pages: PAGES,
    Layout: __Layout,
};