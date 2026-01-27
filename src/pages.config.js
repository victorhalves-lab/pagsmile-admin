import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Financial from './pages/Financial';
import Disputes from './pages/Disputes';
import Subscriptions from './pages/Subscriptions';
import PaymentLinks from './pages/PaymentLinks';
import Customers from './pages/Customers';
import Subaccounts from './pages/Subaccounts';
import Withdrawals from './pages/Withdrawals';
import Webhooks from './pages/Webhooks';
import ApiKeys from './pages/ApiKeys';
import SettingsPage from './pages/SettingsPage';
import Support from './pages/Support';
import DIACopilot from './pages/DIACopilot';
import RecoveryAgent from './pages/RecoveryAgent';
import ConverterAgent from './pages/ConverterAgent';
import DisputeManager from './pages/DisputeManager';
import OriginationAgent from './pages/OriginationAgent';
import TransactionDetail from './pages/TransactionDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Transactions": Transactions,
    "Financial": Financial,
    "Disputes": Disputes,
    "Subscriptions": Subscriptions,
    "PaymentLinks": PaymentLinks,
    "Customers": Customers,
    "Subaccounts": Subaccounts,
    "Withdrawals": Withdrawals,
    "Webhooks": Webhooks,
    "ApiKeys": ApiKeys,
    "SettingsPage": SettingsPage,
    "Support": Support,
    "DIACopilot": DIACopilot,
    "RecoveryAgent": RecoveryAgent,
    "ConverterAgent": ConverterAgent,
    "DisputeManager": DisputeManager,
    "OriginationAgent": OriginationAgent,
    "TransactionDetail": TransactionDetail,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};