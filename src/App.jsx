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

// Telemarketing (MOTO Sale)
import TelemarketingSale from './pages/TelemarketingSale';

// Recon Agents Cockpit
import AdminIntReconAgentsCockpit from './pages/AdminIntReconAgentsCockpit';
import AdminIntReconInbox from './pages/AdminIntReconInbox';
import AdminIntReconObservability from './pages/AdminIntReconObservability';
import AdminIntReconHealthDashboard from './pages/AdminIntReconHealthDashboard';

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
import SplitReconciliationCenter from './pages/SplitReconciliationCenter';
import SplitBeneficiaryHub from './pages/SplitBeneficiaryHub';
import SplitTaxFiscalHub from './pages/SplitTaxFiscalHub';
import SplitApiPlayground from './pages/SplitApiPlayground';

// ====== Wave I (Settlements/Boletos Mentor) ======
import AdminIntSettlementDetail360 from './pages/AdminIntSettlementDetail360';
import SettlementGovernanceCenter from './pages/SettlementGovernanceCenter';
import SettlementMassPurgePanel from './pages/SettlementMassPurgePanel';
import ManualSettlementCreator from './pages/ManualSettlementCreator';
import PaymentTypesCatalog from './pages/PaymentTypesCatalog';
import AdminIntBilletsList from './pages/AdminIntBilletsList';
import AdminIntBilletDetail from './pages/AdminIntBilletDetail';
import AdminIntBilletCreate from './pages/AdminIntBilletCreate';
import AdminIntBilletLayouts from './pages/AdminIntBilletLayouts';
import ExportJobCenter from './pages/ExportJobCenter';

// ====== Wave J (Antecipação Spot Mentor — Entrega 6 Parte 1) ======
import AdminIntAnticipationDetail360 from './pages/AdminIntAnticipationDetail360';
import AdminIntAnticipationGovernanceCenter from './pages/AdminIntAnticipationGovernanceCenter';
import AdminIntRegistradoraHub from './pages/AdminIntRegistradoraHub';

// ====== Wave K (Recebíveis + Ajustes Manuais — Entrega 6 Parte 2) ======
import AdminIntReceivablesLedger from './pages/AdminIntReceivablesLedger';
import AdminIntManualAdjustments from './pages/AdminIntManualAdjustments';

// ====== Wave Mentor Entrega 6 Parte 3 (Registradoras + Efeitos de Contrato + CERC) ======
import AdminIntURDetail360 from './pages/AdminIntURDetail360';
import AdminIntContractEffectDetail360 from './pages/AdminIntContractEffectDetail360';
import AdminIntCERCConciliationHub from './pages/AdminIntCERCConciliationHub';
import AdminIntCERCFileViewer from './pages/AdminIntCERCFileViewer';
import AdminIntJudicialBlockages from './pages/AdminIntJudicialBlockages';
import MyReceivablesUnits from './pages/MyReceivablesUnits';
import MyContractEffects from './pages/MyContractEffects';

// ====== Wave Mentor Entrega 7 Parte 2 (Diagnósticos / TPV / Exports / Webhook PIX) ======
import AdminIntCheckupHub from './pages/AdminIntCheckupHub';
import AdminIntCheckupAuthorizeFlow from './pages/AdminIntCheckupAuthorizeFlow';
import AdminIntCheckupSoftDeleteFlow from './pages/AdminIntCheckupSoftDeleteFlow';
import AdminIntCheckupProgrammaticTrigger from './pages/AdminIntCheckupProgrammaticTrigger';
import AdminIntTPVAnalytics from './pages/AdminIntTPVAnalytics';
import AdminIntTPVExportCenter from './pages/AdminIntTPVExportCenter';
import AdminIntPixWebhookReplay from './pages/AdminIntPixWebhookReplay';
import MyDataExports from './pages/MyDataExports';
import MyWebhookHealth from './pages/MyWebhookHealth';
import MyTPVDashboard from './pages/MyTPVDashboard';

