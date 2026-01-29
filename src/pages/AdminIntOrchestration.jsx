import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, Plus, GripVertical, ChevronRight, Building2, CreditCard, 
  ArrowRight, Trash2, Edit, Copy, Check, X, Zap, TrendingUp, Shield,
  AlertTriangle, Percent, DollarSign, Clock, RefreshCw, Eye, Save,
  Route, Layers, Globe, Filter, Users, ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AcquirerCard = ({ acquirer, position, onMove, onRemove, onEdit }) => {
  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    degraded: 'bg-amber-100 text-amber-700 border-amber-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group">
      <div className="cursor-grab text-slate-400 hover:text-slate-600">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300">
        {position}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900 dark:text-white">{acquirer.name}</span>
          <Badge variant="outline" className={cn("text-[10px]", statusColors[acquirer.status])}>
            {acquirer.status === 'active' ? 'Ativo' : acquirer.status === 'degraded' ? 'Degradado' : 'Inativo'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Percent className="w-3 h-3" /> {acquirer.approval}% aprov.
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {acquirer.latency}ms
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {acquirer.cost}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(acquirer)}>
          <Edit className="w-3.5 h-3.5 text-slate-500" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onRemove(acquirer)}>
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </Button>
      </div>

      <Switch checked={acquirer.enabled} />
    </div>
  );
};

const RuleCard = ({ rule, onEdit, onToggle, onDelete }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded-lg",
          rule.enabled ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-100 dark:bg-slate-800"
        )}>
          <Route className={cn("w-4 h-4", rule.enabled ? "text-emerald-600" : "text-slate-400")} />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{rule.name}</h4>
          <p className="text-[11px] text-slate-500">{rule.description}</p>
        </div>
      </div>
      <Switch checked={rule.enabled} onCheckedChange={() => onToggle(rule)} />
    </div>

    <div className="flex flex-wrap gap-1.5 mb-3">
      {rule.conditions.map((cond, i) => (
        <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800">
          {cond}
        </Badge>
      ))}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <ArrowRight className="w-3 h-3" />
        <span>Rota para: <strong className="text-slate-700 dark:text-slate-300">{rule.targetAcquirer}</strong></span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(rule)}>
          <Edit className="w-3 h-3 mr-1" /> Editar
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600" onClick={() => onDelete(rule)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  </div>
);

const MerchantOverrideRow = ({ merchant }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <Building2 className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{merchant.name}</p>
      <p className="text-[10px] text-slate-500">{merchant.document}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{merchant.primaryAcquirer}</p>
      <p className="text-[10px] text-slate-500">{merchant.rules} regras customizadas</p>
    </div>
    <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + merchant.id}>
      <Button variant="ghost" size="sm" className="h-7">
        <Eye className="w-3.5 h-3.5" />
      </Button>
    </Link>
  </div>
);

