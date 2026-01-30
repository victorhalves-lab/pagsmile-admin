import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
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
  Share2,
  Pause,
  Play,
  Archive,
  LayoutGrid,
  List,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/dashboard/KPICard';
import EmptyState from '@/components/common/EmptyState';
import ShareOptions from '@/components/payment-links/ShareOptions';

export default function PaymentLinks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shareLink, setShareLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data: links = [], isLoading, refetch } = useQuery({
    queryKey: ['payment-links'],
    queryFn: () => base44.entities.PaymentLink.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaymentLink.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      toast.success('Link atualizado!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PaymentLink.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      toast.success('Link excluído!');
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

  // Filter links
  const filteredLinks = links.filter(link => {
    const matchesStatus = statusFilter === 'all' || link.status === statusFilter;
    const matchesSearch = !searchTerm || 
      link.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.link_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const activeLinks = links.filter(l => l.status === 'active');
  const totalCollected = links.reduce((sum, l) => sum + (l.total_collected || 0), 0);
  const totalViews = links.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const totalSales = links.reduce((sum, l) => sum + (l.usage_count || 0), 0);
  const avgConversion = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-600' },
      expired: { label: 'Expirado', className: 'bg-gray-100 text-gray-600' },
      sold_out: { label: 'Esgotado', className: 'bg-yellow-100 text-yellow-700' },
      draft: { label: 'Rascunho', className: 'bg-blue-100 text-blue-700' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Link',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.main_image_url ? (
            <img 
              src={row.main_image_url} 
              alt={value} 
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              row.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
            )}>
              <Link2 className={cn(
                "w-5 h-5",
                row.status === 'active' ? 'text-blue-600' : 'text-gray-400'
              )} />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.short_url || row.url}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <div>
          {row.value_type === 'open' ? (
            <span className="text-sm text-gray-500">Valor aberto</span>
          ) : row.value_type === 'minimum' ? (
            <span className="text-sm">Min. {formatCurrency(row.min_amount)}</span>
          ) : (
            <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
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
      key: 'conversion_rate',
      label: 'Conversão',
      render: (_, row) => {
        const rate = row.views_count > 0 
          ? ((row.usage_count || 0) / row.views_count) * 100 
          : 0;
        return (
          <span className={cn(
            "text-sm font-medium",
            rate >= 5 ? 'text-green-600' : rate >= 2 ? 'text-yellow-600' : 'text-gray-500'
          )}>
            {rate.toFixed(1)}%
          </span>
        );
      }
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
            onClick={() => setShareLink(row)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(row.url, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(createPageUrl('PaymentLinkCreate') + `?id=${row.id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShareLink(row)}>
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.status === 'active' ? (
                <DropdownMenuItem onClick={() => updateMutation.mutate({ id: row.id, data: { status: 'inactive' } })}>
                  <Pause className="w-4 h-4 mr-2" />
                  Desativar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => updateMutation.mutate({ id: row.id, data: { status: 'active' } })}>
                  <Play className="w-4 h-4 mr-2" />
                  Ativar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600" onClick={() => {
                if (confirm('Excluir este link?')) {
                  deleteMutation.mutate(row.id);
                }
              }}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  // Card view for links
  const LinkCard = ({ link }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {link.main_image_url ? (
        <img 
          src={link.main_image_url} 
          alt={link.name} 
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Link2 className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1">{link.name}</h3>
          {getStatusBadge(link.status)}
        </div>
        <p className="text-lg font-bold text-gray-900 mb-3">
          {link.value_type === 'fixed' ? formatCurrency(link.amount) : 'Valor variável'}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{link.usage_count || 0} vendas</span>
          <span>{formatCurrency(link.total_collected || 0)}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => copyToClipboard(link.short_url || link.url)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copiar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShareLink(link)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(createPageUrl('PaymentLinkCreate') + `?id=${link.id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('payment_links.title')}
        subtitle={t('payment_links.title')}
        breadcrumbs={[
          { label: t('payment_links.title'), page: 'PaymentLinks' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(createPageUrl('PaymentLinkShowcase'))}>
              <LayoutGrid className="w-4 h-4 mr-2" />
              Vitrines
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => navigate(createPageUrl('PaymentLinkCreate'))}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('payment_links.create_link')}
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('payment_links.active_links')}
          value={activeLinks.length}
          format="number"
          icon={Link2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title={t('payment_links.total_collected')}
          value={totalCollected}
          format="currency"
          change={15.3}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title={t('dashboard.total_transactions')}
          value={totalSales}
          format="number"
          icon={BarChart3}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title={t('checkout.conversion_rate')}
          value={avgConversion}
          format="percentage"
          icon={TrendingUp}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border">
        <div className="flex flex-1 gap-3">
          <Input
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="sold_out">Esgotados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredLinks.length === 0 && !isLoading ? (
        <EmptyState
          icon={Link2}
          title="Nenhum link de pagamento"
          description="Crie seu primeiro link de pagamento para começar a receber"
          actionLabel="Criar Link"
          onAction={() => navigate(createPageUrl('PaymentLinkCreate'))}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredLinks}
          loading={isLoading}
          pagination
          pageSize={25}
          currentPage={1}
          totalItems={filteredLinks.length}
          onRefresh={refetch}
          emptyMessage="Nenhum link encontrado"
        />
      )}

      {/* Share Dialog */}
      <Dialog open={!!shareLink} onOpenChange={(open) => !open && setShareLink(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Compartilhar Link</DialogTitle>
          </DialogHeader>
          <ShareOptions link={shareLink} onClose={() => setShareLink(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}