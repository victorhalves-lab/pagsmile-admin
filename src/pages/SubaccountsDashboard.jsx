import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  ChevronRight,
  BarChart3,
  DollarSign,
  Link2,
  Upload,
  Download,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { toast } from 'sonner';

// New v2 components
import MarketplaceKpiBar from '@/components/marketplace/v2/MarketplaceKpiBar';
import OnboardingFunnel from '@/components/marketplace/v2/OnboardingFunnel';
import RiskAndDormantCards from '@/components/marketplace/v2/RiskAndDormantCards';
import InviteSubaccountDialog from '@/components/marketplace/v2/InviteSubaccountDialog';
import ImportCsvDialog from '@/components/marketplace/v2/ImportCsvDialog';
import Top10WithFilter from '@/components/marketplace/v2/Top10WithFilter';
import CohortMatrix from '@/components/marketplace/v2/CohortMatrix';
import ComplianceHealthCard from '@/components/marketplace/v2/ComplianceHealthCard';
import AnomalyDetectionCard from '@/components/marketplace/v2/AnomalyDetectionCard';

const statusColors = {
  active: '#10b981',
  pending_documents: '#f59e0b',
  under_review: '#3b82f6',
  suspended: '#f97316',
  blocked: '#ef4444',
  draft: '#9ca3af',
  cancelled: '#6b7280'
};

const statusLabels = {
  active: 'Ativa',
  pending_documents: 'Docs Pendentes',
  under_review: 'Em Análise',
  suspended: 'Suspensa',
  blocked: 'Bloqueada',
  draft: 'Rascunho',
  cancelled: 'Cancelada'
};

export default function SubaccountsDashboard() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const { data: subaccounts = [], isLoading } = useQuery({
    queryKey: ['subaccounts'],
    queryFn: () => base44.entities.Subaccount.list('-created_date', 200)
  });

  const metrics = useMemo(() => {
    const pending = subaccounts.filter(s => ['draft', 'pending_documents', 'under_review'].includes(s.status));
    
    const byStatus = subaccounts.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(byStatus).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      color: statusColors[status] || '#9ca3af'
    }));

    return {
      total: subaccounts.length,
      pending: pending.length,
      statusData,
    };
  }, [subaccounts]);

  const handleExportPdf = () => {
    toast.success('Exportando dashboard como PDF... Você receberá o arquivo em breve.');
  };

  const handleConfigureAlerts = () => {
    toast.info('Configurador de alertas customizados em breve!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace Workspace"
        subtitle="Cockpit do seu marketplace — KPIs, saúde, onboarding e ações rápidas"
        breadcrumbs={[
          { label: 'Subcontas' }
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleConfigureAlerts}>
              <Bell className="w-4 h-4 mr-2" />
              Alertas
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
              <Link2 className="w-4 h-4 mr-2" />
              Convidar
            </Button>
            <Button variant="outline" asChild>
              <Link to={createPageUrl('SubaccountsList')}>
                Ver Todas
              </Link>
            </Button>
            <Button asChild>
              <Link to={createPageUrl('SubaccountOnboarding')}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Subconta
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Bar - Marketplace Economics */}
      <MarketplaceKpiBar subaccounts={subaccounts} />

      {/* Risk + Dormant + KYC Alert Cards */}
      <RiskAndDormantCards subaccounts={subaccounts} />

      {/* Onboarding Funnel + Compliance Health + Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OnboardingFunnel subaccounts={subaccounts} />
        <ComplianceHealthCard subaccounts={subaccounts} />
        <AnomalyDetectionCard subaccounts={subaccounts} />
      </div>

      {/* Top 10 with Multi-dimension Filter */}
      <Top10WithFilter subaccounts={subaccounts} />

      {/* Cohort Analysis */}
      <CohortMatrix subaccounts={subaccounts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Distribuição por Status</CardTitle>
              <Badge variant="outline" className="text-xs">vs mês anterior</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {metrics.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {metrics.statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <span className="text-gray-500">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                Aguardando Aprovação
              </CardTitle>
              <Badge variant="secondary">{metrics.pending}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subaccounts
                .filter(s => ['draft', 'pending_documents', 'under_review'].includes(s.status))
                .slice(0, 5)
                .map(sub => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Building2 className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{sub.business_name}</p>
                        <p className="text-xs text-gray-500">{sub.document}</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      sub.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                      sub.status === 'pending_documents' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {statusLabels[sub.status] || sub.status}
                    </Badge>
                  </div>
                ))}
              {metrics.pending === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>Nenhuma subconta aguardando aprovação</p>
                </div>
              )}
            </div>
            {metrics.pending > 5 && (
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={createPageUrl('SubaccountsList')}>
                  Ver Todas ({metrics.pending})
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to={createPageUrl('SubaccountOnboarding')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Nova Subconta</p>
                <p className="text-xs text-gray-500">Cadastrar manualmente</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('SubaccountsList')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Gerenciar</p>
                <p className="text-xs text-gray-500">Lista completa</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('OriginationAgentSettings')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Agent Origination</p>
                <p className="text-xs text-gray-500">Configurar IA</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('SplitManagement')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Split</p>
                <p className="text-xs text-gray-500">Regras de divisão</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InviteSubaccountDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
      <ImportCsvDialog open={showImportDialog} onOpenChange={setShowImportDialog} />
    </div>
  );
}