import ApiKeys from './pages/ApiKeys';
import ConverterAgent from './pages/ConverterAgent';
import Customers from './pages/Customers';
import DIACopilot from './pages/DIACopilot';
import Dashboard from './pages/Dashboard';
import DisputeManager from './pages/DisputeManager';
import Disputes from './pages/Disputes';
import Financial from './pages/Financial';
import OriginationAgent from './pages/OriginationAgent';
import PaymentLinks from './pages/PaymentLinks';
import RecoveryAgent from './pages/RecoveryAgent';
import SettingsPage from './pages/SettingsPage';
import Subaccounts from './pages/Subaccounts';
import Subscriptions from './pages/Subscriptions';
import Support from './pages/Support';
import TransactionDetail from './pages/TransactionDetail';
import Transactions from './pages/Transactions';
import Webhooks from './pages/Webhooks';
import Withdrawals from './pages/Withdrawals';
import CheckoutBuilder from './pages/CheckoutBuilder';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ApiKeys": ApiKeys,
    "ConverterAgent": ConverterAgent,
    "Customers": Customers,
    "DIACopilot": DIACopilot,
    "Dashboard": Dashboard,
    "DisputeManager": DisputeManager,
    "Disputes": Disputes,
    "Financial": Financial,
    "OriginationAgent": OriginationAgent,
    "PaymentLinks": PaymentLinks,
    "RecoveryAgent": RecoveryAgent,
    "SettingsPage": SettingsPage,
    "Subaccounts": Subaccounts,
    "Subscriptions": Subscriptions,
    "Support": Support,
    "TransactionDetail": TransactionDetail,
    "Transactions": Transactions,
    "Webhooks": Webhooks,
    "Withdrawals": Withdrawals,
    "CheckoutBuilder": CheckoutBuilder,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};