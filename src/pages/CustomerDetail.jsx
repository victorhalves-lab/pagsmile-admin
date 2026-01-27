import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft,
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
  Plus,
  Trash2,
  Monitor,
  Smartphone,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Shield,
  Crown,
  Clock
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
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

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
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value?.slice(0, 12)}...</code>
      )
    },
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <Badge variant="outline" className="capitalize">{value}</Badge>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
  ];

  if (isLoading || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const config = segmentConfig[customer.segment] || segmentConfig.new;

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        subtitle="Perfil 360° do cliente"
        breadcrumbs={[
          { label: 'Clientes', page: 'Customers' },
          { label: customer.name }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Enviar E-mail
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAddTagOpen(true)}>
                  <Tag className="w-4 h-4 mr-2" />
                  Adicionar Tag
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddCardOpen(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Solicitar Cartão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-[#101F3E] text-white text-2xl">
                  {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                <p className="text-gray-500">{customer.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={config.color}>
                    <config.icon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                  {customer.tags?.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">{customer.total_purchases || 0}</p>
                <p className="text-sm text-gray-500">Compras</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-3xl font-bold text-emerald-600">{formatCurrency(customer.total_spent)}</p>
                <p className="text-sm text-gray-500">LTV</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(customer.average_ticket)}</p>
                <p className="text-sm text-gray-500">Ticket Médio</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{customer.risk_score || 0}</p>
                <p className="text-sm text-gray-500">Score de Risco</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="transactions">
            Transações
            <Badge variant="secondary" className="ml-2">{transactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{customer.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p className="font-medium">{customer.document} ({customer.document_type?.toUpperCase()})</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Atividade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Primeira Compra</p>
                      <p className="font-medium">
                        {customer.first_purchase_date 
                          ? format(new Date(customer.first_purchase_date), 'dd/MM/yyyy', { locale: ptBR })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Última Compra</p>
                      <p className="font-medium">
                        {customer.last_purchase_date 
                          ? format(new Date(customer.last_purchase_date), 'dd/MM/yyyy', { locale: ptBR })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Método Preferido</p>
                      <p className="font-medium capitalize">{customer.preferred_payment_method || 'Cartão'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Endereços</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.addresses?.length > 0 ? (
                  <div className="space-y-3">
                    {customer.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">{addr.street}, {addr.number}</p>
                          <p className="text-gray-500">{addr.city} - {addr.state}, {addr.zip_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum endereço cadastrado</p>
                )}
              </CardContent>
            </Card>

            {/* Risk & Disputes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risco e Disputas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Score de Risco</span>
                  </div>
                  <span className={cn(
                    "font-bold",
                    (customer.risk_score || 0) < 30 ? "text-emerald-600" :
                    (customer.risk_score || 0) < 60 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {customer.risk_score || 0}/100
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Chargebacks</span>
                  </div>
                  <span className={cn("font-bold", customer.chargebacks_count > 0 && "text-red-600")}>
                    {customer.chargebacks_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Estornos</span>
                  </div>
                  <span className="font-bold">{customer.refunds_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
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

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Cartões Tokenizados</CardTitle>
              <Button size="sm" onClick={() => setIsAddCardOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Cartão
              </Button>
            </CardHeader>
            <CardContent>
              {customer.saved_cards?.length > 0 ? (
                <div className="space-y-3">
                  {customer.saved_cards.map((card, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">•••• {card.last_four}</p>
                          <p className="text-sm text-gray-500">{card.brand} • Expira {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Ativo</Badge>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum cartão salvo</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddCardOpen(true)}>
                    Solicitar Cadastro de Cartão
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              {subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">{sub.plan_name}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(sub.amount)} / {sub.billing_cycle === 'monthly' ? 'mês' : sub.billing_cycle}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Próxima cobrança</p>
                          <p className="font-medium">
                            {sub.next_billing_date 
                              ? format(new Date(sub.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })
                              : 'N/A'
                            }
                          </p>
                        </div>
                        <StatusBadge status={sub.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma assinatura ativa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes">
          <Card>
            <CardContent className="p-6">
              {disputes.length > 0 ? (
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Disputa #{dispute.dispute_id}</p>
                        <p className="text-sm text-gray-500">
                          {dispute.type} • {dispute.reason_description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-red-600">{formatCurrency(dispute.amount)}</span>
                        <StatusBadge status={dispute.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma disputa registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Tag Dialog */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Tag</DialogTitle>
            <DialogDescription>Adicione uma tag para classificar este cliente</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Nome da Tag</Label>
            <Input
              placeholder="Ex: Premium, Empresa, Parceiro"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => {
                toast.success('Tag adicionada!');
                setIsAddTagOpen(false);
                setNewTag('');
              }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Solicitar Cadastro de Cartão</DialogTitle>
            <DialogDescription>Envie um link seguro para o cliente cadastrar um cartão</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Um e-mail será enviado para <strong>{customer.email}</strong> com um link seguro para cadastro de cartão.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => {
                toast.success('Link enviado por e-mail!');
                setIsAddCardOpen(false);
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}