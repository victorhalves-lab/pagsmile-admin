import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DisputeRatioGauge from '@/components/disputes/DisputeRatioGauge';
import DisputeTrendChart from '@/components/disputes/DisputeTrendChart';
import ComplianceOverview from '@/components/disputes/ComplianceOverview';
import AgentDashboardSummary from '@/components/disputes/AgentDashboardSummary';
import DisputeKPICards from '@/components/disputes/DisputeKPICards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  ArrowRight,
  RefreshCcw,
  Download,
  FileText
} from 'lucide-react';

export default function DisputeDashboard() {
  const { t } = useTranslation();
  const { data: disputes = [], isLoading: loadingDisputes } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => base44.entities.Dispute.list('-created_date', 100)
  });

  const { data: complianceData = [], isLoading: loadingCompliance } = useQuery({
    queryKey: ['compliance'],
    queryFn: () => base44.entities.ComplianceStatus.list()
  });

  const { data: agentConfigs = [], isLoading: loadingAgent } = useQuery({
    queryKey: ['disputeAgentConfig'],
    queryFn: () => base44.entities.DisputeAgentConfig.list()
  });

  const agentConfig = agentConfigs[0] || {};

  // Calculate KPIs from disputes
  const calculateKPIs = () => {
    const openDisputes = disputes.filter(d => 
      ['received', 'in_analysis', 'in_contestation', 'pending'].includes(d.status)
    );
    const preCBs = disputes.filter(d => 
      ['alert_ethoca', 'alert_verifi'].includes(d.type) && 
      !['reimbursed', 'won', 'lost'].includes(d.status)
    );
    const inContestation = disputes.filter(d => d.status === 'in_contestation');
    const won = disputes.filter(d => d.status === 'won');
    const lost = disputes.filter(d => d.status === 'lost' || d.status === 'accepted');
    const reimbursedPreCBs = disputes.filter(d => 
      ['alert_ethoca', 'alert_verifi'].includes(d.type) && d.status === 'reimbursed'
    );

    return {
      totalOpenDisputes: openDisputes.length,
      totalOpenValue: openDisputes.reduce((sum, d) => sum + (d.amount || 0), 0),
      activePreChargebacks: preCBs.length,
      avgPreCBDeadline: preCBs.length > 0 ? Math.round(preCBs.reduce((sum, d) => {
        if (d.alert_deadline) {
          const diff = (new Date(d.alert_deadline) - new Date()) / (1000 * 60 * 60 * 24);
          return sum + Math.max(0, diff);
        }
        return sum;
      }, 0) / preCBs.length) : 0,
      inContestationCount: inContestation.length,
      inContestationValue: inContestation.reduce((sum, d) => sum + (d.amount || 0), 0),
      provisionAmount: openDisputes.reduce((sum, d) => sum + (d.amount || 0), 0) * 0.7,
      provisionPercentGMV: 0.5,
      winRate: (won.length + lost.length) > 0 ? (won.length / (won.length + lost.length)) * 100 : 0,
      preventionRate: (preCBs.length + reimbursedPreCBs.length) > 0 
        ? (reimbursedPreCBs.length / (preCBs.length + reimbursedPreCBs.length)) * 100 
        : 0,
      avgResponseTime: 4,
      recoveredValue: won.reduce((sum, d) => sum + (d.amount || 0), 0),
      lostValue: lost.reduce((sum, d) => sum + (d.amount || 0), 0)
    };
  };

  const kpiData = calculateKPIs();

  // Calculate ratio data for gauges
  const visaDisputes = disputes.filter(d => d.card_brand === 'visa' && d.type === 'chargeback');
  const mcDisputes = disputes.filter(d => d.card_brand === 'mastercard' && d.type === 'chargeback');
  const visaFraud = visaDisputes.filter(d => d.is_fraud);
  const mcFraud = mcDisputes.filter(d => d.is_fraud);

  // Mock transaction counts (in real implementation, fetch from Transaction entity)
  const visaTxCount = 10000;
  const mcTxCount = 8000;

  const visaRatio = visaTxCount > 0 ? (visaDisputes.length / visaTxCount) * 100 : 0;
  const mcRatio = mcTxCount > 0 ? (mcDisputes.length / mcTxCount) * 100 : 0;
  const visaFraudRatio = visaTxCount > 0 ? (visaFraud.length / visaTxCount) * 100 : 0;
  const mcFraudRatio = mcTxCount > 0 ? (mcFraud.length / mcTxCount) * 100 : 0;

  // Mock trend data
  const trendData = [
    { month: 'Ago', visaRatio: 0.45, mastercardRatio: 0.52 },
    { month: 'Set', visaRatio: 0.52, mastercardRatio: 0.48 },
    { month: 'Out', visaRatio: 0.58, mastercardRatio: 0.55 },
    { month: 'Nov', visaRatio: 0.62, mastercardRatio: 0.61 },
    { month: 'Dez', visaRatio: 0.55, mastercardRatio: 0.58 },
    { month: 'Jan', visaRatio: visaRatio || 0.48, mastercardRatio: mcRatio || 0.52 }
  ];

  const getProgramStatus = () => {
    const inProgram = complianceData.some(c => 
      ['standard', 'excessive', 'in_program'].includes(c.status)
    );
    const warning = complianceData.some(c => c.status === 'early_warning');
    
    if (inProgram) return { label: 'Em Programa', color: 'bg-red-100 text-red-700' };
    if (warning) return { label: 'Alerta', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Normal', color: 'bg-green-100 text-green-700' };
  };

  const programStatus = getProgramStatus();

  const handleToggleAgent = async (enabled) => {
    if (agentConfig.id) {
      await base44.entities.DisputeAgentConfig.update(agentConfig.id, { is_agent_enabled: enabled });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('disputes.title')}
        subtitle={t('disputes.title')}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              {t('reports.title')}
            </Button>
          </div>
        }
      />

      {/* Critical Ratio Indicators */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Indicadores Críticos de Ratio</CardTitle>
            <Badge className={programStatus.color}>
              <Shield className="w-3 h-3 mr-1" />
              Status: {programStatus.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DisputeRatioGauge
              value={visaRatio}
              thresholdWarning={0.65}
              thresholdCritical={0.9}
              label="Ratio CB Visa"
              maxValue={2}
            />
            <DisputeRatioGauge
              value={mcRatio}
              thresholdWarning={0.8}
              thresholdCritical={1.0}
              label="Ratio CB Mastercard"
              maxValue={2}
            />
            <DisputeRatioGauge
              value={visaFraudRatio}
              thresholdWarning={0.5}
              thresholdCritical={0.75}
              label="Fraude Visa (VFMP)"
              maxValue={1.5}
            />
            <DisputeRatioGauge
              value={mcFraudRatio}
              thresholdWarning={0.35}
              thresholdCritical={0.5}
              label="Fraude MC (EFM)"
              maxValue={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <DisputeKPICards data={kpiData} isLoading={loadingDisputes} />

      {/* Charts and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DisputeTrendChart 
          data={trendData}
          thresholdWarning={0.65}
          thresholdCritical={0.9}
          title="Tendência de Ratio (6 meses)"
        />
        <ComplianceOverview complianceData={complianceData} />
      </div>

      {/* Agent Summary */}
      <AgentDashboardSummary 
        config={agentConfig}
        onToggleAgent={handleToggleAgent}
        isLoading={loadingAgent}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to={createPageUrl('PreChargebacks')}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">Pré-Chargebacks</p>
                    <p className="text-sm text-orange-700">{kpiData.activePreChargebacks} alertas ativos</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl('Chargebacks')}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-900">Chargebacks</p>
                    <p className="text-sm text-red-700">{kpiData.inContestationCount} em contestação</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl('DisputeAgentSettings')}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Dispute Manager</p>
                    <p className="text-sm text-purple-700">Configurar agente IA</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}