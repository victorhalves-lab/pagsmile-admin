import AccountCreationStep1 from './pages/AccountCreationStep1';
import AccountCreationStep3 from './pages/AccountCreationStep3';
import Anticipation from './pages/Anticipation';
import IBHome from './pages/IBHome';
import IBExtract from './pages/IBExtract';
import IBPixSend from './pages/IBPixSend';
import IBPixReceive from './pages/IBPixReceive';
import IBPixKeys from './pages/IBPixKeys';
import IBPixLimits from './pages/IBPixLimits';
import IBProofs from './pages/IBProofs';
import IBSettings from './pages/IBSettings';
import IBSettingsAccount from './pages/IBSettingsAccount';
import IBSettingsSecurity from './pages/IBSettingsSecurity';
import IBSettingsNotifications from './pages/IBSettingsNotifications';
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
import Financial from './pages/Financial';
import FinancialOverview from './pages/FinancialOverview';
import FinancialStatement from './pages/FinancialStatement';
import LandingPage from './pages/LandingPage';
import LivenessFacematchStep from './pages/LivenessFacematchStep';
import LivenessSimulation from './pages/LivenessSimulation';
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
    "Financial": Financial,
    "FinancialOverview": FinancialOverview,
    "FinancialStatement": FinancialStatement,
    "IBHome": IBHome,
    "IBExtract": IBExtract,
    "IBPixSend": IBPixSend,
    "IBPixReceive": IBPixReceive,
    "IBPixKeys": IBPixKeys,
    "IBPixLimits": IBPixLimits,
    "IBProofs": IBProofs,
    "IBSettings": IBSettings,
    "IBSettingsAccount": IBSettingsAccount,
    "IBSettingsSecurity": IBSettingsSecurity,
    "IBSettingsNotifications": IBSettingsNotifications,
    "LandingPage": LandingPage,
    "LivenessFacematchStep": LivenessFacematchStep,
    "LivenessSimulation": LivenessSimulation,
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