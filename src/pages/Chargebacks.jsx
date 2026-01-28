import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Search,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Bot,
  AlertTriangle,
  Shield,
  Calendar,
  User,
  Hash,
  DollarSign,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
  received: { label: 'Recebido', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  in_analysis: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Search },
  in_contestation: { label: 'Em Contestação', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FileText },
  won: { label: 'Ganho', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  accepted: { label: 'Aceito', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCircle2 },
  expired: { label: 'Expirado', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Clock }
};

const reasonCategoryConfig = {
  fraud: { label: 'Fraude', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  consumer: { label: 'Consumidor', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: User },
  authorization: { label: 'Autorização', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Shield },
  processing: { label: 'Processamento', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Clock }
};

const cardBrandConfig = {
  visa: { label: 'Visa', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  mastercard: { label: 'Mastercard', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  elo: { label: 'Elo', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  amex: { label: 'Amex', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  hipercard: { label: 'Hipercard', color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
};

function WinProbabilityBadge({ probability }) {
  if (probability === undefined || probability === null) {
    return <span className="text-slate-400 text-sm">-</span>;
  }
  
  const getColor = () => {
    if (probability >= 60) return 'bg-emerald-100 text-emerald-700';
    if (probability >= 30) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-16">
        <div 
          className={cn(
            "h-full rounded-full transition-all",
            probability >= 60 ? "bg-emerald-500" : probability >= 30 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold", probability >= 60 ? "text-emerald-600" : probability >= 30 ? "text-amber-600" : "text-red-600")}>
        {probability}%
      </span>
    </div>
  );
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return <span className="text-slate-400 text-sm">-</span>;
  
  const daysLeft = differenceInDays(new Date(deadline), new Date());
  
  if (daysLeft < 0) {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
        <Clock className="w-3 h-3 mr-1" />
        Expirado
      </Badge>
    );
  }
  
  if (daysLeft <= 3) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {daysLeft}d restantes
      </Badge>
    );
  }
  
  if (daysLeft <= 7) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="w-3 h-3 mr-1" />
        {daysLeft}d restantes
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
      <Clock className="w-3 h-3 mr-1" />
      {daysLeft}d restantes
    </Badge>
  );
}

function KPICard({ title, value, subValue, icon: Icon, color, trend }) {
  const colorClasses = {
    default: 'bg-white border-slate-200',
    purple: 'bg-gradient-to-br from-purple-50 to-white border-purple-200',
    green: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
    red: 'bg-gradient-to-br from-red-50 to-white border-red-200',
    amber: 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
  };

  const iconColorClasses = {
    default: 'bg-slate-100 text-slate-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <Card className={cn("border shadow-sm hover:shadow-md transition-shadow", colorClasses[color || 'default'])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subValue && <p className="text-sm text-slate-500">{subValue}</p>}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconColorClasses[color || 'default'])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Shield className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum chargeback encontrado</h3>
      <p className="text-slate-500 text-center max-w-md">
        Quando você receber chargebacks, eles aparecerão aqui para você gerenciar e contestar.
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function Chargebacks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    brand: 'all',
    category: 'all'
  });
  const [selectedDispute, setSelectedDispute] = useState(null);

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ['chargebacks'],
    queryFn: () => base44.entities.Dispute.filter(
      { type: 'chargeback' },
      '-created_date'
    )
  });

  const filteredDisputes = (disputes || []).filter(d => {
    if (!d) return false;
    if (filters.status !== 'all' && d.status !== filters.status) return false;
    if (filters.brand !== 'all' && d.card_brand !== filters.brand) return false;
    if (filters.category !== 'all' && d.reason_category !== filters.category) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (d.dispute_id || '').toLowerCase().includes(term) ||
        (d.transaction_id || '').toLowerCase().includes(term) ||
        (d.arn || '').toLowerCase().includes(term) ||
        (d.customer_name || '').toLowerCase().includes(term) ||
        (d.customer_email || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Calculate KPIs safely
  const safeDisputes = disputes || [];
  const openDisputes = safeDisputes.filter(d => d && ['received', 'in_analysis'].includes(d.status));
  const inContestation = safeDisputes.filter(d => d && d.status === 'in_contestation');
  const won = safeDisputes.filter(d => d && d.status === 'won');
  const lost = safeDisputes.filter(d => d && (d.status === 'lost' || d.status === 'accepted'));
  const winRate = (won.length + lost.length) > 0 
    ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) 
    : 0;

  const handleViewDetails = (dispute) => {
    setSelectedDispute(dispute);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chargebacks"
        subtitle="Gerencie e conteste chargebacks recebidos"
        breadcrumbs={[
          { label: 'Disputas', page: 'DisputeDashboard' },
          { label: 'Chargebacks' }
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Abertos"
          value={openDisputes.length}
          subValue={formatCurrency(openDisputes.reduce((s, d) => s + (d?.amount || 0), 0))}
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="Em Contestação"
          value={inContestation.length}
          subValue={formatCurrency(inContestation.reduce((s, d) => s + (d?.amount || 0), 0))}
          icon={FileText}
          color="purple"
        />
        <KPICard
          title="Ganhos"
          value={won.length}
          subValue={formatCurrency(won.reduce((s, d) => s + (d?.amount || 0), 0))}
          icon={CheckCircle2}
          color="green"
        />
        <KPICard
          title="Perdidos"
          value={lost.length}
          subValue={formatCurrency(lost.reduce((s, d) => s + (d?.amount || 0), 0))}
          icon={XCircle}
          color="red"
        />
        <Card className="border shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Win Rate</p>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{winRate}%</p>
              <Progress value={parseFloat(winRate)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por ID, ARN, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="received">Recebido</SelectItem>
                <SelectItem value="in_analysis">Em Análise</SelectItem>
                <SelectItem value="in_contestation">Em Contestação</SelectItem>
                <SelectItem value="won">Ganho</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
                <SelectItem value="accepted">Aceito</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.brand} onValueChange={(v) => setFilters(f => ({ ...f, brand: v }))}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Bandeira" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Bandeiras</SelectItem>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="elo">Elo</SelectItem>
                <SelectItem value="amex">Amex</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="fraud">Fraude</SelectItem>
                <SelectItem value="consumer">Consumidor</SelectItem>
                <SelectItem value="authorization">Autorização</SelectItem>
                <SelectItem value="processing">Processamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border shadow-sm overflow-hidden">
        {isLoading ? (
          <CardContent className="p-4">
            <TableSkeleton />
          </CardContent>
        ) : filteredDisputes.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700">ID Chargeback</TableHead>
                <TableHead className="font-semibold text-slate-700">Transação</TableHead>
                <TableHead className="font-semibold text-slate-700">Valor</TableHead>
                <TableHead className="font-semibold text-slate-700">Reason Code</TableHead>
                <TableHead className="font-semibold text-slate-700">Bandeira</TableHead>
                <TableHead className="font-semibold text-slate-700">Data</TableHead>
                <TableHead className="font-semibold text-slate-700">Prazo</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Prob. Ganho</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((row) => {
                const status = statusConfig[row?.status] || { color: 'bg-slate-100 text-slate-600', label: row?.status || '-', icon: Clock };
                const StatusIcon = status.icon || Clock;
                const brand = cardBrandConfig[row?.card_brand] || { bg: 'bg-slate-50 border-slate-200', color: 'text-slate-600', label: row?.card_brand };
                const category = reasonCategoryConfig[row?.reason_category] || { color: 'bg-slate-100 text-slate-600' };

                return (
                  <TableRow key={row?.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleViewDetails(row)}>
                    <TableCell className="font-mono text-sm font-medium text-slate-900">
                      {row?.dispute_id || '-'}
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={createPageUrl(`TransactionDetail?id=${row?.transaction_id || ''}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row?.transaction_id || '-'}
                      </Link>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatCurrency(row?.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className={cn("text-xs", category.color)}>
                          {row?.reason_code || '-'}
                        </Badge>
                        <p className="text-xs text-slate-500 max-w-[120px] truncate">
                          {row?.reason_description || '-'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", brand.bg, brand.color)}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {brand.label || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {row?.opened_date ? format(new Date(row.opened_date), 'dd/MM/yy') : '-'}
                    </TableCell>
                    <TableCell>
                      <DeadlineBadge deadline={row?.deadline_date} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", status.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <WinProbabilityBadge probability={row?.win_probability} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(row);
                          }}
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                        {row && ['received', 'in_analysis'].includes(row.status) && (
                          <Link to={createPageUrl(`DisputeContestation?id=${row.id}`)} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                              <FileText className="w-4 h-4 text-purple-600" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Dispute Detail Dialog */}
      <Dialog open={selectedDispute !== null} onOpenChange={(open) => { if (!open) setSelectedDispute(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Detalhes do Chargeback</p>
                <p className="text-sm font-normal text-slate-500">{selectedDispute?.dispute_id || '-'}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-6 mt-4">
              {/* Main Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Hash className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Transação</span>
                  </div>
                  <p className="font-mono font-semibold text-slate-900">{selectedDispute?.transaction_id || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Valor</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedDispute?.amount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">ARN</span>
                  </div>
                  <p className="font-mono text-sm text-slate-900">{selectedDispute?.arn || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Prazo</span>
                  </div>
                  <DeadlineBadge deadline={selectedDispute?.deadline_date} />
                </div>
              </div>

              {/* Reason Code */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">Reason Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={reasonCategoryConfig[selectedDispute?.reason_category]?.color || 'bg-slate-100'}>
                    {selectedDispute?.reason_code || '-'}
                  </Badge>
                  <span className="text-sm text-slate-600">{selectedDispute?.reason_description || '-'}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Cliente</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedDispute?.customer_name || '-'}</p>
                  <p className="text-sm text-slate-500">{selectedDispute?.customer_email || '-'}</p>
                </div>
              </div>

              {/* Win Probability */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">Probabilidade de Ganho</span>
                </div>
                <WinProbabilityBadge probability={selectedDispute?.win_probability} />
              </div>

              {/* AI Recommendation */}
              {selectedDispute?.ai_recommendation && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">Recomendação da IA</span>
                  </div>
                  <Badge className={selectedDispute?.ai_recommendation === 'contest' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                    {selectedDispute?.ai_recommendation === 'contest' ? 'Contestar' : 'Aceitar'}
                  </Badge>
                  {selectedDispute?.ai_recommendation_reason && (
                    <p className="text-sm text-purple-700">{selectedDispute.ai_recommendation_reason}</p>
                  )}
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedDispute(null)}>
                  Fechar
                </Button>
                {selectedDispute && ['received', 'in_analysis'].includes(selectedDispute.status) && (
                  <Link to={createPageUrl(`DisputeContestation?id=${selectedDispute.id}`)}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Contestar Chargeback
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}