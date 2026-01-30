import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileWarning,
  Eye,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  Users,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/common/PageHeader';

const formatCurrency = (value) => {
  if (!value) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// KPI Card Component
const KPICard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Status Badge Component
const ComplianceStatusBadge = ({ status }) => {
  const config = {
    compliant: { label: 'Conforme', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    potential_deviation: { label: 'Possível Desvio', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
    under_review: { label: 'Em Revisão', color: 'bg-blue-100 text-blue-700', icon: Clock },
    not_registered: { label: 'Não Registrado', color: 'bg-slate-100 text-slate-600', icon: XCircle },
  };
  const cfg = config[status] || config.not_registered;
  const Icon = cfg.icon;

  return (
    <Badge className={cn("border-0 flex items-center gap-1", cfg.color)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  );
};

export default function AdminIntMCCsAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch subaccounts with MCC data
  const { data: subaccounts = [], isLoading, refetch } = useQuery({
    queryKey: ['mcc-analysis-subaccounts'],
    queryFn: () => base44.entities.Subaccount.filter({ status: 'active' }, '-total_volume', 500),
  });

  // Calculate KPIs
  const kpis = React.useMemo(() => {
    const total = subaccounts.length;
    const compliant = subaccounts.filter(s => s.mcc_compliance_status === 'compliant').length;
    const deviations = subaccounts.filter(s => s.mcc_compliance_status === 'potential_deviation').length;
    const underReview = subaccounts.filter(s => s.mcc_compliance_status === 'under_review').length;
    const notRegistered = subaccounts.filter(s => !s.mcc_compliance_status || s.mcc_compliance_status === 'not_registered').length;
    const totalImpact = subaccounts.reduce((acc, s) => acc + (s.mcc_impact_revenue || 0), 0);

    return {
      total,
      compliant,
      deviations,
      underReview,
      notRegistered,
      totalImpact,
      complianceRate: total > 0 ? ((compliant / total) * 100).toFixed(1) : 0,
    };
  }, [subaccounts]);

  // Filter subaccounts
  const filteredSubaccounts = React.useMemo(() => {
    return subaccounts.filter(s => {
      const matchesSearch = !searchTerm || 
        s.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.document?.includes(searchTerm) ||
        s.mcc_declared?.includes(searchTerm) ||
        s.mcc_observed?.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'not_registered' && (!s.mcc_compliance_status || s.mcc_compliance_status === 'not_registered')) ||
        s.mcc_compliance_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subaccounts, searchTerm, statusFilter]);

  const handleViewDetails = (merchant) => {
    setSelectedMerchant(merchant);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análise de MCCs"
        subtitle="Monitoramento de conformidade MCC/CNAE dos merchants"
        icon={Building2}
        breadcrumbs={[
          { label: 'Admin Interno' },
          { label: 'Administração' },
          { label: 'Análise de MCCs' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Total Merchants"
          value={kpis.total}
          icon={Users}
          color="bg-slate-600"
        />
        <KPICard
          title="Conformes"
          value={kpis.compliant}
          subtitle={`${kpis.complianceRate}% do total`}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <KPICard
          title="Possíveis Desvios"
          value={kpis.deviations}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
        <KPICard
          title="Em Revisão"
          value={kpis.underReview}
          icon={Clock}
          color="bg-blue-500"
        />
        <KPICard
          title="Não Registrados"
          value={kpis.notRegistered}
          icon={FileWarning}
          color="bg-slate-400"
        />
        <KPICard
          title="Impacto Estimado"
          value={formatCurrency(kpis.totalImpact)}
          subtitle="Em receita perdida"
          icon={DollarSign}
          color="bg-red-500"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, CNPJ, MCC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="compliant">Conformes</SelectItem>
                <SelectItem value="potential_deviation">Possíveis Desvios</SelectItem>
                <SelectItem value="under_review">Em Revisão</SelectItem>
                <SelectItem value="not_registered">Não Registrados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Merchants ({filteredSubaccounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>CNAE Declarado</TableHead>
                  <TableHead>MCC Declarado</TableHead>
                  <TableHead>MCC Observado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Impacto</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredSubaccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Nenhum merchant encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubaccounts.map((merchant) => (
                    <TableRow key={merchant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{merchant.business_name}</p>
                          <p className="text-xs text-slate-500">{merchant.document}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {merchant.cnae_declared ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {merchant.cnae_declared}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {merchant.mcc_declared ? (
                          <Badge className="bg-primary/10 text-primary border-0 font-mono text-xs">
                            {merchant.mcc_declared}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {merchant.mcc_observed ? (
                          <Badge className={cn(
                            "font-mono text-xs border-0",
                            merchant.mcc_declared !== merchant.mcc_observed 
                              ? "bg-orange-100 text-orange-700" 
                              : "bg-green-100 text-green-700"
                          )}>
                            {merchant.mcc_observed}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ComplianceStatusBadge status={merchant.mcc_compliance_status} />
                      </TableCell>
                      <TableCell>
                        {merchant.mcc_impact_revenue ? (
                          <span className="text-sm text-orange-600 font-medium">
                            {formatCurrency(merchant.mcc_impact_revenue)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(merchant)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Detalhes MCC - {selectedMerchant?.business_name}
            </DialogTitle>
          </DialogHeader>

          {selectedMerchant && (
            <div className="space-y-6">
              {/* Merchant Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500">Razão Social</p>
                  <p className="text-sm font-medium">{selectedMerchant.legal_name || selectedMerchant.business_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">CNPJ</p>
                  <p className="text-sm font-medium font-mono">{selectedMerchant.document}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">TPV Total</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedMerchant.total_volume)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <ComplianceStatusBadge status={selectedMerchant.mcc_compliance_status} />
                </div>
              </div>

              {/* MCC Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Declarado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">CNAE</span>
                      <Badge variant="outline" className="font-mono">
                        {selectedMerchant.cnae_declared || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">MCC</span>
                      <Badge className="bg-primary/10 text-primary border-0 font-mono">
                        {selectedMerchant.mcc_declared || 'N/A'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Observado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">CNAE</span>
                      <Badge variant="outline" className="font-mono">
                        {selectedMerchant.cnae_observed || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">MCC</span>
                      <Badge className={cn(
                        "font-mono border-0",
                        selectedMerchant.mcc_declared !== selectedMerchant.mcc_observed
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      )}>
                        {selectedMerchant.mcc_observed || 'N/A'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Analysis */}
              {selectedMerchant.mcc_ai_justification && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      🤖 Análise da IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedMerchant.mcc_ai_justification}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Impact */}
              {selectedMerchant.mcc_impact_revenue && selectedMerchant.mcc_impact_revenue !== 0 && (
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Impacto Estimado na Receita</span>
                  </div>
                  <span className="text-lg font-bold text-orange-700">
                    {formatCurrency(selectedMerchant.mcc_impact_revenue)}
                  </span>
                </div>
              )}

              {/* Last Analysis */}
              {selectedMerchant.mcc_last_analyzed_date && (
                <p className="text-xs text-slate-400 text-center">
                  Última análise: {new Date(selectedMerchant.mcc_last_analyzed_date).toLocaleString('pt-BR')}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Fechar
                </Button>
                <Button>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Completo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}