// ====== Entrega 8 — Compliance Crítico (Admin Sub) ======
import MyAuditTrail from './pages/MyAuditTrail';
import MyMEDQueue from './pages/MyMEDQueue';
import MyComplianceCenter from './pages/MyComplianceCenter';
import MyBlockagesCenter from './pages/MyBlockagesCenter';
import MyDriftAlerts from './pages/MyDriftAlerts';

// ====== Entrega 9 — Diferencial Competitivo (Admin Sub) ======
import MyOrchestrationView from './pages/MyOrchestrationView';
import MyPricingTransparency from './pages/MyPricingTransparency';
import MyReconciliationCenter from './pages/MyReconciliationCenter';
import MyCheckupCenter from './pages/MyCheckupCenter';
import MyCommunicationsCenter from './pages/MyCommunicationsCenter';

// ====== Compliance Onboarding (replicado do app pagsmile-onboarding) ======
import AdminIntComplianceDashboard from './pages/AdminIntComplianceDashboard';
import AdminIntComplianceLinks from './pages/AdminIntComplianceLinks';

// ====== Compliance V4 — Onda 3 (12 páginas novas) ======
import AdminIntComplianceCases from './pages/AdminIntComplianceCases';
import AdminIntComplianceCaseDetail from './pages/AdminIntComplianceCaseDetail';
import AdminIntComplianceAnalysis from './pages/AdminIntComplianceAnalysis';
import AdminIntComplianceRevalidation from './pages/AdminIntComplianceRevalidation';
import AdminIntComplianceSubsellerLinks from './pages/AdminIntComplianceSubsellerLinks';
import AdminIntComplianceRiskScoring from './pages/AdminIntComplianceRiskScoring';
import AdminIntComplianceRiskScoringSubsellers from './pages/AdminIntComplianceRiskScoringSubsellers';
import AdminIntComplianceEscalations from './pages/AdminIntComplianceEscalations';
import AdminIntComplianceBulkReprocess from './pages/AdminIntComplianceBulkReprocess';
import AdminIntComplianceKYCTemplate from './pages/AdminIntComplianceKYCTemplate';
import AdminIntCompliancePartners from './pages/AdminIntCompliancePartners';
import AdminIntCompliancePartnerDetail from './pages/AdminIntCompliancePartnerDetail';
import AdminIntCompliancePreKYCExport from './pages/AdminIntCompliancePreKYCExport';
import AdminIntComplianceBDCHealth from './pages/AdminIntComplianceBDCHealth';
import AdminIntComplianceCafLab from './pages/AdminIntComplianceCafLab';

// ====== Entrega 10 — Operacional Self-Service (Admin Sub) ======
import MyLimitRequest from './pages/MyLimitRequest';
import MyFraudAlerts from './pages/MyFraudAlerts';
import MyWebhookReplay from './pages/MyWebhookReplay';
import MyRollingReserve from './pages/MyRollingReserve';

// ====== Onda 4 — Subsellers (perspectiva Merchant / Admin Sub) ======
import MySubsellersCases from './pages/MySubsellersCases';
import MySubsellerCaseDetail from './pages/MySubsellerCaseDetail';
import MySubsellerInvite from './pages/MySubsellerInvite';
import MyComplianceLinks from './pages/MyComplianceLinks';
import MySubsellerDocsResend from './pages/MySubsellerDocsResend';

// ====== Onda 5 — Páginas Públicas White-Label (subsellers) ======
import SubsellerQuestionnaire from './pages/SubsellerQuestionnaire';
import ComplianceDocOnly from './pages/ComplianceDocOnly';

