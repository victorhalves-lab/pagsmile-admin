import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Star,
  Tag,
  Send,
  RefreshCw,
  Crown,
  Clock,
  MoreHorizontal,
  Activity,
  StickyNote,
  MessageCircle,
  Sparkles,
  Eye,
  Ban,
  Shield,
  Clock as TimelineIcon,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

// Customer 360 v2 components
import CustomerHeaderKpis from '@/components/customers/v2/CustomerHeaderKpis';
import CommsInlineBar from '@/components/customers/v2/CommsInlineBar';
import CustomerAiInsights from '@/components/customers/v2/CustomerAiInsights';
import SavedCardsEnhanced from '@/components/customers/v2/SavedCardsEnhanced';
import SubscriptionsEnhanced from '@/components/customers/v2/SubscriptionsEnhanced';
import DisputesEnhanced from '@/components/customers/v2/DisputesEnhanced';
import CustomerNotes from '@/components/customers/v2/CustomerNotes';
import CustomerCommsHistory from '@/components/customers/v2/CustomerCommsHistory';
// Phase 2: Customer 360 vision
import CustomerTimeline from '@/components/customers/v2/CustomerTimeline';
import CustomerPredictions from '@/components/customers/v2/CustomerPredictions';
import CustomerJourneyMap from '@/components/customers/v2/CustomerJourneyMap';
import CustomerSimilarity from '@/components/customers/v2/CustomerSimilarity';
import SegmentChips from '@/components/customers/v2/SegmentChips';
import CustomerActivityCompact from '@/components/customers/v2/CustomerActivityCompact';

