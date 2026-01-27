import ApiKeys from './pages/ApiKeys';
import Chargebacks from './pages/Chargebacks';
import CheckoutBuilder from './pages/CheckoutBuilder';
import ConverterAgent from './pages/ConverterAgent';
import Customers from './pages/Customers';
import DIACopilot from './pages/DIACopilot';
import Dashboard from './pages/Dashboard';
import DisputeAgentSettings from './pages/DisputeAgentSettings';
import DisputeContestation from './pages/DisputeContestation';
import DisputeDashboard from './pages/DisputeDashboard';
import DisputeManager from './pages/DisputeManager';
import Disputes from './pages/Disputes';
import DunningSettings from './pages/DunningSettings';
import Financial from './pages/Financial';
import OriginationAgent from './pages/OriginationAgent';
import PaymentLinkCreate from './pages/PaymentLinkCreate';
import PaymentLinks from './pages/PaymentLinks';
import PreChargebacks from './pages/PreChargebacks';
import RecoveryAgent from './pages/RecoveryAgent';
import SettingsPage from './pages/SettingsPage';
import Subaccounts from './pages/Subaccounts';
import SubscriptionAnalytics from './pages/SubscriptionAnalytics';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Subscriptions from './pages/Subscriptions';
import Support from './pages/Support';
import TransactionDetail from './pages/TransactionDetail';
import Transactions from './pages/Transactions';
import Webhooks from './pages/Webhooks';
import Withdrawals from './pages/Withdrawals';
import FinancialOverview from './pages/FinancialOverview';
import FinancialStatement from './pages/FinancialStatement';
import ReceivablesAgenda from './pages/ReceivablesAgenda';
import Anticipation from './pages/Anticipation';
import SplitManagement from './pages/SplitManagement';
import SubaccountsDashboard from './pages/SubaccountsDashboard';
import SubaccountsList from './pages/SubaccountsList';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ApiKeys": ApiKeys,
    "Chargebacks": Chargebacks,
    "CheckoutBuilder": CheckoutBuilder,
    "ConverterAgent": ConverterAgent,
    "Customers": Customers,
    "DIACopilot": DIACopilot,
    "Dashboard": Dashboard,
    "DisputeAgentSettings": DisputeAgentSettings,
    "DisputeContestation": DisputeContestation,
    "DisputeDashboard": DisputeDashboard,
    "DisputeManager": DisputeManager,
    "Disputes": Disputes,
    "DunningSettings": DunningSettings,
    "Financial": Financial,
    "OriginationAgent": OriginationAgent,
    "PaymentLinkCreate": PaymentLinkCreate,
    "PaymentLinks": PaymentLinks,
    "PreChargebacks": PreChargebacks,
    "RecoveryAgent": RecoveryAgent,
    "SettingsPage": SettingsPage,
    "Subaccounts": Subaccounts,
    "SubscriptionAnalytics": SubscriptionAnalytics,
    "SubscriptionPlans": SubscriptionPlans,
    "Subscriptions": Subscriptions,
    "Support": Support,
    "TransactionDetail": TransactionDetail,
    "Transactions": Transactions,
    "Webhooks": Webhooks,
    "Withdrawals": Withdrawals,
    "FinancialOverview": FinancialOverview,
    "FinancialStatement": FinancialStatement,
    "ReceivablesAgenda": ReceivablesAgenda,
    "Anticipation": Anticipation,
    "SplitManagement": SplitManagement,
    "SubaccountsDashboard": SubaccountsDashboard,
    "SubaccountsList": SubaccountsList,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};