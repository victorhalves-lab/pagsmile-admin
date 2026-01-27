import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ArrowUpFromLine, 
  Plus, 
  Eye, 
  MoreHorizontal,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/dashboard/KPICard';

export default function Withdrawals() {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('pix');

  const queryClient = useQueryClient();

  const { data: withdrawals = [], isLoading, refetch } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => base44.entities.Withdrawal.list('-created_date', 100),
  });

  // Mock available balance
  const availableBalance = 125430.50;
  const minWithdrawal = 100;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Withdrawal.create({
      ...data,
      withdrawal_id: `wd_${Date.now()}`,
      status: 'pending',
      type: 'manual',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawals']);
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
      toast.success('Saque solicitado com sucesso!');
    }
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing');
  const completedThisMonth = withdrawals.filter(w => {
    if (w.status !== 'completed' || !w.processed_date) return false;
    const date = new Date(w.processed_date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const totalWithdrawnThisMonth = completedThisMonth.reduce((sum, w) => sum + (w.net_amount || w.amount || 0), 0);

  const columns = [
    {
      key: 'withdrawal_id',
      label: 'ID',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.status === 'completed' ? 'bg-emerald-100' : 
            row.status === 'pending' || row.status === 'processing' ? 'bg-blue-100' : 'bg-red-100'
          )}>
            <ArrowUpFromLine className={cn(
              "w-5 h-5",
              row.status === 'completed' ? 'text-emerald-600' : 
              row.status === 'pending' || row.status === 'processing' ? 'text-blue-600' : 'text-red-600'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 capitalize">{row.type}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(value)}</p>
          {row.fee > 0 && (
            <p className="text-xs text-gray-500">Taxa: {formatCurrency(row.fee)}</p>
          )}
        </div>
      )
    },
    {
      key: 'net_amount',
      label: 'Valor Líquido',
      render: (value, row) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(value || row.amount)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'bank_name',
      label: 'Destino',
      render: (value, row) => (
        <div>
          {row.pix_key ? (
            <>
              <p className="text-sm text-gray-900">Pix</p>
              <p className="text-xs text-gray-500">{row.pix_key}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-900">{value || 'N/A'}</p>
              <p className="text-xs text-gray-500">
                Ag: {row.agency} / Cc: {row.account_number}
              </p>
            </>
          )}
        </div>
      )
    },
    {
      key: 'created_date',
      label: 'Solicitado',
      render: (value) => value ? (
        <span className="text-sm text-gray-600">
          {format(new Date(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </span>
      ) : 'N/A'
    },
    {
      key: 'processed_date',
      label: 'Processado',
      render: (value) => value ? (
        <span className="text-sm text-gray-600">
          {format(new Date(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </span>
      ) : '-'
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            {row.receipt_url && (
              <DropdownMenuItem>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ver comprovante
              </DropdownMenuItem>
            )}
            {row.status === 'pending' && (
              <DropdownMenuItem className="text-red-600">
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < minWithdrawal) {
      toast.error(`Valor mínimo: ${formatCurrency(minWithdrawal)}`);
      return;
    }
    if (amount > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }
    createMutation.mutate({
      amount,
      pix_key: withdrawMethod === 'pix' ? 'usuario@email.com' : null,
      pix_key_type: withdrawMethod === 'pix' ? 'email' : null,
      bank_name: withdrawMethod === 'ted' ? 'Banco do Brasil' : null,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saques"
        subtitle="Gerencie suas transferências e saques"
        breadcrumbs={[
          { label: 'Saques', page: 'Withdrawals' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Automático
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => setIsWithdrawOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Saque
            </Button>
          </div>
        }
      />

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#101F3E] to-[#1a2f5e] rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Saldo Disponível para Saque</p>
            <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
            <p className="text-white/60 text-sm mt-2">
              Valor mínimo: {formatCurrency(minWithdrawal)}
            </p>
          </div>
          <Button 
            size="lg"
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <ArrowUpFromLine className="w-5 h-5 mr-2" />
            Solicitar Saque
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Sacado (Mês)"
          value={totalWithdrawnThisMonth}
          format="currency"
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Saques Concluídos (Mês)"
          value={completedThisMonth.length}
          format="number"
          icon={CheckCircle}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Pendentes"
          value={pendingWithdrawals.length}
          format="number"
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <KPICard
          title="Tempo Médio"
          value="2h"
          format="text"
          icon={Calendar}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Pending Alert */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">
                {pendingWithdrawals.length} saque(s) em processamento
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                Total: {formatCurrency(pendingWithdrawals.reduce((s, w) => s + (w.amount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todos
            <Badge variant="secondary" className="ml-2">{withdrawals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes
            {pendingWithdrawals.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">
                {pendingWithdrawals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={withdrawals}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar por ID..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={withdrawals.length}
            onRefresh={refetch}
            emptyMessage="Nenhum saque encontrado"
          />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={pendingWithdrawals}
            loading={isLoading}
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={pendingWithdrawals.length}
            emptyMessage="Nenhum saque pendente"
          />
        </TabsContent>

        <TabsContent value="completed">
          <DataTable
            columns={columns}
            data={withdrawals.filter(w => w.status === 'completed')}
            loading={isLoading}
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={withdrawals.filter(w => w.status === 'completed').length}
            emptyMessage="Nenhum saque concluído"
          />
        </TabsContent>
      </Tabs>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Saque</DialogTitle>
            <DialogDescription>
              Saldo disponível: {formatCurrency(availableBalance)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Valor do Saque</Label>
              <Input
                type="number"
                placeholder="0,00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo: {formatCurrency(minWithdrawal)}
              </p>
            </div>

            <div>
              <Label>Método de Transferência</Label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix (Instantâneo)</SelectItem>
                  <SelectItem value="ted">TED (D+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valor do saque</span>
                <span>{formatCurrency(parseFloat(withdrawAmount) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Taxa</span>
                <span>R$ 0,00</span>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Valor líquido</span>
                <span className="text-emerald-600">{formatCurrency(parseFloat(withdrawAmount) || 0)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleWithdraw}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Processando...' : 'Confirmar Saque'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}