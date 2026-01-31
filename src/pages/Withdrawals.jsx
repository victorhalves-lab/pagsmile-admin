import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  CreditCard
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('financial.withdrawals')}
        subtitle={t('financial.withdrawals')}
        breadcrumbs={[
          { label: t('financial.title'), href: 'Financial' },
          { label: t('financial.withdrawals') }
        ]}
        actions={
          <Button onClick={() => setShowWithdrawDialog(true)}>
            <ArrowUpFromLine className="w-4 h-4 mr-2" />
            {t('financial.withdraw')}
          </Button>
        }
      />

      {/* Balance Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">{t('financial.available_for_withdrawal')}</p>
              <p className="text-3xl font-bold text-green-800">{formatCurrency(availableBalance)}</p>
              <p className="text-xs text-green-600 mt-1">
                {t('financial.min_withdrawal')}: {formatCurrency(minWithdrawal)}
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">{t('financial.withdrawal_history')}</TabsTrigger>
          <TabsTrigger value="accounts">{t('financial.bank_accounts')}</TabsTrigger>
          <TabsTrigger value="auto">{t('financial.auto_withdrawal')}</TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('financial.withdrawal_history')}</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {t('financial.export')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>{t('financial.date')}</TableHead>
                      <TableHead>{t('financial.value')}</TableHead>
                      <TableHead>{t('financial.fee_label')}</TableHead>
                      <TableHead>{t('financial.net')}</TableHead>
                      <TableHead>{t('financial.destination')}</TableHead>
                      <TableHead>{t('financial.type')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => {
                      const statusConf = statusConfig[withdrawal.status] || statusConfig.pending;
                      const StatusIcon = statusConf.icon;

                      return (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {format(new Date(withdrawal.created_date), 'dd/MM/yyyy')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(withdrawal.created_date), 'HH:mm')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            {withdrawal.fee > 0 ? `-${formatCurrency(withdrawal.fee)}` : t('financial.free')}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(withdrawal.net_amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {withdrawal.pix_key ? (
                                <QrCode className="w-4 h-4 text-green-500" />
                              ) : (
                                <Building2 className="w-4 h-4 text-gray-500" />
                              )}
                              <div>
                                <p className="text-sm">{withdrawal.bank_name}</p>
                                <p className="text-xs text-gray-500">
                                  {withdrawal.pix_key || `Ag: ${withdrawal.agency} Cc: ${withdrawal.account_number}`}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {withdrawal.type === 'manual' ? t('financial.manual') : t('financial.automatic')}
                            </Badge>
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
                          <TableCell>
                            {withdrawal.receipt_url && (
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {withdrawals.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <ArrowUpFromLine className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('financial.no_withdrawals')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{t('financial.bank_accounts')}</CardTitle>
                  <CardDescription>{t('financial.manage_accounts')}</CardDescription>
                </div>
                <Button onClick={() => setShowAccountDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('financial.add_account')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div 
                      key={account.id}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-lg",
                        account.is_primary && "border-green-500 bg-green-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {account.pix_key ? (
                            <QrCode className="w-5 h-5 text-green-600" />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{account.bank_name}</p>
                            {account.is_primary && (
                              <Badge className="bg-green-100 text-green-700 text-xs">{t('financial.primary')}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {account.pix_key ? (
                              `Pix: ${account.pix_key}`
                            ) : (
                              `Ag: ${account.agency} | Conta: ${account.account_number}-${account.account_digit}`
                            )}
                          </p>
                          <p className="text-xs text-gray-400">{account.holder_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.is_validated ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t('financial.validated')}
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t('financial.pending')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('financial.no_bank_accounts')}</p>
                  <Button className="mt-4" onClick={() => setShowAccountDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('financial.add_account')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto Withdrawal Tab */}
        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('financial.auto_withdrawal_settings')}
              </CardTitle>
              <CardDescription>
                {t('financial.auto_withdrawal_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <Label className="text-base text-blue-900">{t('financial.enable_auto_withdrawal')}</Label>
                  <p className="text-sm text-blue-700">
                    {t('financial.auto_when_conditions')}
                  </p>
                </div>
                <Switch
                  checked={config.is_auto_enabled}
                  onCheckedChange={(checked) => handleConfigChange('is_auto_enabled', checked)}
                />
              </div>

              {config.is_auto_enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('financial.frequency')}</Label>
                      <Select
                        value={config.auto_frequency}
                        onValueChange={(value) => handleConfigChange('auto_frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">{t('financial.daily')}</SelectItem>
                          <SelectItem value="weekly">{t('financial.weekly')}</SelectItem>
                          <SelectItem value="biweekly">{t('financial.biweekly')}</SelectItem>
                          <SelectItem value="monthly">{t('financial.monthly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {config.auto_frequency === 'weekly' && (
                      <div className="space-y-2">
                        <Label>{t('financial.day_of_week')}</Label>
                        <Select
                          value={String(config.auto_day_of_week || 1)}
                          onValueChange={(value) => handleConfigChange('auto_day_of_week', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">{t('financial.monday')}</SelectItem>
                            <SelectItem value="2">{t('financial.tuesday')}</SelectItem>
                            <SelectItem value="3">{t('financial.wednesday')}</SelectItem>
                            <SelectItem value="4">{t('financial.thursday')}</SelectItem>
                            <SelectItem value="5">{t('financial.friday')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('financial.min_amount_withdraw')}</Label>
                      <Input
                        type="number"
                        value={config.min_amount_to_withdraw}
                        onChange={(e) => handleConfigChange('min_amount_to_withdraw', parseFloat(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">
                        {t('financial.min_amount_help')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('financial.keep_min_balance')}</Label>
                      <Input
                        type="number"
                        value={config.keep_minimum_balance}
                        onChange={(e) => handleConfigChange('keep_minimum_balance', parseFloat(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">
                        {t('financial.keep_min_help')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('financial.default_destination_account')}</Label>
                    <Select
                      value={config.default_bank_account_id || ''}
                      onValueChange={(value) => handleConfigChange('default_bank_account_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('financial.select_account')} />
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

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>{t('financial.notify_auto_withdrawals')}</Label>
                      <p className="text-xs text-gray-500">{t('financial.notify_auto_help')}</p>
                    </div>
                    <Switch
                      checked={config.notification_enabled}
                      onCheckedChange={(checked) => handleConfigChange('notification_enabled', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('financial.request_withdrawal')}</DialogTitle>
            <DialogDescription>
              {t('financial.transfer_available')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">{t('financial.available_balance')}</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(availableBalance)}</p>
            </div>

            <div className="space-y-2">
              <Label>{t('financial.withdrawal_amount')}</Label>
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
                  {t('financial.all')}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('financial.transfer_type')}</Label>
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
                    <p className="text-xs text-gray-500">{t('financial.instant')}</p>
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
                    <p className="text-xs text-gray-500">{t('financial.d0_d1')}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('financial.destination_account')}</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('financial.select_account')} />
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
                  {t('financial.withdrawal_fee')}: {config.withdrawal_fee_type === 'fixed' 
                    ? formatCurrency(config.withdrawal_fee_value)
                    : `${config.withdrawal_fee_value}%`
                  }
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              {t('common.cancel')}
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
              {t('financial.confirm_withdrawal')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}