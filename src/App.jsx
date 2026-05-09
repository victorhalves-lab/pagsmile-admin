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

// Onboarding extras
import SelectSegment from './pages/SelectSegment';

// ====== Catálogos Mestres (Admin Interno) ======
import AdminIntAcquirers from './pages/AdminIntAcquirers';
import AdminIntAcquirerDetail from './pages/AdminIntAcquirerDetail';
import AdminIntCardBrands from './pages/AdminIntCardBrands';
import AdminIntCardBrandDetail from './pages/AdminIntCardBrandDetail';
import AdminIntChannels from './pages/AdminIntChannels';
import AdminIntChannelDetail from './pages/AdminIntChannelDetail';

// ====== Operações Avançadas (Admin Interno) ======
import AdminIntSettlementChangeFlow from './pages/AdminIntSettlementChangeFlow';
import AdminIntContractEffectsRegistry from './pages/AdminIntContractEffectsRegistry';
import AdminIntMerchantGroups from './pages/AdminIntMerchantGroups';
import AdminIntMerchantGroupDetail from './pages/AdminIntMerchantGroupDetail';
import AdminIntMerchantGroupCreate from './pages/AdminIntMerchantGroupCreate';
import AdminIntBlockageFlow from './pages/AdminIntBlockageFlow';
import AdminIntUnblockFlow from './pages/AdminIntUnblockFlow';
import AdminIntSuspensionFlow from './pages/AdminIntSuspensionFlow';
import AdminIntBlockageReviewSchedule from './pages/AdminIntBlockageReviewSchedule';
import AdminIntAcquirerSwitchFlow from './pages/AdminIntAcquirerSwitchFlow';
import AdminIntMccChangePreCheck from './pages/AdminIntMccChangePreCheck';
import AdminIntMerchantOnboardingPipeline from './pages/AdminIntMerchantOnboardingPipeline';
import AdminIntMerchantOnboardingFunnelAnalytics from './pages/AdminIntMerchantOnboardingFunnelAnalytics';
import AdminIntKycAnalysisQueue from './pages/AdminIntKycAnalysisQueue';

// ====== Mentor (Admin Sub) ======
import SubaccountSettlementChangeRequest from './pages/SubaccountSettlementChangeRequest';
import SubaccountAnticipationRequest from './pages/SubaccountAnticipationRequest';
import SubaccountKycReupload from './pages/SubaccountKycReupload';
import SubaccountOnboardingProgress from './pages/SubaccountOnboardingProgress';
import MerchantGroupConsolidatedView from './pages/MerchantGroupConsolidatedView';

// B22 - Tuna Orchestration & Multi-Method Pages (Admin Interno)
import AdminIntMultiMethodCockpit from './pages/AdminIntMultiMethodCockpit';
import AdminIntCrossMethodRecovery from './pages/AdminIntCrossMethodRecovery';
import AdminIntConnectionHealth from './pages/AdminIntConnectionHealth';
import AdminIntMerchantCoverageMatrix from './pages/AdminIntMerchantCoverageMatrix';
// B22 - Wave 2 (P1)
import AdminIntOrchestrationStudio from './pages/AdminIntOrchestrationStudio';
import AdminIntAntiArbitrage from './pages/AdminIntAntiArbitrage';
import AdminIntSmartSplitSuggester from './pages/AdminIntSmartSplitSuggester';
import AdminIntABVolumeAllocator from './pages/AdminIntABVolumeAllocator';
import AdminIntShadowMode from './pages/AdminIntShadowMode';
import AdminIntReconciliationHub from './pages/AdminIntReconciliationHub';
import AdminIntFraudAnomalyDetector from './pages/AdminIntFraudAnomalyDetector';
import AdminIntAuditTrailEnhanced from './pages/AdminIntAuditTrailEnhanced';
import AdminIntTenantManagement from './pages/AdminIntTenantManagement';
import AdminIntWebhookReplay from './pages/AdminIntWebhookReplay';
import AdminIntSettlementForecasting from './pages/AdminIntSettlementForecasting';
import AdminIntCryptoHub from './pages/AdminIntCryptoHub';
// B22 - Admin Sub
import MultiMethodCheckoutConfig from './pages/MultiMethodCheckoutConfig';
import RecoveryLadderConfig from './pages/RecoveryLadderConfig';
import SplitDesignerPage from './pages/SplitDesignerPage';
import SplitTransparencyDashboard from './pages/SplitTransparencyDashboard';

