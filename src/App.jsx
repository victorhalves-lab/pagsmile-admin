import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// B16 - Developer Hub satellite pages
import DevStatusPage from './pages/DevStatusPage';
import DevChangelog from './pages/DevChangelog';
import DevSandbox from './pages/DevSandbox';
import DevDocs from './pages/DevDocs';
import DevAppsMarketplace from './pages/DevAppsMarketplace';

// B22 - Tuna Orchestration & Multi-Method Pages (Admin Interno)
import AdminIntMultiMethodCockpit from './pages/AdminIntMultiMethodCockpit';
import AdminIntCrossMethodRecovery from './pages/AdminIntCrossMethodRecovery';
import AdminIntConnectionHealth from './pages/AdminIntConnectionHealth';
import AdminIntMerchantCoverageMatrix from './pages/AdminIntMerchantCoverageMatrix';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      {/* B16 - Developer Hub satellite pages */}
      <Route path="/DevStatusPage" element={<LayoutWrapper currentPageName="DevStatusPage"><DevStatusPage /></LayoutWrapper>} />
      <Route path="/DevChangelog" element={<LayoutWrapper currentPageName="DevChangelog"><DevChangelog /></LayoutWrapper>} />
      <Route path="/DevSandbox" element={<LayoutWrapper currentPageName="DevSandbox"><DevSandbox /></LayoutWrapper>} />
      <Route path="/DevDocs" element={<LayoutWrapper currentPageName="DevDocs"><DevDocs /></LayoutWrapper>} />
      <Route path="/DevAppsMarketplace" element={<LayoutWrapper currentPageName="DevAppsMarketplace"><DevAppsMarketplace /></LayoutWrapper>} />
      {/* B22 - Tuna Orchestration & Multi-Method (Admin Interno) */}
      <Route path="/AdminIntMultiMethodCockpit" element={<LayoutWrapper currentPageName="AdminIntMultiMethodCockpit"><AdminIntMultiMethodCockpit /></LayoutWrapper>} />
      <Route path="/AdminIntCrossMethodRecovery" element={<LayoutWrapper currentPageName="AdminIntCrossMethodRecovery"><AdminIntCrossMethodRecovery /></LayoutWrapper>} />
      <Route path="/AdminIntConnectionHealth" element={<LayoutWrapper currentPageName="AdminIntConnectionHealth"><AdminIntConnectionHealth /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantCoverageMatrix" element={<LayoutWrapper currentPageName="AdminIntMerchantCoverageMatrix"><AdminIntMerchantCoverageMatrix /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App