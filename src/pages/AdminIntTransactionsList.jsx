import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Download, Eye, MoreVertical, ChevronLeft, ChevronRight, Filter, X, 
  CreditCard, Smartphone, Receipt, TrendingUp, TrendingDown, CheckCircle2, 
  XCircle, Clock, AlertTriangle, RefreshCw, Zap, Building2, User, Calendar,
  ArrowUpRight, ArrowDownRight, Banknote, QrCode, Wallet
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/common/StatusBadge';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "emerald", className }) => {
  const colorClasses = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800" },
  };
  const colors = colorClasses[color];

  return (
    <div className={cn("p-4 rounded-xl border bg-white dark:bg-slate-900", colors.border, className)}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-0.5 text-xs font-medium", trend === 'up' ? 'text-emerald-600' : 'text-red-500')}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{title}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
};

const paymentMethodConfig = {
  credit_card: { icon: CreditCard, label: 'Crédito', color: 'text-blue-600 bg-blue-50' },
  debit_card: { icon: CreditCard, label: 'Débito', color: 'text-indigo-600 bg-indigo-50' },
  pix: { icon: QrCode, label: 'PIX', color: 'text-teal-600 bg-teal-50' },
  boleto: { icon: Receipt, label: 'Boleto', color: 'text-amber-600 bg-amber-50' },
};