// ====== PIX Open Finance (PIX Automático / Biometria / Hub) ======
import PixMandateHealth from './pages/PixMandateHealth';
import CheckoutPreview from './pages/CheckoutPreview';
import PixBiometricInsights from './pages/PixBiometricInsights';
import OpenFinanceHub from './pages/OpenFinanceHub';
import AdminIntOpenFinanceLiveMap from './pages/AdminIntOpenFinanceLiveMap';

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

      {/* Telemarketing (MOTO Sale) */}
      <Route path="/TelemarketingSale" element={<LayoutWrapper currentPageName="TelemarketingSale"><TelemarketingSale /></LayoutWrapper>} />

      {/* Recon Agents Cockpit */}
      <Route path="/AdminIntReconAgentsCockpit" element={<LayoutWrapper currentPageName="AdminIntReconAgentsCockpit"><AdminIntReconAgentsCockpit /></LayoutWrapper>} />
      <Route path="/AdminIntReconInbox" element={<LayoutWrapper currentPageName="AdminIntReconInbox"><AdminIntReconInbox /></LayoutWrapper>} />
      <Route path="/AdminIntReconObservability" element={<LayoutWrapper currentPageName="AdminIntReconObservability"><AdminIntReconObservability /></LayoutWrapper>} />
      <Route path="/AdminIntReconHealthDashboard" element={<LayoutWrapper currentPageName="AdminIntReconHealthDashboard"><AdminIntReconHealthDashboard /></LayoutWrapper>} />

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
      <Route path="/SplitReconciliationCenter" element={<LayoutWrapper currentPageName="SplitReconciliationCenter"><SplitReconciliationCenter /></LayoutWrapper>} />
      <Route path="/SplitBeneficiaryHub" element={<LayoutWrapper currentPageName="SplitBeneficiaryHub"><SplitBeneficiaryHub /></LayoutWrapper>} />
      <Route path="/SplitTaxFiscalHub" element={<LayoutWrapper currentPageName="SplitTaxFiscalHub"><SplitTaxFiscalHub /></LayoutWrapper>} />
      <Route path="/SplitApiPlayground" element={<LayoutWrapper currentPageName="SplitApiPlayground"><SplitApiPlayground /></LayoutWrapper>} />

      {/* ====== Wave I (Settlements/Boletos Mentor) ====== */}
      <Route path="/AdminIntSettlementDetail360" element={<LayoutWrapper currentPageName="AdminIntSettlementDetail360"><AdminIntSettlementDetail360 /></LayoutWrapper>} />
      <Route path="/SettlementGovernanceCenter" element={<LayoutWrapper currentPageName="SettlementGovernanceCenter"><SettlementGovernanceCenter /></LayoutWrapper>} />
      <Route path="/SettlementMassPurgePanel" element={<LayoutWrapper currentPageName="SettlementMassPurgePanel"><SettlementMassPurgePanel /></LayoutWrapper>} />
      <Route path="/ManualSettlementCreator" element={<LayoutWrapper currentPageName="ManualSettlementCreator"><ManualSettlementCreator /></LayoutWrapper>} />
      <Route path="/PaymentTypesCatalog" element={<LayoutWrapper currentPageName="PaymentTypesCatalog"><PaymentTypesCatalog /></LayoutWrapper>} />
      <Route path="/AdminIntBilletsList" element={<LayoutWrapper currentPageName="AdminIntBilletsList"><AdminIntBilletsList /></LayoutWrapper>} />
      <Route path="/AdminIntBilletDetail" element={<LayoutWrapper currentPageName="AdminIntBilletDetail"><AdminIntBilletDetail /></LayoutWrapper>} />
      <Route path="/AdminIntBilletCreate" element={<LayoutWrapper currentPageName="AdminIntBilletCreate"><AdminIntBilletCreate /></LayoutWrapper>} />
      <Route path="/AdminIntBilletLayouts" element={<LayoutWrapper currentPageName="AdminIntBilletLayouts"><AdminIntBilletLayouts /></LayoutWrapper>} />
      <Route path="/ExportJobCenter" element={<LayoutWrapper currentPageName="ExportJobCenter"><ExportJobCenter /></LayoutWrapper>} />

      {/* ====== Wave J (Antecipação Spot Mentor) ====== */}
      <Route path="/AdminIntAnticipationDetail360" element={<LayoutWrapper currentPageName="AdminIntAnticipationDetail360"><AdminIntAnticipationDetail360 /></LayoutWrapper>} />
      <Route path="/AdminIntAnticipationGovernanceCenter" element={<LayoutWrapper currentPageName="AdminIntAnticipationGovernanceCenter"><AdminIntAnticipationGovernanceCenter /></LayoutWrapper>} />
      <Route path="/AdminIntRegistradoraHub" element={<LayoutWrapper currentPageName="AdminIntRegistradoraHub"><AdminIntRegistradoraHub /></LayoutWrapper>} />

      {/* ====== Wave K (Recebíveis + Ajustes Manuais) ====== */}
      <Route path="/AdminIntReceivablesLedger" element={<LayoutWrapper currentPageName="AdminIntReceivablesLedger"><AdminIntReceivablesLedger /></LayoutWrapper>} />
      <Route path="/AdminIntManualAdjustments" element={<LayoutWrapper currentPageName="AdminIntManualAdjustments"><AdminIntManualAdjustments /></LayoutWrapper>} />

      {/* ====== Wave Mentor Entrega 6 Parte 3 (Registradoras + Efeitos de Contrato + CERC) ====== */}
      <Route path="/AdminIntURDetail360" element={<LayoutWrapper currentPageName="AdminIntURDetail360"><AdminIntURDetail360 /></LayoutWrapper>} />
      <Route path="/AdminIntContractEffectDetail360" element={<LayoutWrapper currentPageName="AdminIntContractEffectDetail360"><AdminIntContractEffectDetail360 /></LayoutWrapper>} />
      <Route path="/AdminIntCERCConciliationHub" element={<LayoutWrapper currentPageName="AdminIntCERCConciliationHub"><AdminIntCERCConciliationHub /></LayoutWrapper>} />
      <Route path="/AdminIntCERCFileViewer" element={<LayoutWrapper currentPageName="AdminIntCERCFileViewer"><AdminIntCERCFileViewer /></LayoutWrapper>} />
      <Route path="/AdminIntJudicialBlockages" element={<LayoutWrapper currentPageName="AdminIntJudicialBlockages"><AdminIntJudicialBlockages /></LayoutWrapper>} />
      <Route path="/MyReceivablesUnits" element={<LayoutWrapper currentPageName="MyReceivablesUnits"><MyReceivablesUnits /></LayoutWrapper>} />
      <Route path="/MyContractEffects" element={<LayoutWrapper currentPageName="MyContractEffects"><MyContractEffects /></LayoutWrapper>} />

      {/* ====== Wave Mentor Entrega 7 Parte 2 (Diagnósticos / TPV / Exports / Webhook PIX) ====== */}
      <Route path="/AdminIntCheckupHub" element={<LayoutWrapper currentPageName="AdminIntCheckupHub"><AdminIntCheckupHub /></LayoutWrapper>} />
      <Route path="/AdminIntCheckupAuthorizeFlow" element={<LayoutWrapper currentPageName="AdminIntCheckupAuthorizeFlow"><AdminIntCheckupAuthorizeFlow /></LayoutWrapper>} />
      <Route path="/AdminIntCheckupSoftDeleteFlow" element={<LayoutWrapper currentPageName="AdminIntCheckupSoftDeleteFlow"><AdminIntCheckupSoftDeleteFlow /></LayoutWrapper>} />
      <Route path="/AdminIntCheckupProgrammaticTrigger" element={<LayoutWrapper currentPageName="AdminIntCheckupProgrammaticTrigger"><AdminIntCheckupProgrammaticTrigger /></LayoutWrapper>} />
      <Route path="/AdminIntTPVAnalytics" element={<LayoutWrapper currentPageName="AdminIntTPVAnalytics"><AdminIntTPVAnalytics /></LayoutWrapper>} />
      <Route path="/AdminIntTPVExportCenter" element={<LayoutWrapper currentPageName="AdminIntTPVExportCenter"><AdminIntTPVExportCenter /></LayoutWrapper>} />
      <Route path="/AdminIntPixWebhookReplay" element={<LayoutWrapper currentPageName="AdminIntPixWebhookReplay"><AdminIntPixWebhookReplay /></LayoutWrapper>} />
      <Route path="/MyDataExports" element={<LayoutWrapper currentPageName="MyDataExports"><MyDataExports /></LayoutWrapper>} />
      <Route path="/MyWebhookHealth" element={<LayoutWrapper currentPageName="MyWebhookHealth"><MyWebhookHealth /></LayoutWrapper>} />
      <Route path="/MyTPVDashboard" element={<LayoutWrapper currentPageName="MyTPVDashboard"><MyTPVDashboard /></LayoutWrapper>} />

      {/* ====== Entrega 8 — Compliance Crítico ====== */}
      <Route path="/MyAuditTrail" element={<LayoutWrapper currentPageName="MyAuditTrail"><MyAuditTrail /></LayoutWrapper>} />
      <Route path="/MyMEDQueue" element={<LayoutWrapper currentPageName="MyMEDQueue"><MyMEDQueue /></LayoutWrapper>} />
      <Route path="/MyComplianceCenter" element={<LayoutWrapper currentPageName="MyComplianceCenter"><MyComplianceCenter /></LayoutWrapper>} />
      <Route path="/MyBlockagesCenter" element={<LayoutWrapper currentPageName="MyBlockagesCenter"><MyBlockagesCenter /></LayoutWrapper>} />
      <Route path="/MyDriftAlerts" element={<LayoutWrapper currentPageName="MyDriftAlerts"><MyDriftAlerts /></LayoutWrapper>} />

      {/* ====== Entrega 9 — Diferencial Competitivo ====== */}
      <Route path="/MyOrchestrationView" element={<LayoutWrapper currentPageName="MyOrchestrationView"><MyOrchestrationView /></LayoutWrapper>} />
      <Route path="/MyPricingTransparency" element={<LayoutWrapper currentPageName="MyPricingTransparency"><MyPricingTransparency /></LayoutWrapper>} />
      <Route path="/MyReconciliationCenter" element={<LayoutWrapper currentPageName="MyReconciliationCenter"><MyReconciliationCenter /></LayoutWrapper>} />
      <Route path="/MyCheckupCenter" element={<LayoutWrapper currentPageName="MyCheckupCenter"><MyCheckupCenter /></LayoutWrapper>} />
      <Route path="/MyCommunicationsCenter" element={<LayoutWrapper currentPageName="MyCommunicationsCenter"><MyCommunicationsCenter /></LayoutWrapper>} />

      {/* ====== Entrega 10 — Operacional Self-Service ====== */}
      <Route path="/MyLimitRequest" element={<LayoutWrapper currentPageName="MyLimitRequest"><MyLimitRequest /></LayoutWrapper>} />
      <Route path="/MyFraudAlerts" element={<LayoutWrapper currentPageName="MyFraudAlerts"><MyFraudAlerts /></LayoutWrapper>} />
      <Route path="/MyWebhookReplay" element={<LayoutWrapper currentPageName="MyWebhookReplay"><MyWebhookReplay /></LayoutWrapper>} />
      <Route path="/MyRollingReserve" element={<LayoutWrapper currentPageName="MyRollingReserve"><MyRollingReserve /></LayoutWrapper>} />

      {/* ====== Onda 4 — Subsellers (Merchant) ====== */}
      <Route path="/MySubsellersCases" element={<LayoutWrapper currentPageName="MySubsellersCases"><MySubsellersCases /></LayoutWrapper>} />
      <Route path="/MySubsellerCaseDetail" element={<LayoutWrapper currentPageName="MySubsellerCaseDetail"><MySubsellerCaseDetail /></LayoutWrapper>} />
      <Route path="/MySubsellerInvite" element={<LayoutWrapper currentPageName="MySubsellerInvite"><MySubsellerInvite /></LayoutWrapper>} />
      <Route path="/MyComplianceLinks" element={<LayoutWrapper currentPageName="MyComplianceLinks"><MyComplianceLinks /></LayoutWrapper>} />
      <Route path="/MySubsellerDocsResend" element={<LayoutWrapper currentPageName="MySubsellerDocsResend"><MySubsellerDocsResend /></LayoutWrapper>} />

      {/* ====== Onda 5 — Páginas Públicas White-Label (sem layout wrapper) ====== */}
      <Route path="/SubsellerQuestionnaire" element={<SubsellerQuestionnaire />} />
      <Route path="/ComplianceDocOnly" element={<ComplianceDocOnly />} />

      {/* ====== Checkout Preview (público + autenticado, sem layout admin) ====== */}
      <Route path="/CheckoutPreview" element={<CheckoutPreview />} />

      {/* ====== PIX Open Finance (Automático / Biometria / Hub / Live Map) ====== */}
      <Route path="/PixMandateHealth" element={<LayoutWrapper currentPageName="PixMandateHealth"><PixMandateHealth /></LayoutWrapper>} />
      <Route path="/PixBiometricInsights" element={<LayoutWrapper currentPageName="PixBiometricInsights"><PixBiometricInsights /></LayoutWrapper>} />
      <Route path="/OpenFinanceHub" element={<LayoutWrapper currentPageName="OpenFinanceHub"><OpenFinanceHub /></LayoutWrapper>} />
      <Route path="/AdminIntOpenFinanceLiveMap" element={<LayoutWrapper currentPageName="AdminIntOpenFinanceLiveMap"><AdminIntOpenFinanceLiveMap /></LayoutWrapper>} />

      {/* ====== Compliance Onboarding (replicado do app pagsmile-onboarding) ====== */}
      <Route path="/AdminIntComplianceDashboard" element={<LayoutWrapper currentPageName="AdminIntComplianceDashboard"><AdminIntComplianceDashboard /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceLinks" element={<LayoutWrapper currentPageName="AdminIntComplianceLinks"><AdminIntComplianceLinks /></LayoutWrapper>} />

      {/* ====== Compliance V4 — Onda 3 ====== */}
      <Route path="/AdminIntComplianceCases" element={<LayoutWrapper currentPageName="AdminIntComplianceCases"><AdminIntComplianceCases /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceCaseDetail" element={<LayoutWrapper currentPageName="AdminIntComplianceCaseDetail"><AdminIntComplianceCaseDetail /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceAnalysis" element={<LayoutWrapper currentPageName="AdminIntComplianceAnalysis"><AdminIntComplianceAnalysis /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceRevalidation" element={<LayoutWrapper currentPageName="AdminIntComplianceRevalidation"><AdminIntComplianceRevalidation /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceSubsellerLinks" element={<LayoutWrapper currentPageName="AdminIntComplianceSubsellerLinks"><AdminIntComplianceSubsellerLinks /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceRiskScoring" element={<LayoutWrapper currentPageName="AdminIntComplianceRiskScoring"><AdminIntComplianceRiskScoring /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceRiskScoringSubsellers" element={<LayoutWrapper currentPageName="AdminIntComplianceRiskScoringSubsellers"><AdminIntComplianceRiskScoringSubsellers /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceEscalations" element={<LayoutWrapper currentPageName="AdminIntComplianceEscalations"><AdminIntComplianceEscalations /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceBulkReprocess" element={<LayoutWrapper currentPageName="AdminIntComplianceBulkReprocess"><AdminIntComplianceBulkReprocess /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceKYCTemplate" element={<LayoutWrapper currentPageName="AdminIntComplianceKYCTemplate"><AdminIntComplianceKYCTemplate /></LayoutWrapper>} />
      <Route path="/AdminIntCompliancePartners" element={<LayoutWrapper currentPageName="AdminIntCompliancePartners"><AdminIntCompliancePartners /></LayoutWrapper>} />
      <Route path="/AdminIntCompliancePartnerDetail" element={<LayoutWrapper currentPageName="AdminIntCompliancePartnerDetail"><AdminIntCompliancePartnerDetail /></LayoutWrapper>} />
      <Route path="/AdminIntCompliancePreKYCExport" element={<LayoutWrapper currentPageName="AdminIntCompliancePreKYCExport"><AdminIntCompliancePreKYCExport /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceBDCHealth" element={<LayoutWrapper currentPageName="AdminIntComplianceBDCHealth"><AdminIntComplianceBDCHealth /></LayoutWrapper>} />
      <Route path="/AdminIntComplianceCafLab" element={<LayoutWrapper currentPageName="AdminIntComplianceCafLab"><AdminIntComplianceCafLab /></LayoutWrapper>} />

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