// ====== Mentor — Wave B/C/D (Empresas / Representantes / Projetos) ======
import AdminIntCompanies from './pages/AdminIntCompanies';
import AdminIntCompanyDetail from './pages/AdminIntCompanyDetail';
import AdminIntSalesReps from './pages/AdminIntSalesReps';
import AdminIntSalesRepDetail from './pages/AdminIntSalesRepDetail';
import AdminIntProjects from './pages/AdminIntProjects';
import AdminIntProjectDetail from './pages/AdminIntProjectDetail';
import AdminIntProjectsConsolidatedDashboard from './pages/AdminIntProjectsConsolidatedDashboard';
import AdminIntSupplierCredentials from './pages/AdminIntSupplierCredentials';
import AdminIntUsersHub from './pages/AdminIntUsersHub';
import AdminIntSalesPlans from './pages/AdminIntSalesPlans';
import AdminIntSalesPlanDetail from './pages/AdminIntSalesPlanDetail';
import AdminIntSalesPlanComparator from './pages/AdminIntSalesPlanComparator';
import AdminIntCutoverScheduler from './pages/AdminIntCutoverScheduler';
import AdminIntDriftMonitoring from './pages/AdminIntDriftMonitoring';
import AdminIntTransactionReconciliation from './pages/AdminIntTransactionReconciliation';
import AdminIntTransactionSyncCenter from './pages/AdminIntTransactionSyncCenter';
import AdminIntTransactionExportCenter from './pages/AdminIntTransactionExportCenter';

