import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Link2, 
  Plus, 
  Copy, 
  Eye, 
  MoreHorizontal,
  ExternalLink,
  QrCode,
  TrendingUp,
  DollarSign,
  BarChart3,
  Trash2,
  Edit,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import EmptyState from '@/components/common/EmptyState';

export default function PaymentLinks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    description: '',
    amount: '',
    type: 'reusable',
    allow_custom_amount: false,
  });

  const queryClient = useQueryClient();

  const { data: links = [], isLoading, refetch } = useQuery({
    queryKey: ['payment-links'],
    queryFn: () => base44.entities.PaymentLink.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.create({
      ...data,
      link_id: `link_${Date.now()}`,
      url: `https://pay.pagsmile.com/${Date.now()}`,
      short_url: `https://pag.sm/${Date.now().toString(36)}`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      setIsCreateOpen(false);
      setNewLink({ name: '', description: '', amount: '', type: 'reusable', allow_custom_amount: false });
      toast.success('Link criado com sucesso!');
    }
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado!');
  };

  // Calculate metrics
  const activeLinks = links.filter(l => l.status === 'active');
  const totalCollected = links.reduce((sum, l) => sum + (l.total_collected || 0), 0);
  const totalViews = links.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const avgConversion = links.length > 0 
    ? links.reduce((sum, l) => sum + (l.conversion_rate || 0), 0) / links.length 
    : 0;

  const columns = [
    {
      key: 'name',
      label: 'Link',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <Link2 className={cn(
              "w-5 h-5",
              row.status === 'active' ? 'text-blue-600' : 'text-gray-400'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500">{row.short_url || row.link_id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <div>
          {row.allow_custom_amount ? (
            <span className="text-sm text-gray-500">Valor flexível</span>
          ) : (
            <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => {
        const labels = {
          single: 'Uso único',
          reusable: 'Reutilizável',
          subscription: 'Assinatura'
        };
        return <Badge variant="outline">{labels[value] || value}</Badge>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'usage_count',
      label: 'Uso',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{value || 0} vendas</p>
          <p className="text-xs text-gray-500">{row.views_count || 0} visualizações</p>
        </div>
      )
    },
    {
      key: 'total_collected',
      label: 'Arrecadado',
      render: (value) => (
        <span className="font-semibold text-emerald-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => copyToClipboard(row.short_url || row.url)}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => window.open(row.url, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
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
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <QrCode className="w-4 h-4 mr-2" />
                Gerar QR Code
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  const handleCreate = () => {
    if (!newLink.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    createMutation.mutate({
      ...newLink,
      amount: newLink.allow_custom_amount ? null : parseFloat(newLink.amount) || 0,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Links de Pagamento"
        subtitle="Crie e gerencie seus links de cobrança"
        breadcrumbs={[
          { label: 'Links de Pagamento', page: 'PaymentLinks' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Link
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Links Ativos"
          value={activeLinks.length}
          format="number"
          icon={Link2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Total Arrecadado"
          value={totalCollected}
          format="currency"
          change={15.3}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Visualizações"
          value={totalViews}
          format="number"
          icon={Eye}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Conversão Média"
          value={avgConversion}
          format="percentage"
          change={2.5}
          icon={TrendingUp}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Table */}
      {links.length === 0 && !isLoading ? (
        <EmptyState
          icon={Link2}
          title="Nenhum link de pagamento"
          description="Crie seu primeiro link de pagamento para começar a receber"
          actionLabel="Criar Link"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={links}
          loading={isLoading}
          searchable
          searchPlaceholder="Buscar por nome ou ID..."
          pagination
          pageSize={25}
          currentPage={1}
          totalItems={links.length}
          onRefresh={refetch}
          emptyMessage="Nenhum link encontrado"
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Link de Pagamento</DialogTitle>
            <DialogDescription>
              Crie um link para receber pagamentos de forma rápida
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome do Link *</Label>
              <Input
                placeholder="Ex: Produto X, Serviço Y"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição opcional"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Tipo de Link</Label>
              <Select 
                value={newLink.type} 
                onValueChange={(v) => setNewLink({ ...newLink, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reusable">Reutilizável</SelectItem>
                  <SelectItem value="single">Uso único</SelectItem>
                  <SelectItem value="subscription">Assinatura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Valor flexível</Label>
                <p className="text-xs text-gray-500">Cliente define o valor</p>
              </div>
              <Switch
                checked={newLink.allow_custom_amount}
                onCheckedChange={(v) => setNewLink({ ...newLink, allow_custom_amount: v })}
              />
            </div>

            {!newLink.allow_custom_amount && (
              <div>
                <Label>Valor *</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={newLink.amount}
                  onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}