export default function AdminIntOrchestration() {
  const [activeTab, setActiveTab] = useState('global');
  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [selectedInstallment, setSelectedInstallment] = useState('all');

  const acquirers = [
    { id: 1, name: 'Cielo', status: 'active', approval: 89, latency: 320, cost: 2.1, enabled: true },
    { id: 2, name: 'Rede', status: 'active', approval: 87, latency: 280, cost: 2.3, enabled: true },
    { id: 3, name: 'Stone', status: 'active', approval: 91, latency: 250, cost: 2.5, enabled: true },
    { id: 4, name: 'GetNet', status: 'degraded', approval: 82, latency: 450, cost: 2.0, enabled: false },
    { id: 5, name: 'Adyen', status: 'active', approval: 93, latency: 180, cost: 2.8, enabled: true },
  ];

  const rules = [
    {
      id: 1,
      name: 'Visa Premium para Cielo',
      description: 'Transações Visa acima de R$ 500 são roteadas para Cielo',
      conditions: ['Bandeira: Visa', 'Valor > R$ 500', 'Tipo: Crédito'],
      targetAcquirer: 'Cielo',
      enabled: true,
    },
    {
      id: 2,
      name: 'Mastercard 2-6x para Stone',
      description: 'Parcelamentos de 2 a 6x em Mastercard vão para Stone',
      conditions: ['Bandeira: Mastercard', 'Parcelas: 2-6x'],
      targetAcquirer: 'Stone',
      enabled: true,
    },
    {
      id: 3,
      name: 'Débito para Rede',
      description: 'Todas as transações de débito priorizam Rede',
      conditions: ['Tipo: Débito', 'Todas bandeiras'],
      targetAcquirer: 'Rede',
      enabled: true,
    },
    {
      id: 4,
      name: 'High Ticket Internacional',
      description: 'Transações internacionais acima de R$ 1000',
      conditions: ['Cartão: Internacional', 'Valor > R$ 1000'],
      targetAcquirer: 'Adyen',
      enabled: false,
    },
  ];

  const merchantOverrides = [
    { id: 1, name: 'TechStore Ltda', document: '12.345.678/0001-90', primaryAcquirer: 'Stone', rules: 3 },
    { id: 2, name: 'Fashion Hub', document: '98.765.432/0001-10', primaryAcquirer: 'Cielo', rules: 2 },
    { id: 3, name: 'Digital Games', document: '45.678.901/0001-23', primaryAcquirer: 'Adyen', rules: 5 },
  ];

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Orquestração de Adquirentes"
        subtitle="Configure prioridades e regras de roteamento de transações"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Orquestração' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="w-4 h-4" /> Sincronizar
            </Button>
            <Button size="sm" className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
              <Save className="w-4 h-4" /> Salvar Alterações
            </Button>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Adquirentes Ativos</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">4/5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Route className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Regras Ativas</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Taxa Aprovação Média</p>
              <p className="text-lg font-bold text-emerald-600">89.2%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Latência Média</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">285ms</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="global" className="rounded-lg gap-1.5">
            <Globe className="w-4 h-4" /> Prioridade Global
          </TabsTrigger>
          <TabsTrigger value="rules" className="rounded-lg gap-1.5">
            <Route className="w-4 h-4" /> Regras de Roteamento
          </TabsTrigger>
          <TabsTrigger value="merchants" className="rounded-lg gap-1.5">
            <Users className="w-4 h-4" /> Por Merchant
          </TabsTrigger>
        </TabsList>

        {/* Global Priority Tab */}
        <TabsContent value="global" className="mt-4 space-y-4">
          {/* Filters */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="py-3 px-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Método:</span>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Crédito</SelectItem>
                      <SelectItem value="debit">Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Parcelamento:</span>
                  <Select value={selectedInstallment} onValueChange={setSelectedInstallment}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="1x">À Vista (1x)</SelectItem>
                      <SelectItem value="2-6">2 a 6x</SelectItem>
                      <SelectItem value="7-12">7 a 12x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="sm" className="ml-auto gap-1.5">
                  <Plus className="w-4 h-4" /> Adicionar Adquirente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Priority List */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-slate-500" />
                    Ordem de Prioridade - Crédito {selectedInstallment !== 'all' && `(${selectedInstallment})`}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Arraste para reordenar. O primeiro será chamado sempre que possível.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {acquirers.map((acq, idx) => (
                <AcquirerCard 
                  key={acq.id} 
                  acquirer={acq} 
                  position={idx + 1}
                  onMove={() => {}}
                  onRemove={() => {}}
                  onEdit={() => {}}
                />
              ))}
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-800">
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Como funciona o fallback</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Se o adquirente primário recusar ou estiver indisponível, a transação é automaticamente direcionada 
                    para o próximo da lista. Você pode configurar regras específicas na aba "Regras de Roteamento".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input placeholder="Buscar regras..." className="w-[250px]" />
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1.5" /> Filtrar
              </Button>
            </div>
            <Button size="sm" className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
              <Plus className="w-4 h-4" /> Nova Regra
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {rules.map(rule => (
              <RuleCard 
                key={rule.id} 
                rule={rule}
                onEdit={() => {}}
                onToggle={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>

          {/* Conditions Help */}
          <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <CardContent className="py-3 px-4">
              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Condições disponíveis para regras:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px]">Bandeira (Visa, MC, Elo...)</Badge>
                <Badge variant="outline" className="text-[10px]">Valor da Transação</Badge>
                <Badge variant="outline" className="text-[10px]">Número de Parcelas</Badge>
                <Badge variant="outline" className="text-[10px]">Tipo (Crédito/Débito)</Badge>
                <Badge variant="outline" className="text-[10px]">BIN Range</Badge>
                <Badge variant="outline" className="text-[10px]">Cartão Internacional</Badge>
                <Badge variant="outline" className="text-[10px]">MCC do Merchant</Badge>
                <Badge variant="outline" className="text-[10px]">Horário</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Merchants Tab */}
        <TabsContent value="merchants" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Merchants com configurações de orquestração personalizadas
            </p>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="w-4 h-4" /> Adicionar Override
            </Button>
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-2">
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {merchantOverrides.map(merchant => (
                  <MerchantOverrideRow key={merchant.id} merchant={merchant} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-800">
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Atenção</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Configurações por merchant sobrescrevem as regras globais. Use com cuidado para 
                    não criar conflitos de roteamento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}