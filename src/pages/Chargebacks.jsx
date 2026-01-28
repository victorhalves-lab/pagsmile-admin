import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Shield,
  Search,
  Filter,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
  received: { label: 'Recebido', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  in_analysis: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700', icon: Search },
  in_contestation: { label: 'Em Contestação', color: 'bg-purple-100 text-purple-700', icon: FileText },
  won: { label: 'Ganho', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-700', icon: XCircle },
  accepted: { label: 'Aceito', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 },
  expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-600', icon: Clock }
};

const reasonCategoryConfig = {
  fraud: { label: 'Fraude', color: 'bg-red-100 text-red-700' },
  consumer: { label: 'Consumidor', color: 'bg-blue-100 text-blue-700' },
  authorization: { label: 'Autorização', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Processamento', color: 'bg-purple-100 text-purple-700' }
};

const cardBrandConfig = {
  visa: { label: 'Visa', color: 'text-blue-800', bg: 'bg-blue-50' },
  mastercard: { label: 'Mastercard', color: 'text-red-600', bg: 'bg-red-50' },
  elo: { label: 'Elo', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  amex: { label: 'Amex', color: 'text-blue-500', bg: 'bg-blue-50' },
  hipercard: { label: 'Hipercard', color: 'text-orange-600', bg: 'bg-orange-50' }
};

function WinProbabilityBadge({ probability }) {
  if (probability === undefined || probability === null) {
    return <span className="text-gray-400">-</span>;
  }
  
  const getColor = () => {
    if (probability >= 60) return 'bg-green-100 text-green-700';
    if (probability >= 30) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };
  
  return (
    <Badge className={getColor()}>
      <TrendingUp className="w-3 h-3 mr-1" />
      {probability}%
    </Badge>
  );
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return <span className="text-gray-400">-</span>;
  
  const daysLeft = differenceInDays(new Date(deadline), new Date());
  
  if (daysLeft < 0) {
    return <Badge className="bg-gray-100 text-gray-600">Expirado</Badge>;
  }
  
  if (daysLeft <= 3) {
    return <Badge className="bg-red-100 text-red-700">{daysLeft}d restantes</Badge>;
  }
  
  if (daysLeft <= 7) {
    return <Badge className="bg-yellow-100 text-yellow-700">{daysLeft}d restantes</Badge>;
  }
  
  return <Badge className="bg-green-100 text-green-700">{daysLeft}d restantes</Badge>;
}

export default function Chargebacks() {
  const queryClient = useQueryClient();
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

  const filteredDisputes = disputes.filter(d => {
    if (filters.status !== 'all' && d.status !== filters.status) return false;
    if (filters.brand !== 'all' && d.card_brand !== filters.brand) return false;
    if (filters.category !== 'all' && d?.reason_category !== filters.category) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        d.dispute_id?.toLowerCase().includes(term) ||
        d.transaction_id?.toLowerCase().includes(term) ||
        d.arn?.toLowerCase().includes(term) ||
        d.customer_name?.toLowerCase().includes(term) ||
        d.customer_email?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Calculate KPIs
  const openDisputes = disputes.filter(d => ['received', 'in_analysis'].includes(d.status));
  const inContestation = disputes.filter(d => d.status === 'in_contestation');
  const won = disputes.filter(d => d.status === 'won');
  const lost = disputes.filter(d => d.status === 'lost' || d.status === 'accepted');
  const winRate = (won.length + lost.length) > 0 
    ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) 
    : 0;

  const columns = [
    {
      key: 'dispute_id',
      label: 'ID CB',
      render: (row) => (
        <span className="font-mono text-sm">{row.dispute_id}</span>
      )
    },
    {
      key: 'transaction_id',
      label: 'Transação',
      render: (row) => (
        <Link 
          to={createPageUrl(`TransactionDetail?id=${row.transaction_id}`)}
          className="text-blue-600 hover:underline font-mono text-sm"
        >
          {row.transaction_id}
        </Link>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (row) => (
        <span className="font-semibold">{formatCurrency(row.amount)}</span>
      )
    },
    {
      key: 'reason',
      label: 'Reason Code',
      render: (row) => {
        const category = reasonCategoryConfig[row.reason_category] || { label: 'Desconhecido', color: 'bg-gray-100 text-gray-700' };
        return (
          <div>
            <Badge className={category.color}>
              {row.reason_code || '-'}
            </Badge>
            <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate">
              {row.reason_description}
            </p>
          </div>
        );
      }
    },
    {
      key: 'brand',
      label: 'Bandeira',
      render: (row) => {
        const brand = cardBrandConfig[row.card_brand] || {};
        return (
          <Badge className={cn(brand.bg, brand.color)}>
            <CreditCard className="w-3 h-3 mr-1" />
            {brand.label || row.card_brand}
          </Badge>
        );
      }
    },
    {
      key: 'opened_date',
      label: 'Data',
      render: (row) => (
        <span className="text-sm">
          {row.opened_date ? format(new Date(row.opened_date), 'dd/MM/yy') : '-'}
        </span>
      )
    },
    {
      key: 'deadline',
      label: 'Prazo',
      render: (row) => <DeadlineBadge deadline={row.deadline_date} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = statusConfig[row.status] || {};
        const Icon = status.icon || Clock;
        return (
          <Badge className={status.color}>
            <Icon className="w-3 h-3 mr-1" />
            {status.label || row.status}
          </Badge>
        );
      }
    },
    {
      key: 'probability',
      label: 'Prob. Ganho',
      render: (row) => <WinProbabilityBadge probability={row.win_probability} />
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedDispute(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {['received', 'in_analysis'].includes(row.status) && (
            <Link to={createPageUrl(`DisputeContestation?id=${row.id}`)}>
              <Button variant="ghost" size="icon" className="text-purple-600">
                <FileText className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      )
    }
  ];

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
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Abertos</p>
            <p className="text-2xl font-bold">{openDisputes.length}</p>
            <p className="text-xs text-gray-500">{formatCurrency(openDisputes.reduce((s, d) => s + (d.amount || 0), 0))}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Em Contestação</p>
            <p className="text-2xl font-bold text-purple-600">{inContestation.length}</p>
            <p className="text-xs text-gray-500">{formatCurrency(inContestation.reduce((s, d) => s + (d.amount || 0), 0))}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Ganhos</p>
            <p className="text-2xl font-bold text-green-600">{won.length}</p>
            <p className="text-xs text-green-600">{formatCurrency(won.reduce((s, d) => s + (d.amount || 0), 0))}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Perdidos</p>
            <p className="text-2xl font-bold text-red-600">{lost.length}</p>
            <p className="text-xs text-red-600">{formatCurrency(lost.reduce((s, d) => s + (d.amount || 0), 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="text-2xl font-bold">{winRate}%</p>
            <Progress value={parseFloat(winRate)} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID, ARN, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-40">
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
          <SelectTrigger className="w-40">
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
          <SelectTrigger className="w-40">
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredDisputes}
        isLoading={isLoading}
        emptyMessage="Nenhum chargeback encontrado"
      />

      {/* Dispute Detail Dialog */}
      <Dialog open={selectedDispute !== null} onOpenChange={(open) => { if (!open) setSelectedDispute(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Chargeback</DialogTitle>
          </DialogHeader>

          {selectedDispute ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">ID do Chargeback</p>
                  <p className="font-mono font-semibold">{selectedDispute.dispute_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transação</p>
                  <p className="font-mono">{selectedDispute.transaction_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ARN</p>
                  <p className="font-mono text-sm">{selectedDispute.arn || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="font-semibold text-lg">{formatCurrency(selectedDispute.amount)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Reason Code</p>
                <Badge className={reasonCategoryConfig[selectedDispute?.reason_category]?.color || 'bg-gray-100'}>
                  {selectedDispute?.reason_code || '-'}
                </Badge>
                <p className="text-sm mt-2">{selectedDispute?.reason_description || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedDispute.customer_name}</p>
                  <p className="text-sm text-gray-500">{selectedDispute.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Probabilidade de Ganho</p>
                  <WinProbabilityBadge probability={selectedDispute.win_probability} />
                </div>
              </div>

              {selectedDispute.ai_recommendation && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-600">Recomendação da IA</p>
                  </div>
                  <Badge className={selectedDispute.ai_recommendation === 'contest' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {selectedDispute.ai_recommendation === 'contest' ? 'Contestar' : 'Aceitar'}
                  </Badge>
                  {selectedDispute.ai_recommendation_reason && (
                    <p className="text-sm text-gray-600 mt-2">{selectedDispute.ai_recommendation_reason}</p>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDispute(null)}>
                  Fechar
                </Button>
                {['received', 'in_analysis'].includes(selectedDispute.status) && (
                  <Link to={createPageUrl(`DisputeContestation?id=${selectedDispute.id}`)}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Contestar
                    </Button>
                  </Link>
                )}
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}