export default function CustomerDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get('id');

  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const customers = await base44.entities.Customer.filter({ id: customerId });
      return customers[0];
    },
    enabled: !!customerId,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['customer-transactions', customer?.email],
    queryFn: () => base44.entities.Transaction.filter({ customer_email: customer?.email }, '-created_date', 50),
    enabled: !!customer?.email,
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['customer-subscriptions', customer?.email],
    queryFn: () => base44.entities.Subscription.filter({ customer_email: customer?.email }),
    enabled: !!customer?.email,
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ['customer-disputes', customer?.email],
    queryFn: () => base44.entities.Dispute.filter({ customer_email: customer?.email }),
    enabled: !!customer?.email,
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const segmentConfig = {
    new: { label: 'Novo', color: 'bg-blue-100 text-blue-700', icon: Star },
    recurring: { label: 'Recorrente', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: Crown },
    at_risk: { label: 'Em Risco', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700', icon: Clock },
  };

  const transactionColumns = [
    {
      key: 'transaction_id',
      label: 'ID',
      render: (value) => (
        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{value?.slice(0, 12)}...</code>
      )
    },
    { key: 'created_date', label: 'Data',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-' },
    { key: 'type', label: 'Tipo',
      render: (value) => <Badge variant="outline" className="capitalize">{value}</Badge> },
    { key: 'amount', label: 'Valor',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span> },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  ];

  if (isLoading || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const config = segmentConfig[customer.segment] || segmentConfig.new;
  const ConfigIcon = config.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        subtitle="Customer 360°"
        breadcrumbs={[
          { label: 'Clientes', page: 'Customers' },
          { label: customer.name }
        ]}
        actions={
          <div className="flex gap-2">
            {/* Comms inline bar (Email / WhatsApp / SMS / Push) */}
            <CommsInlineBar customer={customer} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setIsAddTagOpen(true)}>
                  <Tag className="w-4 h-4 mr-2" /> Adicionar Tag
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddCardOpen(true)}>
                  <CreditCard className="w-4 h-4 mr-2" /> Solicitar Cartão
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Promovido a VIP')}>
                  <Crown className="w-4 h-4 mr-2" /> Promover a VIP
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Campanha iniciada')}>
                  <Send className="w-4 h-4 mr-2" /> Iniciar campanha
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Visualizando como cliente...')}>
                  <Eye className="w-4 h-4 mr-2" /> Ver como cliente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => toast.warning('Cliente bloqueado')}>
                  <Ban className="w-4 h-4 mr-2" /> Bloquear cliente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-[#101F3E] text-white text-2xl">
                  {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
                <p className="text-slate-500 text-sm">{customer.email}</p>
                {customer.phone && <p className="text-slate-500 text-sm">{customer.phone}</p>}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge className={cn('gap-1', config.color)}>
                    <ConfigIcon className="w-3 h-3" />
                    {config.label}
                  </Badge>
                  {customer.tags?.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online há 5min
                  </Badge>
                </div>
                {/* AI dynamic segments */}
                <div className="mt-3">
                  <SegmentChips customer={customer} />
                </div>
              </div>
            </div>
          </div>

          {/* 7 KPIs incluindo Health, Churn, LTV projection, Risk com explainability */}
          <div className="mt-6">
            <CustomerHeaderKpis customer={customer} />
          </div>
        </CardContent>
      </Card>

      {/* Customer Journey Map */}
      <CustomerJourneyMap customer={customer} />

      {/* AI Insights */}
      <CustomerAiInsights customer={customer} />

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="timeline">
            <TimelineIcon className="w-3.5 h-3.5 mr-1" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
            <Brain className="w-3.5 h-3.5 mr-1" />
            AI Predictions
          </TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="transactions">
            Transações <Badge variant="secondary" className="ml-2">{transactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cards">
            Cartões <Badge variant="secondary" className="ml-2">{customer.saved_cards?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            Assinaturas <Badge variant="secondary" className="ml-2">{subscriptions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="disputes">
            Disputas <Badge variant="secondary" className="ml-2">{disputes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="comms">
            <MessageCircle className="w-3.5 h-3.5 mr-1" />
            Comunicação
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="w-3.5 h-3.5 mr-1" />
            Notas
          </TabsTrigger>
        </TabsList>

        {/* Timeline (default) — unified cross-channel events */}
        <TabsContent value="timeline">
          <CustomerTimeline
            customer={customer}
            transactions={transactions}
            subscriptions={subscriptions}
            disputes={disputes}
          />
        </TabsContent>

        {/* AI Predictions */}
        <TabsContent value="ai" className="space-y-6">
          <CustomerPredictions customer={customer} />
          <CustomerSimilarity customer={customer} />
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">E-mail</p>
                    <p className="font-medium text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telefone</p>
                    <p className="font-medium text-sm">{customer.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Documento</p>
                    <p className="font-medium text-sm font-mono">{customer.document} ({customer.document_type?.toUpperCase()})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Datas-chave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Primeira Compra</p>
                    <p className="font-medium text-sm">
                      {customer.first_purchase_date
                        ? format(new Date(customer.first_purchase_date), 'dd/MM/yyyy', { locale: ptBR })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Última Compra</p>
                    <p className="font-medium text-sm">
                      {customer.last_purchase_date
                        ? format(new Date(customer.last_purchase_date), 'dd/MM/yyyy', { locale: ptBR })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Método Preferido</p>
                    <p className="font-medium text-sm capitalize">{customer.preferred_payment_method || 'Cartão'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Endereços
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer.addresses?.length > 0 ? (
                  <div className="space-y-3">
                    {customer.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">{addr.street}, {addr.number}</p>
                          <p className="text-slate-500">{addr.city} - {addr.state}, {addr.zip_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum endereço cadastrado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Resumo de Risco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Risk Score (clique no header para detalhes)
                  </span>
                  <span className={cn(
                    'font-bold text-sm',
                    (customer.risk_score || 0) < 30 ? 'text-emerald-600' :
                    (customer.risk_score || 0) < 60 ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {customer.risk_score || 0}/100
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-slate-500" />
                    Chargebacks
                  </span>
                  <span className={cn('font-bold text-sm', customer.chargebacks_count > 0 && 'text-red-600')}>
                    {customer.chargebacks_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 text-slate-500" />
                    Estornos
                  </span>
                  <span className="font-bold text-sm">{customer.refunds_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={transactionColumns}
                data={transactions}
                searchable
                searchPlaceholder="Buscar transações..."
                pagination
                pageSize={10}
                currentPage={1}
                totalItems={transactions.length}
                emptyMessage="Nenhuma transação encontrada"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <SavedCardsEnhanced customer={customer} onRequestNew={() => setIsAddCardOpen(true)} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionsEnhanced subscriptions={subscriptions} />
        </TabsContent>

        <TabsContent value="disputes">
          <DisputesEnhanced disputes={disputes} customer={customer} />
        </TabsContent>

        <TabsContent value="comms">
          <CustomerCommsHistory />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <CustomerNotes customer={customer} />
          <CustomerActivityCompact />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Tag</DialogTitle>
            <DialogDescription>Adicione uma tag para classificar este cliente</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Nome da Tag</Label>
            <Input placeholder="Ex: Premium, Empresa, Parceiro" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={() => { toast.success('Tag adicionada!'); setIsAddTagOpen(false); setNewTag(''); }}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Solicitar Cadastro de Cartão</DialogTitle>
            <DialogDescription>Envie um link seguro para o cliente cadastrar um cartão</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Um link seguro será enviado para <strong>{customer.email}</strong> ou via WhatsApp para <strong>{customer.phone}</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-xs" onClick={() => { toast.success('Link enviado por email'); setIsAddCardOpen(false); }}>
              <Mail className="w-3 h-3 mr-1" /> Por Email
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
              onClick={() => { toast.success('QR/Link enviado por WhatsApp'); setIsAddCardOpen(false); }}>
              <Send className="w-3 h-3 mr-1" /> Por WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}