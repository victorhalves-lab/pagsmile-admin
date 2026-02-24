import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
// PageHeader removed - using simple h1
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Tabs removed - simplified layout
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpFromLine,
  Wallet,
  Building2,
  QrCode,
  Plus,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Download,
  RefreshCcw,
  CreditCard,
  Zap,
  Info,
  Lock,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const getStatusConfig = (t) => ({
  pending: { label: t('common.pending'), color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: t('common.processing'), color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  completed: { label: t('common.completed'), color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  failed: { label: t('common.failed'), color: 'bg-red-100 text-red-700', icon: XCircle },
  cancelled: { label: t('common.cancelled'), color: 'bg-gray-100 text-gray-700', icon: XCircle },
});

export default function Withdrawals() {
  const { t } = useTranslation();
  const statusConfig = getStatusConfig(t);
  const queryClient = useQueryClient();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [withdrawType, setWithdrawType] = useState('pix');

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => base44.entities.Withdrawal.list('-created_date', 100)
  });

  const { data: bankAccounts = [] } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => base44.entities.BankAccount.filter({ status: 'active' })
  });

  const { data: configs = [] } = useQuery({
    queryKey: ['withdrawal-config'],
    queryFn: () => base44.entities.WithdrawalConfig.list()
  });

  const config = configs[0] || {
    is_auto_enabled: false,
    auto_frequency: 'daily',
    min_amount_to_withdraw: 100,
    keep_minimum_balance: 0,
    withdrawal_fee_type: 'free',
    withdrawal_fee_value: 0
  };

  // Simulated available balance
  const availableBalance = 45680.50;
  const minWithdrawal = 10;

  const createWithdrawalMutation = useMutation({
    mutationFn: (data) => base44.entities.Withdrawal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Saque solicitado com sucesso!');
      setShowWithdrawDialog(false);
      setWithdrawAmount('');
    }
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data) => {
      if (configs[0]?.id) {
        return base44.entities.WithdrawalConfig.update(configs[0].id, data);
      }
      return base44.entities.WithdrawalConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-config'] });
      toast.success('Configurações salvas!');
    }
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < minWithdrawal) {
      toast.error(`Valor mínimo para saque é ${formatCurrency(minWithdrawal)}`);
      return;
    }
    if (amount > availableBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    const selectedAccount = bankAccounts.find(a => a.id === selectedAccountId);

    createWithdrawalMutation.mutate({
      withdrawal_id: `WD-${Date.now()}`,
      amount,
      fee: config.withdrawal_fee_type === 'fixed' ? config.withdrawal_fee_value : 0,
      net_amount: amount - (config.withdrawal_fee_type === 'fixed' ? config.withdrawal_fee_value : 0),
      type: 'manual',
      bank_name: selectedAccount?.bank_name,
      bank_code: selectedAccount?.bank_code,
      agency: selectedAccount?.agency,
      account_number: selectedAccount?.account_number,
      account_type: selectedAccount?.account_type,
      pix_key: withdrawType === 'pix' ? selectedAccount?.pix_key : null,
      pix_key_type: withdrawType === 'pix' ? selectedAccount?.pix_key_type : null,
      status: 'pending'
    });
  };

  const handleConfigChange = (field, value) => {
    updateConfigMutation.mutate({ ...config, [field]: value });
  };

  // Simulated financial summary values
  const anticipateBalance = 12500.00;
  const anticipationProcessing = 3200.00;
  const blockedInDisputes = 1800.00;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = !searchQuery || 
      w.withdrawal_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(w.amount).includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Saques</h1>

      {/* Summary Cards - 4 columns */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Card 1 - Disponível para antecipar */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Disponível para antecipar (D+2)
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(anticipateBalance)}</p>
              <Button variant="outline" size="sm" className="w-fit text-sm">
                Antecipar
              </Button>
            </div>

            {/* Card 2 - Antecipação em processamento */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Antecipação em processamento
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(anticipationProcessing)}</p>
              <Button variant="outline" size="sm" className="w-fit text-sm">
                Ver status
              </Button>
            </div>

            {/* Card 3 - Valor bloqueado em disputas */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Lock className="w-4 h-4 text-red-500" />
                  Valor bloqueado em disputas
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(blockedInDisputes)}</p>
              <Button variant="outline" size="sm" className="w-fit text-sm">
                Ver disputas
              </Button>
            </div>

            {/* Card 4 - Disponível para saque */}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  Disponível para saque
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(availableBalance)}</p>
              <Button 
                size="sm" 
                className="w-fit text-sm bg-[#2bc196] hover:bg-[#239b7a]"
                onClick={() => setShowWithdrawDialog(true)}
              >
                Sacar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search, Filters and Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Pesquisar por ID, valor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>ID de pagamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.map((withdrawal) => {
                const statusConf = statusConfig[withdrawal.status] || statusConfig.pending;
                const StatusIcon = statusConf.icon;

                return (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium text-slate-700">
                      {withdrawal.withdrawal_id}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(withdrawal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1", statusConf.color)}>
                        <StatusIcon className={cn(
                          "w-3 h-3",
                          withdrawal.status === 'processing' && "animate-spin"
                        )} />
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {format(new Date(withdrawal.created_date), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredWithdrawals.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p>Nenhum dado encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Saque</DialogTitle>
            <DialogDescription>
              Transfira o saldo disponível para sua conta bancária
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Saldo disponível</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(availableBalance)}</p>
            </div>

            <div className="space-y-2">
              <Label>Valor do saque</Label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0,00"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setWithdrawAmount(String(availableBalance / 2))}
                >
                  50%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setWithdrawAmount(String(availableBalance))}
                >
                  Tudo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de transferência</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWithdrawType('pix')}
                  className={cn(
                    "p-3 border rounded-lg flex items-center gap-2 transition-all",
                    withdrawType === 'pix' ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                  )}
                >
                  <QrCode className={cn(
                    "w-5 h-5",
                    withdrawType === 'pix' ? "text-green-600" : "text-gray-400"
                  )} />
                  <div className="text-left">
                    <p className="font-medium text-sm">Pix</p>
                    <p className="text-xs text-gray-500">Instantâneo</p>
                  </div>
                </button>
                <button
                  onClick={() => setWithdrawType('ted')}
                  className={cn(
                    "p-3 border rounded-lg flex items-center gap-2 transition-all",
                    withdrawType === 'ted' ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
                  <Building2 className={cn(
                    "w-5 h-5",
                    withdrawType === 'ted' ? "text-blue-600" : "text-gray-400"
                  )} />
                  <div className="text-left">
                    <p className="font-medium text-sm">TED</p>
                    <p className="text-xs text-gray-500">D+0 / D+1</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Conta de destino</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank_name} - {account.pix_key || account.account_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {config.withdrawal_fee_type !== 'free' && (
              <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                <p className="text-yellow-700">
                  Taxa de saque: {config.withdrawal_fee_type === 'fixed' 
                    ? formatCurrency(config.withdrawal_fee_value)
                    : `${config.withdrawal_fee_value}%`
                  }
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={!withdrawAmount || !selectedAccountId || createWithdrawalMutation.isPending}
            >
              {createWithdrawalMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
              )}
              Confirmar saque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}