const statusConfig = {
  approved: { icon: CheckCircle2, label: 'Aprovada', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  refused: { icon: XCircle, label: 'Recusada', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  pending: { icon: Clock, label: 'Pendente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  processing: { icon: RefreshCw, label: 'Processando', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  chargeback: { icon: AlertTriangle, label: 'Chargeback', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  refunded: { icon: RefreshCw, label: 'Estornada', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

export default function AdminIntTransactionsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [period, setPeriod] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const filteredTxs = mockTransactions.filter(tx => {
    const matchSearch = searchTerm === '' || 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer?.document?.includes(searchTerm) ||
      tx.external_reference?.includes(searchTerm);
    const matchStatus = selectedStatus === 'all' || tx.status === selectedStatus;
    const matchTab = activeTab === 'all' || 
      (activeTab === 'pix' && tx.method === 'pix') ||
      (activeTab === 'card' && (tx.method === 'credit_card' || tx.method === 'debit_card'));
    return matchSearch && matchStatus && matchTab;
  });

  const paginatedTxs = filteredTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage);

  // Estatísticas gerais
  const allApproved = mockTransactions.filter(t => t.status === 'approved');
  const pixTxs = mockTransactions.filter(t => t.method === 'pix');
  const cardTxs = mockTransactions.filter(t => t.method === 'credit_card' || t.method === 'debit_card');
  
  const stats = {
    total: mockTransactions.length,
    tpv: allApproved.reduce((sum, t) => sum + t.amount, 0),
    approved: allApproved.length,
    refused: mockTransactions.filter(t => t.status === 'refused').length,
    pending: mockTransactions.filter(t => t.status === 'pending' || t.status === 'processing').length,
    pix: {
      total: pixTxs.length,
      tpv: pixTxs.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
      approval: pixTxs.length > 0 ? (pixTxs.filter(t => t.status === 'approved').length / pixTxs.length * 100).toFixed(1) : 0,
    },
    card: {
      total: cardTxs.length,
      tpv: cardTxs.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
      approval: cardTxs.length > 0 ? (cardTxs.filter(t => t.status === 'approved').length / cardTxs.length * 100).toFixed(1) : 0,
    },
  };

  const approvalRate = stats.total > 0 ? (stats.approved / stats.total * 100).toFixed(1) : 0;
  const avgTicket = stats.approved > 0 ? stats.tpv / stats.approved : 0;

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Lista de Transações"
        subtitle="Gestão completa de transações PIX e Cartão"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Lista' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-4 h-4" /> Exportar
            </Button>
            <Button size="sm" className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
              <RefreshCw className="w-4 h-4" /> Atualizar
            </Button>
          </div>
        }
      />

      {/* Tabs PIX vs Cartão */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <Wallet className="w-4 h-4" /> Todas
          </TabsTrigger>
          <TabsTrigger value="pix" className="rounded-lg gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <QrCode className="w-4 h-4 text-teal-500" /> PIX
          </TabsTrigger>
          <TabsTrigger value="card" className="rounded-lg gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <CreditCard className="w-4 h-4 text-blue-500" /> Cartão
          </TabsTrigger>
        </TabsList>

        {/* KPIs Dinâmicos por Tab */}
        <div className="mt-4">
          {activeTab === 'all' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <KPICard title="TPV Total" value={formatCurrency(stats.tpv)} icon={Banknote} color="emerald" trend="up" trendValue="+12%" />
              <KPICard title="Transações" value={stats.total.toLocaleString()} icon={Zap} color="blue" trend="up" trendValue="+8%" />
              <KPICard title="Aprovação" value={`${approvalRate}%`} icon={CheckCircle2} color="emerald" trend="up" trendValue="+0.5%" />
              <KPICard title="Recusadas" value={stats.refused.toLocaleString()} icon={XCircle} color="red" trend="down" trendValue="-2%" />
              <KPICard title="Pendentes" value={stats.pending.toLocaleString()} icon={Clock} color="amber" />
              <KPICard title="Ticket Médio" value={formatCurrency(avgTicket)} icon={TrendingUp} color="purple" trend="up" trendValue="+5%" />
            </div>
          )}

          {activeTab === 'pix' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <KPICard title="TPV PIX" value={formatCurrency(stats.pix.tpv)} icon={QrCode} color="teal" trend="up" trendValue="+22%" />
              <KPICard title="Transações PIX" value={stats.pix.total.toLocaleString()} icon={Smartphone} color="teal" subtitle={`${((stats.pix.total / stats.total) * 100).toFixed(0)}% do total`} />
              <KPICard title="Taxa Conversão" value={`${stats.pix.approval}%`} icon={CheckCircle2} color="emerald" trend="up" trendValue="+1.2%" subtitle="QR Code → Pagamento" />
              <KPICard title="Tempo Médio" value="8s" icon={Clock} color="blue" subtitle="Confirmação" />
              <KPICard title="Ticket Médio" value={formatCurrency(stats.pix.total > 0 ? stats.pix.tpv / stats.pix.total : 0)} icon={Banknote} color="purple" />
            </div>
          )}

          {activeTab === 'card' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <KPICard title="TPV Cartão" value={formatCurrency(stats.card.tpv)} icon={CreditCard} color="blue" trend="up" trendValue="+8%" />
              <KPICard title="Transações" value={stats.card.total.toLocaleString()} icon={Zap} color="blue" subtitle={`${((stats.card.total / stats.total) * 100).toFixed(0)}% do total`} />
              <KPICard title="Aprovação" value={`${stats.card.approval}%`} icon={CheckCircle2} color="emerald" trend="up" trendValue="+0.3%" />
              <KPICard title="Chargebacks" value="12" icon={AlertTriangle} color="red" subtitle="0.15% ratio" />
              <KPICard title="3DS" value="78%" icon={Building2} color="purple" subtitle="Autenticado" />
              <KPICard title="Antifraude" value="2.3%" icon={AlertTriangle} color="amber" subtitle="Bloqueadas" />
            </div>
          )}
        </div>
      </Tabs>

      {/* Busca e Filtros */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar por ID, CPF, e-mail, referência... (Ctrl+K)"
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[130px] bg-slate-50 dark:bg-slate-800">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="month">Mês atual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[130px] bg-slate-50 dark:bg-slate-800">
                  <Filter className="w-4 h-4 mr-1.5 text-slate-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="refused">Recusadas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="chargeback">Chargebacks</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || selectedStatus !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }}>
                  <X className="w-4 h-4 mr-1" /> Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              {activeTab === 'pix' && <QrCode className="w-4 h-4 text-teal-500" />}
              {activeTab === 'card' && <CreditCard className="w-4 h-4 text-blue-500" />}
              {activeTab === 'all' && <Wallet className="w-4 h-4 text-slate-500" />}
              {filteredTxs.length.toLocaleString()} transações
            </CardTitle>
            <span className="text-xs text-slate-500">
              Exibindo {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTxs.length)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">ID / Referência</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Merchant</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Método</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-xs">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTxs.map(tx => {
                  const method = paymentMethodConfig[tx.method] || paymentMethodConfig.credit_card;
                  const status = statusConfig[tx.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const MethodIcon = method.icon;
                  
                  return (
                    <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + tx.id} className="font-mono text-xs text-[#2bc196] hover:underline font-medium">
                          {tx.id.slice(0, 12)}...
                        </Link>
                        {tx.external_reference && (
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">Ref: {tx.external_reference}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                        <div>{new Date(tx.date).toLocaleDateString('pt-BR')}</div>
                        <div className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + tx.merchant_id} className="text-xs text-slate-900 dark:text-white hover:text-[#2bc196] font-medium">
                          {tx.merchant_name}
                        </Link>
                        <p className="text-[10px] text-slate-400">ID: {tx.merchant_id}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(tx.amount)}</span>
                        {tx.installments > 1 && (
                          <p className="text-[10px] text-slate-400">{tx.installments}x</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium", method.color)}>
                          <MethodIcon className="w-3 h-3" />
                          {method.label}
                          {tx.brand && <span className="text-[10px] opacity-70">• {tx.brand}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + tx.id}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-4 h-4 text-slate-500" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="w-4 h-4 text-slate-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem><Receipt className="w-4 h-4 mr-2" /> Copiar ID</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {tx.status === 'approved' && (
                                <DropdownMenuItem className="text-red-600"><RefreshCw className="w-4 h-4 mr-2" /> Estornar</DropdownMenuItem>
                              )}
                              <DropdownMenuItem><Zap className="w-4 h-4 mr-2" /> Reenviar Webhook</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="h-8"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className={cn("h-8 w-8 p-0", currentPage === page && "bg-[#2bc196] hover:bg-[#239b7a]")}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="h-8"
              >
                Próxima <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <Select defaultValue="25">
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 por pág</SelectItem>
                <SelectItem value="50">50 por pág</SelectItem>
                <SelectItem value="100">100 por pág</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}