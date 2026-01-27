import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import SplitRuleCard from '@/components/financial/SplitRuleCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeftRight,
  Plus,
  Users,
  Percent,
  DollarSign,
  Trash2,
  Info,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function SplitManagement() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    split_type: 'percentage',
    fee_payer: 'seller',
    chargeback_liable: 'seller',
    is_default: false,
    recipients: [{ name: '', subaccount_id: '', type: 'percentage', value: 0 }]
  });

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['split-rules'],
    queryFn: () => base44.entities.SplitRule.list()
  });

  const { data: subaccounts = [] } = useQuery({
    queryKey: ['subaccounts-active'],
    queryFn: () => base44.entities.Subaccount.filter({ status: 'active' })
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SplitRule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-rules'] });
      toast.success('Regra de split criada com sucesso!');
      handleCloseDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SplitRule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-rules'] });
      toast.success('Regra atualizada!');
      handleCloseDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SplitRule.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['split-rules'] });
      toast.success('Regra excluída!');
    }
  });

  const handleOpenDialog = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description || '',
        split_type: rule.split_type || 'percentage',
        fee_payer: rule.fee_payer || 'seller',
        chargeback_liable: rule.chargeback_liable || 'seller',
        is_default: rule.is_default || false,
        recipients: rule.recipients || [{ name: '', subaccount_id: '', type: 'percentage', value: 0 }]
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        split_type: 'percentage',
        fee_payer: 'seller',
        chargeback_liable: 'seller',
        is_default: false,
        recipients: [{ name: '', subaccount_id: '', type: 'percentage', value: 0 }]
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingRule(null);
  };

  const handleAddRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, { name: '', subaccount_id: '', type: 'percentage', value: 0 }]
    }));
  };

  const handleRemoveRecipient = (index) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const handleRecipientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => 
        i === index ? { ...r, [field]: value } : r
      )
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (formData.recipients.length === 0) {
      toast.error('Adicione pelo menos um recebedor');
      return;
    }

    const data = {
      ...formData,
      status: 'active',
      rule_id: editingRule?.rule_id || `SPLIT-${Date.now()}`
    };

    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const totalPercentage = formData.recipients
    .filter(r => r.type === 'percentage')
    .reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Split de Pagamentos"
        subtitle="Configure como dividir os valores das transações entre recebedores"
        breadcrumbs={[
          { label: 'Financeiro', href: 'Financial' },
          { label: 'Split' }
        ]}
        actions={
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </Button>
        }
      />

      {/* Info Card */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="font-medium text-indigo-900">O que é Split de Pagamentos?</p>
              <p className="text-sm text-indigo-700">
                Split permite dividir automaticamente o valor de cada transação entre múltiplos recebedores.
                Ideal para marketplaces, plataformas SaaS com parceiros e franquias.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Regras Ativas</p>
                <p className="text-xl font-bold">
                  {rules.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subcontas Participantes</p>
                <p className="text-xl font-bold">{subaccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume com Split</p>
                <p className="text-xl font-bold">
                  {formatCurrency(rules.reduce((sum, r) => sum + (r.total_volume || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <SplitRuleCard
              key={rule.id}
              rule={rule}
              onEdit={handleOpenDialog}
              onDelete={(rule) => deleteMutation.mutate(rule.id)}
              onDuplicate={(rule) => {
                handleOpenDialog({
                  ...rule,
                  name: `${rule.name} (Cópia)`,
                  is_default: false
                });
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Nenhuma regra de split criada</h3>
            <p className="text-gray-500 mb-4">
              Crie sua primeira regra para dividir automaticamente os pagamentos
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Regra
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Editar Regra de Split' : 'Nova Regra de Split'}
            </DialogTitle>
            <DialogDescription>
              Configure como dividir o valor das transações entre os recebedores
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Regra *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Split Marketplace"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Split</Label>
                  <Select
                    value={formData.split_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, split_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                      <SelectItem value="mixed">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva quando esta regra deve ser usada..."
                  rows={2}
                />
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Recebedores</Label>
                <Button variant="outline" size="sm" onClick={handleAddRecipient}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {formData.recipients.map((recipient, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Recebedor {index + 1}</span>
                    {formData.recipients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveRecipient(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Subconta</Label>
                      <Select
                        value={recipient.subaccount_id}
                        onValueChange={(value) => {
                          const sub = subaccounts.find(s => s.id === value);
                          handleRecipientChange(index, 'subaccount_id', value);
                          handleRecipientChange(index, 'name', sub?.business_name || '');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Conta Principal</SelectItem>
                          {subaccounts.map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.business_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tipo</Label>
                      <Select
                        value={recipient.type}
                        onValueChange={(value) => handleRecipientChange(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentual (%)</SelectItem>
                          <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">
                      {recipient.type === 'percentage' ? 'Percentual (%)' : 'Valor Fixo (R$)'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step={recipient.type === 'percentage' ? '0.1' : '0.01'}
                        value={recipient.value}
                        onChange={(e) => handleRecipientChange(index, 'value', parseFloat(e.target.value) || 0)}
                        className="max-w-[120px]"
                      />
                      <span className="text-gray-500">
                        {recipient.type === 'percentage' ? '%' : 'BRL'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {formData.split_type === 'percentage' && (
                <div className={cn(
                  "p-3 rounded-lg text-sm",
                  totalPercentage === 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                )}>
                  Total: {totalPercentage}% {totalPercentage !== 100 && '(deve somar 100%)'}
                </div>
              )}
            </div>

            {/* Responsibilities */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quem paga o MDR?</Label>
                <Select
                  value={formData.fee_payer}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fee_payer: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="proportional">Proporcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quem assume Chargeback?</Label>
                <Select
                  value={formData.chargeback_liable}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chargeback_liable: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="proportional">Proporcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Default */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Regra Padrão</Label>
                <p className="text-xs text-gray-500">Aplicar quando nenhuma regra específica for definida</p>
              </div>
              <Switch
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingRule ? 'Salvar Alterações' : 'Criar Regra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}