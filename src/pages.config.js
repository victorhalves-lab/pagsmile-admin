import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Financial from './pages/Financial';
import Disputes from './pages/Disputes';
import Subscriptions from './pages/Subscriptions';
import PaymentLinks from './pages/PaymentLinks';
import Customers from './pages/Customers';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Transactions": Transactions,
    "Financial": Financial,
    "Disputes": Disputes,
    "Subscriptions": Subscriptions,
    "PaymentLinks": PaymentLinks,
    "Customers": Customers,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};