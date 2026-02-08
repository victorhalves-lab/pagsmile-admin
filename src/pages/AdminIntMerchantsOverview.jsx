import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/common/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Eye,
  Search,
  Settings,
  DollarSign,
  ArrowLeftRight,
  Check,
  Lock,
  Pause,
  MoreHorizontal,
  Users,
  TrendingUp,
  AlertTriangle,
  Store
} from 'lucide-react';
import { mockMainMerchants, mockHierarchicalSubaccounts } from '@/components/mockData/adminInternoMocks';
import { formatCurrency } from '@/components/utils';

export default function AdminIntMerchantsOverview() {
  const [expandedMerchants, setExpandedMerchants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMerchantExpand = (merchantId) => {
    setExpandedMerchants(prev =>
      prev.includes(merchantId)
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  const getSubaccountsForMerchant = (merchantId) => {
    return mockHierarchicalSubaccounts.filter(sub => sub.parent_merchant_id === merchantId);
  };

  const filteredMerchants = mockMainMerchants.filter(merchant =>
    merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.document.includes(searchTerm)
  );

  // KPIs
  const totalMerchants = mockMainMerchants.length;
  const totalSubaccounts = mockHierarchicalSubaccounts.length;
  const pendingApprovals = mockHierarchicalSubaccounts.filter(s => 
    ['pending_compliance', 'under_review'].includes(s.status)
  ).length;
  const blockedSubaccounts = mockHierarchicalSubaccounts.filter(s => 
    ['blocked', 'suspended'].includes(s.status)
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Comerciantes e Subcontas"
        subtitle="Visão hierárquica completa de merchants e suas subcontas"
        icon={Building2}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Gestão de Comerciantes e Subcontas' }
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Comerciantes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalMerchants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Subcontas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubaccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Aguardando Aprovação</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bloqueadas/Suspensas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{blockedSubaccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Comerciantes Principais</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Comerciante</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Volume Total</TableHead>
                <TableHead className="text-center">Subcontas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.map((merchant) => {
                const subaccounts = getSubaccountsForMerchant(merchant.id);
                const isExpanded = expandedMerchants.includes(merchant.id);

                return (
                  <React.Fragment key={merchant.id}>
                    {/* Merchant Row */}
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleMerchantExpand(merchant.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{merchant.business_name}</p>
                            <p className="text-xs text-slate-500">{merchant.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{merchant.document}</TableCell>
                      <TableCell>
                        <StatusBadge status={merchant.status} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(merchant.total_volume)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-semibold">
                          {subaccounts.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={createPageUrl(`AdminIntMerchantProfile?id=${merchant.id}`)}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Perfil
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>

                    {/* Subaccounts Rows (Expanded) */}
                    {isExpanded && subaccounts.map((sub) => (
                      <TableRow key={sub.id} className="bg-white dark:bg-slate-900">
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 pl-6">
                            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 -ml-3 mr-2"></div>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{sub.business_name}</p>
                              <p className="text-xs text-slate-500">{sub.mcc_description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{sub.document}</TableCell>
                        <TableCell>
                          <StatusBadge status={sub.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sub.total_volume)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={sub.risk_level === 'low' ? 'success' : sub.risk_level === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {sub.risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl(`AdminIntSubaccountFullDetail?id=${sub.id}`)} className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  Ver Detalhes Completos
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl(`AdminIntSubaccountTransactions?id=${sub.id}`)} className="flex items-center gap-2">
                                  <ArrowLeftRight className="w-4 h-4" />
                                  Ver Transações
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl(`AdminIntSubaccountLimits?id=${sub.id}`)} className="flex items-center gap-2">
                                  <Settings className="w-4 h-4" />
                                  Gerenciar Limites
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl(`AdminIntSubaccountRates?id=${sub.id}`)} className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  Visualizar Taxas
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {sub.status === 'pending_compliance' && (
                                <DropdownMenuItem className="text-emerald-600 dark:text-emerald-400">
                                  <Check className="w-4 h-4 mr-2" />
                                  Aprovar Subconta
                                </DropdownMenuItem>
                              )}
                              {sub.status === 'active' && (
                                <>
                                  <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                                    <Pause className="w-4 h-4 mr-2" />
                                    Suspender Subconta
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Bloquear Subconta
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(sub.status === 'suspended' || sub.status === 'blocked') && (
                                <DropdownMenuItem className="text-emerald-600 dark:text-emerald-400">
                                  <Check className="w-4 h-4 mr-2" />
                                  Reativar Subconta
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}