// ====== Mentor — Wave H (Split) ======
import SplitDetail360 from './pages/SplitDetail360';
import SplitTerminalLinker from './pages/SplitTerminalLinker';
import SplitEditFlow from './pages/SplitEditFlow';
import SplitRiskOpportunityHub from './pages/SplitRiskOpportunityHub';
import AdminIntSplitsGovernance from './pages/AdminIntSplitsGovernance';
import SplitTemplatesBulkApply from './pages/SplitTemplatesBulkApply';

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
      {/* Onboarding extras */}
      <Route path="/SelectSegment" element={<LayoutWrapper currentPageName="SelectSegment"><SelectSegment /></LayoutWrapper>} />

      {/* ====== Catálogos Mestres ====== */}
      <Route path="/AdminIntAcquirers" element={<LayoutWrapper currentPageName="AdminIntAcquirers"><AdminIntAcquirers /></LayoutWrapper>} />
      <Route path="/AdminIntAcquirerDetail" element={<LayoutWrapper currentPageName="AdminIntAcquirerDetail"><AdminIntAcquirerDetail /></LayoutWrapper>} />
      <Route path="/AdminIntCardBrands" element={<LayoutWrapper currentPageName="AdminIntCardBrands"><AdminIntCardBrands /></LayoutWrapper>} />
      <Route path="/AdminIntCardBrandDetail" element={<LayoutWrapper currentPageName="AdminIntCardBrandDetail"><AdminIntCardBrandDetail /></LayoutWrapper>} />
      <Route path="/AdminIntChannels" element={<LayoutWrapper currentPageName="AdminIntChannels"><AdminIntChannels /></LayoutWrapper>} />
      <Route path="/AdminIntChannelDetail" element={<LayoutWrapper currentPageName="AdminIntChannelDetail"><AdminIntChannelDetail /></LayoutWrapper>} />

      {/* ====== Operações Avançadas ====== */}
      <Route path="/AdminIntSettlementChangeFlow" element={<LayoutWrapper currentPageName="AdminIntSettlementChangeFlow"><AdminIntSettlementChangeFlow /></LayoutWrapper>} />
      <Route path="/AdminIntContractEffectsRegistry" element={<LayoutWrapper currentPageName="AdminIntContractEffectsRegistry"><AdminIntContractEffectsRegistry /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantGroups" element={<LayoutWrapper currentPageName="AdminIntMerchantGroups"><AdminIntMerchantGroups /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantGroupDetail" element={<LayoutWrapper currentPageName="AdminIntMerchantGroupDetail"><AdminIntMerchantGroupDetail /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantGroupCreate" element={<LayoutWrapper currentPageName="AdminIntMerchantGroupCreate"><AdminIntMerchantGroupCreate /></LayoutWrapper>} />
      <Route path="/AdminIntBlockageFlow" element={<LayoutWrapper currentPageName="AdminIntBlockageFlow"><AdminIntBlockageFlow /></LayoutWrapper>} />
      <Route path="/AdminIntUnblockFlow" element={<LayoutWrapper currentPageName="AdminIntUnblockFlow"><AdminIntUnblockFlow /></LayoutWrapper>} />
      <Route path="/AdminIntSuspensionFlow" element={<LayoutWrapper currentPageName="AdminIntSuspensionFlow"><AdminIntSuspensionFlow /></LayoutWrapper>} />
      <Route path="/AdminIntBlockageReviewSchedule" element={<LayoutWrapper currentPageName="AdminIntBlockageReviewSchedule"><AdminIntBlockageReviewSchedule /></LayoutWrapper>} />
      <Route path="/AdminIntAcquirerSwitchFlow" element={<LayoutWrapper currentPageName="AdminIntAcquirerSwitchFlow"><AdminIntAcquirerSwitchFlow /></LayoutWrapper>} />
      <Route path="/AdminIntMccChangePreCheck" element={<LayoutWrapper currentPageName="AdminIntMccChangePreCheck"><AdminIntMccChangePreCheck /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantOnboardingPipeline" element={<LayoutWrapper currentPageName="AdminIntMerchantOnboardingPipeline"><AdminIntMerchantOnboardingPipeline /></LayoutWrapper>} />
      <Route path="/AdminIntMerchantOnboardingFunnelAnalytics" element={<LayoutWrapper currentPageName="AdminIntMerchantOnboardingFunnelAnalytics"><AdminIntMerchantOnboardingFunnelAnalytics /></LayoutWrapper>} />
      <Route path="/AdminIntKycAnalysisQueue" element={<LayoutWrapper currentPageName="AdminIntKycAnalysisQueue"><AdminIntKycAnalysisQueue /></LayoutWrapper>} />

      {/* ====== Mentor — Admin Sub ====== */}
      <Route path="/SubaccountSettlementChangeRequest" element={<LayoutWrapper currentPageName="SubaccountSettlementChangeRequest"><SubaccountSettlementChangeRequest /></LayoutWrapper>} />
      <Route path="/SubaccountAnticipationRequest" element={<LayoutWrapper currentPageName="SubaccountAnticipationRequest"><SubaccountAnticipationRequest /></LayoutWrapper>} />
      <Route path="/SubaccountKycReupload" element={<LayoutWrapper currentPageName="SubaccountKycReupload"><SubaccountKycReupload /></LayoutWrapper>} />
      <Route path="/SubaccountOnboardingProgress" element={<LayoutWrapper currentPageName="SubaccountOnboardingProgress"><SubaccountOnboardingProgress /></LayoutWrapper>} />
      <Route path="/MerchantGroupConsolidatedView" element={<LayoutWrapper currentPageName="MerchantGroupConsolidatedView"><MerchantGroupConsolidatedView /></LayoutWrapper>} />

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
      {/* B22 Wave 2 - Admin Interno P1 */}
      <Route path="/AdminIntOrchestrationStudio" element={<LayoutWrapper currentPageName="AdminIntOrchestrationStudio"><AdminIntOrchestrationStudio /></LayoutWrapper>} />
      <Route path="/AdminIntAntiArbitrage" element={<LayoutWrapper currentPageName="AdminIntAntiArbitrage"><AdminIntAntiArbitrage /></LayoutWrapper>} />
      <Route path="/AdminIntSmartSplitSuggester" element={<LayoutWrapper currentPageName="AdminIntSmartSplitSuggester"><AdminIntSmartSplitSuggester /></LayoutWrapper>} />
      <Route path="/AdminIntABVolumeAllocator" element={<LayoutWrapper currentPageName="AdminIntABVolumeAllocator"><AdminIntABVolumeAllocator /></LayoutWrapper>} />
      <Route path="/AdminIntShadowMode" element={<LayoutWrapper currentPageName="AdminIntShadowMode"><AdminIntShadowMode /></LayoutWrapper>} />
      <Route path="/AdminIntReconciliationHub" element={<LayoutWrapper currentPageName="AdminIntReconciliationHub"><AdminIntReconciliationHub /></LayoutWrapper>} />
      <Route path="/AdminIntFraudAnomalyDetector" element={<LayoutWrapper currentPageName="AdminIntFraudAnomalyDetector"><AdminIntFraudAnomalyDetector /></LayoutWrapper>} />
      <Route path="/AdminIntAuditTrailEnhanced" element={<LayoutWrapper currentPageName="AdminIntAuditTrailEnhanced"><AdminIntAuditTrailEnhanced /></LayoutWrapper>} />
      <Route path="/AdminIntTenantManagement" element={<LayoutWrapper currentPageName="AdminIntTenantManagement"><AdminIntTenantManagement /></LayoutWrapper>} />
      <Route path="/AdminIntWebhookReplay" element={<LayoutWrapper currentPageName="AdminIntWebhookReplay"><AdminIntWebhookReplay /></LayoutWrapper>} />
      <Route path="/AdminIntSettlementForecasting" element={<LayoutWrapper currentPageName="AdminIntSettlementForecasting"><AdminIntSettlementForecasting /></LayoutWrapper>} />
      <Route path="/AdminIntCryptoHub" element={<LayoutWrapper currentPageName="AdminIntCryptoHub"><AdminIntCryptoHub /></LayoutWrapper>} />
      {/* B22 - Admin Sub */}
      <Route path="/MultiMethodCheckoutConfig" element={<LayoutWrapper currentPageName="MultiMethodCheckoutConfig"><MultiMethodCheckoutConfig /></LayoutWrapper>} />
      <Route path="/RecoveryLadderConfig" element={<LayoutWrapper currentPageName="RecoveryLadderConfig"><RecoveryLadderConfig /></LayoutWrapper>} />
      <Route path="/SplitDesignerPage" element={<LayoutWrapper currentPageName="SplitDesignerPage"><SplitDesignerPage /></LayoutWrapper>} />
      <Route path="/SplitTransparencyDashboard" element={<LayoutWrapper currentPageName="SplitTransparencyDashboard"><SplitTransparencyDashboard /></LayoutWrapper>} />

      {/* ====== Mentor: Empresas / Representantes / Projetos ====== */}
      <Route path="/AdminIntCompanies" element={<LayoutWrapper currentPageName="AdminIntCompanies"><AdminIntCompanies /></LayoutWrapper>} />
      <Route path="/AdminIntCompanyDetail" element={<LayoutWrapper currentPageName="AdminIntCompanyDetail"><AdminIntCompanyDetail /></LayoutWrapper>} />
      <Route path="/AdminIntSalesReps" element={<LayoutWrapper currentPageName="AdminIntSalesReps"><AdminIntSalesReps /></LayoutWrapper>} />
      <Route path="/AdminIntSalesRepDetail" element={<LayoutWrapper currentPageName="AdminIntSalesRepDetail"><AdminIntSalesRepDetail /></LayoutWrapper>} />
      <Route path="/AdminIntProjects" element={<LayoutWrapper currentPageName="AdminIntProjects"><AdminIntProjects /></LayoutWrapper>} />
      <Route path="/AdminIntProjectDetail" element={<LayoutWrapper currentPageName="AdminIntProjectDetail"><AdminIntProjectDetail /></LayoutWrapper>} />
      <Route path="/AdminIntProjectsConsolidatedDashboard" element={<LayoutWrapper currentPageName="AdminIntProjectsConsolidatedDashboard"><AdminIntProjectsConsolidatedDashboard /></LayoutWrapper>} />
      <Route path="/AdminIntSupplierCredentials" element={<LayoutWrapper currentPageName="AdminIntSupplierCredentials"><AdminIntSupplierCredentials /></LayoutWrapper>} />
      <Route path="/AdminIntUsersHub" element={<LayoutWrapper currentPageName="AdminIntUsersHub"><AdminIntUsersHub /></LayoutWrapper>} />
      <Route path="/AdminIntSalesPlans" element={<LayoutWrapper currentPageName="AdminIntSalesPlans"><AdminIntSalesPlans /></LayoutWrapper>} />
      <Route path="/AdminIntSalesPlanDetail" element={<LayoutWrapper currentPageName="AdminIntSalesPlanDetail"><AdminIntSalesPlanDetail /></LayoutWrapper>} />
      <Route path="/AdminIntSalesPlanComparator" element={<LayoutWrapper currentPageName="AdminIntSalesPlanComparator"><AdminIntSalesPlanComparator /></LayoutWrapper>} />
      <Route path="/AdminIntCutoverScheduler" element={<LayoutWrapper currentPageName="AdminIntCutoverScheduler"><AdminIntCutoverScheduler /></LayoutWrapper>} />
      <Route path="/AdminIntDriftMonitoring" element={<LayoutWrapper currentPageName="AdminIntDriftMonitoring"><AdminIntDriftMonitoring /></LayoutWrapper>} />
      <Route path="/AdminIntTransactionReconciliation" element={<LayoutWrapper currentPageName="AdminIntTransactionReconciliation"><AdminIntTransactionReconciliation /></LayoutWrapper>} />
      <Route path="/AdminIntTransactionSyncCenter" element={<LayoutWrapper currentPageName="AdminIntTransactionSyncCenter"><AdminIntTransactionSyncCenter /></LayoutWrapper>} />
      <Route path="/AdminIntTransactionExportCenter" element={<LayoutWrapper currentPageName="AdminIntTransactionExportCenter"><AdminIntTransactionExportCenter /></LayoutWrapper>} />

      {/* ====== Mentor — Wave H (Split) ====== */}
      <Route path="/SplitDetail360" element={<LayoutWrapper currentPageName="SplitDetail360"><SplitDetail360 /></LayoutWrapper>} />
      <Route path="/SplitTerminalLinker" element={<LayoutWrapper currentPageName="SplitTerminalLinker"><SplitTerminalLinker /></LayoutWrapper>} />
      <Route path="/SplitEditFlow" element={<LayoutWrapper currentPageName="SplitEditFlow"><SplitEditFlow /></LayoutWrapper>} />
      <Route path="/SplitRiskOpportunityHub" element={<LayoutWrapper currentPageName="SplitRiskOpportunityHub"><SplitRiskOpportunityHub /></LayoutWrapper>} />
      <Route path="/AdminIntSplitsGovernance" element={<LayoutWrapper currentPageName="AdminIntSplitsGovernance"><AdminIntSplitsGovernance /></LayoutWrapper>} />
      <Route path="/SplitTemplatesBulkApply" element={<LayoutWrapper currentPageName="SplitTemplatesBulkApply"><SplitTemplatesBulkApply /></LayoutWrapper>} />

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