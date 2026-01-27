import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import AnticipationSimulator from '@/components/financial/AnticipationSimulator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Zap,
  Settings,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  History,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function Anticipation() {
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAnticipation, setPendingAnticipation] = useState(null);

  const { data: receivables = [] } = useQuery({
    queryKey: ['receivables-anticipatable'],
    queryFn: () => base44.entities.Receivable.filter({ status: 'scheduled', is_anticipatable: true })
  });

  const { data: configs = [] } = useQuery({
    queryKey: ['anticipation-config'],
    queryFn: () => base44.entities.AnticipationConfig.list()
  });

  const config = configs[0] || {
    is_auto_enabled: false,
    auto_rule: 'all',
    auto_min_days: 15,
    fee_percentage_monthly: 1.99,
    total_anticipated: 0,
    total_fees_paid: 0
  };

  const updateConfigMutation = useMutation({
    mutationFn: async (data) => {
      if (configs[0]?.id) {
        return base44.entities.AnticipationConfig.update(configs[0].id, data);
      }
      return base44.entities.AnticipationConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anticipation-config'] });
      toast.success('Configurações salvas!');
    }
  });

  // Calculate available amount
  const availableAmount = useMemo(() => {
    return receivables.reduce((sum, r) => sum + (r.net_amount || 0), 0);
  }, [receivables]);

  const handleAnticipate = (simulation) => {
    setPendingAnticipation(simulation);
    setShowConfirmDialog(true);
  };

  const confirmAnticipation = async () => {
    // In real app, this would process the anticipation
    toast.success(`Antecipação de ${formatCurrency(pendingAnticipation.netAmount)} solicitada com sucesso!`);
    setShowConfirmDialog(false);
    setPendingAnticipation(null);
    queryClient.invalidateQueries({ queryKey: ['receivables-anticipatable'] });
  };

  const handleAutoConfigChange = (field, value) => {
    updateConfigMutation.mutate({ ...config, [field]: value });
  };

  // Mock history data
  const anticipationHistory = [
    { id: 1, date: '2025-01-25', gross: 15000, fee: 225, net: 14775, status: 'completed' },
    { id: 2, date: '2025-01-20', gross: 8500, fee: 127.50, net: 8372.50, status: 'completed' },
    { id: 3, date: '2025-01-15', gross: 22000, fee: 330, net: 21670, status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Antecipação de Recebíveis"
        subtitle="Antecipe seus recebíveis e tenha o dinheiro na hora"
        breadcrumbs={[
          { label: 'Financeiro', href: 'Financial' },
          { label: 'Antecipação' }
        ]}
      />

      <Tabs defaultValue="simulate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="simulate">Simular e Antecipar</TabsTrigger>
          <TabsTrigger value="auto">Auto-Antecipação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Simulate Tab */}
        <TabsContent value="simulate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnticipationSimulator
              availableAmount={availableAmount}
              feePercentage={config.fee_percentage_monthly}
              onAnticipate={handleAnticipate}
            />

            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Resumo de Antecipações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Total Antecipado</p>
                      <p className="text-xl font-bold text-purple-700">
                        {formatCurrency(config.total_anticipated)}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Total em Taxas</p>
                      <p className="text-xl font-bold text-orange-700">
                        {formatCurrency(config.total_fees_paid)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Como funciona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-full">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Escolha o valor</p>
                      <p className="text-xs text-gray-500">Informe quanto deseja antecipar ou selecione "Antecipar tudo"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-full">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Confira a simulação</p>
                      <p className="text-xs text-gray-500">Veja o valor líquido que receberá após a taxa de antecipação</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-full">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Receba em até 1 hora</p>
                      <p className="text-xs text-gray-500">O valor será creditado no seu saldo disponível</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Auto-Anticipation Tab */}
        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Auto-Antecipação
              </CardTitle>
              <CardDescription>
                Configure para antecipar automaticamente seus recebíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <Label className="text-base text-purple-900">Habilitar Auto-Antecipação</Label>
                  <p className="text-sm text-purple-700">
                    Antecipar automaticamente novos recebíveis
                  </p>
                </div>
                <Switch
                  checked={config.is_auto_enabled}
                  onCheckedChange={(checked) => handleAutoConfigChange('is_auto_enabled', checked)}
                />
              </div>

              {config.is_auto_enabled && (
                <>
                  <div className="space-y-3">
                    <Label>Regra de Auto-Antecipação</Label>
                    <Select
                      value={config.auto_rule}
                      onValueChange={(value) => handleAutoConfigChange('auto_rule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Antecipar todo recebível novo</SelectItem>
                        <SelectItem value="above_days">Apenas recebíveis com D+X ou mais</SelectItem>
                        <SelectItem value="above_value">Apenas recebíveis acima de um valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.auto_rule === 'above_days' && (
                    <div className="space-y-2">
                      <Label>Dias mínimos para antecipar (D+)</Label>
                      <Input
                        type="number"
                        value={config.auto_min_days}
                        onChange={(e) => handleAutoConfigChange('auto_min_days', parseInt(e.target.value))}
                        className="max-w-[200px]"
                      />
                      <p className="text-xs text-gray-500">
                        Só antecipará recebíveis com prazo de {config.auto_min_days} dias ou mais
                      </p>
                    </div>
                  )}

                  {config.auto_rule === 'above_value' && (
                    <div className="space-y-2">
                      <Label>Valor mínimo para antecipar</Label>
                      <Input
                        type="number"
                        value={config.auto_min_value || 0}
                        onChange={(e) => handleAutoConfigChange('auto_min_value', parseFloat(e.target.value))}
                        className="max-w-[200px]"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Taxa máxima aceitável (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={config.max_fee_percentage || 3}
                      onChange={(e) => handleAutoConfigChange('max_fee_percentage', parseFloat(e.target.value))}
                      className="max-w-[200px]"
                    />
                    <p className="text-xs text-gray-500">
                      Só antecipará se a taxa efetiva for menor que este valor
                    </p>
                  </div>
                </>
              )}

              <Alert>
                <Zap className="w-4 h-4" />
                <AlertDescription>
                  Com a auto-antecipação ativa, você terá fluxo de caixa D+0 automaticamente.
                  Taxa atual: <strong>{config.fee_percentage_monthly}% ao mês</strong>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Antecipações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anticipationHistory.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Antecipação</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(item.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(item.net)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Taxa: {formatCurrency(item.fee)}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Concluída
                    </Badge>
                  </div>
                ))}

                {anticipationHistory.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma antecipação realizada ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Antecipação</DialogTitle>
            <DialogDescription>
              Revise os detalhes da antecipação antes de confirmar
            </DialogDescription>
          </DialogHeader>

          {pendingAnticipation && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Valor Bruto</span>
                <span className="font-semibold">{formatCurrency(pendingAnticipation.grossAmount)}</span>
              </div>
              <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-600">Taxa de Antecipação</span>
                <span className="font-semibold text-red-600">-{formatCurrency(pendingAnticipation.fee)}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Valor Líquido</span>
                <span className="font-bold text-green-700 text-lg">{formatCurrency(pendingAnticipation.netAmount)}</span>
              </div>

              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription>
                  O valor será creditado no seu saldo disponível em até 1 hora.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={confirmAnticipation}
            >
              <Zap className="w-4 h-4 mr-2" />
              Confirmar Antecipação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}